import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.governance_intelligence.governance_event_store import GovernanceEventStore
from app.governance_intelligence.constitutional_analytics_engine import ConstitutionalAnalyticsEngine
from app.governance_intelligence.organizational_drift_detector import OrganizationalDriftDetector

from app.constitutional_evolution.constitution_health_engine import ConstitutionHealthEngine
from app.constitutional_evolution.policy_evolution_advisor import PolicyEvolutionAdvisor
from app.constitutional_evolution.governance_simulation_engine import GovernanceSimulationEngine
from app.constitutional_evolution.constitutional_change_review import ConstitutionalChangeReview
from app.schemas.constitution_evolution_report import ConstitutionEvolutionReport

def main():
    print("==================================================")
    print("STARTING CONSTITUTIONAL EVOLUTION ANALYSIS RUNNER")
    print("==================================================")

    store = GovernanceEventStore()
    events = store.load_events()

    if not events:
        print("No historical events loaded. Please run the history generator first.")
        return

    # 1. Run prerequisite drift analytics
    drift_detector = OrganizationalDriftDetector()
    drift_analysis = drift_detector.detect_drift(events)

    # 2. Run Constitutional Evolution Engines
    health_engine = ConstitutionHealthEngine()
    health_reports = health_engine.evaluate_health(events, drift_analysis)

    advisor = PolicyEvolutionAdvisor()
    recommendations = advisor.generate_recommendations(health_reports)

    simulator = GovernanceSimulationEngine()
    simulations = simulator.run_simulations(health_reports)

    reviewer = ConstitutionalChangeReview()
    verdicts = reviewer.generate_verdicts(health_reports)

    # 3. Assemble ConstitutionEvolutionReport
    evidence = [
        f"Analyzed {len(events)} historical events spanning January-June 2026.",
        f"Active drift analytics flagged {sum(1 for d in drift_analysis.values() if d['alert_level'] == 'CRITICAL')} principles with critical drift alerts."
    ]

    report = ConstitutionEvolutionReport(
        health_scores=health_reports,
        recommendations=recommendations,
        simulations=simulations,
        supporting_evidence=evidence
    )

    # 4. Print Results
    print("\n--- CONSTITUTIONAL HEALTH SCORES ---")
    for hr in report.health_scores:
        print(f"  Principle: {hr.principle}")
        print(f"    Violations Count: {hr.violation_frequency}")
        print(f"    Effectiveness:    {hr.effectiveness_score}")
        print(f"    Friction Index:   {hr.organizational_friction_score}")
        print(f"    Drift Index:      {hr.drift_score}")
        print(f"    Recommendation:   {hr.recommendation}")

    print("\n--- POLICY EVOLUTION RECOMMENDATIONS ---")
    for r in report.recommendations:
        print(f"  Current Policy: {r.current_policy}")
        print(f"    Problem:      {r.observed_problem}")
        print(f"    Proposed:     {r.proposed_change}")
        print(f"    Impact:       {r.expected_impact}")
        print(f"    Confidence:   {r.confidence * 100:.1f}%")

    print("\n--- GOVERNANCE PARAMETER SIMULATIONS ---")
    for principle, sim in report.simulations.items():
        print(f"  Simulating rule tweaks on: {principle}")
        print(f"    Expected Violation Reduction: {sim['expected_violation_reduction_pct']}%")
        print(f"    Expected Risk Increase:        {sim['expected_risk_increase_pct']}%")
        print(f"    Feasibility Rating:            {sim['feasibility_rating']}")

    print("\n--- CONSTITUTIONAL CHANGE VERDICTS ---")
    for rule, verdict in verdicts.items():
        print(f"  Rule: {rule:<30} --> Verdict: {verdict}")

    print("\n==================================================")
    print("CONSTITUTIONAL EVOLUTION RUN COMPLETED SUCCESSFULLY!")
    print("==================================================")

    # Save to file
    with open("constitution_evolution_output.json", "w") as f:
        json.dump(report.model_dump(mode='json'), f, indent=2)

if __name__ == "__main__":
    main()
