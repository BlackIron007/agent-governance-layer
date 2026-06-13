from pydantic import BaseModel, Field

class ConstitutionHealthReport(BaseModel):
    """
    Evaluates individual constitutional principles on compliance volume, friction, and drift.
    """
    principle: str = Field(..., description="The name of the constitutional principle being evaluated.")
    violation_frequency: int = Field(..., description="Total violation events count in this audit period.")
    effectiveness_score: float = Field(..., ge=0.0, le=1.0, description="Score indicating how well this rule deters risks.")
    organizational_friction_score: float = Field(..., ge=0.0, le=1.0, description="Friction score measuring how much this rule slows down approvals.")
    drift_score: float = Field(..., ge=0.0, le=1.0, description="Monthly variance tracking parameter drift.")
    recommendation: str = Field(..., description="Action recommendation (e.g. MODERNIZE, KEEP, RETIRE).")

    class Config:
        from_attributes = True
