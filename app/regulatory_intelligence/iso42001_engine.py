from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport
from app.schemas.regulatory_obligation import RegulatoryObligation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class ISO42001Engine:
    """
    ISO/IEC 42001 AI Management System compliance engine.
    Evaluates oversight, review requirements, management controls, and accountability.
    """
    def evaluate_framework(self, payload: DecisionPayload, report: BoardDecisionReport) -> RegulatoryFrameworkEvaluation:
        framework_name = "ISO/IEC 42001"
        compliance_score = 100.0
        violations = []
        obligations_checked = []

        # Obligation 1: System Management Control
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="ISO-42001-A9",
                obligation_title="AI Management System Controls",
                severity="Medium",
                description="Controls and monitoring mechanisms applied to verify system recommendations.",
                evidence="Audited via Trust Console IQ single-path decision audit pipeline."
            )
        )

        # Obligation 2: Accountability & Verification Checks
        compliance_violations = 0
        if report.multi_constitution_report:
            for eval_item in report.multi_constitution_report.evaluations:
                compliance_violations += len(eval_item.violations)
                
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="ISO-42001-A10",
                obligation_title="Accountability & Oversight Review",
                severity="High",
                description="Verify AI decisions against competing enterprise policies and legal obligations.",
                evidence=f"Multi-constitutional scorecards active. Number of scorecard violations = {compliance_violations}."
            )
        )

        # Evaluate violations
        if compliance_violations > 0:
            compliance_score -= min(40.0, compliance_violations * 15.0)
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-ISO-ACCOUNT",
                    violated_requirement="Accountability Standards Compliance",
                    severity="High",
                    explanation="AI recommendation violates principles registered in Security/Compliance/Sustainability constitutions.",
                    supporting_evidence=f"Scorecard violations found = {compliance_violations}."
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
