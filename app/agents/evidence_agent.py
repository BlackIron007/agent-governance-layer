import logging
from typing import List
from app.schemas.decision_parameter import DecisionParameter
from app.schemas.evidence_record import EvidenceRecord
from app.modules.decision_evidence_builder import build_decision_evidence
from app.services.nli_service import check_claim_evidence_support

logger = logging.getLogger("verifier")

class EvidenceAgent:
    """
    Evidence Agent: Queries external web sources and compiles factual verification snippets.
    """
    def __init__(self):
        self.trace = []

    async def execute(self, parameters: List[DecisionParameter], justification_text: str) -> List[EvidenceRecord]:
        self.trace.append("AGENT_START: Initializing evidence sourcing for parameters.")
        
        # Call legacy builder
        evidence_records = await build_decision_evidence(parameters)
        self.trace.append(f"RETRIEVAL: Retrieved {len(evidence_records)} evidence snippets.")

        # Run NLI checks
        for ev in evidence_records:
            label, score = check_claim_evidence_support(justification_text, ev.evidence_text)
            if label == "supports":
                ev.support_label = "entailment"
            else:
                ev.support_label = label
            ev.support_score = float(score)
            self.trace.append(f"VERIFICATION: Verified source '{ev.title or ev.source}' | NLI status: {ev.support_label} (Score: {ev.support_score:.2f})")

        self.trace.append("AGENT_END: Evidence sourcing and verification phase complete.")
        return evidence_records
