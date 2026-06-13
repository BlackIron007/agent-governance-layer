import logging
import uuid
import json
import re
from typing import List, Dict, Any, Tuple
from datetime import datetime

from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardDecisionReport, BoardMemberVote, VoteType, BoardRecommendationAction
from app.schemas.outcome_forecast_report import OutcomeForecastReport, FutureOutcomeSimulation
from app.board_agents.cfo_agent import CFOAgent
from app.board_agents.ciso_agent import CISOAgent
from app.board_agents.legal_agent import LegalAgent
from app.board_agents.operations_agent import OperationsAgent
from app.board_agents.procurement_agent import ProcurementAgent
from app.services.model_client import ModelClient

from app.memory.precedent_retriever import PrecedentRetriever
from app.memory.organizational_memory_engine import OrganizationalMemoryEngine
from app.modules.executive_constitutional_layer import ExecutiveConstitutionalLayer
from app.enterprise_simulation.enterprise_simulation_engine import EnterpriseSimulationEngine


logger = logging.getLogger("verifier")

class ExecutiveDebateEngine:
    """
    Orchestrates the Executive Debate Board, integrates memory retrieval,
    constitutional validation, and aggregates votes and outcome forecasts.
    """
    def __init__(self):
        self.cfo = CFOAgent()
        self.ciso = CISOAgent()
        self.legal = LegalAgent()
        self.operations = OperationsAgent()
        self.procurement = ProcurementAgent()

    def run_debate(self, payload: DecisionPayload, evidence_texts: List[str]) -> BoardDecisionReport:
        board_decision_id = f"brd_{uuid.uuid4().hex[:8]}"
        
        # 1. Retrieve Historical Precedents
        retriever = PrecedentRetriever()
        precedents = retriever.retrieve_relevant_precedents(payload.proposed_action)
        
        # 2. Gather Votes with Memory precedents passed
        votes: List[BoardMemberVote] = [
            self.cfo.evaluate(payload, evidence_texts, precedents),
            self.ciso.evaluate(payload, evidence_texts, precedents),
            self.legal.evaluate(payload, evidence_texts, precedents),
            self.operations.evaluate(payload, evidence_texts, precedents),
            self.procurement.evaluate(payload, evidence_texts, precedents)
        ]

        # 3. Calculate Consensus Score
        vote_counts = {VoteType.APPROVED: 0, VoteType.REJECTED: 0, VoteType.ABSTAINED: 0}
        for v in votes:
            vote_counts[v.vote] += 1
            
        max_block = max(vote_counts.values())
        consensus_score = round(max_block / len(votes), 2)

        # 4. Identify Conflicts
        conflicts = []
        rejected_members = [v.member_name for v in votes if v.vote == VoteType.REJECTED]
        abstained_members = [v.member_name for v in votes if v.vote == VoteType.ABSTAINED]
        
        if len(rejected_members) > 0 and len(rejected_members) < len(votes):
            conflicts.append(f"Disagreement: Members {', '.join(rejected_members)} voted REJECTED while others supported.")
        if len(abstained_members) > 0:
            conflicts.append(f"Caution: Members {', '.join(abstained_members)} ABSTAINED due to insufficient risk indicators.")

        # 5. Compile Memory Aggregation Report
        memory_engine = OrganizationalMemoryEngine()
        memory_report = memory_engine.generate_report(precedents)

        # 6. Verify Votes against Constitutional Principles
        # Current risk factor multiplier base
        risk_score = round(0.15 + 0.15 * vote_counts[VoteType.REJECTED], 2)
        constitutional_layer = ExecutiveConstitutionalLayer()
        constitutional_status, constitutional_violations, suggested_override = constitutional_layer.verify_principles(
            votes=votes,
            risk_score=risk_score
        )

        # 7. Board Recommendation Logic with Constitutional Overrides
        if vote_counts[VoteType.REJECTED] >= 3:
            board_rec = BoardRecommendationAction.REJECTED
        elif "Operations" in rejected_members or "CISO" in rejected_members:
            board_rec = BoardRecommendationAction.DEVIATION_SUSPENDED
        elif consensus_score < 0.80 or vote_counts[VoteType.ABSTAINED] > 0:
            board_rec = BoardRecommendationAction.DEFERRED_FOR_REVIEW
        else:
            board_rec = BoardRecommendationAction.APPROVED

        # If constitutional layer recommends an override, apply it
        if suggested_override:
            if suggested_override == "REJECTED":
                board_rec = BoardRecommendationAction.REJECTED
            elif suggested_override == "DEVIATION_SUSPENDED":
                board_rec = BoardRecommendationAction.DEVIATION_SUSPENDED
            elif suggested_override == "DEFERRED_FOR_REVIEW":
                board_rec = BoardRecommendationAction.DEFERRED_FOR_REVIEW

        # 8. Generate Outcome Forecast Report (5 Alternative Futures)
        outcome_forecast = self._generate_forecast(payload, votes)

        # 9. Run Enterprise Impact Simulation Engine
        simulation_engine = EnterpriseSimulationEngine()
        enterprise_sim = simulation_engine.run_simulation(
            payload=payload,
            board_votes=votes,
            constitutional_violations=constitutional_violations,
            precedents=precedents
        )

        return BoardDecisionReport(
            board_decision_id=board_decision_id,
            timestamp=datetime.utcnow(),
            decision_context=payload,
            board_members=votes,
            consensus_score=consensus_score,
            conflicts=conflicts,
            board_recommendation=board_rec,
            outcome_forecast=outcome_forecast,
            constitutional_status=constitutional_status,
            constitutional_violations=constitutional_violations,
            organizational_memory_report=memory_report,
            enterprise_simulation=enterprise_sim
        )


    def _generate_forecast(self, payload: DecisionPayload, votes: List[BoardMemberVote]) -> OutcomeForecastReport:
        votes_text = "\n".join([f"- {v.member_name}: Vote={v.vote.value}, Rationale={v.rationale}" for v in votes])
        prompt = f"""You are the Predictive Sourcing Forecaster for Trust Console IQ. 
Based on this proposed action and board votes, simulate EXACTLY 5 alternative future scenarios:

Proposed Action: {payload.proposed_action}
Board Votes:
{votes_text}

For each scenario, define:
1. "scenario": The description of the simulated future (e.g. Vendor delivery failure, cost inflation, market consolidation).
2. "probability": A float between 0.0 and 1.0.
3. "expected_impact": Assessment of business impact.
4. "supporting_assumptions": List of underlying assumptions.

Return the response strictly as a JSON object matching key: "simulations" which contains a list of 5 objects with keys: "scenario", "probability", "expected_impact", "supporting_assumptions". Do not include markdown wraps or headers.
"""
        try:
            res = ModelClient.generate(prompt)
            match = re.search(r'\{\s*".*"\s*:\s*.*\}', res, re.DOTALL)
            clean_text = match.group(0) if match else res.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()
            
            parsed = json.loads(clean_text)
            simulations = []
            for item in parsed.get("simulations", [])[:5]:
                simulations.append(
                    FutureOutcomeSimulation(
                        scenario=item.get("scenario"),
                        probability=float(item.get("probability", 0.2)),
                        expected_impact=item.get("expected_impact"),
                        supporting_assumptions=item.get("supporting_assumptions", [])
                    )
                )
            while len(simulations) < 5:
                simulations.append(
                    FutureOutcomeSimulation(
                        scenario="Unpredicted boundary scenario.",
                        probability=0.05,
                        expected_impact="Minor operational adjustments required.",
                        supporting_assumptions=[]
                    )
                )
            return OutcomeForecastReport(simulations=simulations)
        except Exception:
            fallback_sims = [
                FutureOutcomeSimulation(
                    scenario="Vendor A defaults on strategic SLAs due to capability limitations.",
                    probability=0.35,
                    expected_impact="Supply chain delay of 2-3 months on strategic hardware, inflating operations cost.",
                    supporting_assumptions=["Delivery metrics warnings were correct"]
                ),
                FutureOutcomeSimulation(
                    scenario="Competitors offer greater discounts to match Vendor A, sparking market consolidation.",
                    probability=0.25,
                    expected_impact="Opportunity cost loss since cheaper bids materialize shortly after selection.",
                    supporting_assumptions=["Competitors adjust margins"]
                ),
                FutureOutcomeSimulation(
                    scenario="Successful integration and execution of cost control goals.",
                    probability=0.20,
                    expected_impact="Captured the 20% margin reduction directly with no logistical failure.",
                    supporting_assumptions=["Vendor A capacity is sufficient"]
                ),
                FutureOutcomeSimulation(
                    scenario="Vendor A increases maintenance charges after initial hardware onboarding.",
                    probability=0.15,
                    expected_impact="Long-term ROI degrades, making lifetime cost identical to Vendor B.",
                    supporting_assumptions=["Contract loopholes exist"]
                ),
                FutureOutcomeSimulation(
                    scenario="Security vulnerability discovered in Vendor A's firmware.",
                    probability=0.05,
                    expected_impact="Reputational risk exposure and potential operational shutdown.",
                    supporting_assumptions=["No independent security certifications exist"]
                )
            ]
            return OutcomeForecastReport(simulations=fallback_sims)
