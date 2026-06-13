from pydantic import BaseModel, Field

class QuarterlyImpact(BaseModel):
    """
    Projected business metrics estimated for a specific quarter post-decision.
    """
    quarter: str = Field(..., description="Target quarter indicator (e.g. Q1, Q2).")
    financial_impact: str = Field(..., description="Estimated cost savings, overhead shifts, or capital losses.")
    operational_impact: str = Field(..., description="Estimated changes in throughput, logistics latency, or SLAs.")
    compliance_impact: str = Field(..., description="Estimated policy validation violations or audit exposures.")
    reputation_impact: str = Field(..., description="Estimated impact on brand equity, stakeholder confidence, or customer trust.")
    risk_score: float = Field(..., ge=0.0, le=100.0, description="Risk index rating (0 to 100).")

    class Config:
        from_attributes = True
