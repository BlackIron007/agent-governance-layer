from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport
from app.schemas.regulatory_obligation import RegulatoryObligation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class MicrosoftResponsibleAIEngine:
    """
    Microsoft Responsible AI Standard Engine: Evaluates fairness, reliability, safety,
    privacy, transparency, and accountability.
    """
    def evaluate_framework(self, payload: DecisionPayload, report: BoardDecisionReport) -> RegulatoryFrameworkEvaluation:
        framework_name = "Microsoft Responsible AI Standard"
        compliance_score = 100.0
        violations = []
        obligations_checked = []

        # Obligation 1: Reliability & Safety
        is_unstable = report.enterprise_simulation.expected_risk_exposure > 30.0 if report.enterprise_simulation else False
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="MS-RAI-RELIABILITY",
                obligation_title="Reliability and Safety",
                severity="High",
                description="Ensure AI system decisions operate reliably and do not introduce severe operational risk.",
                evidence=f"System reliability check. Enterprise risk exposure flags = {is_unstable}."
            )
        )

        # Obligation 2: Transparency & Accountability
        ignored_metrics = payload.raw_payload.get("ignored_delivery_metrics", False) if payload.raw_payload else False
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="MS-RAI-ACCOUNTABILITY",
                obligation_title="Transparency and Accountability",
                severity="High",
                description="Establish accountability layers and transparent documentation of decision trade-offs.",
                evidence=f"Transparency check. Ignored delivery warning metrics = {ignored_metrics}."
            )
        )

        # Evaluate violations
        if ignored_metrics:
            compliance_score -= 30.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-MS-RAI-TRANS",
                    violated_requirement="Transparency and Honesty Standard",
                    severity="High",
                    explanation="AI agent recommended cheaper vendor by withholding and ignoring critical SLA performance warnings.",
                    supporting_evidence="Proposal raw payload indicates ignored_delivery_metrics = True."
                )
            )

        if is_unstable:
            compliance_score -= 20.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-MS-RAI-SAFETY",
                    violated_requirement="Safety and Reliability Guardrails",
                    severity="Medium",
                    explanation="Expected enterprise failure risk exceeds standard safety operating margins.",
                    supporting_evidence=f"Simulation risk score: {report.enterprise_simulation.expected_risk_exposure if report.enterprise_simulation else 0.0}."
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
