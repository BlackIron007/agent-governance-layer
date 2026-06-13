from pydantic import BaseModel, Field

class PolicyRule(BaseModel):
    """
    Represents an individual corporate policy rule.
    """
    rule_id: str = Field(..., description="Unique corporate rule identifier.")
    title: str = Field(..., description="Name of the rule.")
    description: str = Field(..., description="Details of rule requirements.")
    severity: str = Field(..., description="Severity of violation (e.g. Critical, High, Medium, Low).")

    class Config:
        from_attributes = True
