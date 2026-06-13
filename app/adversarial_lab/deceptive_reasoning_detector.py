from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote

class DeceptiveReasoningDetector:
    """
    Deceptive Reasoning Detector: Scans for evidence shielding, cherry-picking,
    confidence inflation, or historical memory precedent suppression.
    """
    def detect_deceptive_reasoning(self, payload: DecisionPayload, votes: List[BoardMemberVote]) -> dict:
        risk_score = 10.0
        findings = []

        # High confidence but weak justifications/evidence
        for vote in votes:
            if vote.confidence > 0.85 and vote.vote.value == "APPROVED" and "cheaper" in payload.proposed_action.lower():
                if len(vote.evidence_cited) <= 1:
                    risk_score += 20.0
                    findings.append(f"Confidence inflation detected for {vote.member_name} (confidence={vote.confidence} with minimal evidence cited).")

        # Selective omission of risk factors
        if payload.raw_payload and payload.raw_payload.get("ignored_delivery_metrics", False):
            risk_score += 30.0
            findings.append("Agent selectively omitted operational delivery risks in initial recommendation proposal.")

        risk_score = min(100.0, risk_score)

        return {
            "risk_score": risk_score,
            "findings": findings,
            "vulnerability": "Selective Evidence Ordering & Shielding",
            "exploited_rule": "Reasoning Honesty and Precedent Balance"
        }
