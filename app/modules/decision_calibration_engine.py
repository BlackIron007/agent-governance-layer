from typing import List, Dict, Any, Tuple
from app.schemas.assumption_record import AssumptionRecord
from app.schemas.contradiction_record import ContradictionRecord
from app.schemas.missing_evidence_record import MissingEvidenceRecord
from app.schemas.decision_audit_report import ChallengeReview
from app.schemas.confidence_waterfall import ConfidenceWaterfall, AdjustmentEvent
from app.modules.governance_rules_engine import GovernanceRulesEngine

class DecisionCalibrationEngine:
    """
    The single source of truth for calibrating trust/risk scores and tracing confidence changes.
    """
    def __init__(self):
        self.rules_engine = GovernanceRulesEngine()

    def calibrate(
        self,
        base_trust: float,
        base_risk: float,
        assumptions: List[AssumptionRecord],
        contradictions: List[ContradictionRecord],
        missing_evidence: List[MissingEvidenceRecord],
        challenge_review: ChallengeReview = None
    ) -> Dict[str, Any]:
        """
        Calibrates the final scores.
        Returns:
            calibrated_trust: float
            calibrated_risk: float
            waterfall: ConfidenceWaterfall
            trace: List[str]
            governance_rules: List[str]
            override: str | None
        """
        trace = [f"CALIBRATION_START: Base Trust Score: {base_trust}, Base Risk Score: {base_risk}"]
        
        # 1. Run Governance Rules
        adjustments, rule_results = self.rules_engine.evaluate_rules(
            assumptions=assumptions,
            contradictions=contradictions,
            missing_evidence=missing_evidence,
            challenge_review=challenge_review
        )

        waterfall_events = []
        current_trust = base_trust
        current_risk = base_risk
        override_action = None

        severity_rank = {
            "APPROVED": 1,
            "APPROVED_WITH_WARNINGS": 2,
            "HOLD_FOR_REVIEW": 3,
            "REJECTED": 4
        }

        # 2. Compile Adjustments
        for adj in adjustments:
            source = adj["source"]
            reason = adj["reason"]
            t_delta = adj["trust_delta"]
            r_delta = adj["risk_delta"]
            override = adj["override"]

            # Trust penalty application
            if t_delta != 0.0:
                prev_trust = current_trust
                current_trust = round(max(0.0, min(1.0, current_trust + t_delta)), 2)
                waterfall_events.append(
                    AdjustmentEvent(
                        source=source,
                        reason=reason,
                        delta=t_delta
                    )
                )
                trace.append(f"ADJUSTMENT: Trust score penalized by {t_delta} ({source}). Shifted from {prev_trust} to {current_trust}.")

            # Risk penalty application
            if r_delta != 0.0:
                prev_risk = current_risk
                current_risk = round(max(0.0, min(1.0, current_risk + r_delta)), 2)
                trace.append(f"ADJUSTMENT: Risk score escalated by +{r_delta} ({source}). Shifted from {prev_risk} to {current_risk}.")

            # Check override updates
            if override:
                if not override_action or severity_rank[override] > severity_rank[override_action]:
                    override_action = override
                    trace.append(f"OVERRIDE_TRIGGERED: Rule demanded action escalate to '{override}'.")

        # Compile final results
        waterfall = ConfidenceWaterfall(
            initial_confidence=base_trust,
            adjustments=waterfall_events,
            final_confidence=current_trust
        )
        
        trace.append(f"CALIBRATION_END: Calibrated Trust Score: {current_trust}, Calibrated Risk Score: {current_risk}")

        return {
            "calibrated_trust": current_trust,
            "calibrated_risk": current_risk,
            "waterfall": waterfall,
            "trace": trace,
            "governance_rules": rule_results,
            "override": override_action
        }
