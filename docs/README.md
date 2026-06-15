# Trust Console IQ: Universal Governance Layer for AI Agents

Trust Console IQ is an enterprise-grade AI decision governance platform. It audits, evaluates, and challenges autonomous AI-driven recommendations before they are executed, mitigating regulatory, financial, security, and operational risks.

## Core Features & Experience

- **Governance Command Center**: Central workspace offering Verdict Hero Cards, Decision DNA breakdown, and progressive disclosure of agent deliberations.
- **Forensic Analysis Workspace**: Interactive panels allowing compliance judges to drill down into decisions:
  - **Causal Analysis**: Heatmapped directed causal graphs tracing primary compliance blockers.
  - **Counterfactual Replay**: Side-by-side simulation comparing actual outcomes to hypothetical parameter shifts.
  - **Confidence Engine**: Propagation waterfall tracking confidence levels across layers (Evidence → Board → Simulation → Regulatory → Verdict).
  - **Verdict Ownership**: Percentage-weighted contribution breakdown of final verdict factors.
  - **Cross Examination**: Multi-agent debate transcript detailing arguments FOR and AGAINST the recommendation.
- **Governance Intelligence Hub**: High-level dashboard monitoring overall posture, Constitutional Drift, riskiest active agent bots, and policy frictions.
- **Enterprise Audit Trail**: Historical log directory showing the audit history of the last 50 decisions with status indicators.

## Repository Layout

```
├── app/                        # FastAPI Backend Application
│   ├── main.py                 # REST API endpoints & mock decision database
│   ├── modules/                # Core governance, scoring, NLI, and risk engines
│   ├── schemas/                # Shared Pydantic data schemas
│   └── services/               # Evidence retrieval & NLI classifiers
├── frontend/                   # Next.js Frontend Console
│   ├── components/             # Reusable UI cards, panels, and layouts
│   └── app/                    # Web application pages and routes
├── tests/                      # Python test scripts
└── docs/archive/               # Historical design and planning documents
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)

### Backend Installation

1. Navigate to the root directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

### Frontend Installation

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
