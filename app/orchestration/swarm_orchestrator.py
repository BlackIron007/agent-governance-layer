import logging
import uuid
from datetime import datetime
from typing import List, Dict, Any

from app.schemas.decision_payload import DecisionPayload
from app.schemas.decision_audit_report import DecisionAuditReport, AuditStatus, AuditFindings, ChallengeReview, DecisionTimeline
from app.schemas.policy_compliance_record import PolicyComplianceRecord
from app.schemas.contradiction_record import ContradictionRecord
from app.schemas.missing_evidence_record import MissingEvidenceRecord
from app.schemas.assumption_record import AssumptionRecord
from app.schemas.executive_recommendation import ExecutiveRecommendation

from app.modules.decision_parameter_extractor import extract_decision_parameters
from app.agents.evidence_agent import EvidenceAgent
from app.agents.policy_agent import PolicyAgent
from app.agents.risk_agent import RiskAgent
from app.agents.red_team_agent import RedTeamAgent
from app.agents.replay_agent import ReplayAgent
from app.agents.governance_agent import GovernanceAgent

logger = logging.getLogger("verifier")

class SwarmOrchestrator:
    """
    Orchestrates the multi-agent swarm auditing cycle:
    Decision Payload -> Extraction -> Evidence Agent -> Replay Agent -> Red-Team Agent -> Policy Agent -> Risk Agent -> Governance Agent
    """
    def __init__(self):
        self.evidence_agent = EvidenceAgent()
        self.policy_agent = PolicyAgent()
        self.risk_agent = RiskAgent()
        self.red_team_agent = RedTeamAgent()
        self.replay_agent = ReplayAgent()
        self.governance_agent = GovernanceAgent()
        self.orchestration_trace = []

    async def audit_decision(self, payload: DecisionPayload) -> DecisionAuditReport:
        audit_id = f"audit_{uuid.uuid4().hex[:8]}"
        self.orchestration_trace.append(f"ORCHESTRATION_START: Ingesting audit payload {audit_id}")

        # 1. Parameter Extraction
        parameters = extract_decision_parameters(payload)
        justifications = [p for p in parameters if p.parameter_type == "justification"]
        justification_text = " ".join([str(j.value) for j in justifications]) if justifications else payload.proposed_action
        self.orchestration_trace.append(f"EXTRACTOR: Extracted {len(parameters)} parameter models from payload.")

        # 2. Evidence Agent Execution
        evidence_records = await self.evidence_agent.execute(parameters, justification_text)
        self.orchestration_trace.extend([f"[EvidenceAgent] {t}" for t in self.evidence_agent.trace])

        # 3. Replay Agent Execution
        decision_replay, assumptions = self.replay_agent.execute(parameters, evidence_records)
        self.orchestration_trace.extend([f"[ReplayAgent] {t}" for t in self.replay_agent.trace])

        # 4. Red Team Agent (Debate Challenge Mode)
        challenge_review = self.red_team_agent.execute(
            payload.proposed_action,
            parameters,
            evidence_records,
            assumptions
        )
        self.orchestration_trace.extend([f"[RedTeamAgent] {t}" for t in self.red_team_agent.trace])

        # 5. Policy Agent Execution
        policy_compliance = self.policy_agent.execute(justification_text, evidence_records)
        self.orchestration_trace.extend([f"[PolicyAgent] {t}" for t in self.policy_agent.trace])

        # 6. Risk Agent Execution
        contradictions, missing_evidence = self.risk_agent.execute(justification_text, evidence_records)
        self.orchestration_trace.extend([f"[RiskAgent] {t}" for t in self.risk_agent.trace])

        # 7. Governance Agent Execution (Scoring Calibration & Verdict Action)
        base_trust = 0.95
        base_risk = 0.15
        audit_status, executive_recommendation, calibration_results = self.governance_agent.execute(
            base_trust=base_trust,
            base_risk=base_risk,
            assumptions=assumptions,
            contradictions=contradictions,
            missing_evidence=missing_evidence,
            challenge_review=challenge_review
        )
        self.orchestration_trace.extend([f"[GovernanceAgent] {t}" for t in self.governance_agent.trace])

        overall_trust_score = calibration_results["calibrated_trust"]
        overall_risk_score = calibration_results["calibrated_risk"]
        confidence_waterfall = calibration_results["waterfall"]
        calibration_trace = calibration_results["trace"]
        governance_rule_results = calibration_results["governance_rules"]

        # Assemble structural findings
        findings = AuditFindings(
            policy_compliance=policy_compliance,
            contradictions=contradictions,
            missing_evidence=missing_evidence,
            assumptions=assumptions
        )

        # 8. Compile Timeline checkpoint metrics
        evidence_used_titles = [ev.title or ev.source for ev in evidence_records if ev.support_label == "entailment"]
        evidence_ignored_titles = [ev.title or ev.source for ev in evidence_records if ev.support_label == "contradiction"]
        assumptions_text_list = [a.premise for a in assumptions]
        counterfactuals_text_list = [c.altered_premise for c in decision_replay.counterfactuals]

        nli_strength = max((ev.support_score or 0.0) for ev in evidence_records) if evidence_records else 1.0

        decision_timeline = [
            DecisionTimeline(
                decision_step="Decision Ingestion",
                evidence_used=[],
                evidence_ignored=[],
                assumptions_made=[],
                counterfactuals=[],
                final_recommendation="Proposed action: " + payload.proposed_action
            ),
            DecisionTimeline(
                decision_step="Parameter Sourcing & Verification",
                evidence_used=evidence_used_titles,
                evidence_ignored=evidence_ignored_titles,
                assumptions_made=assumptions_text_list,
                counterfactuals=[],
                final_recommendation=f"Integrity verified. Support level score is {nli_strength:.3f}."
            ),
            DecisionTimeline(
                decision_step="Adversarial Replay Simulation",
                evidence_used=[],
                evidence_ignored=evidence_ignored_titles,
                assumptions_made=[],
                counterfactuals=counterfactuals_text_list,
                final_recommendation="Risk calibration output: " + str(overall_risk_score)
            ),
            DecisionTimeline(
                decision_step="Audit Decision Verdict",
                evidence_used=[],
                evidence_ignored=[],
                assumptions_made=[],
                counterfactuals=[],
                final_recommendation="Audit Status: " + str(audit_status)
            )
        ]

        self.orchestration_trace.append(f"ORCHESTRATION_END: Finished audit {audit_id}")

        # Integrate agent traces directly into the calibration trace log for visibility
        combined_trace = self.orchestration_trace + ["--- CORE CALIBRATION DETAILS ---"] + calibration_trace

        return DecisionAuditReport(
            audit_id=audit_id,
            timestamp=datetime.utcnow(),
            decision_context=payload,
            overall_trust_score=overall_trust_score,
            overall_risk_score=overall_risk_score,
            audit_status=audit_status,
            findings=findings,
            decision_replay=decision_replay,
            executive_recommendation=executive_recommendation,
            challenge_review=challenge_review,
            decision_timeline=decision_timeline,
            evidence_influence_ranking=decision_replay.ranked_evidence_list,
            confidence_waterfall=confidence_waterfall,
            calibration_trace=combined_trace,
            governance_rule_results=governance_rule_results
        )
