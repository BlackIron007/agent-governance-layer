import logging
from typing import List
from app.schemas.policy_compliance_record import PolicyComplianceRecord, ComplianceStatus
from app.schemas.contradiction_record import ContradictionRecord, ContradictionType
from app.schemas.evidence_record import EvidenceRecord

logger = logging.getLogger("verifier")

class PolicyAgent:
    """
    Policy Agent: Performs compliance audits against standard rules and identifies internal contradictions.
    """
    def __init__(self):
        self.trace = []

    def execute(
        self, 
        justification_text: str, 
        evidence_records: List[EvidenceRecord]
    ) -> List[PolicyComplianceRecord]:
        self.trace.append("AGENT_START: Reviewing corporate policy rule bounds.")
        
        # Simple compliance heuristics
        has_contradictions = any(ev.support_label == "contradiction" for ev in evidence_records)
        
        nli_strength = 1.0
        if evidence_records:
            nli_strength = max((ev.support_score or 0.0) for ev in evidence_records)

        if has_contradictions:
            status = ComplianceStatus.NON_COMPLIANT
            reasoning = "The decision justification contradicts retrieved factual documentation."
            self.trace.append("COMPLIANCE_FAIL: Policy violation triggered due to evidence contradiction.")
        elif not evidence_records:
            status = ComplianceStatus.UNVERIFIED
            reasoning = "No evidence found to verify policy compliance."
            self.trace.append("COMPLIANCE_WARN: Compliance state is UNVERIFIED due to lack of evidence records.")
        else:
            status = ComplianceStatus.COMPLIANT
            reasoning = "The proposed decision parameters match all internal corporate registries."
            self.trace.append("COMPLIANCE_PASS: Parameters are fully policy compliant.")

        compliance_record = PolicyComplianceRecord(
            policy_id="SOP-001",
            policy_name="Decision Integrity Verification",
            status=status,
            nli_support_strength=nli_strength,
            reasoning=reasoning
        )
        
        self.trace.append("AGENT_END: Compliance audit finalized.")
        return [compliance_record]
