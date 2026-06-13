from pydantic import BaseModel, Field
from typing import List

class AdjustmentEvent(BaseModel):
    """
    Represents a single confidence adjustment event applied by the governance rules engine.
    """
    source: str = Field(
        ..., 
        description="The source category of the adjustment (e.g., unsupported_assumption, missing_evidence, red_team_challenge)."
    )
    reason: str = Field(
        ..., 
        description="Text description of why this specific adjustment was applied."
    )
    delta: float = Field(
        ..., 
        description="The change in confidence/trust score (usually negative for penalties, positive for reinforcements)."
    )

    class Config:
        from_attributes = True

class ConfidenceWaterfall(BaseModel):
    """
    Captures the step-by-step degradation/appreciation of confidence from initial state to final verdict.
    """
    initial_confidence: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="The baseline trust confidence value before running governance evaluations."
    )
    adjustments: List[AdjustmentEvent] = Field(
        default_factory=list,
        description="List of applied delta adjustment events."
    )
    final_confidence: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="The final computed trust confidence value after compound calculations."
    )

    class Config:
        from_attributes = True
