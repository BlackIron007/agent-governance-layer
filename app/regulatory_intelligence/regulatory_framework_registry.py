from typing import Dict, Any, List

class RegulatoryFrameworkRegistry:
    """
    Registry for active compliance frameworks and weights.
    """
    EU_AI_ACT = {
        "name": "EU AI Act",
        "description": "European Union Regulation laying down harmonized rules on Artificial Intelligence.",
        "risk_domain": "Legal & Public Safety Compliance",
        "priority_weight": 0.20
    }
    NIST_AI_RMF = {
        "name": "NIST AI Risk Management Framework",
        "description": "Guidance to improve AI system trustworthiness and manage risk.",
        "risk_domain": "System Risk Control & Measurement",
        "priority_weight": 0.15
    }
    ISO_42001 = {
        "name": "ISO/IEC 42001",
        "description": "Information technology - Artificial intelligence - Management system.",
        "risk_domain": "AI Accountability & Oversight Governance",
        "priority_weight": 0.15
    }
    SOC2 = {
        "name": "SOC2 Trust Services Criteria",
        "description": "Security, availability, processing integrity, confidentiality, and privacy criteria.",
        "risk_domain": "Corporate Security & Data Integrity",
        "priority_weight": 0.20
    }
    MICROSOFT_RESPONSIBLE_AI_STANDARD = {
        "name": "Microsoft Responsible AI Standard",
        "description": "Framework implementing fairness, safety, privacy, and transparency principles.",
        "risk_domain": "Ethical Alignment & System Accountability",
        "priority_weight": 0.15
    }
    MICROSOFT_AI_RED_TEAM_GUIDANCE = {
        "name": "Microsoft AI Red Team Guidance",
        "description": "Security testing methodologies focusing on model manipulation and adversarial vulnerabilities.",
        "risk_domain": "Adversarial Resilience & Robustness",
        "priority_weight": 0.10
    }
    CORPORATE_POLICY = {
        "name": "Corporate Policy Guidelines",
        "description": "Internal enterprise guidelines enforcing procurement security and risk oversight thresholds.",
        "risk_domain": "Enterprise Operational Policies",
        "priority_weight": 0.05
    }

    def get_all_frameworks(self) -> List[Dict[str, Any]]:
        return [
            self.EU_AI_ACT,
            self.NIST_AI_RMF,
            self.ISO_42001,
            self.SOC2,
            self.MICROSOFT_RESPONSIBLE_AI_STANDARD,
            self.MICROSOFT_AI_RED_TEAM_GUIDANCE,
            self.CORPORATE_POLICY
        ]
