from pydantic import BaseModel, Field
from typing import List

class ConstitutionEvaluation(BaseModel):
    """
    Represents the evaluation of a decision under a specific constitution.
    """
    constitution_name: str = Field(..., description="Name of the evaluated constitution.")
    score: float = Field(..., ge=0.0, le=100.0, description="Evaluation score (0 to 100).")
    violations: List[str] = Field(default_factory=list, description="List of triggered principle violations.")
    strengths: List[str] = Field(default_factory=list, description="Strengths observed supporting this framework.")
    recommendation: str = Field(..., description="Decision recommendation (Reject, Review, Approve, Approve With Conditions).")

    class Config:
        from_attributes = True
