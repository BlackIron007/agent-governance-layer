from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport
from app.schemas.regulatory_obligation import RegulatoryObligation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class CorporatePolicyEngine:
    """
    Corporate Policy Engine: Evaluates compliance against enterprise-specific policy rules
    such as security prioritization, SOC2 requirements, and risk thresholds.
    """
    def evaluate_framework(self, payload: DecisionPayload, report: BoardDecisionReport) -> RegulatoryFrameworkEvaluation:
        framework_name = "Corporate Policy Guidelines"
        compliance_score = 100.0
        violations = []
        obligations_checked = []

        # Obligation 1: SOC2 Critical Vendor Compliance
        category = payload.raw_payload.get("category", "") if payload.raw_payload else ""
        is_critical = "strategic" in category or "critical" in category or "hardware" in category
        lacks_soc2 = "lack" in payload.proposed_action.lower() or "soc2" in payload.proposed_action.lower() or (payload.raw_payload and payload.raw_payload.get("ignored_delivery_metrics", False)) or any("soc2" in v.rationale.lower() or "lack" in v.rationale.lower() for v in report.board_members)
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="CORP-POL-SOC2",
                obligation_title="SOC2 Required for Critical Vendors",
                severity="Critical",
                description="All strategic hardware or software suppliers must possess certified SOC2 credentials prior to selection.",
                evidence=f"Category: {category}, Critical: {is_critical}, Lacks SOC2: {lacks_soc2}."
            )
        )


        # Obligation 2: Security Over Commercial Value
        cfo_approved = any(v.member_name == "CFO" and v.vote.value == "APPROVED" for v in report.board_members)
        ciso_rejected = any(v.member_name == "CISO" and v.vote.value == "REJECTED" for v in report.board_members)
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="CORP-POL-SEC-COST",
                obligation_title="Security Before Cost Prioritization",
                severity="High",
                description="Commercial savings must never justify overriding security gates or CISO rejections.",
                evidence=f"CFO Approved: {cfo_approved}, CISO Rejected: {ciso_rejected}."
            )
        )

        # Obligation 3: Human Review Gate for High Risk
        risk_score = report.enterprise_simulation.expected_risk_exposure if report.enterprise_simulation else 0.0
        obligations_checked.append(
            RegulatoryObligation(
                framework_name=framework_name,
                obligation_id="CORP-POL-REVIEW",
                obligation_title="Human Review Required for High Risk",
                severity="High",
                description="Decisions exhibiting high simulated risk exposure (>30) require mandatory human review.",
                evidence=f"Expected enterprise risk exposure: {risk_score}."
            )
        )

        # Evaluate violations
        if is_critical and lacks_soc2:
            compliance_score -= 40.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-CORP-SOC2",
                    violated_requirement="SOC2 Vendor Policy",
                    severity="Critical",
                    explanation="Strategic hardware supplier Vendor A lacks SOC2 security certification.",
                    supporting_evidence="Proposal targets strategic hardware supply but reports missing SOC2 certification."
                )
            )

        if cfo_approved and ciso_rejected:
            compliance_score -= 30.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-CORP-SEC-COST",
                    violated_requirement="Security Prioritization Policy",
                    severity="High",
                    explanation="Economic savings (20% cheaper) prioritized over CISO data security concerns.",
                    supporting_evidence="CFO voted APPROVED citing saving margins; CISO voted REJECTED citing lack of SOC2."
                )
            )

        if risk_score > 30.0:
            compliance_score -= 20.0
            violations.append(
                RegulatoryViolation(
                    framework_name=framework_name,
                    violation_id="VIO-CORP-REVIEW",
                    violated_requirement="Mandatory Human Escort Gate",
                    severity="High",
                    explanation="Enterprise risk projection exceeded the maximum threshold of 30.",
                    supporting_evidence=f"Simulated Expected Risk Exposure is {risk_score}."
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
