from typing import List, Dict
from app.schemas.constitution_evaluation import ConstitutionEvaluation

class ConstitutionAlignmentEngine:
    """
    Constitution Alignment Engine: Calculates weighted composite alignment scores
    using scorecards and active governance profile weight parameters.
    """
    def calculate_alignment(
        self,
        evaluations: List[ConstitutionEvaluation],
        weights: Dict[str, float]
    ) -> float:
        total_score = 0.0
        total_weight = 0.0

        # Map constitution_id keys to name strings in evaluations
        name_map = {
            "security_constitution": "Security Constitution",
            "compliance_constitution": "Compliance Constitution",
            "financial_constitution": "Financial Constitution",
            "sustainability_constitution": "Sustainability Constitution"
        }

        for eval_item in evaluations:
            # Find matching weight key
            weight = 0.25  # Fallback uniform weight
            for c_id, name in name_map.items():
                if name == eval_item.constitution_name:
                    weight = weights.get(c_id, 0.25)
                    break
            
            total_score += eval_item.score * weight
            total_weight += weight

        if total_weight == 0.0:
            return 50.0

        return round(total_score / total_weight, 2)
