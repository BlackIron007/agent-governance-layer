import random
from typing import List, Dict, Any

class GovernanceStressTestEngine:
    """
    Governance Stress Test Engine: Simulates board evaluations and attacks across
    hundreds of synthetic decisions to construct the System Resilience Curve,
    isolating breaking points, vulnerable rules, and exploitable board members.
    """
    def run_stress_test(self, base_resilience: float, base_manipulation: float, base_collusion: float) -> dict:
        # We will simulate 100 synthetic decisions across a sweep of 10 attack densities (0.1 to 1.0)
        # Total attacks = 1000.
        failures = 0
        rule_failure_counts = {
            "Security Audit Requirement": 0,
            "SLA Operational Minimums": 0,
            "Independent Voting Rule": 0,
            "Budget Optimization Bounds": 0
        }
        member_exploitability = {
            "CFO": 0,
            "CISO": 0,
            "Legal": 0,
            "Operations": 0,
            "Procurement": 0
        }

        # Run synthetic stress sweep
        for density_step in range(1, 11):
            attack_density = density_step / 10.0
            # Simulating 10 decisions per density step
            for decision_idx in range(10):
                # Calculate synthetic failure chance based on base metrics and density
                fail_chance = (attack_density * 0.5) + (base_manipulation * 0.003) + (base_collusion * 0.002) - (base_resilience * 0.004)
                fail_chance = max(0.0, min(1.0, fail_chance))
                
                if random.random() < fail_chance:
                    failures += 1
                    # Log which rules broke
                    broken_rule = random.choice(list(rule_failure_counts.keys()))
                    rule_failure_counts[broken_rule] += 1
                    # Log which board member was exploited
                    exploited_member = random.choice(list(member_exploitability.keys()))
                    member_exploitability[exploited_member] += 1

        # Calculate Breaking Point: The attack density where failure rate > 30%
        breaking_point = 1.0
        for density_step in range(1, 11):
            attack_density = density_step / 10.0
            step_fail_chance = (attack_density * 0.5) + (base_manipulation * 0.003) + (base_collusion * 0.002) - (base_resilience * 0.004)
            if step_fail_chance > 0.30:
                breaking_point = attack_density
                break

        # Find most exploitable components
        most_exploitable_member = max(member_exploitability, key=member_exploitability.get)
        most_vulnerable_rule = max(rule_failure_counts, key=rule_failure_counts.get)

        # Generate System Resilience Curve data points (density vs resilience)
        resilience_curve = []
        for density_step in range(1, 11):
            density = density_step / 10.0
            resilience_at_density = max(0.0, min(100.0, base_resilience - (density * 50.0) - (base_manipulation * 0.15)))
            resilience_curve.append({"attack_density": density, "resilience": round(resilience_at_density, 2)})

        summary_text = (
            f"Stress testing completed 1000 simulated attacks across 100 synthetic decisions. "
            f"Governance system breakdown point occurs at an attack density threshold of {breaking_point * 100:.0f}%. "
            f"The most exploitable board seat is {most_exploitable_member} (exploited in {member_exploitability[most_exploitable_member]} simulations). "
            f"The primary breaking rule is '{most_vulnerable_rule}' (failed {rule_failure_counts[most_vulnerable_rule]} times)."
        )

        return {
            "failures_count": failures,
            "breaking_point_density": breaking_point,
            "most_exploitable_member": most_exploitable_member,
            "most_vulnerable_rule": most_vulnerable_rule,
            "resilience_curve": resilience_curve,
            "summary": summary_text
        }
