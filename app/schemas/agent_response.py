from pydantic import BaseModel, Field
from typing import List
from app.schemas.agent_finding import AgentFinding

class AgentResponse(BaseModel):
    """
    Standard schema for responses returned by auditing agents to the Audit Coordinator.
    """
    agent_id: str = Field(
        ..., 
        description="The ID of the specialized agent (e.g., PolicyAuditor, RedTeamAgent)."
    )
    findings: List[AgentFinding] = Field(
        default_factory=list,
        description="List of evaluation findings discovered by the agent."
    )
    trust_score_contribution: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="The individual trust evaluation score output by this agent."
    )
    risk_score_contribution: float = Field(
        ..., 
        ge=0.0, 
        le=1.0, 
        description="The individual risk evaluation score output by this agent."
    )

    class Config:
        from_attributes = True
