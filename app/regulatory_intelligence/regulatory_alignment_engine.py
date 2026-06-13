from typing import List, Tuple
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation
from app.schemas.regulatory_violation import RegulatoryViolation
from app.regulatory_intelligence.regulatory_framework_registry import RegulatoryFrameworkRegistry

class RegulatoryAlignmentEngine:
    """
    Regulatory Alignment Engine: Computes overall compliance score and determines
    final Execution Status based on violation severities.
    """
    def align_compliance(
        self,
        evaluations: List[RegulatoryFrameworkEvaluation]
    ) -> Tuple[float, str]:
        # 1. Compile violations and check severities
        violations: List[RegulatoryViolation] = []
        for e in evaluations:
            violations.extend(e.violations)

        critical_count = sum(1 for v in violations if v.severity == "Critical")
        high_count = sum(1 for v in violations if v.severity == "High")
        medium_count = sum(1 for v in violations if v.severity == "Medium")
        
        # 2. Determine Execution Status
        if critical_count > 0:
            status = "BLOCKED"
        elif high_count >= 2:
            status = "REVIEW_REQUIRED"
        elif high_count > 0 or medium_count > 0:
            status = "CONDITIONAL_ALLOW"
        else:
            status = "ALLOW"

        # 3. Calculate weighted compliance score
        registry = RegulatoryFrameworkRegistry()
        total_score = 0.0
        total_weight = 0.0

        for e in evaluations:
            # Match framework priority weight
            weight = 0.15
            for fw in registry.get_all_frameworks():
                if fw["name"] == e.framework_name:
                    weight = fw["priority_weight"]
                    break
            
            total_score += e.compliance_score * weight
            total_weight += weight

        overall_score = round(total_score / total_weight, 2) if total_weight > 0.0 else 100.0

        return overall_score, status
