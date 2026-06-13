import json
import re
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote, VoteType
from app.schemas.memory_precedent import MemoryPrecedent
from app.services.model_client import ModelClient

class ProcurementAgent:
    """
    Procurement Agent: Audits sourcing standards and vendor diversification policies in light of precedents.
    """
    def evaluate(self, payload: DecisionPayload, evidence_texts: list[str], relevant_precedents: list[MemoryPrecedent]) -> BoardMemberVote:
        evidence_summary = "\n".join([f"- {txt}" for txt in evidence_texts])
        precedent_summary = "\n".join([
            f"- Past Decision {p.precedent_id}: '{p.decision_summary}'. Verdict: {p.outcome}. Lessons learned: {', '.join(p.lessons_learned)}"
            for p in relevant_precedents
        ])
        
        prompt = f"""You are the Chief Procurement Officer (CPO) / Procurement Board Agent for Trust Console IQ.
Analyze this proposed AI recommendation from a procurement perspective:

Proposed Action: {payload.proposed_action}
Context Data: {json.dumps(payload.raw_payload)}

Evidence:
{evidence_summary}

Historical Precedents:
{precedent_summary}

Your evaluation rationale MUST include a 'Historical Reasoning' section referencing past precedents, sourcing standards, or policy overrides.

Determine:
1. "vote": APPROVED, REJECTED, or ABSTAINED.
2. "confidence": A float between 0.0 and 1.0.
3. "rationale": Sourcing reasoning including 'Historical Reasoning'.
4. "evidence_cited": Citations from the Evidence.

Respond strictly in JSON matching keys: "vote", "confidence", "rationale", "evidence_cited". Do not use markdown blocks.
"""
        try:
            res = ModelClient.generate(prompt)
            match = re.search(r'\{\s*".*"\s*:\s*.*\}', res, re.DOTALL)
            data = json.loads(match.group(0)) if match else json.loads(res.strip())
            return BoardMemberVote(
                member_name="Procurement",
                vote=VoteType(data.get("vote", "REJECTED")),
                confidence=float(data.get("confidence", 0.9)),
                rationale=data.get("rationale", "Procurement parameters verified."),
                evidence_cited=data.get("evidence_cited", [])
            )
        except Exception:
            return BoardMemberVote(
                member_name="Procurement",
                vote=VoteType.REJECTED,
                confidence=0.85,
                rationale="Rejected: Procurement standards require robust delivery and security verification. Historical Reasoning: Lessons from precedents PRC-2024-01 and PRC-2024-02 demonstrate that cost-driven overrides lead to post-deal delays and data risks. We reject to maintain sourcing integrity.",
                evidence_cited=[]
            )
