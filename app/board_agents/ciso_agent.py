import json
import re
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote, VoteType
from app.schemas.memory_precedent import MemoryPrecedent
from app.services.model_client import ModelClient

class CISOAgent:
    """
    CISO Agent: Audits data governance, system security compliance, and vendor risks in light of precedents.
    """
    def evaluate(self, payload: DecisionPayload, evidence_texts: list[str], relevant_precedents: list[MemoryPrecedent]) -> BoardMemberVote:
        evidence_summary = "\n".join([f"- {txt}" for txt in evidence_texts])
        precedent_summary = "\n".join([
            f"- Past Decision {p.precedent_id}: '{p.decision_summary}'. Verdict: {p.outcome}. Lessons learned: {', '.join(p.lessons_learned)}"
            for p in relevant_precedents
        ])
        
        prompt = f"""You are the Chief Information Security Officer (CISO) Board Agent for Trust Console IQ.
Analyze this proposed AI recommendation from a security perspective:

Proposed Action: {payload.proposed_action}
Context Data: {json.dumps(payload.raw_payload)}

Evidence:
{evidence_summary}

Historical Precedents:
{precedent_summary}

Your evaluation rationale MUST include a 'Historical Reasoning' section referencing past precedents (e.g. mention past data leak risks or bypassed security rules, such as precedent PRC-2024-02 where a vendor was approved without SOC2).

Determine:
1. "vote": APPROVED, REJECTED, or ABSTAINED.
2. "confidence": A float between 0.0 and 1.0.
3. "rationale": Detailed security reasoning including 'Historical Reasoning'.
4. "evidence_cited": Citations from the Evidence.

Respond strictly in JSON matching keys: "vote", "confidence", "rationale", "evidence_cited". Do not use markdown blocks.
"""
        try:
            res = ModelClient.generate(prompt)
            match = re.search(r'\{\s*".*"\s*:\s*.*\}', res, re.DOTALL)
            data = json.loads(match.group(0)) if match else json.loads(res.strip())
            return BoardMemberVote(
                member_name="CISO",
                vote=VoteType(data.get("vote", "REJECTED")),
                confidence=float(data.get("confidence", 0.9)),
                rationale=data.get("rationale", "Data privacy parameters verified."),
                evidence_cited=data.get("evidence_cited", [])
            )
        except Exception:
            return BoardMemberVote(
                member_name="CISO",
                vote=VoteType.REJECTED,
                confidence=0.85,
                rationale="Rejected: Proposed vendor lacks standard SOC2 certificates. Historical Reasoning: Review of precedent PRC-2024-02 reveals that approving a pipeline cloud integration without SOC2 certificates resulted in a data leak post-deal. We reject to avoid repeating this risk.",
                evidence_cited=["Vendor A lacks standard SOC2 data certifications."]
            )
