from typing import List, Dict, Any, Tuple
from app.schemas.board_decision_report import BoardMemberVote, VoteType

class ExecutiveConstitutionalLayer:
    """
    Defines and audits organizational principles (Security before Cost, Compliance before Speed, Human Review for High Risk).
    """
    def __init__(self):
        self.principles = {
            "SECURITY_BEFORE_COST": "CISO vetoes must override CFO cost savings recommendations.",
            "COMPLIANCE_BEFORE_SPEED": "Legal compliance findings must override operational schedule speed metrics.",
            "HUMAN_REVIEW_FOR_HIGH_RISK": "Decisions flagged with high risk index must mandate human gate review."
        }

    def verify_principles(
        self,
        votes: List[BoardMemberVote],
        risk_score: float
    ) -> Tuple[str, List[str], str | None]:
        """
        Verifies if the board votes align with the constitution.
        Returns:
            status: str ("COMPLIANT" or "CONSTITUTION_VIOLATION")
            violations: List of descriptions of violations.
            suggested_override: str | None ("DEVIATION_SUSPENDED" or "DEFERRED_FOR_REVIEW" or "REJECTED")
        """
        violations = []
        suggested_override = None

        cfo_vote = next((v for v in votes if v.member_name == "CFO"), None)
        ciso_vote = next((v for v in votes if v.member_name == "CISO"), None)
        legal_vote = next((v for v in votes if v.member_name == "Legal"), None)
        ops_vote = next((v for v in votes if v.member_name == "Operations"), None)

        # 1. Verify SECURITY_BEFORE_COST
        if ciso_vote and ciso_vote.vote == VoteType.REJECTED:
            if cfo_vote and cfo_vote.vote == VoteType.APPROVED:
                violations.append(
                    "CONSTITUTION_VIOLATION: SECURITY_BEFORE_COST violated. CISO raised a security veto, "
                    "but CFO approved due to cost reductions. Security must take priority."
                )
                suggested_override = "REJECTED"

        # 2. Verify COMPLIANCE_BEFORE_SPEED
        if legal_vote and legal_vote.vote == VoteType.REJECTED:
            if ops_vote and ops_vote.vote == VoteType.APPROVED:
                violations.append(
                    "CONSTITUTION_VIOLATION: COMPLIANCE_BEFORE_SPEED violated. Legal raised compliance issues, "
                    "but Operations prioritized delivery schedules."
                )
                suggested_override = "DEVIATION_SUSPENDED"

        # 3. Verify HUMAN_REVIEW_FOR_HIGH_RISK
        if risk_score >= 0.60:
            violations.append(
                f"CONSTITUTION_ALERT: HUMAN_REVIEW_FOR_HIGH_RISK active. Risk score {risk_score} exceeds the constitutional 0.60 gate."
            )
            # Escalates to DEFERRED_FOR_REVIEW if not already rejected
            if not suggested_override:
                suggested_override = "DEFERRED_FOR_REVIEW"

        status = "CONSTITUTION_VIOLATION" if violations else "COMPLIANT"
        return status, violations, suggested_override
