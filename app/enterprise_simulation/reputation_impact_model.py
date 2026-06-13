class ReputationImpactModel:
    """
    Reputation Impact Model: Estimates customer trust impact, stakeholder confidence, and brand exposure.
    """
    def estimate_reputation(self, failure_probability: float, historical_confidence_pct: float) -> dict:
        # Customer trust impact based on failure probability
        trust_impact_delta = -round(failure_probability * 45.0, 2)
        projected_trust_score = max(0.0, min(100.0, round(95.0 + trust_impact_delta, 2)))
        
        # Stakeholder confidence impact
        confidence_delta = -round(failure_probability * 30.0, 2)
        projected_stakeholder_confidence = max(0.0, min(100.0, round(historical_confidence_pct + confidence_delta, 2)))
        
        # Brand exposure level
        brand_exposure = "Minimal"
        if failure_probability > 0.6:
            brand_exposure = "Critical Public Disruption"
        elif failure_probability > 0.3:
            brand_exposure = "Elevated Brand Vulnerability"
        elif failure_probability > 0.1:
            brand_exposure = "Moderate Brand Friction"

        return {
            "projected_customer_trust_score": projected_trust_score,
            "projected_stakeholder_confidence": projected_stakeholder_confidence,
            "brand_exposure_level": brand_exposure,
            "trust_impact_delta": trust_impact_delta
        }
