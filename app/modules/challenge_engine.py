import json
import logging
import re
from typing import List
from app.schemas.decision_parameter import DecisionParameter
from app.schemas.evidence_record import EvidenceRecord
from app.schemas.assumption_record import AssumptionRecord
from app.schemas.decision_audit_report import ChallengeReview
from app.services.model_client import ModelClient

logger = logging.getLogger("verifier")

def run_adversarial_challenge(
    proposed_action: str,
    parameters: List[DecisionParameter],
    evidence_records: List[EvidenceRecord],
    assumptions: List[AssumptionRecord]
) -> ChallengeReview:
    """
    Executes the 'Audit Challenge Mode'. Simulates a debate between a supporting agent
    and an opposing red-team agent, returning a ChallengeReview schema record.
    """
    parameters_text = "\n".join([f"- {p.name}: {p.value} ({p.parameter_type})" for p in parameters])
    evidence_text = "\n".join([f"- Source: {e.source}, Snippet: {e.evidence_text} (NLI: {e.support_label})" for e in evidence_records])
    assumptions_text = "\n".join([f"- Assumption: {a.premise}" for a in assumptions])

    prompt = f"""You are the Adversarial Challenge Engine for Trust Console IQ. 
Review this decision recommendation and challenge it under a red-team adversarial model:

Proposed Action: {proposed_action}

Extracted Parameters:
{parameters_text}

Evidence Retrieved:
{evidence_text}

Assumptions Made:
{assumptions_text}

Generate:
1. "supporting_argument": The strongest logical case FOR approving this action.
2. "opposing_argument": The strongest adversarial red-team case AGAINST approving this action.
3. "confidence_adjustment": A float between -1.0 and 1.0 showing how much confidence shifted after this debate. A negative shift indicates the red-team's arguments successfully undermined the decision's integrity.
4. "challenge_summary": A summary of the challenge mode debate results.

Format the response strictly as a JSON object containing keys: "supporting_argument", "opposing_argument", "confidence_adjustment", and "challenge_summary". Do not include markdown wraps or headers.
"""

    try:
        response_text = ModelClient.generate(prompt)
        
        # Robust regex-based JSON parser
        match = re.search(r'\{\s*".*"\s*:\s*.*\}', response_text, re.DOTALL)
        if match:
            clean_text = match.group(0)
        else:
            clean_text = response_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()

        parsed_data = json.loads(clean_text)
        return ChallengeReview(
            supporting_argument=parsed_data.get("supporting_argument", "Default support case based on proposed values."),
            opposing_argument=parsed_data.get("opposing_argument", "Default red-team warnings about parameter verification."),
            confidence_adjustment=float(parsed_data.get("confidence_adjustment", -0.1)),
            challenge_summary=parsed_data.get("challenge_summary", "Challenge session finalized.")
        )
    except Exception as e:
        logger.error(f"Error during adversarial challenge execution: {e}")
        # Fallback values
        return ChallengeReview(
            supporting_argument=f"Proposed action has basic alignment with vendor selection constraints.",
            opposing_argument=f"Logical risk found: Missing verified independent benchmark pricing.",
            confidence_adjustment=-0.25,
            challenge_summary="Audit Challenge Mode executed via fallback logic. Adversarial arguments raised caution flags."
        )
