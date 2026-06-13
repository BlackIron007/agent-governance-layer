import logging
from typing import List, Tuple
from app.schemas.contradiction_record import ContradictionRecord, ContradictionType
from app.schemas.missing_evidence_record import MissingEvidenceRecord, EvidenceSeverity
from app.schemas.evidence_record import EvidenceRecord

logger = logging.getLogger("verifier")

class RiskAgent:
    """
    Risk Agent: Evaluates parameter risks, identifies contradictions, and compiles missing evidence warnings.
    """
    def __init__(self):
        self.trace = []

    def execute(
        self, 
        justification_text: str, 
        evidence_records: List[EvidenceRecord]
    ) -> Tuple[List[ContradictionRecord], List[MissingEvidenceRecord]]:
        self.trace.append("AGENT_START: Scanning for transaction contradictions and missing information gates.")
        
        contradictions = []
        missing_evidence = []

        # 1. Contradictions extraction
        for ev in evidence_records:
            if ev.support_label == "contradiction":
                contradictions.append(
                    ContradictionRecord(
                        type=ContradictionType.INTERNAL,
                        source_a=justification_text,
                        source_b=ev.evidence_text,
                        description=f"Justification contradicts source evidence from {ev.source}."
                    )
                )
                self.trace.append(f"CONTRADICTION_FOUND: Parameter justification conflicts with evidence: {ev.title}")

        # 2. Missing Evidence evaluation
        if not evidence_records:
            missing_evidence.append(
                MissingEvidenceRecord(
                    required_data_point="General independent verification data",
                    impact_severity=EvidenceSeverity.HIGH,
                    suggested_source="Web Search / Microsoft Fabric"
                )
            )
            self.trace.append("OMISSION_FOUND: Critical lack of verification records detected.")

        self.trace.append("AGENT_END: Risk mapping complete.")
        return contradictions, missing_evidence
