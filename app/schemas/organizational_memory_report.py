from pydantic import BaseModel, Field
from typing import List
from app.schemas.memory_precedent import MemoryPrecedent

class OrganizationalMemoryReport(BaseModel):
    """
    Summary report of how historical memory guided the current audit cycle.
    """
    precedents_used: List[MemoryPrecedent] = Field(
        default_factory=list,
        description="List of historical decisions matched as similar precedents."
    )
    lessons_learned: List[str] = Field(
        default_factory=list,
        description="Consolidated observations and adjustments derived from precedents."
    )
    recurring_risks: List[str] = Field(
        default_factory=list,
        description="Risk elements identified as repeating across matched past runs."
    )
    recurring_successes: List[str] = Field(
        default_factory=list,
        description="Favorable metrics captured in successful past decisions."
    )

    class Config:
        from_attributes = True
