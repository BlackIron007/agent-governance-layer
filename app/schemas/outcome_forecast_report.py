from pydantic import BaseModel, Field
from typing import List

class FutureOutcomeSimulation(BaseModel):
    """
    Represents a single projected alternative future simulation for a decision.
    """
    scenario: str = Field(
        ..., 
        description="Description of the hypothetical future scenario."
    )
    probability: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="Calculated likelihood of occurrence (0.0 to 1.0)."
    )
    expected_impact: str = Field(
        ..., 
        description="Qualitative description of impact on corporate operations/finances."
    )
    supporting_assumptions: List[str] = Field(
        default_factory=list,
        description="Underlying assumptions that must hold true for this scenario to play out."
    )

    class Config:
        from_attributes = True

class OutcomeForecastReport(BaseModel):
    """
    A report compiling multiple alternative futures to map long-term risks.
    """
    simulations: List[FutureOutcomeSimulation] = Field(
        ..., 
        description="The alternative future simulations (exactly 5 are generated)."
    )

    class Config:
        from_attributes = True
