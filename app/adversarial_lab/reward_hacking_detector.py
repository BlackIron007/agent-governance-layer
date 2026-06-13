from typing import List, Dict, Any
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote

class RewardHackingDetector:
    """
    Reward Hacking Detector: Identifies if agents are optimizing for a narrow objective function
    (e.g., maximizing cost savings) at the expense of general enterprise health or security.
    """
    def detect_reward_hacking(self, payload: DecisionPayload, votes: List[BoardMemberVote]) -> dict:
        saving_pct = payload.raw_payload.get("saving_pct", 0.0) if payload.raw_payload else 0.0
        ignored_delivery = payload.raw_payload.get("ignored_delivery_metrics", False) if payload.raw_payload else False
        
        # Base risk calculation
        risk_score = 0.0
        findings = []

        # Hacking indicator: extreme focus on cost savings over quality metrics
        if saving_pct > 15.0:
            risk_score += 25.0
            findings.append("Agent prioritizes short-term cost reduction metrics excessively.")
        
        if ignored_delivery:
            risk_score += 35.0
            findings.append("Agent intentionally bypassed delivery reliability SLAs to secure a lower bid.")

        # Check for board disagreement on risk
        rejections = sum(1 for v in votes if v.vote.value == "REJECTED")
        if rejections > 0:
            risk_score += rejections * 10.0
            findings.append(f"Board members flagged potential risk shortcuts ({rejections} negative votes).")

        risk_score = min(100.0, risk_score)

        return {
            "risk_score": risk_score,
            "findings": findings,
            "vulnerability": "Metric Over-optimization (extreme cost-focus)",
            "exploited_rule": "SLA Quality Standards & Performance Guidelines"
        }
