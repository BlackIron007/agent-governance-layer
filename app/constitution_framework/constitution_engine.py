from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote
from app.schemas.multi_constitution_report import MultiConstitutionReport

from app.constitution_framework.constitution_registry import ConstitutionRegistry
from app.constitution_framework.governance_profile_manager import GovernanceProfileManager
from app.constitution_framework.constitution_scorecard_engine import ConstitutionScorecardEngine
from app.constitution_framework.constitution_conflict_resolver import ConstitutionConflictResolver
from app.constitution_framework.constitution_alignment_engine import ConstitutionAlignmentEngine

class ConstitutionEngine:
    """
    Constitution Framework Engine: Orchestrates multi-constitutional evaluations,
    profiles mapping, conflict resolutions, and alignment assessments.
    """
    def __init__(self):
        self.registry = ConstitutionRegistry()
        self.profile_manager = GovernanceProfileManager()
        self.scorecard_engine = ConstitutionScorecardEngine()
        self.conflict_resolver = ConstitutionConflictResolver()
        self.alignment_engine = ConstitutionAlignmentEngine()

    def run_evaluations(
        self,
        payload: DecisionPayload,
        board_votes: List[BoardMemberVote],
        constitutional_violations: List[str]
    ) -> MultiConstitutionReport:
        # Determine governance profile preset
        profile_name = "Highly Regulated Enterprise"
        if payload.raw_payload and "governance_profile" in payload.raw_payload:
            profile_name = payload.raw_payload["governance_profile"]


        # Fetch profile weights
        weights = self.profile_manager.get_profile_weights(profile_name)

        # Generate scorecards
        evaluations = self.scorecard_engine.generate_scorecards(payload, board_votes, constitutional_violations)

        # Run conflict resolution
        conflicts = self.conflict_resolver.resolve_conflicts(payload, board_votes, constitutional_violations)

        # Calculate weighted overall alignment
        alignment_score = self.alignment_engine.calculate_alignment(evaluations, weights)

        # Formulate recommended action based on overall alignment score
        if alignment_score >= 80.0:
            rec_action = "APPROVED"
        elif alignment_score >= 50.0:
            rec_action = "DEFERRED_FOR_REVIEW"
        else:
            rec_action = "REJECTED"

        return MultiConstitutionReport(
            evaluations=evaluations,
            conflicts=conflicts,
            overall_alignment_score=alignment_score,
            governance_profile=profile_name,
            recommended_action=rec_action
        )
