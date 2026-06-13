from pydantic import BaseModel, Field
from typing import Any

class DecisionParameter(BaseModel):
    """
    Represents an individual variable, constraint, or entity extracted from the AI decision payload.
    """
    name: str = Field(
        ..., 
        description="The extracted parameter name (e.g., vendor_name, contract_value, risk_tolerance)."
    )
    value: Any = Field(
        ..., 
        description="The value associated with the parameter."
    )
    parameter_type: str = Field(
        ..., 
        description="The semantic category of the parameter (e.g., financial, constraint, timeline, entity)."
    )
    extracted_from: str = Field(
        ..., 
        description="The source string or JSON path from which the parameter was extracted."
    )

    class Config:
        from_attributes = True
