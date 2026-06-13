from typing import List, Dict, Any, Tuple
from app.schemas.assumption_record import AssumptionRecord
from app.schemas.contradiction_record import ContradictionRecord
from app.schemas.missing_evidence_record import MissingEvidenceRecord
from app.schemas.decision_audit_report import ChallengeReview

class GovernanceRulesEngine:
    """
    Evaluates findings against deterministic rules to produce trust adjustments,
    risk adjustments, and recommendation overrides.
    """
    def __init__(self, config: Dict[str, Any] = None):
        # Default rules configuration
        self.config = config or {
            "unsupported_assumption_penalty": -0.15,
            "missing_evidence_penalty": -0.10,
            "missing_evidence_risk_increase": 0.20,
            "contradiction_penalty": -0.30,
            "contradiction_risk_increase": 0.40,
        }

    def evaluate_rules(
        self,
        assumptions: List[AssumptionRecord],
        contradictions: List[ContradictionRecord],
        missing_evidence: List[MissingEvidenceRecord],
        challenge_review: ChallengeReview = None
    ) -> Tuple[List[Dict[str, Any]], List[str]]:
        """
        Evaluates active governance rules.
        Returns:
            adjustments: List of dicts representing adjustments: {"source": str, "reason": str, "trust_delta": float, "risk_delta": float, "override": str | None}
            triggered_rules: List of descriptive strings detailing which rules were fired.
        """
        adjustments = []
        triggered_rules = []

        # 1. Evaluate Unsupported Assumptions
        if assumptions:
            for ass in assumptions:
                delta = self.config["unsupported_assumption_penalty"]
                adjustments.append({
                    "source": "unsupported_assumption",
                    "reason": f"Assumption '{ass.premise}' lacks factual proof.",
                    "trust_delta": delta,
                    "risk_delta": 0.0,
                    "override": None
                })
                triggered_rules.append(f"RULE_TRIGGERED: UNSUPPORTED_ASSUMPTION (Penalty: {delta})")

        # 2. Evaluate Missing Evidence
        if missing_evidence:
            for me in missing_evidence:
                t_delta = self.config["missing_evidence_penalty"]
                r_delta = self.config["missing_evidence_risk_increase"]
                adjustments.append({
                    "source": "missing_evidence",
                    "reason": f"Missing critical verification input: '{me.required_data_point}'.",
                    "trust_delta": t_delta,
                    "risk_delta": r_delta,
                    "override": None
                })
                triggered_rules.append(f"RULE_TRIGGERED: MISSING_EVIDENCE (Trust: {t_delta}, Risk: +{r_delta})")

        # 3. Evaluate High Severity Contradictions
        if contradictions:
            for con in contradictions:
                t_delta = self.config["contradiction_penalty"]
                r_delta = self.config["contradiction_risk_increase"]
                adjustments.append({
                    "source": "contradiction",
                    "reason": f"Logical conflict: Justification contradicts evidence snippet: '{con.description}'.",
                    "trust_delta": t_delta,
                    "risk_delta": r_delta,
                    "override": "HOLD_FOR_REVIEW"  # High severity trigger overrides recommendation to HOLD
                })
                triggered_rules.append(f"RULE_TRIGGERED: HIGH_SEVERITY_CONTRADICTION (Trust: {t_delta}, Risk: +{r_delta}, Override: HOLD_FOR_REVIEW)")

        # 4. Evaluate Successful Red-Team Challenge
        if challenge_review and challenge_review.confidence_adjustment < 0.0:
            delta = challenge_review.confidence_adjustment
            adjustments.append({
                "source": "red_team_challenge",
                "reason": f"Red-team challenged decision logic: '{challenge_review.opposing_argument}'",
                "trust_delta": delta,
                "risk_delta": 0.10,  # Debate increases overall risk index slightly
                "override": None
            })
            triggered_rules.append(f"RULE_TRIGGERED: SUCCESSFUL_CHALLENGE (Trust: {delta})")

        return adjustments, triggered_rules
