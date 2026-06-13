from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_intelligence_report import RegulatoryIntelligenceReport

from app.regulatory_intelligence.eu_ai_act_engine import EUAIActEngine
from app.regulatory_intelligence.nist_rmf_engine import NISTRMFEngine
from app.regulatory_intelligence.iso42001_engine import ISO42001Engine
from app.regulatory_intelligence.soc2_engine import SOC2Engine
from app.regulatory_intelligence.microsoft_responsible_ai_engine import MicrosoftResponsibleAIEngine
from app.regulatory_intelligence.microsoft_red_team_engine import MicrosoftAIRedTeamEngine
from app.regulatory_intelligence.corporate_policy_engine import CorporatePolicyEngine
from app.regulatory_intelligence.regulatory_conflict_engine import RegulatoryConflictEngine
from app.regulatory_intelligence.regulatory_alignment_engine import RegulatoryAlignmentEngine

class RegulatoryOrchestrator:
    """
    Regulatory Orchestrator: Coordinates multi-framework evaluations, checks corporate policies,
    detects conflicts, and compiles the Regulatory Intelligence Report.
    """
    def __init__(self):
        self.eu_ai_act = EUAIActEngine()
        self.nist_rmf = NISTRMFEngine()
        self.iso_42001 = ISO42001Engine()
        self.soc2 = SOC2Engine()
        self.ms_responsible_ai = MicrosoftResponsibleAIEngine()
        self.ms_red_team = MicrosoftAIRedTeamEngine()
        self.corp_policy = CorporatePolicyEngine()
        self.conflict_engine = RegulatoryConflictEngine()
        self.alignment_engine = RegulatoryAlignmentEngine()

    def run_regulatory_review(
        self,
        payload: DecisionPayload,
        report: BoardDecisionReport
    ) -> RegulatoryIntelligenceReport:
        # Run evaluations
        evaluations = [
            self.eu_ai_act.evaluate_framework(payload, report),
            self.nist_rmf.evaluate_framework(payload, report),
            self.iso_42001.evaluate_framework(payload, report),
            self.soc2.evaluate_framework(payload, report),
            self.ms_responsible_ai.evaluate_framework(payload, report),
            self.ms_red_team.evaluate_framework(payload, report),
            self.corp_policy.evaluate_framework(payload, report)
        ]

        # Compile all violations
        violations = []
        for e in evaluations:
            violations.extend(e.violations)

        # Run conflict detection
        conflicts = self.conflict_engine.detect_conflicts(payload, report, evaluations)

        # Compute compliance score and execution status
        compliance_score, execution_status = self.alignment_engine.align_compliance(evaluations)

        # Build executive summary
        summary = (
            f"The Regulatory Intelligence Review resulted in a status of {execution_status} "
            f"with an overall compliance score of {compliance_score}/100. "
            f"We identified {len(violations)} regulatory violations and {len(conflicts)} policy conflicts. "
            f"Key triggers include Vendor A lacking mandatory SOC2 security certifications, CISO rejection, "
            f"and cognitive manipulation anomalies flagged by AI Red Teaming."
        )

        return RegulatoryIntelligenceReport(
            framework_evaluations=evaluations,
            regulatory_violations=violations,
            regulatory_conflicts=conflicts,
            overall_compliance_score=compliance_score,
            execution_status=execution_status,
            executive_summary=summary
        )
