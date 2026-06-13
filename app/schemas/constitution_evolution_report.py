from pydantic import BaseModel, Field
from typing import List, Dict, Any
from app.schemas.constitution_health_report import ConstitutionHealthReport
from app.schemas.policy_evolution_recommendation import PolicyEvolutionRecommendation

class ConstitutionEvolutionReport(BaseModel):
    """
    Consolidated executive report detailing the health checks, policy recommendations, and simulation outcomes.
    """
    health_scores: List[ConstitutionHealthReport] = Field(
        ..., 
        description="Health metrics evaluated for every constitutional principle."
    )
    recommendations: List[PolicyEvolutionRecommendation] = Field(
        ..., 
        description="Policy evolution proposals generated for human review."
    )
    simulations: Dict[str, Any] = Field(
        ..., 
        description="Outcomes computed by the simulation engine showing impact changes."
    )
    supporting_evidence: List[str] = Field(
        default_factory=list,
        description="Memory precedents and drift statistics used to support the recommendations."
    )

    class Config:
        from_attributes = True
