from typing import List
from app.schemas.memory_precedent import MemoryPrecedent

class DecisionMemoryStore:
    """
    Decisions memory registry storing past vendor approvals, overrides, and security evaluations.
    """
    def __init__(self):
        self._precedents = [
            MemoryPrecedent(
                precedent_id="PRC-2024-01",
                decision_summary="Select Vendor X because they were 15% cheaper, overriding Vendor Y's delivery SLA.",
                outcome="APPROVED",
                lessons_learned=[
                    "Average delivery delay increased by 12% in operations.",
                    "Unscheduled logistics bottlenecks inflated post-deal implementation cost by 8%."
                ],
                risk_factors=["Logistics metrics warning ignored", "Short-term cost priority bias"]
            ),
            MemoryPrecedent(
                precedent_id="PRC-2024-02",
                decision_summary="Approve Vendor Z for cloud integration pipeline. Vendor Z lacked SOC2 audit compliance.",
                outcome="APPROVED",
                lessons_learned=[
                    "Data leakage warning fired 6 months post-integration.",
                    "Operations suspended for 2 weeks to audit third-party security logs."
                ],
                risk_factors=["Security assessment bypassed", "High operational vulnerability"]
            ),
            MemoryPrecedent(
                precedent_id="PRC-2024-03",
                decision_summary="Select Vendor W for strategic hardware supply. Vendor W met all security and delivery KPIs.",
                outcome="APPROVED",
                lessons_learned=[
                    "Successful deployment. Zero logistics delays encountered.",
                    "Maintained overall contract budget targets."
                ],
                risk_factors=["Minimal risk elements"]
            )
        ]

    def get_all(self) -> List[MemoryPrecedent]:
        return self._precedents
