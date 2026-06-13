from typing import List, Dict, Any
from collections import defaultdict
from app.schemas.governance_event import GovernanceEvent

class OrganizationalDriftDetector:
    """
    Tracks monthly volume shifts in constitutional violations to identify alignment drift.
    """
    def detect_drift(self, events: List[GovernanceEvent]) -> Dict[str, Any]:
        monthly_violations = defaultdict(lambda: defaultdict(int))
        
        # Aggregate by month (using event timestamp)
        for ev in events:
            month_name = ev.timestamp.strftime("%B")  # E.g. "January", "February"
            for violation in ev.constitutional_violations:
                rule_name = violation.split(":")[0].strip()
                monthly_violations[rule_name][month_name] += 1

        drift_metrics = {}
        for rule, months in monthly_violations.items():
            # Convert months to list sorted by occurrence sequence (e.g. Jan -> Feb -> Mar)
            sorted_months = sorted(months.items(), key=lambda x: self._month_rank(x[0]))
            
            # Simple drift score: ratio of increase
            if len(sorted_months) > 1:
                first_val = sorted_months[0][1]
                last_val = sorted_months[-1][1]
                diff = last_val - first_val
                
                # Drift score calculated between 0.0 and 1.0
                drift_score = round(min(1.0, max(0.0, diff / max(1, first_val))), 2)
            else:
                drift_score = 0.0
                
            # Assign alert rating
            if drift_score >= 0.75:
                alert = "CRITICAL"
            elif drift_score >= 0.40:
                alert = "MEDIUM"
            else:
                alert = "LOW"

            drift_metrics[rule] = {
                "monthly_trend": dict(sorted_months),
                "drift_score": drift_score,
                "alert_level": alert
            }

        return drift_metrics

    def _month_rank(self, name: str) -> int:
        ranks = {
            "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
            "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
        }
        return ranks.get(name, 99)
