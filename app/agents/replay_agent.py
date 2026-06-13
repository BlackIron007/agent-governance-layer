import logging
from typing import List, Tuple
from app.schemas.decision_parameter import DecisionParameter
from app.schemas.evidence_record import EvidenceRecord
from app.schemas.decision_replay import DecisionReplay
from app.schemas.assumption_record import AssumptionRecord
from app.modules.decision_replay_engine import replay_decision_evaluation

logger = logging.getLogger("verifier")

class ReplayAgent:
    """
    Replay Agent: Traces decision weights, flags ignored evidence, and generates counterfactual scenarios.
    """
    def __init__(self):
        self.trace = []

    def execute(
        self,
        parameters: List[DecisionParameter],
        evidence_records: List[EvidenceRecord]
    ) -> Tuple[DecisionReplay, List[AssumptionRecord]]:
        self.trace.append("AGENT_START: Loading decision parameters for replay tracing.")
        
        decision_replay, assumptions = replay_decision_evaluation(parameters, evidence_records)
        
        self.trace.append(f"TRACE: Logged {len(decision_replay.evidence_influence)} influence parameters.")
        self.trace.append(f"TRACE: Flagged {len(assumptions)} unsupported assumptions.")
        self.trace.append(f"SCENARIOS: Formulated {len(decision_replay.counterfactuals)} counterfactuals.")
        
        self.trace.append("AGENT_END: Tracing and counterfactual replication completed.")
        return decision_replay, assumptions
