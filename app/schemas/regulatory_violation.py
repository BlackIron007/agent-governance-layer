from pydantic import BaseModel, Field

class RegulatoryViolation(BaseModel):
    """
    Represents a specific compliance failure against a regulatory requirement.
    """
    framework_name: str = Field(..., description="Name of the regulatory framework.")
    violation_id: str = Field(..., description="Unique code of the breach.")
    violated_requirement: str = Field(..., description="Description of the breached requirement.")
    severity: str = Field(..., description="Severity level of the violation (Critical, High, Medium, Low).")
    explanation: str = Field(..., description="Clear explanation of the failure rationale.")
    supporting_evidence: str = Field(..., description="Facts and context demonstrating the violation.")

    class Config:
        from_attributes = True
