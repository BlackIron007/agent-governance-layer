# FINAL FRONTEND ARCHITECTURE SPECIFICATION
**Target System**: Trust Console IQ (Next.js Application Console)  
**Status**: Current Implementation

---

## 1. Page and Routing System

The frontend application provides the following pages and routing systems matching the corporate governance workspace requirements:

### 1. `/` (Public Landing Page)
* **Purpose**: Explains Trust Console IQ's positioning as the governance layer for AI Agents.
* **CTAs**: `[ Convene Decision Command Center ]` (Redirects to `/command-center`).

### 2. `/command-center` (Decision Ingestion Dashboard)
* **Purpose**: Serves as the interactive launchpad for decision scenarios.
* **Layout**:
  - **Left Sidebar**: Guided demo scenarios controller + active preset launch buttons (Vendor Approval, Procurement Fraud, Emergency Security Override, Bias Hiring, Medical Variance).
  - **Main Screen**: Detailed ingestion workflow, letting users submit decisions to the pipeline.

### 3. `/decision-history` (Enterprise Audit Trail)
* **Purpose**: Directory of previously audited decisions.
* **Layout**: Complete historic table showing audit IDs, timestamps, decision types, context summaries, confidence/risk scores, and status badges (`APPROVED`, `BLOCKED`, `CONDITIONAL_ALLOW`).

### 4. `/decision/[id]` (Forensic Reconstruction Ledger)
* **Purpose**: Deep forensic audit review workstation.
* **Key Components**:
  - **Verdict Hero Panel**: Main banner indicating final status, risk metrics, and evidence indicators.
  - **Causal Graph Panel**: Threat-score heatmapped, directed causal graph representing decision nodes with active highlighted paths.
  - **Forensic Overview Memo Card**: Executive summary of why a decision was blocked or approved.
  - **Forensic Analysis Workspace**: Keyboard-accessible tabbed container allowing judges to toggle between five analysis panels:
    1. *Causal Analysis*: Lists upstream causes and downstream consequences of the selected node.
    2. *Counterfactual Replay*: Side-by-side table presenting actual metrics vs counterfactual projections.
    3. *Confidence Engine*: Layered propagation waterfall with alerts indicating the largest drop.
    4. *Verdict Ownership*: Progression bars detailing percentage-weighted final decision factors.
    5. *Cross Examination*: Transcript displaying debate arguments FOR and AGAINST the recommendation.

### 5. `/intelligence` (Governance Intelligence Hub)
* **Purpose**: High-level posture analytics dashboard.
* **Layout**:
  - **Governance Health Index**: Giant overall posture card (0-100).
  - **Constitutional Drift & Analytic Feeds**: Dynamic charts tracking rule deviation rates.
  - **Riskiest Agents**: Leaderboard monitoring background agent violations.
  - **Policy Friction Heatmap**: Direct list of rule overrides and frequencies.
  - **Evolution Recommendations**: Programmatically proposed policy amendments with direct "Approve & Evolve" CTAs.
