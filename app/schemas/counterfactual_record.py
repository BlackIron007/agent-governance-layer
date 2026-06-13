from pydantic import BaseModel, Field
from enum import Enum

class CriticalityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class CounterfactualRecord(BaseModel):
    """
    Simulated counterfactual scenarios identifying how changes to input assertions shift the recommended decision.
    """
    altered_premise: str = Field(
        ..., 
        description="The modified hypothetical input (e.g., 'What if Vendor B cost 20% less?')."
    )
    expected_outcome_shift: str = Field(
        ..., 
        description="The predicted shift in decision action if the altered premise were true."
    )
    criticality: CriticalityLevel = Field(
        ..., 
        description="Importance of this scenario in testing decision boundaries."
    )

    class Config:
        from_attributes = True
