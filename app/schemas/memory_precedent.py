from pydantic import BaseModel, Field
from typing import List, Optional

class MemoryPrecedent(BaseModel):
    """
    Represents a historical organizational decision stored in memory to act as a governance precedent.
    """
    precedent_id: str = Field(..., description="Unique ID of the past decision.")
    decision_summary: str = Field(..., description="Summary of what was proposed and evaluated.")
    outcome: str = Field(..., description="The final recommendation verdict of the board.")
    lessons_learned: List[str] = Field(default_factory=list, description="Remediations and observations learned post-execution.")
    risk_factors: List[str] = Field(default_factory=list, description="Risks logged during the historical audit.")
    similarity_score: Optional[float] = Field(0.0, description="Calculated similarity comparison score to current payload.")

    class Config:
        from_attributes = True
