from pydantic import BaseModel, Field
from typing import List
from app.schemas.regulatory_violation import RegulatoryViolation
from app.schemas.regulatory_obligation import RegulatoryObligation

class RegulatoryFrameworkEvaluation(BaseModel):
    """
    Scorecard evaluation details for a specific compliance framework.
    """
    framework_name: str = Field(..., description="Name of the framework.")
    compliance_score: float = Field(..., ge=0.0, le=100.0, description="Compliance status score (0 to 100).")
    violations: List[RegulatoryViolation] = Field(default_factory=list, description="Violations triggered.")
    obligations_checked: List[RegulatoryObligation] = Field(default_factory=list, description="Obligations evaluated.")
    recommendation: str = Field(..., description="Verdict recommendation (e.g. Approve, Review, Block).")

    class Config:
        from_attributes = True
