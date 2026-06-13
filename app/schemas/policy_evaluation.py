from pydantic import BaseModel, Field
from typing import List

class PolicyEvaluation(BaseModel):
    """
    Represents the evaluation of a decision against corporate policies.
    """
    policy_name: str = Field(..., description="Name of corporate policy suite.")
    score: float = Field(..., ge=0.0, le=100.0, description="Alignment score (0 to 100).")
    violations: List[str] = Field(default_factory=list, description="Policy rules triggered as violated.")
    status: str = Field(..., description="Stance (e.g. Compliant, Non-Compliant).")

    class Config:
        from_attributes = True
