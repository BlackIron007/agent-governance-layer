from pydantic import BaseModel, Field

class AttackFinding(BaseModel):
    """
    Represents a specific exploit finding identified during the adversarial simulation.
    """
    vulnerability: str = Field(..., description="Vulnerability observed in the current setup.")
    exploited_rule: str = Field(..., description="The specific policy or rule exploited by the attack.")
    attack_success_probability: float = Field(..., ge=0.0, le=1.0, description="Exploit success probability (0.0 to 1.0).")
    impact_score: float = Field(..., ge=0.0, le=100.0, description="Potential damage rating (0 to 100).")
    mitigation: str = Field(..., description="Recommended control or defense strategy.")

    class Config:
        from_attributes = True
