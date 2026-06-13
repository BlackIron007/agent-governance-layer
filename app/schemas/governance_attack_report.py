from pydantic import BaseModel, Field
from typing import List
from app.schemas.attack_scenario import AttackScenario
from app.schemas.attack_finding import AttackFinding

class GovernanceAttackReport(BaseModel):
    """
    Consolidated adversarial analysis report outlining vulnerabilities and stress-testing metrics.
    """
    attack_scenarios: List[AttackScenario] = Field(..., description="List of simulated attack profiles.")
    findings: List[AttackFinding] = Field(..., description="List of observed vulnerability exploits.")
    governance_resilience_score: float = Field(..., ge=0.0, le=100.0, description="Overall governance resilience rating (0 to 100).")
    board_manipulation_risk: float = Field(..., ge=0.0, le=100.0, description="Board manipulation risk index (0 to 100).")
    collusion_risk: float = Field(..., ge=0.0, le=100.0, description="Agent collusion risk index (0 to 100).")
    stress_test_summary: str = Field(..., description="Stress test resilience curve summary details.")
    critical_vulnerabilities: List[str] = Field(default_factory=list, description="Critical weaknesses discovered.")
    mitigation_plan: List[str] = Field(default_factory=list, description="Remediation steps proposed.")

    class Config:
        from_attributes = True
