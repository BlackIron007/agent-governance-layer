import asyncio
import json
import os
import sys

# Ensure project root is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.schemas.decision_payload import DecisionPayload
from app.modules.decision_audit_pipeline import run_decision_audit

async def main():
    # Construct test scenario payload
    payload = DecisionPayload(
        actor_agent_id="procurement_assistant_v2",
        decision_type="vendor_selection",
        proposed_action="Approve Vendor A because Vendor A is 15% cheaper.",
        raw_payload={
            "vendor_name": "Vendor A",
            "justification": "15% cheaper than alternative bids",
            "margin_pct": 15
        }
    )

    print("Running Decision Audit Pipeline V1...")
    try:
        report = await run_decision_audit(payload)
        
        # Serialize and print the structured JSON output
        report_json = report.model_dump(mode='json')
        print("\n--- DECISION AUDIT REPORT JSON OUTPUT ---")
        print(json.dumps(report_json, indent=2))
        print("-----------------------------------------\n")
        print("Pipeline executed successfully!")
    except Exception as e:
        print(f"Pipeline execution failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
