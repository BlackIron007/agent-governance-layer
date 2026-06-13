from pydantic import BaseModel, Field
from typing import List

class ConstitutionConflict(BaseModel):
    """
    Details a conflict identified when evaluating a decision under competing constitutions.
    """
    conflicting_constitutions: List[str] = Field(..., description="The constitutions in conflict.")
    conflict_reason: str = Field(..., description="Explanation of the conflict.")
    severity: str = Field(..., description="Severity rating (Low, Medium, High, Critical).")
    proposed_resolution: str = Field(..., description="Recommended resolution strategy.")

    class Config:
        from_attributes = True
