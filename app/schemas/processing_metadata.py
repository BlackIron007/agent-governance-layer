from pydantic import BaseModel, Field


class ProcessingMetadata(BaseModel):
    """
    Runtime execution telemetry attached to every governance decision response.
    Provides judges and auditors with a transparent view of what the system actually executed.
    """
    duration_ms: int = Field(
        ...,
        description="Wall-clock milliseconds from request intake to final verdict emission."
    )
    agents_executed: int = Field(
        ...,
        description="Total number of AI agents invoked during the governance pipeline run."
    )
    regulatory_frameworks_evaluated: int = Field(
        ...,
        description="Count of regulatory frameworks evaluated (NIST, SOC2, GDPR, etc.)."
    )
    simulation_scenarios_generated: int = Field(
        ...,
        description="Number of Monte Carlo / enterprise simulation scenarios generated."
    )
    attack_vectors_tested: int = Field(
        ...,
        description="Number of adversarial attack vectors probed by the Governance Attack Lab."
    )

    class Config:
        from_attributes = True
