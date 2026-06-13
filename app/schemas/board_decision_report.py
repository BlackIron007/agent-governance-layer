from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum
from app.schemas.decision_payload import DecisionPayload
from app.schemas.outcome_forecast_report import OutcomeForecastReport
from app.schemas.organizational_memory_report import OrganizationalMemoryReport
from app.schemas.enterprise_simulation_report import EnterpriseSimulationReport
from app.schemas.governance_attack_report import GovernanceAttackReport
from app.schemas.multi_constitution_report import MultiConstitutionReport


class VoteType(str, Enum):
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    ABSTAINED = "ABSTAINED"

class BoardMemberVote(BaseModel):
    """
    Individual board member evaluation model.
    """
    member_name: str = Field(..., description="Role profile name (e.g., CFO, CISO, Legal).")
    vote: VoteType = Field(..., description="Voting stance on the proposed action.")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Member confidence in their decision rating.")
    rationale: str = Field(..., description="Details of their evaluation rationale.")
    evidence_cited: List[str] = Field(default_factory=list, description="Citations of evidence used during validation.")

    class Config:
        from_attributes = True

class BoardRecommendationAction(str, Enum):
    APPROVED = "APPROVED"
    DEFERRED_FOR_REVIEW = "DEFERRED_FOR_REVIEW"
    DEVIATION_SUSPENDED = "DEVIATION_SUSPENDED"
    REJECTED = "REJECTED"

class BoardDecisionReport(BaseModel):
    """
    Represents the final collective audit verdict compiled by the Executive Debate Board.
    """
    board_decision_id: str = Field(..., description="Unique code for this board audit session.")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    decision_context: DecisionPayload = Field(..., description="Proposed AI recommendation payload.")
    board_members: List[BoardMemberVote] = Field(..., description="Voter profiles and evaluations.")
    consensus_score: float = Field(..., ge=0.0, le=1.0, description="Agreement density index (0.0 to 1.0).")
    conflicts: List[str] = Field(default_factory=list, description="Logical conflicts or voting disputes identified.")
    board_recommendation: BoardRecommendationAction = Field(..., description="Actionable gate recommendation.")
    outcome_forecast: OutcomeForecastReport = Field(..., description="Projected scenarios for alternative futures.")
    constitutional_status: str = Field(..., description="Constitutional compliance score/status.")
    constitutional_violations: List[str] = Field(default_factory=list, description="Constitutional principle violations triggered.")
    organizational_memory_report: OrganizationalMemoryReport = Field(..., description="Details of precedents searched and guided rules.")
    enterprise_simulation: Optional[EnterpriseSimulationReport] = Field(None, description="Enterprise-wide impact simulation engine report.")
    governance_attack_report: Optional[GovernanceAttackReport] = Field(None, description="Adversarial governance penetration testing report.")
    multi_constitution_report: Optional[MultiConstitutionReport] = Field(None, description="Multi-constitution evaluation scorecard report.")

    class Config:
        from_attributes = True



