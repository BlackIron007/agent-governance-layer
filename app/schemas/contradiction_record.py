from pydantic import BaseModel, Field
from enum import Enum

class ContradictionType(str, Enum):
    INTERNAL = "internal"
    EXTERNAL_KNOWLEDGE = "external_knowledge"
    POLICY_CLASH = "policy_clash"

class ContradictionRecord(BaseModel):
    """
    Represents logical conflicts identified within the decision, against internal databases, or against external facts.
    """
    type: ContradictionType = Field(
        ..., 
        description="The nature of the contradiction."
    )
    source_a: str = Field(
        ..., 
        description="The first entity or statement involved in the conflict."
    )
    source_b: str = Field(
        ..., 
        description="The second contradicting entity, statement, or ground truth."
    )
    description: str = Field(
        ..., 
        description="Human-readable assessment detailing the logical divergence."
    )

    class Config:
        from_attributes = True
