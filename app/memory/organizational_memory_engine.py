from typing import List
from app.schemas.memory_precedent import MemoryPrecedent
from app.schemas.organizational_memory_report import OrganizationalMemoryReport

class OrganizationalMemoryEngine:
    """
    Compiles individual precedents into an aggregated OrganizationalMemoryReport.
    """
    def generate_report(self, precedents: List[MemoryPrecedent]) -> OrganizationalMemoryReport:
        lessons = []
        risks = []
        successes = []

        for p in precedents:
            lessons.extend(p.lessons_learned)
            risks.extend(p.risk_factors)
            if p.outcome == "APPROVED" and "delay" not in "".join(p.lessons_learned).lower():
                successes.append(f"Precedent {p.precedent_id} approved with no operations failure.")

        # Deduplicate
        lessons = list(dict.fromkeys(lessons))
        risks = list(dict.fromkeys(risks))
        successes = list(dict.fromkeys(successes))

        if not successes:
            successes.append("No recurring successes identified. Historic precedents logged operational risks.")

        return OrganizationalMemoryReport(
            precedents_used=precedents,
            lessons_learned=lessons,
            recurring_risks=risks,
            recurring_successes=successes
        )
