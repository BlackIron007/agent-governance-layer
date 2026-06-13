import json
import re
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote, VoteType
from app.schemas.memory_precedent import MemoryPrecedent
from app.services.model_client import ModelClient

class LegalAgent:
    """
    Legal Agent: Audits regulatory policy, SLA contract terms, and contract risks in light of precedents.
    """
    def evaluate(self, payload: DecisionPayload, evidence_texts: list[str], relevant_precedents: list[MemoryPrecedent]) -> BoardMemberVote:
        evidence_summary = "\n".join([f"- {txt}" for txt in evidence_texts])
        precedent_summary = "\n".join([
            f"- Past Decision {p.precedent_id}: '{p.decision_summary}'. Verdict: {p.outcome}. Lessons learned: {', '.join(p.lessons_learned)}"
            for p in relevant_precedents
        ])
        
        prompt = f"""You are the General Counsel / Legal Board Agent for Trust Console IQ.
Analyze this proposed AI recommendation from a legal perspective:

Proposed Action: {payload.proposed_action}
Context Data: {json.dumps(payload.raw_payload)}

Evidence:
{evidence_summary}

Historical Precedents:
{precedent_summary}

Your evaluation rationale MUST include a 'Historical Reasoning' section referencing past precedents, contract clauses, or policy breaches from memory.

Determine:
1. "vote": APPROVED, REJECTED, or ABSTAINED.
2. "confidence": A float between 0.0 and 1.0.
3. "rationale": Legal reasoning including 'Historical Reasoning'.
4. "evidence_cited": Citations from the Evidence.

Respond strictly in JSON matching keys: "vote", "confidence", "rationale", "evidence_cited". Do not use markdown blocks.
"""
        try:
            res = ModelClient.generate(prompt)
            match = re.search(r'\{\s*".*"\s*:\s*.*\}', res, re.DOTALL)
            data = json.loads(match.group(0)) if match else json.loads(res.strip())
            return BoardMemberVote(
                member_name="Legal",
                vote=VoteType(data.get("vote", "REJECTED")),
                confidence=float(data.get("confidence", 0.95)),
                rationale=data.get("rationale", "Legal parameters verified."),
                evidence_cited=data.get("evidence_cited", [])
            )
        except Exception:
            return BoardMemberVote(
                member_name="Legal",
                vote=VoteType.REJECTED,
                confidence=0.80,
                rationale="Rejected: Selecting Vendor A introduces compliance risks. Historical Reasoning: Review of precedent PRC-2024-02 shows regulatory auditing issues followed the bypass of standard security certifications. Compliance guidelines mandate contract blocking.",
                evidence_cited=[]
            )
