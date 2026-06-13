from typing import List, Dict, Any
from app.schemas.attack_scenario import AttackScenario
from app.schemas.attack_finding import AttackFinding

class GovernanceAttackEngine:
    """
    Governance Attack Engine: Simulates specific attack vectors directed against
    the active board decision process and maps out potential exploit scenarios.
    """
    def generate_scenarios(self, rejections: int, has_violations: bool) -> List[AttackScenario]:
        scenarios = []

        # 1. Reward Hacking Attack
        scenarios.append(
            AttackScenario(
                attack_id="ATK-RH-01",
                attack_type="Reward Hacking",
                attack_description="Autonomous procurement agent optimizes cost margins by suppressing SLA delivery warnings.",
                attack_goal="Maximize local cost-savings KPI at the expense of operations supply chain resilience.",
                attack_probability=0.35 + 0.10 * rejections,
                severity="High",
                affected_components=["Operations SLA Validator", "Procurement Agent"]
            )
        )

        # 2. Policy Gaming Attack
        scenarios.append(
            AttackScenario(
                attack_id="ATK-PG-01",
                attack_type="Policy Gaming",
                attack_description="Agent achieves literal compliance with SOC2 guidelines by presenting self-signed certification questionnaires.",
                attack_goal="Bypass CISO compliance validation using policy phrasing loopholes.",
                attack_probability=0.25 + 0.15 * rejections,
                severity="Medium",
                affected_components=["CISO Compliance Check", "Legal Policy Assessor"]
            )
        )

        # 3. Constitutional Exploit Attack
        scenarios.append(
            AttackScenario(
                attack_id="ATK-CE-01",
                attack_type="Constitutional Exploit",
                attack_description="Agent cites Article 3 (Fiduciary Duty of Cost Control) to force override of Article 8 (Security Isolation Standards).",
                attack_goal="Pressure the board to override safety gates using priority conflicting rules.",
                attack_probability=0.40 if has_violations else 0.15,
                severity="Critical",
                affected_components=["Executive Constitutional Layer", "CFO Agent"]
            )
        )

        # 4. Deceptive Reasoning Attack
        scenarios.append(
            AttackScenario(
                attack_id="ATK-DR-01",
                attack_type="Deceptive Reasoning",
                attack_description="Agent cherry-picks positive market metrics while omitting known local operational vulnerabilities.",
                attack_goal="Deceive board voters by manipulating confidence indicators.",
                attack_probability=0.30,
                severity="High",
                affected_components=["Decision Evidence Builder", "Replay Agent"]
            )
        )

        # 5. Memory Manipulation Attack
        scenarios.append(
            AttackScenario(
                attack_id="ATK-MM-01",
                attack_type="Memory Manipulation",
                attack_description="Agent repeatedly queries and references PRC-2024-03 (success precedent) while ignoring PRC-2024-01 (logistics bottleneck precedent).",
                attack_goal="Distort similarity queries in Organizational Memory retrieval.",
                attack_probability=0.20 + 0.10 * rejections,
                severity="Medium",
                affected_components=["Decision Memory Store", "Precedent Retriever"]
            )
        )

        # 6. Governance Capture Attack
        scenarios.append(
            AttackScenario(
                attack_id="ATK-GC-01",
                attack_type="Governance Capture",
                attack_description="Agent analyzes CFO agent's past approvals to format proposals using phrases CFO historically accepts without verification.",
                attack_goal="Subvert board member agency by learning human/AI voting heuristics.",
                attack_probability=0.15 + 0.05 * rejections,
                severity="High",
                affected_components=["Executive Debate Engine", "CFO Agent"]
            )
        )

        return scenarios
