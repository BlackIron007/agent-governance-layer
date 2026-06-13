from pydantic import BaseModel, Field
from typing import List
from app.schemas.policy_rule import PolicyRule

class CorporatePolicy(BaseModel):
    """
    Defines a corporate compliance policy containing specific rules.
    """
    policy_id: str = Field(..., description="Unique corporate policy ID.")
    name: str = Field(..., description="Corporate policy name.")
    rules: List[PolicyRule] = Field(default_factory=list, description="Policy rules contained in this suite.")

    class Config:
        from_attributes = True
