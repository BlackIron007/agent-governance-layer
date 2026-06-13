class ComplianceImpactModel:
    """
    Compliance Impact Model: Estimates policy violations, regulatory exposure, and audit risk.
    """
    def estimate_compliance(self, compliance_fail_rate: float, prior_violations_count: int) -> dict:
        # Determine audit risk score (0-100)
        audit_risk_score = min(100.0, round(compliance_fail_rate * 75.0 + prior_violations_count * 5.0, 2))
        
        # Determine policy violations count and severity
        violations_severity = "Compliant"
        if audit_risk_score > 60.0:
            violations_severity = "High Risk of Material Violation"
        elif audit_risk_score > 25.0:
            violations_severity = "Minor Operational Deviations"
            
        # Determine regulatory exposure rating
        regulatory_exposure = "Negligible"
        if audit_risk_score > 70.0:
            regulatory_exposure = "Critical Legal Exposure"
        elif audit_risk_score > 40.0:
            regulatory_exposure = "Moderate Exposure"
        elif audit_risk_score > 15.0:
            regulatory_exposure = "Low Exposure"

        return {
            "policy_violations_severity": violations_severity,
            "regulatory_exposure_level": regulatory_exposure,
            "audit_risk_score": audit_risk_score
        }
