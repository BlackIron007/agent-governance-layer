# Trust Console IQ: The Governance Layer For AI Agents
## Architecture Blueprint & System Specifications

This document outlines the system architecture of **Trust Console IQ**, mapping Next.js frontend console layouts to the Python FastAPI backend engine layers.

---

## 1. System Topology

Trust Console IQ operates as an independent gatekeeping middleware between business execution systems and AI agents.

```
       +-------------------------------------------------------------+
       |                        Next.js UI                           |
       |  /command-center | /decision-history | /intelligence        |
       +-------------------------------------------------------------+
                                      │
                                      ▼ HTTPS (JSON)
       +-------------------------------------------------------------+
       |                     FastAPI REST Gateway                    |
       |  /api/v1/decisions | /api/v1/governance/intelligence        |
       +-------------------------------------------------------------+
                                      │
                                      ▼ 
       +-------------------------------------------------------------+
       |                  Active Governance Engines                  |
       |  - Governance Rules Engine                                  |
       |  - Calibration and Recommendation Core                      |
       |  - Forensic Replay / Counterfactual Evaluators              |
       +-------------------------------------------------------------+
```

---

## 2. Data Contracts & Canonical Schema

The backend serves structured Pydantic models from `app/schemas/`. The core contract used to render the Forensic Reconstruction workspace is the `GovernanceDecisionDetail` model:

### Key Schema Elements:
- **Identity & Context**: `decision_id`, `decision_type`, `context`, `proposal`, `rationale`, `agent_profile`.
- **Metrics**: `verdict`, `execution_confidence`, `risk_exposure`, `evidence_strength`.
- **Deliberation**: `board` (votes, members, rationales), `regulatory` (evaluated frameworks), `adversarial` (collusion/hacking risks), `simulation` (value and risk forecasts).
- **Causal Graph & Timeline**: `timeline` (composed of sequence nodes detailing step-by-step audit outcomes).

---

## 3. Active Backend Engines (Current Implementation)

Trust Console IQ's decision analysis relies on the following active Python components:

- **`GovernanceRulesEngine` (`app/modules/governance_rules_engine.py`)**: Applies penalty points to candidate proposals (e.g. `-0.15` for unsupported assumptions, `-0.30` for contradictions) and overrides final recommendations if critical policy conditions fail.
- **`DecisionCalibrationEngine` (`app/modules/decision_calibration_engine.py`)**: Normalizes trust/risk bounds to compile final calibration scores from the active rules database.
- **`RecommendationEngine` (`app/modules/recommendation_engine.py`)**: Maps trust and risk thresholds to final decisions (`APPROVED`, `APPROVED_WITH_WARNINGS`, `HOLD_FOR_REVIEW`, `REJECTED`).
- **`DecisionReplayEngine` (`app/modules/decision_replay_engine.py`)**: Tracks evidence influence weights, evaluates ignored inputs, and runs counterfactual scenarios.
- **`ExecutiveDebateEngine` (`app/modules/executive_debate_engine.py`)**: Simulates red-team and supporting arguments for Cross Examination.

---

## 4. Future Vision & Planned Roadmap

The following integration components are documented as strategic initiatives and are not active in the current demo REST endpoints:

- **Foundry IQ integration [Planned Roadmap]**: Designed to orchestrate live Swarm-agent deliberations and manage communication lifecycles of background verification loops.
- **Fabric IQ integration [Planned Roadmap]**: Intended to connect the system to enterprise-level Microsoft Fabric semantic layers for real-time internal policy retrieval and data lineage tracking.
- **Dynamic Swarm-Agent Consensus [Future Vision]**: Real-time multi-agent negotiation where agents dynamically reach agreements on incoming payloads before presenting audit metrics.
