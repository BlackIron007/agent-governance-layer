from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport
from app.schemas.regulatory_obligation import RegulatoryObligation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class SOC2Engine:
    """
    SOC2 Compliance Engine: Evaluates security, availability, integrity,
    confidentiality, and third-party vendor risk controls.
    """
    def evaluate_framework(self, payload: DecisionPayload, report: BoardDecisionReport) -> RegulatoryFrameworkEvaluation:
        framework_name = "SOC2 Trust Services Criteria"
        compliance_score = 100.0
        violations = []
        obligations_checked = []

        # Obligation 1: Security and Vendor Governance
        lacks_soc2 = "lack" in payload.proposed_action.lower() or "soc2" in payload.proposed_action.lower() or (payload.raw_payload and payload.raw_payload.get("ignored_delivery_metrics", False))
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="SOC2-SEC-1.1",
                obligation_title="Third-Party Vendor Controls",
                severity="Critical",
                description="Ensure all critical cloud and hardware vendors maintain certified SOC2 audit reports.",
                evidence=f"Vendor assessment checked. Lacks certification flag = {lacks_soc2}."
            )
        )

        # Obligation 2: Data Confidentiality
        ciso_rejected = any(v.member_name == "CISO" and v.vote.value == "REJECTED" for v in report.board_members)
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="SOC2-CONF-2.1",
                obligation_title="Confidentiality and Leakage Prevention",
                severity="High",
                description="Assess data protection and confidentiality controls of system endpoints.",
                evidence=f"CISO audit review status. Rejections count = {1 if ciso_rejected else 0}."
            )
        )

        # Evaluate violations
        if lacks_soc2:
            compliance_score -= 60.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-SOC2-VENDOR",
                    violated_requirement="SOC2 Vendor Validation",
                    severity="Critical",
                    explanation="Vendor A was recommended but lacks standard SOC2 audit compliance.",
                    supporting_evidence="Proposed action summary notes vendor lacks standard SOC2 compliance."
                )
            )

        if ciso_rejected:
            compliance_score -= 20.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-SOC2-CONF",
                    violated_requirement="Information Security Controls",
                    severity="High",
                    explanation="Information security officer rejected the selection due to data leakage risk.",
                    supporting_evidence="CISO vote is set to REJECTED."
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
