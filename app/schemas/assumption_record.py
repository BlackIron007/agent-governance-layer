from pydantic import BaseModel, Field
from enum import Enum

class AssumptionClassification(str, Enum):
    UNSUPPORTED_LEAP = "UNSUPPORTED_LEAP"
    PLAUSIBLE_HEURISTIC = "PLAUSIBLE_HEURISTIC"

class AssumptionRecord(BaseModel):
    """
    Specifies implicit logical premises assumed by the AI agent that lack clear evidence support.
    """
    premise: str = Field(
        ..., 
        description="The statement or logical bridge assumed to be true by the agent."
    )
    classification: AssumptionClassification = Field(
        ..., 
        description="Categorization of the assumption reliability."
    )
    mitigation_query: str = Field(
        ..., 
        description="A search query generated to verify or challenge this specific assumption."
    )

    class Config:
        from_attributes = True
