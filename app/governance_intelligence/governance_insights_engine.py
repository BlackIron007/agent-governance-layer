from typing import List, Dict, Any
from app.schemas.governance_event import GovernanceEvent

class GovernanceInsightsEngine:
    """
    Generates high-level executive insight sentences by evaluating analytics patterns.
    """
    def generate_insights(
        self,
        events: List[GovernanceEvent],
        analytics: Dict[str, Any],
        rankings: List[Dict[str, Any]],
        drift: Dict[str, Any]
    ) -> List[str]:
        insights = []

        total_runs = len(events)
        total_violations = analytics.get("total_violations", 0)

        # Insight 1: Rule violations count
        if total_violations > 0:
            insights.append(f"Organizational audit traced {total_violations} constitutional principle violations across {total_runs} decision runs.")

        # Insight 2: Riskiest agent alert
        if rankings:
            riskiest = rankings[0]
            if riskiest["average_risk"] > 0.50:
                insights.append(
                    f"Action Required: Agent '{riskiest['agent_id']}' represents the highest governance risk profile, "
                    f"averaging a risk index of {riskiest['average_risk']} with {riskiest['rejection_ratio_pct']}% of its recommendations blocked."
                )

        # Insight 3: Drift alerts
        critical_drifts = [rule for rule, metrics in drift.items() if metrics["alert_level"] == "CRITICAL"]
        if critical_drifts:
            insights.append(
                f"Critical Alignment Drift: The following constitutional principles are experiencing rapid violation increases: "
                f"{', '.join(critical_drifts)}. Organizational memory indicates policies are being bypassed systematically."
            )
        else:
            insights.append("Alignment Stable: No critical constitutional drift alerts detected this period.")

        # Insight 4: Category density
        category_counts = {}
        for ev in events:
            category_counts[ev.decision_type] = category_counts.get(ev.decision_type, 0) + len(ev.constitutional_violations)

        if category_counts:
            sorted_cats = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
            top_cat, top_count = sorted_cats[0]
            percentage = int((top_count / max(1, total_violations)) * 100)
            if percentage > 25:
                insights.append(f"Workflows under type '{top_cat}' account for {percentage}% of all constitutional violations, indicating a systemic policy conflict.")

        return insights
