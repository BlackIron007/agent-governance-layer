import asyncio
import json
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.schemas.decision_payload import DecisionPayload
from app.modules.executive_debate_engine import ExecutiveDebateEngine

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
            "ignored_delivery_metrics": True
        }
    )

    print("==================================================")
    print("STARTING STRATEGIC PROCUREMENT EXECUTIVE BOARD AUDIT")
    print("==================================================")

    # In a real pipeline run, evidence search is executed first.
    # We provide a mock list of evidence snippets representing typical retrieved inputs.
    evidence_texts = [
        "Vendor A catalog quote shows a unit cost 20% lower than standard industry benchmarks.",
        "Internal procurement historical records show Vendor B has maintained a 99.4% on-time delivery rate.",
        "Supplier risk analysis indicates Vendor A lacks standard SOC2 data certifications."
    ]

    debate_engine = ExecutiveDebateEngine()
    try:
        report = debate_engine.run_debate(payload, evidence_texts)
        
        print(f"\nAudit Board Session ID: {report.board_decision_id}")
        print(f"Proposed Action:        {report.decision_context.proposed_action}")
        
        print("\n--- BOARD MEMBERS DEBATE & VOTES ---")
        for member in report.board_members:
            print(f"\n  Member:    {member.member_name}")
            print(f"  Vote:      {member.vote.value}")
            print(f"  Confidence: {member.confidence}")
            print(f"  Rationale: {member.rationale}")
            print(f"  Cited:     {member.evidence_cited}")

        print("\n--- CONSENSUS MATRIX ---")
        print(f"  Consensus Score: {report.consensus_score} (Agreement Density)")
        print(f"  Conflicts:       {report.conflicts}")
        print(f"  Final Decision:  {report.board_recommendation.value}")

        print("\n--- FUTURE OUTCOME FORECASTS (5 SCENARIOS) ---")
        for idx, sim in enumerate(report.outcome_forecast.simulations):
            print(f"\n  Future #{idx + 1}: {sim.scenario}")
            print(f"    Probability: {sim.probability * 100:.1f}%")
            print(f"    Impact:      {sim.expected_impact}")
            print(f"    Assumptions: {sim.supporting_assumptions}")

        print("\n==================================================")
        print("EXECUTIVE DEBATE BOARD DEMO COMPLETED SUCCESSFULLY!")
        print("==================================================")
        
        # Save structured report JSON in the root for proof of execution
        report_json = report.model_dump(mode='json')
        with open("board_decision_output.json", "w") as f:
            json.dump(report_json, f, indent=2)
            
    except Exception as e:
        print(f"Swarm execution failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
