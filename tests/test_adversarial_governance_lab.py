import sys
import os
import json

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
    print("RUNNING ADVERSARIAL GOVERNANCE LAB STRESS TEST")
    print("==================================================")

    evidence_texts = [
        "Vendor A catalog quote shows a unit cost 20% lower than standard industry benchmarks.",
        "Internal procurement historical records show Vendor B has maintained a 99.4% on-time delivery rate.",
        "Supplier risk analysis indicates Vendor A lacks standard SOC2 data certifications."
    ]

    debate_engine = ExecutiveDebateEngine()
    try:
        report = debate_engine.run_debate(payload, evidence_texts)
        
        # Verify that governance attack report is attached
        agl_report = report.governance_attack_report
        if not agl_report:
            print("ERROR: Governance attack report is missing!")
            sys.exit(1)

        print("\nDECISION CONTEXT:")
        print(f"  Action: {report.decision_context.proposed_action}")

        print("\nAGL SECURITY METRICS:")
        print(f"  Governance Resilience Score: {agl_report.governance_resilience_score}/100")
        print(f"  Board Manipulation Risk:      {agl_report.board_manipulation_risk}/100")
        print(f"  Agent Collusion Risk:         {agl_report.collusion_risk}/100")

        print("\n--- DETECTED VULNERABILITIES & FINDINGS ---")
        for idx, finding in enumerate(agl_report.findings):
            print(f"\nFinding #{idx+1}: {finding.vulnerability}")
            print(f"  Target Rule:       {finding.exploited_rule}")
            print(f"  Success Likelihood: {finding.attack_success_probability * 100:.1f}%")
            print(f"  Impact Rating:     {finding.impact_score}/100")
            print(f"  Mitigation Detail: {finding.mitigation}")

        print("\n--- SIMULATED ATTACK SCENARIOS ---")
        for idx, scenario in enumerate(agl_report.attack_scenarios):
            print(f"\nScenario #{idx+1}: {scenario.attack_type} (ID: {scenario.attack_id})")
            print(f"  Goal:        {scenario.attack_goal}")
            print(f"  Severity:    {scenario.severity}")
            print(f"  Targets:     {scenario.affected_components}")
            print(f"  Probability: {scenario.attack_probability * 100:.1f}%")

        print("\n--- GOVERNANCE STRESS TESTING RUN ---")
        print(agl_report.stress_test_summary)

        print("\n--- CRITICAL SYSTEM VULNERABILITIES ---")
        for vuln in agl_report.critical_vulnerabilities:
            print(f"  - {vuln}")

        print("\n--- RECOMMENDED MITIGATION PLAN ---")
        for step in agl_report.mitigation_plan:
            print(f"  - {step}")

        # Assertions to verify requirements
        assert len(agl_report.attack_scenarios) >= 6, "Expected at least 6 attack scenarios!"
        assert len(agl_report.findings) > 0, "Expected at least one audit finding vulnerability!"
        assert agl_report.governance_resilience_score >= 0.0, "Resilience score must be valid!"

        # Save output for validation
        output_filepath = "scratch/adversarial_governance_lab_output.json"
        output_data = report.model_dump(mode='json')
        with open(output_filepath, "w") as f:
            json.dump(output_data, f, indent=2)

        print(f"\nAdversarial governance lab output saved successfully to {output_filepath}")
        print("==================================================")
        print("ADVERSARIAL GOVERNANCE LAB COMPLETED SUCCESSFULLY!")
        print("==================================================")

    except Exception as e:
        print(f"Adversarial lab stress execution failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
