from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport, VoteType
from app.schemas.regulatory_obligation import RegulatoryObligation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class NISTRMFEngine:
    """
    NIST AI Risk Management Framework (RMF) Engine: Evaluates AI system governance,
    measurement, monitoring, and active risk controls.
    """
    def evaluate_framework(self, payload: DecisionPayload, report: BoardDecisionReport) -> RegulatoryFrameworkEvaluation:
        framework_name = "NIST AI Risk Management Framework"
        compliance_score = 100.0
        violations = []
        obligations_checked = []

        # Obligation 1: Governance & Accountability
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="NIST-GOVERN-1.1",
                obligation_title="AI Governance Accountability",
                severity="High",
                description="Establish organizational policies for AI design, development, and deployment.",
                evidence="Executive Debate Board active with representatives from CFO, CISO, Legal, Operations, and Procurement."
            )
        )

        # Obligation 2: Risk Controls & Measurement
        risk_exposure = report.enterprise_simulation.expected_risk_exposure if report.enterprise_simulation else 0.0
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="NIST-MEASURE-2.1",
                obligation_title="Risk Control & Measurement",
                severity="High",
                description="Ensure system risks are measured and tracked over a multi-horizon enterprise scale.",
                evidence=f"Expected Enterprise Risk Score = {risk_exposure}/100."
            )
        )

        # Evaluate violations
        if risk_exposure > 30.0:
            compliance_score -= 25.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-NIST-MEASURE",
                    violated_requirement="Risk Control Thresholds",
                    severity="Medium",
                    explanation="Simulation shows enterprise risk exposure exceeds safety target levels.",
                    supporting_evidence=f"Active expected risk exposure: {risk_exposure}."
                )
            )

        has_violations = len(report.constitutional_violations) > 0
        if has_violations:
            compliance_score -= 20.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-NIST-GOVERN",
                    violated_requirement="Governance Integrity Gate",
                    severity="High",
                    explanation="Decision triggers constitutional principle violations, breaching core governance bounds.",
                    supporting_evidence=f"Constitutional Violations: {', '.join(report.constitutional_violations)}."
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
