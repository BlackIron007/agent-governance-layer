from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class GovernanceEvent(BaseModel):
    """
    Structured model for individual decision audit metadata stored in the historical log.
    """
    event_id: str = Field(..., description="Unique event transaction identifier.")
    timestamp: datetime = Field(..., description="Timestamp of the decision audit completion.")
    originating_agent: str = Field(..., description="ID of the AI agent requesting the decision.")
    decision_type: str = Field(..., description="E.g., vendor_selection, risk_assessment, procurement.")
    trust_score: float = Field(..., ge=0.0, le=1.0)
    risk_score: float = Field(..., ge=0.0, le=1.0)
    final_verdict: str = Field(..., description="Final resolved audit verdict (APPROVED, WARNING, REJECTED_CRITICAL, REJECTED).")
    constitutional_violations: List[str] = Field(default_factory=list, description="Descriptions of principles violated.")
    board_recommendation: str = Field(..., description="Actionable recommendation issued.")
    precedents_used: List[str] = Field(default_factory=list, description="IDs of precedents matched.")

    class Config:
        from_attributes = True
