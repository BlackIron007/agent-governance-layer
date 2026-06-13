from pydantic import BaseModel, Field
from typing import List
from app.schemas.enterprise_simulation_scenario import EnterpriseSimulationScenario
from app.schemas.quarterly_impact import QuarterlyImpact

class EnterpriseSimulationReport(BaseModel):
    """
    Consolidated enterprise-wide simulation report tracing multiple paths over time.
    """
    decision_summary: str = Field(..., description="Proposed AI recommendation evaluated.")
    scenarios: List[EnterpriseSimulationScenario] = Field(..., description="The 5 generated alternative future scenarios.")
    quarterly_impacts: List[QuarterlyImpact] = Field(..., description="Chronological quarterly impact projections.")
    expected_enterprise_value: float = Field(..., ge=0.0, le=100.0, description="Overall expected benefit score (0-100).")
    expected_risk_exposure: float = Field(..., ge=0.0, le=100.0, description="Overall expected risk penalty score (0-100).")
    simulation_summary: str = Field(..., description="Executive summary of EISE projections.")

    class Config:
        from_attributes = True
