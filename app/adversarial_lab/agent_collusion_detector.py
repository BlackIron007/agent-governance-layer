from typing import List
import re
from app.schemas.board_decision_report import BoardMemberVote

class AgentCollusionDetector:
    """
    Agent Collusion Detector: Identifies copy-paste rationales, circular citations,
    and vote herding behaviors among autonomous board agents.
    """
    def detect_collusion(self, votes: List[BoardMemberVote]) -> dict:
        risk_score = 0.0
        findings = []

        # 1. Vote Herding (unusual consensus alignment when critical risk metrics are missing)
        rejections = sum(1 for v in votes if v.vote.value == "REJECTED")
        approvals = sum(1 for v in votes if v.vote.value == "APPROVED")
        
        # If all vote the same way with zero discussion on the primary risk
        if approvals == len(votes) or rejections == len(votes):
            risk_score += 20.0
            findings.append("Herd Behavior: Extreme vote alignment with low variance indicates potential alignment gaming.")

        # 2. Circular citations & reinforcement detection
        # Citing each other's rationales (e.g. CISO mentions Operations, CFO mentions Procurement)
        cross_references = 0
        roles = [v.member_name.lower() for v in votes]
        for v in votes:
            rationale_lower = v.rationale.lower()
            for r in roles:
                if r != v.member_name.lower() and r in rationale_lower:
                    cross_references += 1
                    findings.append(f"Mutual Reinforcement: Agent {v.member_name} cites reasoning of {r.upper()}.")

        if cross_references >= 3:
            risk_score += 40.0
            findings.append("Circular Citations: Multiple agents referencing each other's stances rather than independent evidence.")
        elif cross_references >= 1:
            risk_score += 15.0

        # 3. Duplicate/Similar reasoning chains (word overlap / phrasing overlap)
        duplicates = 0
        for i in range(len(votes)):
            for j in range(i + 1, len(votes)):
                r1 = votes[i].rationale.split()
                r2 = votes[j].rationale.split()
                if not r1 or not r2:
                    continue
                overlap = len(set(r1) & set(r2)) / max(len(r1), len(r2))
                if overlap > 0.65:
                    duplicates += 1
                    findings.append(f"Identical Reasoning: {votes[i].member_name} and {votes[j].member_name} share {overlap*100:.1f}% rationale structure.")

        if duplicates > 0:
            risk_score += min(40.0, duplicates * 20.0)

        risk_score = min(100.0, risk_score)

        return {
            "risk_score": risk_score,
            "findings": findings,
            "vulnerability": "Reasoning Collusion & Circular Citations",
            "exploited_rule": "Voter Independence & Agency Separation Rule"
        }
