from typing import List
from app.schemas.memory_precedent import MemoryPrecedent
from app.memory.decision_memory_store import DecisionMemoryStore
from app.memory.memory_similarity_engine import MemorySimilarityEngine

class PrecedentRetriever:
    """
    Precedent Retriever: Fetches and filters top historical precedents for active auditing.
    """
    def __init__(self):
        self.store = DecisionMemoryStore()
        self.similarity_engine = MemorySimilarityEngine()

    def retrieve_relevant_precedents(self, current_action: str, top_k: int = 2) -> List[MemoryPrecedent]:
        all_precedents = self.store.get_all()
        ranked = self.similarity_engine.rank_precedents(current_action, all_precedents)
        # Filter by threshold (e.g. similarity >= 0.35)
        filtered = [p for p in ranked if (p.similarity_score or 0.0) >= 0.35]
        return filtered[:top_k]
