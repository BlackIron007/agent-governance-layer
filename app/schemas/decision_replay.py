from pydantic import BaseModel, Field
from typing import List
from enum import Enum
from app.schemas.counterfactual_record import CounterfactualRecord

class OriginType(str, Enum):
    FABRIC_INTERNAL = "fabric_internal"
    PUBLIC_WEB = "public_web"

class EvidenceInfluenceItem(BaseModel):
    """
    Traces the correlation weight and influence of a specific source in supporting or rejecting a decision.
    """
    source_id: str = Field(
        ..., 
        description="The source identifier or database key."
    )
    source_name: str = Field(
        ..., 
        description="Friendly name/title of the evidence source."
    )
    origin: OriginType = Field(
        ..., 
        description="Data origin type (internal vs public web)."
    )
    influence_weight: float = Field(
        ..., 
        ge=-1.0, 
        le=1.0, 
        description="Mathematical correlation or impact weight of this evidence on the decision (-1.0 to 1.0)."
    )
    normalized_influence: float = Field(
        default=0.0,
        description="Min-max normalized score of the influence weight."
    )
    explanation: str = Field(
        default="",
        description="Detailed semantic description of how this evidence influenced the decision."
    )
    was_ignored: bool = Field(
        default=False, 
        description="Indicates if the source contains high-contradiction signals but was dismissed by the decision agent."
    )

    class Config:
        from_attributes = True

class DecisionReplay(BaseModel):
    """
    Captures why a decision agent acted the way it did: what it relied on, what it ignored, and scenario shift projections.
    """
    evidence_influence: List[EvidenceInfluenceItem] = Field(
        default_factory=list,
        description="Trace logs identifying critical data dependencies of the decision."
    )
    counterfactuals: List[CounterfactualRecord] = Field(
        default_factory=list,
        description="Simulated alternate scenarios and predicted outcome drifts."
    )
    ranked_evidence_list: List[str] = Field(
        default_factory=list,
        description="Ranked list of sources ordering by absolute influence strength."
    )

    class Config:
        from_attributes = True
