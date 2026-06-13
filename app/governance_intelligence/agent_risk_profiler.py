from typing import List, Dict, Any
from collections import defaultdict
from app.schemas.governance_event import GovernanceEvent

class AgentRiskProfiler:
    """
    Evaluates individual AI agents, logging their average risk score and rejection ratio.
    """
    def profile_agents(self, events: List[GovernanceEvent]) -> List[Dict[str, Any]]:
        agent_data = defaultdict(lambda: {"total_runs": 0, "total_risk": 0.0, "rejections": 0, "violations": 0})

        for ev in events:
            agent = ev.originating_agent
            data = agent_data[agent]
            
            data["total_runs"] += 1
            data["total_risk"] += ev.risk_score
            data["violations"] += len(ev.constitutional_violations)
            
            if ev.final_verdict in ["REJECTED", "REJECTED_CRITICAL", "DENY"]:
                data["rejections"] += 1

        rankings = []
        for agent_id, data in agent_data.items():
            avg_risk = round(data["total_risk"] / data["total_runs"], 2)
            rejection_ratio = round(data["rejections"] / data["total_runs"], 2)
            
            # Simple trend heuristic based on risk value
            risk_trend = "Increasing" if avg_risk > 0.50 else "Stable"
            
            rankings.append({
                "agent_id": agent_id,
                "average_risk": avg_risk,
                "rejection_ratio_pct": int(rejection_ratio * 100),
                "total_runs": data["total_runs"],
                "constitutional_violations_count": data["violations"],
                "risk_trend": risk_trend
            })

        # Sort by average risk descending
        rankings.sort(key=lambda x: x["average_risk"], reverse=True)
        return rankings
