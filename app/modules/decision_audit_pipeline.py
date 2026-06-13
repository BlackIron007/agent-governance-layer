import logging
import uuid
from datetime import datetime
from typing import List

from app.schemas.decision_payload import DecisionPayload
from app.schemas.decision_audit_report import DecisionAuditReport, AuditStatus, AuditFindings, ChallengeReview, DecisionTimeline
from app.schemas.policy_compliance_record import PolicyComplianceRecord, ComplianceStatus
from app.schemas.contradiction_record import ContradictionRecord, ContradictionType
from app.schemas.missing_evidence_record import MissingEvidenceRecord, EvidenceSeverity
from app.schemas.executive_recommendation import ExecutiveRecommendation, RecommendationAction
from app.modules.challenge_engine import run_adversarial_challenge

from app.modules.decision_parameter_extractor import extract_decision_parameters
from app.modules.decision_evidence_builder import build_decision_evidence
from app.services.nli_service import check_claim_evidence_support
from app.modules.decision_replay_engine import replay_decision_evaluation
from app.modules.decision_calibration_engine import DecisionCalibrationEngine
from app.modules.recommendation_engine import RecommendationEngine

logger = logging.getLogger("verifier")

async def run_decision_audit(payload: DecisionPayload) -> DecisionAuditReport:
    """
    Executes the unified single-path decision auditing pipeline:
    Extraction -> Evidence Retrieval -> NLI Verification -> Replay Engine -> Audit Report
    """
    audit_id = f"audit_{uuid.uuid4().hex[:8]}"
    logger.info(f"Starting audit run: {audit_id}")

    # 1. Parameter Extraction
    parameters = extract_decision_parameters(payload)
    logger.info(f"Extracted {len(parameters)} parameters.")

    # 2. Evidence Retrieval
    evidence_records = await build_decision_evidence(parameters)
    logger.info(f"Retrieved {len(evidence_records)} evidence records.")

    # 3. NLI Verification (Verification phase before Replay)
    justifications = [p for p in parameters if p.parameter_type == "justification"]
    justification_text = " ".join([str(j.value) for j in justifications]) if justifications else payload.proposed_action

    for ev in evidence_records:
        label, score = check_claim_evidence_support(justification_text, ev.evidence_text)
        # Map labels to NLI standards (entailment/contradiction)
        if label == "supports":
            ev.support_label = "entailment"
        else:
            ev.support_label = label
        ev.support_score = float(score)

    # 4. Decision Replay Engine
    decision_replay, assumptions = replay_decision_evaluation(parameters, evidence_records)

    # 5. Run Audit Challenge Mode
    challenge_review = run_adversarial_challenge(
        payload.proposed_action,
        parameters,
        evidence_records,
        assumptions
    )

    # 6. Extract Contradictions
    contradictions = []
    for ev in evidence_records:
        if ev.support_label == "contradiction":
            contradictions.append(
                ContradictionRecord(
                    type=ContradictionType.INTERNAL,
                    source_a=justification_text,
                    source_b=ev.evidence_text,
                    description=f"Justification contradicts source evidence from {ev.source}."
                )
            )

    # 7. Extract Missing Evidence
    missing_evidence = []
    # If no evidence is found at all, suggest missing evidence
    if not evidence_records:
        missing_evidence.append(
            MissingEvidenceRecord(
                required_data_point="General independent verification data",
                impact_severity=EvidenceSeverity.HIGH,
                suggested_source="Web Search / Microsoft Fabric"
            )
        )

    # 8. Policy Compliance Verification (V1 SOP rules)
    nli_strength = 1.0
    if evidence_records:
        nli_strength = max((ev.support_score or 0.0) for ev in evidence_records)

    if contradictions:
        compliance_status = ComplianceStatus.NON_COMPLIANT
        compliance_reasoning = "Decision contradicts retrieved factual evidence."
    elif not evidence_records:
        compliance_status = ComplianceStatus.UNVERIFIED
        compliance_reasoning = "No evidence found to verify compliance with organizational SOPs."
    else:
        compliance_status = ComplianceStatus.COMPLIANT
        compliance_reasoning = "Decision justification matches retrieved verification data."

    policy_compliance = [
        PolicyComplianceRecord(
            policy_id="SOP-001",
            policy_name="Decision Integrity Verification",
            status=compliance_status,
            nli_support_strength=nli_strength,
            reasoning=compliance_reasoning
        )
    ]

    # 9. Calibration & Scoring Engine (Single Source of Truth)
    calibrator = DecisionCalibrationEngine()
    calibration_results = calibrator.calibrate(
        base_trust=0.95,
        base_risk=0.15,
        assumptions=assumptions,
        contradictions=contradictions,
        missing_evidence=missing_evidence,
        challenge_review=challenge_review
    )
    overall_trust_score = calibration_results["calibrated_trust"]
    overall_risk_score = calibration_results["calibrated_risk"]
    confidence_waterfall = calibration_results["waterfall"]
    calibration_trace = calibration_results["trace"]
    governance_rule_results = calibration_results["governance_rules"]
    override_action = calibration_results["override"]

    # 10. Verdict Assignment
    audit_status, executive_recommendation, rec_explanation = RecommendationEngine.determine_recommendation(
        trust_score=overall_trust_score,
        risk_score=overall_risk_score,
        override_action=override_action
    )

    findings = AuditFindings(
        policy_compliance=policy_compliance,
        contradictions=contradictions,
        missing_evidence=missing_evidence,
        assumptions=assumptions
    )

    # 11. Build Decision Replay Timeline steps
    evidence_used_titles = [ev.title or ev.source for ev in evidence_records if ev.support_label == "entailment"]
    evidence_ignored_titles = [ev.title or ev.source for ev in evidence_records if ev.support_label == "contradiction"]
    assumptions_text_list = [a.premise for a in assumptions]
    counterfactuals_text_list = [c.altered_premise for c in decision_replay.counterfactuals]

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
            final_recommendation=f"Integrity verified. Support level score is {nli_strength}."
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
        calibration_trace=calibration_trace,
        governance_rule_results=governance_rule_results
    )
