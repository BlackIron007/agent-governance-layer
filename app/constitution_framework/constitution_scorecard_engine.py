from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote, VoteType
from app.schemas.constitution_evaluation import ConstitutionEvaluation

class ConstitutionScorecardEngine:
    """
    Constitution Scorecard Engine: Evaluates a decision context under individual
    registered constitutions and outputs detailed compliance scorecards.
    """
    def generate_scorecards(
        self,
        payload: DecisionPayload,
        votes: List[BoardMemberVote],
        violations: List[str]
    ) -> List[ConstitutionEvaluation]:
        evaluations = []

        action_text = payload.proposed_action.lower()
        saving_pct = payload.raw_payload.get("saving_pct", 0.0) if payload.raw_payload else 0.0
        
        # Determine rejection metrics
        ciso_rejection = any(v.member_name == "CISO" and v.vote == VoteType.REJECTED for v in votes)
        cfo_approval = any(v.member_name == "CFO" and v.vote == VoteType.APPROVED for v in votes)

        # 1. Security Constitution Scorecard
        sec_score = 100.0
        sec_violations = []
        sec_strengths = []
        
        if "soc2" in action_text or "security" in action_text:
            sec_score -= 50.0
            sec_violations.append("Vendor lacks independent SOC2 compliance certificate.")
        if ciso_rejection:
            sec_score -= 15.0
            sec_violations.append("CISO rejected proposal due to data leakage exposure risk.")
        
        if sec_score >= 85.0:
            sec_rec = "Approve"
            sec_strengths.append("Meets all default security audit and compliance gates.")
        elif sec_score >= 60.0:
            sec_rec = "Review"
            sec_strengths.append("Standard network interfaces; low exposure perimeter.")
        else:
            sec_rec = "Reject"
            
        evaluations.append(
            ConstitutionEvaluation(
                constitution_name="Security Constitution",
                score=sec_score,
                violations=sec_violations,
                strengths=sec_strengths,
                recommendation=sec_rec
            )
        )

        # 2. Compliance Constitution Scorecard
        comp_score = 100.0
        comp_violations = []
        comp_strengths = []
        
        if len(violations) > 0:
            comp_score -= 30.0 * len(violations)
            comp_violations.extend(violations)
        if "bypass" in action_text or "ignore" in action_text:
            comp_score -= 20.0
            comp_violations.append("Procedural compliance audit metrics ignored.")

        comp_score = max(0.0, comp_score)
        
        if comp_score >= 85.0:
            comp_rec = "Approve"
            comp_strengths.append("Zero policy violations observed.")
        elif comp_score >= 50.0:
            comp_rec = "Review"
            comp_strengths.append("Standard traceability reports present.")
        else:
            comp_rec = "Reject"

        evaluations.append(
            ConstitutionEvaluation(
                constitution_name="Compliance Constitution",
                score=comp_score,
                violations=comp_violations,
                strengths=comp_strengths,
                recommendation=comp_rec
            )
        )

        # 3. Financial Constitution Scorecard
        fin_score = 40.0  # Base score
        fin_violations = []
        fin_strengths = []
        
        if saving_pct > 0.0:
            fin_score += saving_pct * 2.5
            fin_strengths.append(f"Achieves {saving_pct}% discount on standard unit costs.")
        if cfo_approval:
            fin_score += 10.0
            fin_strengths.append("CFO endorsed commercial viability.")
            
        fin_score = min(100.0, fin_score)
        
        if fin_score < 50.0:
            fin_violations.append("Fails to reach ROI target threshold.")
            fin_rec = "Reject"
        elif fin_score < 75.0:
            fin_rec = "Review"
        else:
            fin_rec = "Approve"

        evaluations.append(
            ConstitutionEvaluation(
                constitution_name="Financial Constitution",
                score=fin_score,
                violations=fin_violations,
                strengths=fin_strengths,
                recommendation=fin_rec
            )
        )

        # 4. Sustainability Constitution Scorecard
        sus_score = 70.0
        sus_violations = []
        sus_strengths = []
        
        if "sustainability" in action_text or "esg" in action_text:
            sus_score += 20.0
            sus_strengths.append("Cites environmental impact remediation standards.")
        else:
            sus_violations.append("Lacks explicit ESG alignment tracking reports.")
            
        sus_score = min(100.0, max(0.0, sus_score))
        
        if sus_score >= 85.0:
            sus_rec = "Approve"
        elif sus_score >= 60.0:
            sus_rec = "Approve With Conditions"
        else:
            sus_rec = "Reject"

        evaluations.append(
            ConstitutionEvaluation(
                constitution_name="Sustainability Constitution",
                score=sus_score,
                violations=sus_violations,
                strengths=sus_strengths,
                recommendation=sus_rec
            )
        )

        return evaluations
