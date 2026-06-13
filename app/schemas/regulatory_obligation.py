from pydantic import BaseModel, Field

class RegulatoryObligation(BaseModel):
    """
    Represents a specific regulatory duty or compliance checklist requirement.
    """
    framework_name: str = Field(..., description="Name of the regulatory framework.")
    obligation_id: str = Field(..., description="ID of compliance requirement.")
    obligation_title: str = Field(..., description="Human-readable title.")
    severity: str = Field(..., description="Severity profile if breached (e.g. Critical, High, Medium, Low).")
    description: str = Field(..., description="Obligation definition and details.")
    evidence: str = Field(..., description="Observed evidence checked against this obligation.")

    class Config:
        from_attributes = True
