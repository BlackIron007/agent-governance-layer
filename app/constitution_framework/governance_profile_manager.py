from typing import Dict, Any

class GovernanceProfileManager:
    """
    Manages active governance profile presets and maps weights for evaluations.
    """
    def __init__(self):
        self._profiles = {
            "Conservative Enterprise": {
                "security_constitution": 0.35,
                "compliance_constitution": 0.35,
                "financial_constitution": 0.15,
                "sustainability_constitution": 0.15
            },
            "Balanced Enterprise": {
                "security_constitution": 0.25,
                "compliance_constitution": 0.25,
                "financial_constitution": 0.25,
                "sustainability_constitution": 0.25
            },
            "Growth Focused Enterprise": {
                "security_constitution": 0.15,
                "compliance_constitution": 0.15,
                "financial_constitution": 0.50,
                "sustainability_constitution": 0.20
            },
            "Highly Regulated Enterprise": {
                "security_constitution": 0.40,
                "compliance_constitution": 0.35,
                "financial_constitution": 0.15,
                "sustainability_constitution": 0.10
            }
        }

    def get_profile_weights(self, profile_name: str) -> Dict[str, float]:
        if profile_name not in self._profiles:
            # Fallback to Balanced Enterprise
            return self._profiles["Balanced Enterprise"]
        return self._profiles[profile_name]

    def get_all_profiles(self) -> Dict[str, Dict[str, float]]:
        return self._profiles
