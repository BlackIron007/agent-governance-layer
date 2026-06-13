from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport
from app.schemas.regulatory_framework_evaluation import RegulatoryFrameworkEvaluation

class RegulatoryConflictEngine:
    """
    Regulatory Conflict Engine: Flags deep operational contradictions (e.g. Board approvals
    vs regulatory rejections, simulation failures vs financial metrics).
    """
    def detect_conflicts(
        self,
        payload: DecisionPayload,
        report: BoardDecisionReport,
        evaluations: List[RegulatoryFrameworkEvaluation]
    ) -> List[str]:
        conflicts = []

        # 1. Board Approved vs Regulatory Engine Blocks
        board_rec = report.board_recommendation.value
        blocked_frameworks = [e.framework_name for e in evaluations if e.recommendation == "Block"]
        if board_rec == "APPROVED" and blocked_frameworks:
            conflicts.append(
                f"Board Debate recommended APPROVED, but Regulatory Intelligence Blocked the action "
                f"due to compliance failures in: {', '.join(blocked_frameworks)}."
            )

        # 2. Financial Approval vs Compliance Rejections
        mc = report.multi_constitution_report
        if mc:
            fin_eval = next((e for e in mc.evaluations if e.constitution_name == "Financial Constitution"), None)
            comp_eval = next((e for e in mc.evaluations if e.constitution_name == "Compliance Constitution"), None)
            if fin_eval and comp_eval:
                if fin_eval.recommendation == "Approve" and comp_eval.recommendation in ["Reject", "Review"]:
                    conflicts.append(
                        "Constitutional Conflict: Financial scorecard recommended APPROVE due to high ROI, "
                        "whereas Compliance scorecard recommended REJECT/REVIEW due to policy violations."
                    )

        # 3. High Simulation Failure Risk vs Board Approval
        risk_score = report.enterprise_simulation.expected_risk_exposure if report.enterprise_simulation else 0.0
        if board_rec == "APPROVED" and risk_score > 30.0:
            conflicts.append(
                f"Simulation Overrule: Executive Board approved the action, despite the Enterprise "
                f"Simulation Engine projecting high risk exposure ({risk_score}/100)."
            )

        return conflicts
