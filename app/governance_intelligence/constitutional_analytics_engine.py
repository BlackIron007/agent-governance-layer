from typing import List, Dict, Any
from collections import defaultdict
from app.schemas.governance_event import GovernanceEvent

class ConstitutionalAnalyticsEngine:
    """
    Analyzes counts, severity distributions, and trend direction for constitutional principle violations.
    """
    def analyze_violations(self, events: List[GovernanceEvent]) -> Dict[str, Any]:
        counts = defaultdict(int)
        severity_dist = {"HIGH": 0, "MEDIUM": 0, "LOW": 0}

        # Track temporal split (First half vs Second half of events list to determine trend)
        half_idx = len(events) // 2
        first_half_counts = defaultdict(int)
        second_half_counts = defaultdict(int)

        for idx, ev in enumerate(events):
            for violation in ev.constitutional_violations:
                rule_name = violation.split(":")[0].strip()
                counts[rule_name] += 1
                
                # Assign severity dynamically based on principle
                if "SECURITY" in rule_name:
                    severity_dist["HIGH"] += 1
                elif "COMPLIANCE" in rule_name:
                    severity_dist["MEDIUM"] += 1
                else:
                    severity_dist["LOW"] += 1

                # Track trends
                if idx < half_idx:
                    first_half_counts[rule_name] += 1
                else:
                    second_half_counts[rule_name] += 1

        rule_summaries = {}
        for rule, count in counts.items():
            first_val = first_half_counts[rule]
            second_val = second_half_counts[rule]
            
            if second_val > first_val:
                trend = "Increasing"
            elif second_val < first_val:
                trend = "Decreasing"
            else:
                trend = "Stable"

            rule_summaries[rule] = {
                "violations_count": count,
                "trend": trend,
                "severity": "HIGH" if "SECURITY" in rule else ("MEDIUM" if "COMPLIANCE" in rule else "LOW")
            }

        return {
            "rule_summaries": rule_summaries,
            "severity_distribution": severity_dist,
            "total_violations": sum(counts.values())
        }
