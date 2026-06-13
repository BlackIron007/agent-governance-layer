from typing import Tuple, List, Optional
from app.schemas.decision_audit_report import AuditStatus
from app.schemas.executive_recommendation import ExecutiveRecommendation, RecommendationAction

class RecommendationEngine:
    """
    Translates calibrated trust and risk scores along with governance overrides 
    into final audit verdicts and action steps.
    """
    @staticmethod
    def determine_recommendation(
        trust_score: float,
        risk_score: float,
        override_action: Optional[str] = None
    ) -> Tuple[AuditStatus, ExecutiveRecommendation, str]:
        """
        Determines the final decision recommendation based on calibrated values.
        Returns:
            audit_status: AuditStatus enum value.
            recommendation: ExecutiveRecommendation model.
            explanation: A clear string tracing the recommendation decision logic.
        """
        base_action = None
        explanation = ""

        # Score-based classification logic
        if trust_score >= 0.85 and risk_score <= 0.25:
            base_action = "APPROVED"
            rec_action = RecommendationAction.PROCEED
            explanation = f"High confidence and low risk verified (Trust: {trust_score}, Risk: {risk_score}). Approval granted."
            remediation_steps = ["Deploy proposed action directly."]
        elif trust_score >= 0.70 and risk_score <= 0.45:
            base_action = "APPROVED_WITH_WARNINGS"
            rec_action = RecommendationAction.PROCEED
            explanation = f"Moderate trust alignment (Trust: {trust_score}, Risk: {risk_score}). Action approved under standard monitoring guidelines."
            remediation_steps = ["Monitor execution metrics closely for deviation signs."]
        elif trust_score >= 0.45 and risk_score <= 0.75:
            base_action = "HOLD_FOR_REVIEW"
            rec_action = RecommendationAction.HOLD_FOR_REVIEW
            explanation = f"Significant risk factors detected (Trust: {trust_score}, Risk: {risk_score}). Execution must be paused for human analyst audit."
            remediation_steps = ["Review all counterfactual alternatives.", "Ingest required verification data."]
        else:
            base_action = "REJECTED"
            rec_action = RecommendationAction.DENY
            explanation = f"Fails basic integrity thresholds (Trust: {trust_score}, Risk: {risk_score}). The proposed decision is blocked."
            remediation_steps = ["Reject decision immediately.", "Re-evaluate the source AI agent parameters."]

        # Apply override if more restrictive
        severity_rank = {
            "APPROVED": 1,
            "APPROVED_WITH_WARNINGS": 2,
            "HOLD_FOR_REVIEW": 3,
            "REJECTED": 4
        }

        final_action = base_action
        if override_action and override_action in severity_rank:
            if severity_rank[override_action] > severity_rank[base_action]:
                final_action = override_action
                explanation += f" Governance override rule applied: escalated action to {override_action} due to critical finding validation."
                
                if override_action == "HOLD_FOR_REVIEW":
                    rec_action = RecommendationAction.HOLD_FOR_REVIEW
                    remediation_steps = ["Review compliance logs manually.", "Require human double check before execution."]
                elif override_action == "REJECTED":
                    rec_action = RecommendationAction.DENY
                    remediation_steps = ["Deny vendor or parameter approval.", "Audit database rules."]

        # Map string representation to schema AuditStatus Enum
        if final_action == "APPROVED":
            status = AuditStatus.APPROVED
        elif final_action == "APPROVED_WITH_WARNINGS":
            status = AuditStatus.WARNING
        elif final_action == "HOLD_FOR_REVIEW":
            status = AuditStatus.WARNING
        else:
            status = AuditStatus.REJECTED_CRITICAL

        executive_rec = ExecutiveRecommendation(
            summary=explanation,
            recommended_action=rec_action,
            remediation_steps=remediation_steps
        )

        return status, executive_rec, explanation
