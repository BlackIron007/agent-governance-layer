from pydantic import BaseModel, Field
from typing import List, Dict, Any

class GovernanceIntelligenceReport(BaseModel):
    """
    Master report consolidating constitutional analytics, risk rankings, drift scores, and executive insights.
    """
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
    executive_findings: List[str] = Field(
        ...,
        description="High-level insights highlighting critical alerts and anomalies."
    )

    class Config:
        from_attributes = True
