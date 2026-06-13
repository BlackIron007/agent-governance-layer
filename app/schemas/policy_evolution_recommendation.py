from pydantic import BaseModel, Field
from typing import List

class PolicyEvolutionRecommendation(BaseModel):
    """
    Structured policy change proposal detailing the observed issue, suggested remedy, and impact projections.
    """
    current_policy: str = Field(..., description="Details of the active constitutional rule.")
    observed_problem: str = Field(..., description="Problem description identified from historical violations/friction.")
    supporting_evidence: List[str] = Field(default_factory=list, description="Citations of logs/drift trends supporting change.")
    proposed_change: str = Field(..., description="Text proposal of the adjusted guideline rule.")
    expected_impact: str = Field(..., description="Projected operational/risk outcomes post-adjustment.")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence in this recommendation.")

    class Config:
        from_attributes = True
