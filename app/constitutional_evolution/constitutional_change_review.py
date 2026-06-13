from typing import List, Dict
from app.schemas.constitution_health_report import ConstitutionHealthReport

class ConstitutionalChangeReview:
    """
    Summarizes the evolution status verdict for each constitutional principle.
    """
    def generate_verdicts(self, health_reports: List[ConstitutionHealthReport]) -> Dict[str, str]:
        verdicts = {}
        for hr in health_reports:
            # Verdict matches the recommendation parameter generated in health engine
            verdicts[hr.principle] = hr.recommendation
        return verdicts
