from pydantic import BaseModel, Field
from enum import Enum

class EvidenceSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class MissingEvidenceRecord(BaseModel):
    """
    Indicates critical ground truth parameters or historical records that were missing or omitted from the decision context.
    """
    required_data_point: str = Field(
        ..., 
        description="The omitted parameters or documentation (e.g., recent credit history, third-party risk analysis)."
    )
    impact_severity: EvidenceSeverity = Field(
        ..., 
        description="Importance of the missing information on decision completeness."
    )
    suggested_source: str = Field(
        ..., 
        description="Recommended search parameters or database queries (Fabric/Web) to locate this data."
    )

    class Config:
        from_attributes = True
