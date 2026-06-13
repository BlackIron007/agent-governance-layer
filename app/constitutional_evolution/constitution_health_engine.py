from typing import List, Dict, Any
from app.schemas.governance_event import GovernanceEvent
from app.schemas.constitution_health_report import ConstitutionHealthReport

class ConstitutionHealthEngine:
    """
    Evaluates individual constitutional principles on effectiveness, friction, and drift.
    """
    def evaluate_health(self, events: List[GovernanceEvent], drift_analysis: Dict[str, Any]) -> List[ConstitutionHealthReport]:
        reports = []
        
        # Principles list
        principles = ["SECURITY_BEFORE_COST", "COMPLIANCE_BEFORE_SPEED", "HUMAN_REVIEW_FOR_HIGH_RISK"]
        
        for p in principles:
            rule_drift = drift_analysis.get(p, {"drift_score": 0.0, "monthly_trend": {}})
            drift_score = rule_drift["drift_score"]

            # Count violations
            violations_count = sum(1 for e in events if any(p in v for v in e.constitutional_violations))
            
            # Simple health heuristics
            # Effectiveness: drops as violations count increases
            effectiveness = round(max(0.1, 1.0 - (violations_count / 150.0)), 2)
            
            # Friction: high if the rule forces rejections on high-trust items
            rejections = sum(1 for e in events if any(p in v for v in e.constitutional_violations) and e.final_verdict.startswith("REJ"))
            friction = round(min(0.9, (rejections / max(1, violations_count)) * 0.8), 2)
            
            # Recommendation mapping
            if drift_score >= 0.75 and violations_count > 50:
                recommendation = "MODERNIZE"
            elif violations_count < 10:
                recommendation = "KEEP"
            elif friction > 0.70:
                recommendation = "SPLIT"
            else:
                recommendation = "KEEP"

            reports.append(
                ConstitutionHealthReport(
                    principle=p,
                    violation_frequency=violations_count,
                    effectiveness_score=effectiveness,
                    organizational_friction_score=friction,
                    drift_score=drift_score,
                    recommendation=recommendation
                )
            )
            
        return reports
