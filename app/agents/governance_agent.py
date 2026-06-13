import logging
from typing import List, Dict, Any, Tuple
from app.schemas.assumption_record import AssumptionRecord
from app.schemas.contradiction_record import ContradictionRecord
from app.schemas.missing_evidence_record import MissingEvidenceRecord
from app.schemas.decision_audit_report import ChallengeReview, AuditStatus
from app.schemas.executive_recommendation import ExecutiveRecommendation
from app.modules.decision_calibration_engine import DecisionCalibrationEngine
from app.modules.recommendation_engine import RecommendationEngine

logger = logging.getLogger("verifier")

class GovernanceAgent:
    """
    Governance Agent: Orchestrates calibration metrics, applies rules, and issues final verdicts.
    """
    def __init__(self):
        self.trace = []

    def execute(
        self,
        base_trust: float,
        base_risk: float,
        assumptions: List[AssumptionRecord],
        contradictions: List[ContradictionRecord],
        missing_evidence: List[MissingEvidenceRecord],
        challenge_review: ChallengeReview = None
    ) -> Tuple[AuditStatus, ExecutiveRecommendation, Dict[str, Any]]:
        self.trace.append("AGENT_START: Launching final scores calibration.")
        
        # Calibration (Single Source of Truth)
        calibrator = DecisionCalibrationEngine()
        calibration_results = calibrator.calibrate(
            base_trust=base_trust,
            base_risk=base_risk,
            assumptions=assumptions,
            contradictions=contradictions,
            missing_evidence=missing_evidence,
            challenge_review=challenge_review
        )
        
        trust_val = calibration_results["calibrated_trust"]
        risk_val = calibration_results["calibrated_risk"]
        override_action = calibration_results["override"]
        
        self.trace.append(f"CALIBRATION: Trust calibrated to {trust_val} | Risk calibrated to {risk_val}")
        
        # Recommendations
        audit_status, executive_rec, explanation = RecommendationEngine.determine_recommendation(
            trust_score=trust_val,
            risk_score=risk_val,
            override_action=override_action
        )
        
        self.trace.append(f"VERDICT: Recommendation issued: {audit_status.value} - {explanation}")
        self.trace.append("AGENT_END: Governance audit review finalized.")
        return audit_status, executive_rec, calibration_results
