import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.schemas.decision_payload import DecisionPayload
from app.modules.executive_debate_engine import ExecutiveDebateEngine
from app.enterprise_simulation.enterprise_simulation_engine import EnterpriseSimulationEngine

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

    print("==========================================")
    print("RUNNING STRATEGIC PROCUREMENT SIMULATION")
    print("==========================================")

    evidence_texts = [
        "Vendor A catalog quote shows a unit cost 20% lower than standard industry benchmarks.",
        "Internal procurement historical records show Vendor B has maintained a 99.4% on-time delivery rate.",
        "Supplier risk analysis indicates Vendor A lacks standard SOC2 data certifications."
    ]

    debate_engine = ExecutiveDebateEngine()
    try:
        report = debate_engine.run_debate(payload, evidence_texts)
        
        # Verify that enterprise simulation is attached to the report
        simulation = report.enterprise_simulation
        if not simulation:
            print("ERROR: Enterprise simulation report is missing!")
            sys.exit(1)

        print("\nDECISION SUMMARY:")
        print(f"  {simulation.decision_summary}")

        print("\nSIMULATION VERDICT:")
        print(f"  Expected Enterprise Value: {simulation.expected_enterprise_value}/100")
        print(f"  Expected Risk Exposure:     {simulation.expected_risk_exposure}/100")
        print(f"  Executive Summary:          {simulation.simulation_summary}")

        print("\n--- GENERATED SCENARIOS (5 REQUIRED) ---")
        for idx, scenario in enumerate(simulation.scenarios):
            print(f"\nScenario #{idx+1}: {scenario.scenario_name} (ID: {scenario.scenario_id})")
            print(f"  Probability: {scenario.probability * 100:.1f}%")
            print(f"  Confidence:  {scenario.confidence * 100:.1f}%")
            
            # Precedent and Assumption citations verification
            print(f"  Supporting Precedents: {scenario.supporting_precedents}")
            print(f"  Assumptions Cited:     {scenario.assumptions}")
            
            # Assertions to verify requirements programmatically
            assert len(scenario.supporting_precedents) > 0, f"Scenario {scenario.scenario_id} lacks precedent citations!"
            assert len(scenario.assumptions) > 0, f"Scenario {scenario.scenario_id} lacks assumptions!"

        print("\n--- CHRONOLOGICAL QUARTERLY IMPACTS ---")
        for q_impact in simulation.quarterly_impacts:
            print(f"\nQuarter: {q_impact.quarter}")
            print(f"  Financial:   {q_impact.financial_impact}")
            print(f"  Operational: {q_impact.operational_impact}")
            print(f"  Compliance:  {q_impact.compliance_impact}")
            print(f"  Reputation:  {q_impact.reputation_impact}")
            print(f"  Risk Index:  {q_impact.risk_score}/100")

        # Save output for validation
        output_data = report.model_dump(mode='json')
        output_filepath = "scratch/enterprise_simulation_output.json"
        with open(output_filepath, "w") as f:
            json.dump(output_data, f, indent=2)
            
        print(f"\nSimulation output saved successfully to {output_filepath}")
        print("==========================================")
        print("ENTERPRISE SIMULATION ENGINE VERIFIED!")
        print("==========================================")

    except Exception as e:
        print(f"Simulation execution or verification failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
