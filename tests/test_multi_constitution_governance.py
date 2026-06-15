import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.schemas.decision_payload import DecisionPayload
from app.modules.executive_debate_engine import ExecutiveDebateEngine
from app.constitution_framework.governance_profile_manager import GovernanceProfileManager
from app.constitution_framework.constitution_alignment_engine import ConstitutionAlignmentEngine

def main():
    # Ingest strategic procurement board decision payload
    payload = DecisionPayload(
        actor_agent_id="autonomous_procurement_agent_v3",
        decision_type="procurement_board_decision",
        proposed_action=(
            "Procurement AI recommends selecting Vendor A over Vendor B because Vendor A "
            "is 20% cheaper on strategic hardware supply, even though Vendor B has "
            "superior historical delivery metrics."
        ),
        raw_payload={
            "selected_vendor": "Vendor A",
            "alternative_vendor": "Vendor B",
            "saving_pct": 20,
            "category": "strategic hardware supply",
            "ignored_delivery_metrics": True,
            "governance_profile": "Highly Regulated Enterprise"
        }

    )

    print("==================================================")
    print("RUNNING MULTI-CONSTITUTION FRAMEWORK ENGINE TEST")
    print("==================================================")

    evidence_texts = [
        "Vendor A catalog quote shows a unit cost 20% lower than standard industry benchmarks.",
        "Internal procurement historical records show Vendor B has maintained a 99.4% on-time delivery rate.",
        "Supplier risk analysis indicates Vendor A lacks standard SOC2 data certifications."
    ]

    debate_engine = ExecutiveDebateEngine()
    try:
        report = debate_engine.run_debate(payload, evidence_texts)
        
        # Verify multi-constitution report exists
        mc_report = report.multi_constitution_report
        if not mc_report:
            print("ERROR: Multi-constitution report is missing!")
            sys.exit(1)

        print(f"\nDECISION SUBJECT: {report.decision_context.proposed_action}")
        print(f"ACTIVE GOVERNANCE PROFILE Presets: {mc_report.governance_profile}")
        print(f"Overall Weighted Alignment: {mc_report.overall_alignment_score}/100")
        print(f"Recommended Consolidated Action: {mc_report.recommended_action}")

        print("\n--- CONSTITUTION Compliance Scorecards ---")
        for scorecard in mc_report.evaluations:
            print(f"\nScorecard: {scorecard.constitution_name}")
            print(f"  Score:          {scorecard.score}/100")
            print(f"  Recommendation: {scorecard.recommendation}")
            print(f"  Strengths:      {scorecard.strengths}")
            print(f"  Violations:     {scorecard.violations}")

        print("\n--- CONSTITUTION CONFLICT MATRIX ---")
        for idx, conflict in enumerate(mc_report.conflicts):
            print(f"\nConflict #{idx+1}: {', '.join(conflict.conflicting_constitutions)}")
            print(f"  Severity:   {conflict.severity}")
            print(f"  Reason:     {conflict.conflict_reason}")
            print(f"  Resolution: {conflict.proposed_resolution}")

        print("\n--- GOVERNANCE PROFILE STANCE COMPARISONS ---")
        # Compare alignment score across all profiles
        profile_manager = GovernanceProfileManager()
        alignment_engine = ConstitutionAlignmentEngine()
        all_profiles = profile_manager.get_all_profiles()

        scores = {}
        for p_name, p_weights in all_profiles.items():
            alignment = alignment_engine.calculate_alignment(mc_report.evaluations, p_weights)
            scores[p_name] = alignment
            print(f"  Profile: {p_name.ljust(30)} => Alignment Score: {alignment}/100")

        # Programmatic verifications
        assert len(mc_report.evaluations) == 4, "Expected exactly 4 constitution scorecards!"
        assert len(mc_report.conflicts) > 0, "Expected at least one priority conflict!"
        assert scores["Growth Focused Enterprise"] > scores["Highly Regulated Enterprise"], (
            f"Growth Focused alignment ({scores['Growth Focused Enterprise']}) should be higher than "
            f"Regulated Enterprise alignment ({scores['Highly Regulated Enterprise']}) due to financial weight focus!"
        )

        # Save output for validation
        output_filepath = "scratch/multi_constitution_governance_output.json"
        output_data = report.model_dump(mode='json')
        with open(output_filepath, "w") as f:
            json.dump(output_data, f, indent=2)

        print(f"\nMulti-constitution report saved successfully to {output_filepath}")
        print("==================================================")
        print("CONSTITUTION FRAMEWORK ENGINE VERIFIED!")
        print("==================================================")

    except Exception as e:
        print(f"Multi-constitution test execution failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
