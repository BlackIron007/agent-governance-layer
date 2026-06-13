from pydantic import BaseModel, Field
from typing import List
from app.schemas.constitution_evaluation import ConstitutionEvaluation
from app.schemas.constitution_conflict import ConstitutionConflict

class MultiConstitutionReport(BaseModel):
    """
    Consolidated report containing multi-constitutional scorecards, conflicts, and profile outputs.
    """
    evaluations: List[ConstitutionEvaluation] = Field(..., description="Scorecard evaluations for all registered constitutions.")
    conflicts: List[ConstitutionConflict] = Field(..., description="Observed conflicts and resolutions.")
    overall_alignment_score: float = Field(..., ge=0.0, le=100.0, description="Weighted alignment rating (0 to 100).")
    governance_profile: str = Field(..., description="Name of the active enterprise profile.")
    recommended_action: str = Field(..., description="Consolidated recommendation verdict.")

    class Config:
        from_attributes = True
