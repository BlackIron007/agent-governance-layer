from pydantic import BaseModel, Field
from typing import List

class EnterpriseSimulationScenario(BaseModel):
    """
    Represents a specific simulated long-term outcome scenario.
    """
    scenario_id: str = Field(..., description="Unique code identifier (e.g. best_case, failure_cascade).")
    scenario_name: str = Field(..., description="Human-readable title of the scenario.")
    probability: float = Field(..., ge=0.0, le=1.0, description="Probability score (0.0 to 1.0).")
    assumptions: List[str] = Field(default_factory=list, description="Assumptions supporting this scenario.")
    supporting_precedents: List[str] = Field(default_factory=list, description="IDs of historical memory precedents cited.")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Calculation confidence score.")

    class Config:
        from_attributes = True
