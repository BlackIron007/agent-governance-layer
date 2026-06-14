from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

from app.schemas.processing_metadata import ProcessingMetadata
from app.schemas.governance_decision_list import DecisionVerdictType


class TimelineNodeType(str, Enum):
    """
    Classifies each node in the decision narrative timeline by the governance layer it represents.
    Enables the frontend to render layer-appropriate icons, colors, and grouping.
    """
    INPUT = "INPUT"
    EVIDENCE = "EVIDENCE"
    BOARD = "BOARD"
    REGULATORY = "REGULATORY"
    ADVERSARIAL = "ADVERSARIAL"
    SIMULATION = "SIMULATION"
    CONSTITUTION = "CONSTITUTION"
    VERDICT = "VERDICT"


class TimelineNodeStatus(str, Enum):
    COMPLETED = "completed"
    CURRENT = "current"
    UPCOMING = "upcoming"


class GovernanceTimelineNode(BaseModel):
    """
    A single step in the governance decision narrative timeline.
    Each node represents one layer of the multi-agent pipeline.
    """
    type: TimelineNodeType = Field(
        ...,
        description="Governance layer this node represents — drives frontend icon/color rendering."
    )
    label: str = Field(..., description="Short display label for this timeline step.")
    summary: str = Field(..., description="One-line summary of what happened at this step.")
    details: str = Field(default="", description="Expanded forensic detail paragraph.")
    status: TimelineNodeStatus = Field(
        default=TimelineNodeStatus.COMPLETED,
        description="Execution status of this timeline node."
    )

    class Config:
        from_attributes = True


class EnrichedBoardMemberVote(BaseModel):
    """
    An enriched board member vote, including evidence references and constitutional citations.
    Replaces the bare BoardMemberVote schema for governance decision detail responses.
    """
    member: str = Field(..., description="Role profile of the board member (e.g., CISO, CFO).")
    vote: str = Field(..., description="Voting stance: APPROVED or REJECTED.")
    confidence: float = Field(
        ..., ge=0.0, le=100.0,
        description="Member confidence in their decision (0-100 percentage scale)."
    )
    rationale: str = Field(..., description="Detailed rationale for the member's vote.")
    evidence_count: int = Field(
        default=0,
        description="Number of evidence items this member cited in their deliberation."
    )
    precedent_count: int = Field(
        default=0,
        description="Number of organizational memory precedents referenced."
    )
    constitutional_violations_referenced: int = Field(
        default=0,
        description="Number of constitutional violations this member's vote references."
    )

    class Config:
        from_attributes = True


class GovernanceDecisionDetail(BaseModel):
    """
    Full forensic audit payload for a single governance decision.
    Returned by GET /api/v1/decisions/{decisionId}.
    Contains all information required to fully render /decision/[id] on the frontend.
    """
    schema_version: str = Field(
        default="1.0.0",
        description="Payload schema version — increment when breaking changes are introduced."
    )
    decision_id: str = Field(
        ...,
        description="Stable, human-readable decision identifier (e.g., 'DEC-1495')."
    )
    timestamp: datetime = Field(
        ...,
        description="UTC timestamp of when the governance decision was finalized."
    )
    decision_type: str = Field(..., description="Category of the decision.")
    context: str = Field(..., description="Narrative context describing the governance scenario.")
    proposal: str = Field(..., description="The specific action proposed by the AI agent.")
    rationale: str = Field(..., description="The supporting rationale provided by the proposing agent.")
    agent_profile: str = Field(..., description="Enterprise profile context (e.g., Highly Regulated).")

    verdict: DecisionVerdictType = Field(..., description="Final governance verdict.")
    execution_confidence: float = Field(
        ..., ge=0.0, le=100.0,
        description="Governance confidence score (0-100). Replaces 'trust_score'."
    )
    risk_exposure: float = Field(
        ..., ge=0.0, le=100.0,
        description="Risk exposure score (0-100)."
    )
    evidence_strength: float = Field(
        ..., ge=0.0, le=100.0,
        description="Aggregate strength of evidence backing this decision (0-100)."
    )
    takeaway: str = Field(..., description="One-sentence executive takeaway explaining the verdict.")

    processing: ProcessingMetadata = Field(
        ...,
        description="Runtime execution telemetry from the governance pipeline."
    )

    decision_dna: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Decision DNA breakdown — driver labels and relative weight percentages."
    )

    board: Dict[str, Any] = Field(
        default_factory=dict,
        description="Executive board deliberation result, including enriched member votes."
    )

    regulatory: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Per-framework regulatory alignment evaluation results."
    )

    adversarial: Dict[str, Any] = Field(
        default_factory=dict,
        description="Governance Attack Lab adversarial resilience report."
    )

    simulation: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="Enterprise simulation forecast scenarios."
    )

    constitutions: Dict[str, Any] = Field(
        default_factory=dict,
        description="Multi-constitution scorecard and conflict resolution summary."
    )

    timeline: List[GovernanceTimelineNode] = Field(
        default_factory=list,
        description="Typed narrative timeline nodes tracing every governance layer."
    )

    class Config:
        from_attributes = True
