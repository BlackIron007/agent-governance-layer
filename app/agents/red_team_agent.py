import logging
from typing import List
from app.schemas.decision_parameter import DecisionParameter
from app.schemas.evidence_record import EvidenceRecord
from app.schemas.assumption_record import AssumptionRecord
from app.schemas.decision_audit_report import ChallengeReview
from app.modules.challenge_engine import run_adversarial_challenge

logger = logging.getLogger("verifier")

class RedTeamAgent:
    """
    Red Team Agent: Challenges decision logic, generating opposing arguments and delta adjustments.
    """
    def __init__(self):
        self.trace = []

    def execute(
        self,
        proposed_action: str,
        parameters: List[DecisionParameter],
        evidence_records: List[EvidenceRecord],
        assumptions: List[AssumptionRecord]
    ) -> ChallengeReview:
        self.trace.append("AGENT_START: Launching adversarial debate simulator.")
        
        challenge_review = run_adversarial_challenge(
            proposed_action,
            parameters,
            evidence_records,
            assumptions
        )
        
        self.trace.append(f"DEBATE: Generated Supporting Case: '{challenge_review.supporting_argument[:60]}...'")
        self.trace.append(f"DEBATE: Generated Adversarial Case: '{challenge_review.opposing_argument[:60]}...'")
        self.trace.append(f"CALIBRATION: Applied delta change: {challenge_review.confidence_adjustment}")
        
        self.trace.append("AGENT_END: Adversarial review debate completed.")
        return challenge_review
