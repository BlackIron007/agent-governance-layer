from pydantic import BaseModel, Field
from typing import List
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation
from app.schemas.regulatory_violation import RegulatoryViolation

class RegulatoryIntelligenceReport(BaseModel):
    """
    Consolidated compliance report compiled by the Regulatory Intelligence Layer (RIL).
    """
    framework_evaluations: List[RegulatoryFrameworkEvaluation] = Field(..., description="Scorecards for each evaluated framework.")
    regulatory_violations: List[RegulatoryViolation] = Field(..., description="All observed compliance violations.")
    regulatory_conflicts: List[str] = Field(default_factory=list, description="Cross-layer conflicts or policy contradictions.")
    overall_compliance_score: float = Field(..., ge=0.0, le=100.0, description="Weighted compliance score (0 to 100).")
    execution_status: str = Field(..., description="Final execution verdict (ALLOW, CONDITIONAL_ALLOW, REVIEW_REQUIRED, BLOCKED).")
    executive_summary: str = Field(..., description="Narrative summary of RIL findings.")

    class Config:
        from_attributes = True
