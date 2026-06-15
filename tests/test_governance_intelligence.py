import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.governance_intelligence.governance_event_store import GovernanceEventStore
from app.governance_intelligence.constitutional_analytics_engine import ConstitutionalAnalyticsEngine
from app.governance_intelligence.agent_risk_profiler import AgentRiskProfiler
from app.governance_intelligence.organizational_drift_detector import OrganizationalDriftDetector
from app.governance_intelligence.governance_insights_engine import GovernanceInsightsEngine
from app.schemas.governance_intelligence_report import GovernanceIntelligenceReport

def main():
    print("==================================================")
    print("STARTING GOVERNANCE INTELLIGENCE ANALYTICS RUNNER")
    print("==================================================")

    store = GovernanceEventStore()
    events = store.load_events()
    
    if not events:
        print("No events found. Generating history first...")
        from scratch.generate_governance_history import generate_history
        generate_history()
        events = store.load_events()

    print(f"Loaded {len(events)} governance events from store.")

    # 1. Execute analytics engines
    analytics_engine = ConstitutionalAnalyticsEngine()
    analytics = analytics_engine.analyze_violations(events)

    profiler = AgentRiskProfiler()
    risk_rankings = profiler.profile_agents(events)

    drift_detector = OrganizationalDriftDetector()
    drift = drift_detector.detect_drift(events)

    insights_engine = GovernanceInsightsEngine()
    executive_findings = insights_engine.generate_insights(events, analytics, risk_rankings, drift)

    # 2. Package as GovernanceIntelligenceReport
    report = GovernanceIntelligenceReport(
        constitutional_analytics=analytics,
        risk_rankings=risk_rankings,
        drift_analysis=drift,
        executive_findings=executive_findings
    )

    # 3. Print Results
    print("\n--- TOP CONSTITUTIONAL VIOLATIONS ---")
    summaries = report.constitutional_analytics["rule_summaries"]
    for rule, data in summaries.items():
        print(f"  Rule:   {rule}")
        print(f"    Violations: {data['violations_count']}")
        print(f"    Trend:      {data['trend']}")
        print(f"    Severity:   {data['severity']}")

    print("\n--- RISKIEST AI AGENTS ---")
    for profile in report.risk_rankings:
        print(f"  Agent:   {profile['agent_id']}")
        print(f"    Avg Risk:    {profile['average_risk']}")
        print(f"    Rejections:  {profile['rejection_ratio_pct']}%")
        print(f"    Violations:  {profile['constitutional_violations_count']}")
        print(f"    Trend:       {profile['risk_trend']}")

    print("\n--- ALIGNMENT DRIFT ALERTS ---")
    for rule, metrics in report.drift_analysis.items():
        print(f"  Rule:   {rule}")
        print(f"    Drift Score: {metrics['drift_score']}")
        print(f"    Alert Level: {metrics['alert_level']}")
        print(f"    Trend Logs:  {metrics['monthly_trend']}")

    print("\n--- EXECUTIVE GOVERNANCE INSIGHTS ---")
    for finding in report.executive_findings:
        print(f"  • {finding}")

    print("\n==================================================")
    print("GOVERNANCE INTELLIGENCE RUN COMPLETED SUCCESSFULLY!")
    print("==================================================")

    # Save to file
    with open("governance_intelligence_output.json", "w") as f:
        json.dump(report.model_dump(mode='json'), f, indent=2)

if __name__ == "__main__":
    main()
