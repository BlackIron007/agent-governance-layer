from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport, VoteType
from app.schemas.regulatory_obligation import RegulatoryObligation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class EUAIActEngine:
    """
    EU AI Act Compliance Engine: Evaluates transparency, traceability, human oversight,
    and risk management requirements.
    """
    def evaluate_framework(self, payload: DecisionPayload, report: BoardDecisionReport) -> RegulatoryFrameworkEvaluation:
        framework_name = "EU AI Act"
        compliance_score = 100.0
        violations = []
        obligations_checked = []

        # Obligation 1: Human Oversight
        rejections = sum(1 for v in report.board_members if v.vote == VoteType.REJECTED)
        oversight_status = "Adequate" if rejections > 0 else "Low verification intervention"
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="EU-ACT-ART14",
                obligation_title="Human Oversight",
                severity="High",
                description="High-risk AI systems must have adequate human oversight interfaces to prevent or minimize risk.",
                evidence=f"Executive board review performed with {len(report.board_members)} active members voting. Status: {oversight_status}."
            )
        )

        # Obligation 2: Transparency & Traceability
        has_warnings = "ignored" in payload.proposed_action.lower() or (payload.raw_payload and payload.raw_payload.get("ignored_delivery_metrics", False))
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="EU-ACT-ART13",
                obligation_title="Transparency & Traceability",
                severity="Medium",
                description="Ensuring high-risk system parameters are traceable, auditable, and transparent.",
                evidence=f"Decision audit timeline compiled. Ignored metrics warning flagged = {has_warnings}."
            )
        )

        # Evaluate violations
        if has_warnings:
            compliance_score -= 30.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-EU-ART13",
                    violated_requirement="Transparency & Parameter Documentation",
                    severity="High",
                    explanation="AI agent recommended vendor A while selectively omitting historical delivery degradation parameters.",
                    supporting_evidence="Proposal logs indicate 'ignored_delivery_metrics' parameter set to True."
                )
            )

        if rejections >= 3:
            compliance_score -= 20.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-EU-ART14",
                    violated_requirement="Human Oversight Alignment",
                    severity="Medium",
                    explanation="Autonomous execution proceeded despite majority board rejection votes.",
                    supporting_evidence=f"Voter rejections count = {rejections}."
                )
            )

        compliance_score = max(0.0, compliance_score)
        rec = "Approve" if compliance_score >= 80.0 else "Review" if compliance_score >= 50.0 else "Block"

        return RegulatoryFrameworkEvaluation(
            framework_name=framework_name,
            compliance_score=compliance_score,
            violations=violations,
            obligations_checked=obligations_checked,
            recommendation=rec
        )
