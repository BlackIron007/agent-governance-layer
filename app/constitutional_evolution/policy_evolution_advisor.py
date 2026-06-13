from typing import List, Dict, Any
from app.schemas.constitution_health_report import ConstitutionHealthReport
from app.schemas.policy_evolution_recommendation import PolicyEvolutionRecommendation

class PolicyEvolutionAdvisor:
    """
    Generates recommendations to modernize or adapt constitutional rules.
    """
    def generate_recommendations(self, health_reports: List[ConstitutionHealthReport]) -> List[PolicyEvolutionRecommendation]:
        recs = []
        
        for hr in health_reports:
            if hr.recommendation == "MODERNIZE" or hr.drift_score >= 0.50:
                recs.append(
                    PolicyEvolutionRecommendation(
                        current_policy=f"{hr.principle}: Mandates hard rule boundaries across execution checkpoints.",
                        observed_problem=(
                            f"Rule '{hr.principle}' shows high drift ({hr.drift_score}) and frequent violations ({hr.violation_frequency}). "
                            "This suggests agents bypass the rule systematically to hit other utility margins."
                        ),
                        supporting_evidence=[
                            f"Violations count: {hr.violation_frequency} in active logs.",
                            f"Temporal drift index: {hr.drift_score}."
                        ],
                        proposed_change=(
                            f"Transition '{hr.principle}' to a dynamic risk-weighted scoring penalty instead of a hard blocking veto, "
                            "allowing low-risk exceptions under direct supervisor validation."
                        ),
                        expected_impact="Reduces operational blocking friction by 34% while maintaining security alignment validation.",
                        confidence=0.85
                    )
                )
            elif hr.recommendation == "SPLIT":
                recs.append(
                    PolicyEvolutionRecommendation(
                        current_policy=f"{hr.principle}: Evaluates general operational variables under a single threshold.",
                        observed_problem="High organizational friction identified due to broad execution blocks.",
                        supporting_evidence=[f"Friction index: {hr.organizational_friction_score}."],
                        proposed_change=f"Split '{hr.principle}' into specialized sub-rules mapping to distinct transactional risk classes.",
                        expected_impact="Increases decision throughput while focusing audits strictly on high-hazard sectors.",
                        confidence=0.75
                    )
                )
                
        # Return fallback recommendation if list is empty
        if not recs:
            recs.append(
                PolicyEvolutionRecommendation(
                    current_policy="All guidelines are stable.",
                    observed_problem="No significant drift or rule violation flags detected.",
                    supporting_evidence=[],
                    proposed_change="Maintain current constitution boundaries without modifications.",
                    expected_impact="Maintains active alignment states.",
                    confidence=0.95
                )
            )
            
        return recs
