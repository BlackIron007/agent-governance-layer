from pydantic import BaseModel, Field
from typing import List

class Constitution(BaseModel):
    """
    Defines a governance framework containing specific principles and priorities.
    """
    constitution_id: str = Field(..., description="Unique identifier (e.g. security_constitution).")
    constitution_name: str = Field(..., description="Human-readable title.")
    description: str = Field(..., description="Overview of the governance goal.")
    principles: List[str] = Field(default_factory=list, description="Rules enforced by this constitution.")
    priority_weight: float = Field(..., ge=0.0, le=1.0, description="Priority weight (0.0 to 1.0).")

    class Config:
        from_attributes = True
