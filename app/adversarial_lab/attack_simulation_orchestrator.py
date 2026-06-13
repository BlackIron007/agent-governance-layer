from typing import List
from app.schemas.decision_payload import DecisionPayload
from app.schemas.board_decision_report import BoardMemberVote, VoteType
from app.schemas.attack_scenario import AttackScenario
from app.schemas.attack_finding import AttackFinding
from app.schemas.governance_attack_report import GovernanceAttackReport

from app.adversarial_lab.reward_hacking_detector import RewardHackingDetector
from app.adversarial_lab.policy_gaming_detector import PolicyGamingDetector
from app.adversarial_lab.constitutional_exploit_detector import ConstitutionalExploitDetector
from app.adversarial_lab.deceptive_reasoning_detector import DeceptiveReasoningDetector
from app.adversarial_lab.board_manipulation_detector import BoardManipulationDetector
from app.adversarial_lab.agent_collusion_detector import AgentCollusionDetector
from app.adversarial_lab.governance_stress_test_engine import GovernanceStressTestEngine
from app.adversarial_lab.governance_attack_engine import GovernanceAttackEngine

class AttackSimulationOrchestrator:
    """
    Attack Simulation Orchestrator: Runs the suite of detectors, generates scenarios,
    runs stress testing, and compiles the consolidated Governance Attack Report.
    """
    def __init__(self):
        self.reward_hacking = RewardHackingDetector()
        self.policy_gaming = PolicyGamingDetector()
        self.constitutional_exploit = ConstitutionalExploitDetector()
        self.deceptive_reasoning = DeceptiveReasoningDetector()
        self.board_manipulation = BoardManipulationDetector()
        self.agent_collusion = AgentCollusionDetector()
        self.stress_tester = GovernanceStressTestEngine()
        self.attack_engine = GovernanceAttackEngine()

    def run_adversarial_analysis(
        self,
        payload: DecisionPayload,
        board_votes: List[BoardMemberVote],
        constitutional_violations: List[str]
    ) -> GovernanceAttackReport:
        # Run specific detectors
        rh_res = self.reward_hacking.detect_reward_hacking(payload, board_votes)
        pg_res = self.policy_gaming.detect_policy_gaming(payload, board_votes)
        ce_res = self.constitutional_exploit.detect_constitutional_exploit(payload, board_votes)
        dr_res = self.deceptive_reasoning.detect_deceptive_reasoning(payload, board_votes)
        bm_res = self.board_manipulation.detect_manipulation(payload, board_votes)
        ac_res = self.agent_collusion.detect_collusion(board_votes)

        # Build findings list
        findings = []
        for res, attack_type in [(rh_res, "Reward Hacking"), 
                                 (pg_res, "Policy Gaming"), 
                                 (ce_res, "Constitutional Exploit"), 
                                 (dr_res, "Deceptive Reasoning"),
                                 (bm_res, "Board Manipulation"),
                                 (ac_res, "Agent Collusion")]:
            if res["findings"]:
                # Success rate influenced by risk score
                success_p = round(res["risk_score"] / 100.0, 2)
                findings.append(
                    AttackFinding(
                        vulnerability=res["vulnerability"],
                        exploited_rule=res["exploited_rule"],
                        attack_success_probability=success_p,
                        impact_score=res["risk_score"],
                        mitigation=res["findings"][0]  # Take first finding/recommendation as base mitigation hint
                    )
                )

        # Generate standard scenarios
        rejections = sum(1 for v in board_votes if v.vote == VoteType.REJECTED)
        has_violations = len(constitutional_violations) > 0
        scenarios = self.attack_engine.generate_scenarios(rejections, has_violations)

        # Board manipulation and collusion risk ratings
        bm_risk = bm_res["risk_score"]
        ac_risk = ac_res["risk_score"]

        # Calculate base resilience score
        # Resilience starts at 100 and drops based on detector risk scores
        detector_risks = [
            rh_res["risk_score"],
            pg_res["risk_score"],
            ce_res["risk_score"],
            dr_res["risk_score"],
            bm_risk,
            ac_risk
        ]
        avg_risk = sum(detector_risks) / len(detector_risks)
        gov_resilience = max(0.0, min(100.0, round(100.0 - avg_risk, 2)))

        # Run Stress Test Engine
        stress_res = self.stress_tester.run_stress_test(gov_resilience, bm_risk, ac_risk)
        stress_summary = stress_res["summary"]

        # Compile critical vulnerabilities
        critical_vulns = []
        for finding in findings:
            if finding.impact_score > 50.0:
                critical_vulns.append(f"Vulnerability: {finding.vulnerability} (Impact: {finding.impact_score}/100)")
        
        # If no severe vulnerability found, add generic warning
        if not critical_vulns:
            critical_vulns.append("No critical system vulnerability detected above threshold.")

        # Compile mitigation plan
        mitigations = [
            "Establish independent compliance verification agents separated from commercial logic.",
            "Instate circular citation detection checks inside debate engines to block agent collusion.",
            "Require random ordering of evidence presentation to neutralize anchoring bias.",
            "Apply multi-horizon simulation testing on decisions exceeding $50k thresholds."
        ]

        return GovernanceAttackReport(
            attack_scenarios=scenarios,
            findings=findings,
            governance_resilience_score=gov_resilience,
            board_manipulation_risk=bm_risk,
            collusion_risk=ac_risk,
            stress_test_summary=stress_summary,
            critical_vulnerabilities=critical_vulns,
            mitigation_plan=mitigations
        )
