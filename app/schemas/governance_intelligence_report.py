from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class GovernanceHealthBreakdown(BaseModel):
    """
    A single dimension of the Governance Health Index composite score.
    """
    label: str = Field(..., description="Human-readable label for this health dimension.")
    score: float = Field(..., ge=0.0, le=100.0, description="Score for this dimension (0-100).")
    description: str = Field(default="", description="Short explanation of what this dimension measures.")

    class Config:
        from_attributes = True


class PolicyFrictionRecord(BaseModel):
    """
    Describes friction between a governance policy rule and operational agent behavior.
    """
    rule: str = Field(..., description="Policy rule identifier and description.")
    friction: str = Field(..., description="Friction level: High, Medium, Low.")
    overrides: int = Field(default=0, description="Number of times this rule was overridden or bypassed.")

    class Config:
        from_attributes = True


class PolicyEvolutionRecommendation(BaseModel):
    """
    An AI-generated recommendation to evolve or strengthen a governance policy.
    """
    id: str = Field(..., description="Unique recommendation identifier (e.g., EVO-01).")
    action: str = Field(..., description="Recommended evolution action: MODERNIZE, STRENGTHEN, DEPRECATE.")
    target: str = Field(..., description="Target policy rule or governance principle.")
    change: str = Field(..., description="Description of the proposed policy change.")
    impact: str = Field(..., description="Estimated impact on friction, risk, and safety metrics.")
    status: str = Field(default="RECOMMENDED", description="Current status of the recommendation.")

    class Config:
        from_attributes = True


class GovernanceIntelligenceReport(BaseModel):
    """
    Master report consolidating constitutional analytics, risk rankings, drift scores,
    governance health index, and executive insights.
    Returned by GET /api/v1/governance/intelligence.
    """
    schema_version: str = Field(
        default="1.0.0",
        description="Payload schema version for safe future migration."
    )
    governance_health_index: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Composite score (0-100) reflecting overall governance system health and alignment stability."
    )
    health_posture: str = Field(
        ...,
        description="Human-readable posture label (e.g., 'Stable Posture', 'At Risk', 'Critical')."
    )
    health_breakdown: List[GovernanceHealthBreakdown] = Field(
        default_factory=list,
        description="Per-dimension breakdown of the Governance Health Index composite score."
    )
    constitutional_analytics: Dict[str, Any] = Field(
        ...,
        description="Statistics of violations by rule and severity distributions."
    )
    risk_rankings: List[Dict[str, Any]] = Field(
        ...,
        description="Ranking of AI agents by average risk and failure ratios."
    )
    drift_analysis: Dict[str, Any] = Field(
        ...,
        description="Temporal trend mapping of constitutional violations pointing to alignment drift."
    )
    policy_frictions: List[PolicyFrictionRecord] = Field(
        default_factory=list,
        description="Rules with the highest operational friction and override counts."
    )
    evolution_recommendations: List[PolicyEvolutionRecommendation] = Field(
        default_factory=list,
        description="AI-generated recommendations for evolving or strengthening governance policies."
    )
    executive_findings: List[str] = Field(
        ...,
        description="High-level insights highlighting critical alerts and anomalies."
    )

    class Config:
        from_attributes = True
