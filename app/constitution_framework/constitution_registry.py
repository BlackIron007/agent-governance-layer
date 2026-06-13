from typing import List
from app.schemas.constitution import Constitution

class ConstitutionRegistry:
    """
    Registry storing registered constitutions and active principles.
    """
    def __init__(self):
        self._constitutions = [
            Constitution(
                constitution_id="security_constitution",
                constitution_name="Security Constitution",
                description="Prioritizes system integrity, data safety, and zero vulnerabilites.",
                principles=[
                    "Security before convenience",
                    "Security before cost",
                    "Zero critical vulnerabilities"
                ],
                priority_weight=0.25
            ),
            Constitution(
                constitution_id="compliance_constitution",
                constitution_name="Compliance Constitution",
                description="Prioritizes strict adherence to rules, guidelines, and legislation.",
                principles=[
                    "Compliance before speed",
                    "Auditability",
                    "Regulatory traceability"
                ],
                priority_weight=0.25
            ),
            Constitution(
                constitution_id="financial_constitution",
                constitution_name="Financial Constitution",
                description="Focuses on cost efficiency, high return on investment, and budget bounds.",
                principles=[
                    "ROI optimization",
                    "Cost efficiency",
                    "Resource utilization"
                ],
                priority_weight=0.25
            ),
            Constitution(
                constitution_id="sustainability_constitution",
                constitution_name="Sustainability Constitution",
                description="Enforces ESG parameters and environmental alignment.",
                principles=[
                    "ESG alignment",
                    "Environmental impact",
                    "Long-term sustainability"
                ],
                priority_weight=0.25
            )
        ]

    def get_all(self) -> List[Constitution]:
        return self._constitutions

    def get_by_id(self, constitution_id: str) -> Constitution:
        for c in self._constitutions:
            if c.constitution_id == constitution_id:
                return c
        raise ValueError(f"Constitution '{constitution_id}' not found.")
