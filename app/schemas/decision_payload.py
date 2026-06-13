from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime

class DecisionPayload(BaseModel):
    """
    Represents the ingested AI decision context that triggers the audit process.
    """
    actor_agent_id: str = Field(
        ..., 
        description="Unique identifier of the AI agent proposing the decision."
    )
    decision_type: str = Field(
        ..., 
        description="Category of the decision being audited (e.g., vendor_selection, procurement_recommendation)."
    )
    proposed_action: str = Field(
        ..., 
        description="A clear, human-readable summary of the action the agent wants to perform."
    )
    raw_payload: Dict[str, Any] = Field(
        ..., 
        description="The raw payload and metadata of the agent execution run."
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="The timestamp when the decision payload was ingested."
    )

    class Config:
        from_attributes = True
