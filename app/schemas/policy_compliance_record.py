from pydantic import BaseModel, Field
from enum import Enum

class ComplianceStatus(str, Enum):
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    UNVERIFIED = "UNVERIFIED"

class PolicyComplianceRecord(BaseModel):
    """
    Validation record mapping how a decision aligns with a specific corporate rule or SOP.
    """
    policy_id: str = Field(
        ..., 
        description="The unique code/ID of the target policy."
    )
    policy_name: str = Field(
        ..., 
        description="A short label/description of the policy."
    )
    status: ComplianceStatus = Field(
        ..., 
        description="The resulting compliance classification."
    )
    nli_support_strength: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="The NLI match alignment value supporting compliance."
    )
    reasoning: str = Field(
        ..., 
        description="Audit statement explaining the compliance outcome."
    )

    class Config:
        from_attributes = True
