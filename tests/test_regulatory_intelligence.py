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
            "ignored_delivery_metrics": True,
            "governance_profile": "Highly Regulated Enterprise"
        }
    )

    print("==================================================")
    print("RUNNING REGULATORY INTELLIGENCE LAYER (RIL) TEST")
    print("==================================================")

    evidence_texts = [
        "Vendor A catalog quote shows a unit cost 20% lower than standard industry benchmarks.",
        "Internal procurement historical records show Vendor B has maintained a 99.4% on-time delivery rate.",
        "Supplier risk analysis indicates Vendor A lacks standard SOC2 data certifications."
    ]

    debate_engine = ExecutiveDebateEngine()
    try:
        report = debate_engine.run_debate(payload, evidence_texts)
        
        # Verify regulatory intelligence report exists
        ril_report = report.regulatory_intelligence_report
        if not ril_report:
            print("ERROR: Regulatory Intelligence report is missing!")
            sys.exit(1)

        print(f"\nDECISION SUBJECT:  {report.decision_context.proposed_action}")
        print(f"COMPLIANCE SCORE:  {ril_report.overall_compliance_score}/100")
        print(f"EXECUTION STATUS:  {ril_report.execution_status}")
        print(f"EXECUTIVE SUMMARY: {ril_report.executive_summary}")

        print("\n--- COMPLIANCE SCORECARDS ---")
        for scorecard in ril_report.framework_evaluations:
            print(f"\nFramework: {scorecard.framework_name}")
            print(f"  Score:          {scorecard.compliance_score}/100")
            print(f"  Recommendation: {scorecard.recommendation}")
            print(f"  Violations count: {len(scorecard.violations)}")
            print(f"  Obligations checked: {len(scorecard.obligations_checked)}")

        print("\n--- DETECTED REGULATORY VIOLATIONS ---")
        for idx, violation in enumerate(ril_report.regulatory_violations):
            print(f"\nViolation #{idx+1}: {violation.violated_requirement} ({violation.framework_name})")
            print(f"  Violation ID:  {violation.violation_id}")
            print(f"  Severity:      {violation.severity}")
            print(f"  Explanation:   {violation.explanation}")
            print(f"  Evidence:      {violation.supporting_evidence}")

        print("\n--- REGULATORY CONFLICT MATRIX ---")
        for conflict in ril_report.regulatory_conflicts:
            print(f"  - {conflict}")

        # Assertions to verify requirements
        assert ril_report.execution_status == "BLOCKED", f"Expected BLOCKED status, got {ril_report.execution_status}!"
        
        violation_codes = [v.violation_id for v in ril_report.regulatory_violations]
        assert "VIO-SOC2-VENDOR" in violation_codes, "Expected SOC2 vendor violation!"
        assert "VIO-CORP-SOC2" in violation_codes, "Expected Corporate policy SOC2 violation!"
        assert "VIO-MS-RAI-TRANS" in violation_codes, "Expected Microsoft Responsible AI transparency concern!"
        assert "VIO-MS-RED-MANIP" in violation_codes, "Expected Microsoft Red Team manipulation concern!"

        # Save output for validation
        output_filepath = "scratch/regulatory_intelligence_output.json"
        output_data = report.model_dump(mode='json')
        with open(output_filepath, "w") as f:
            json.dump(output_data, f, indent=2)

        print(f"\nRegulatory Intelligence report saved successfully to {output_filepath}")
        print("==================================================")
        print("REGULATORY INTELLIGENCE LAYER VERIFIED!")
        print("==================================================")

    except Exception as e:
        print(f"Regulatory Intelligence test execution failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
