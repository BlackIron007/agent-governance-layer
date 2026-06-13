from pydantic import BaseModel, Field
from typing import List

class AttackScenario(BaseModel):
    """
    Represents a simulated governance attack scenario.
    """
    attack_id: str = Field(..., description="Unique identifier for the simulated attack.")
    attack_type: str = Field(..., description="Category of the attack (e.g. Reward Hacking, Policy Gaming, etc.).")
    attack_description: str = Field(..., description="Detailed description of the exploit vector.")
    attack_goal: str = Field(..., description="The objectives of the attacker.")
    attack_probability: float = Field(..., ge=0.0, le=1.0, description="Likelihood of the attack scenario (0.0 to 1.0).")
    severity: str = Field(..., description="Severity rating (e.g. Low, Medium, High, Critical).")
    affected_components: List[str] = Field(default_factory=list, description="List of targeted governance layers or agents.")

    class Config:
        from_attributes = True
