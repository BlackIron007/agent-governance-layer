from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote
from app.schemas.constitution_conflict import ConstitutionConflict

class ConstitutionConflictResolver:
    """
    Constitution Conflict Resolver: Examines independent scorecards and identifies core
    prioritizations mismatches (Security vs Finance, Compliance vs Speed, ESG vs Cost)
    offering resolution overrides.
    """
    def resolve_conflicts(
        self,
        payload: DecisionPayload,
        votes: List[BoardMemberVote],
        violations: List[str]
    ) -> List[ConstitutionConflict]:
        conflicts = []

        action_text = payload.proposed_action.lower()
        saving_pct = payload.raw_payload.get("saving_pct", 0.0) if payload.raw_payload else 0.0

        # 1. Security vs Finance Conflict
        if "security" in action_text or "soc2" in action_text or "vulnerability" in action_text:
            if saving_pct > 15.0 or "cheaper" in action_text:
                conflicts.append(
                    ConstitutionConflict(
                        conflicting_constitutions=["Security Constitution", "Financial Constitution"],
                        conflict_reason="Financial Constitution supports selecting Vendor A due to 20% savings, while Security Constitution triggers severe violations due to missing SOC2 data certifications.",
                        severity="Critical",
                        proposed_resolution="Defer decision. Require Vendor A to present SOC2 compliance report or set budget contingency for independent audit."
                    )
                )

        # 2. Compliance vs Speed/Savings Conflict
        if len(violations) > 0 or "bypass" in action_text:
            conflicts.append(
                ConstitutionConflict(
                    conflicting_constitutions=["Compliance Constitution", "Financial Constitution"],
                    conflict_reason="Decision favors rapid, low-cost procurement over regulatory traceability and constitutional layer verification gates.",
                    severity="High",
                    proposed_resolution="Suspend automated approval. Request manual review by Chief Compliance Officer."
                )
            )

        # 3. ESG / Sustainability vs Cost/SLA Conflict
        if "sustainability" in action_text or "esg" in action_text or "delivery" in action_text:
            conflicts.append(
                ConstitutionConflict(
                    conflicting_constitutions=["Sustainability Constitution", "Financial Constitution"],
                    conflict_reason="Decision prioritizes short-term margin optimizations over long-term environmental traceability and compliance standards.",
                    severity="Medium",
                    proposed_resolution="Conditional approval. Vendor A must commit to carbon offset requirements in final contract terms."
                )
            )

        # Fallback if no conflicts found
        if not conflicts:
            conflicts.append(
                ConstitutionConflict(
                    conflicting_constitutions=["All Constitutions"],
                    conflict_reason="No direct priority conflicts identified. Governance targets are aligned.",
                    severity="Low",
                    proposed_resolution="Proceed with standard voting pipeline."
                )
            )

        return conflicts
