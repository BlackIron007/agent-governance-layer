from typing import List
from app.schemas.enterprise_simulation_scenario import EnterpriseSimulationScenario
from app.schemas.quarterly_impact import QuarterlyImpact

class SimulationAggregator:
    """
    Simulation Aggregator: Aggregates scenario metrics and quarterly impacts to compute
    the overall Enterprise Impact Score and Enterprise Risk Exposure.
    """
    def aggregate_scores(
        self, 
        scenarios: List[EnterpriseSimulationScenario], 
        quarterly_impacts: List[QuarterlyImpact]
    ) -> tuple[float, float]:
        if not scenarios:
            return 50.0, 50.0

        # Enterprise Impact Score (0-100): Expected organizational benefit.
        # We weight scenario calculations by probability.
        # Best Case and Expected Case contribute positively; failure/regulatory/delayed cases represent downside risks.
        # Let's derive benefit score from positive scenarios and subtract risk score, or base it on individual scenarios.
        
        expected_benefit = 0.0
        expected_risk = 0.0
        
        for scenario in scenarios:
            prob = scenario.probability
            conf = scenario.confidence
            
            # Map scenario_id to base benefit and risk coefficients
            if scenario.scenario_id == "best_case":
                benefit_coeff = 95.0
                risk_coeff = 5.0
            elif scenario.scenario_id == "expected_case":
                benefit_coeff = 75.0
                risk_coeff = 15.0
            elif scenario.scenario_id == "delayed_impact":
                benefit_coeff = 50.0
                risk_coeff = 35.0
            elif scenario.scenario_id == "regulatory_event":
                benefit_coeff = 20.0
                risk_coeff = 75.0
            elif scenario.scenario_id == "failure_cascade":
                benefit_coeff = 5.0
                risk_coeff = 95.0
            else:
                benefit_coeff = 50.0
                risk_coeff = 50.0
                
            # Weighted expected values
            expected_benefit += prob * benefit_coeff * conf
            expected_risk += prob * risk_coeff * conf

        # Incorporate quarterly risk scores
        avg_quarterly_risk = sum(q.risk_score for q in quarterly_impacts) / max(len(quarterly_impacts), 1)
        
        # Blend the risk metrics (70% scenario risk, 30% quarterly risk trend)
        final_risk = round(0.70 * expected_risk + 0.30 * avg_quarterly_risk, 2)
        # Final value/impact score
        final_value = round(expected_benefit, 2)

        # Bound them strictly between 0 and 100
        final_value = max(0.0, min(100.0, final_value))
        final_risk = max(0.0, min(100.0, final_risk))

        return final_value, final_risk
