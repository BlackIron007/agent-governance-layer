import os
import json
import logging
from typing import List
from app.schemas.governance_event import GovernanceEvent

logger = logging.getLogger("verifier")

class GovernanceEventStore:
    """
    Manages loading and saving governance events to local files.
    """
    def __init__(self, file_path: str = "data/governance_history.json"):
        self.file_path = file_path
        # Ensure directories exist
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)

    def save_event(self, event: GovernanceEvent):
        events = self.load_events()
        events.append(event)
        
        # Write back to file
        try:
            with open(self.file_path, "w") as f:
                json.dump([e.model_dump(mode='json') for e in events], f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save event to store: {e}")

    def load_events(self) -> List[GovernanceEvent]:
        if not os.path.exists(self.file_path):
            return []
            
        try:
            with open(self.file_path, "r") as f:
                data = json.load(f)
                return [GovernanceEvent(**item) for item in data]
        except Exception as e:
            logger.error(f"Failed to load events from store: {e}")
            return []
