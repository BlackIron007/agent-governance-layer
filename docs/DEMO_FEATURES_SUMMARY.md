# Trust Console IQ: Demo Features Summary

This document highlights the interactive features implemented in the Trust Console IQ demonstration workspace to showcase agent governance, adversarial verification, and decision tracing.

---

## 1. Demo User Journey

1. **Scenario Selection**: The user selects one of 5 preset scenarios from the sidebar launcher (e.g. Vendor Procurement, Procurement Fraud, Security Bypass, Bias Hiring, Medical Dosages).
2. **Reconstruction Workspace**: The user examines the decision's Forensic Reconstruction Ledger:
   - Identifies the final decision verdict card and visual metrics.
   - Traces the causal reasoning graph for blocked paths.
   - Explores the Forensic Analysis tabs to view metrics and multi-agent debate transcripts.
3. **Intelligence Hub Audit**: The user audits the overall system posture and approves policy modernizations.

---

## 2. Sample Output Schema Payload

The `/api/v1/decisions/{id}` endpoint serves structured JSON payloads matching the following format (taken from `DEC-1495`):

```json
{
  "schema_version": "1.0.0",
  "decision_id": "DEC-1495",
  "timestamp": "2026-06-14T16:34:00Z",
  "decision_type": "Procurement Board Decision",
  "context": "Core Customer Database Cloud migration infrastructure selection.",
  "proposal": "AI recommends Vendor X because they are 20% cheaper than Vendor Y...",
  "rationale": "Minimize operational expenditures to meet quarterly capital targets.",
  "verdict": "BLOCKED",
  "execution_confidence": 38.0,
  "risk_exposure": 84.0,
  "evidence_strength": 92.0,
  "takeaway": "Critical SOC2 compliance violations and CISO veto override the proposed financial savings.",
  "decision_dna": [
    {"label": "Security Concerns", "value": 55},
    {"label": "Regulatory Risk", "value": 25},
    {"label": "Cost Savings", "value": 15},
    {"label": "Operational Impact", "value": 5}
  ],
  "board": {
    "members": [
      {"member": "CISO", "vote": "REJECTED", "confidence": 95, "rationale": "Selecting a vendor without SOC2 certificate..."}
    ],
    "consensus_summary": "2 APPROVED, 3 REJECTED",
    "final_verdict": "REJECTED"
  },
  "regulatory": [
    {"name": "SOC2 Compliance", "score": 58, "status": "FAILED", "violations_count": 3}
  ],
  "timeline": [
    {
      "type": "INPUT",
      "label": "Decision Submitted",
      "summary": "Vendor selection proposal loaded.",
      "details": "Procurement agent submitted proposal...",
      "status": "COMPLETED"
    }
  ]
}
```

---

## 3. Flagship "Wow" Interactions

- **Heatmapped Causal Pathways**: The causal graph highlights blocked paths and threat scores using visual border coloring, drawing immediate focus to audit blockers.
- **Counterfactual Projections**: Toggling variables demonstrates how alternative decisions (like enforcing SOC2 compliance) shifts verdicts from `BLOCKED` to `APPROVED`.
- **Confidence Waterfalls**: Step-by-step confidence adjustments showing precisely where confidence values degraded during policy audits.
- **Multi-Agent Debater**: Live-agent FOR and AGAINST arguments detailing systemic alignment risks.
