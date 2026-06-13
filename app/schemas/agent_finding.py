from pydantic import BaseModel, Field
from enum import Enum

class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class AgentFinding(BaseModel):
    """
    An individual evaluation finding raised by a specialized auditing agent.
    """
    agent_id: str = Field(
        ..., 
        description="The ID of the auditing agent raising the finding."
    )
    finding_type: str = Field(
        ..., 
        description="Category of finding (e.g., policy_violation, logical_inconsistency, risk_outlier)."
    )
    description: str = Field(
        ..., 
        description="The detailed rationale or explanation of the finding."
    )
    severity: SeverityLevel = Field(
        ..., 
        description="The seriousness of the finding on the decision execution."
    )

    class Config:
        from_attributes = True
