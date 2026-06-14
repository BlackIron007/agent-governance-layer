from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class DecisionVerdictType(str, Enum):
    APPROVED = "APPROVED"
    BLOCKED = "BLOCKED"
    CONDITIONAL_ALLOW = "CONDITIONAL_ALLOW"


class GovernanceDecisionSummary(BaseModel):
    """
    A lightweight summary of a single governance decision, used in paginated list responses.
    Designed for the /decisions history endpoint and audit trail views.
    """
    decision_id: str = Field(
        ...,
        description="Stable, human-readable decision identifier (e.g., 'DEC-1495')."
    )
    schema_version: str = Field(
        default="1.0.0",
        description="Schema version of this payload, for future migration safety."
    )
    timestamp: datetime = Field(
        ...,
        description="UTC timestamp of when the governance decision was finalized."
    )
    decision_type: str = Field(
        ...,
        description="Category of the decision (e.g., 'Procurement', 'Access Override', 'Clinical Ops')."
    )
    summary: str = Field(
        ...,
        description="One-line human-readable summary of what was evaluated."
    )
    verdict: DecisionVerdictType = Field(
        ...,
        description="Final verdict emitted by the governance pipeline."
    )
    execution_confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Governance confidence score (0.0-1.0). Formerly 'trust_score'."
    )
    risk_exposure: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Risk exposure score (0.0-1.0)."
    )

    class Config:
        from_attributes = True


class GovernanceDecisionListResponse(BaseModel):
    """
    Paginated response wrapper for the /api/v1/decisions endpoint.
    """
    schema_version: str = Field(default="1.0.0")
    items: List[GovernanceDecisionSummary] = Field(default_factory=list)
    page: int = Field(default=1, description="Current page number (1-indexed).")
    page_size: int = Field(default=50, description="Number of items per page.")
    total: int = Field(default=0, description="Total number of decisions across all pages.")

    class Config:
        from_attributes = True
