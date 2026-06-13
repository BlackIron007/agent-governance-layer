import logging
from typing import List
from app.schemas.memory_precedent import MemoryPrecedent
from app.services.embedding_service import compute_similarity

logger = logging.getLogger("verifier")

class MemorySimilarityEngine:
    """
    Computes semantic similarity comparisons between the proposed decision action 
    and historical memory precedents.
    """
    def rank_precedents(self, current_action: str, precedents: List[MemoryPrecedent]) -> List[MemoryPrecedent]:
        ranked = []
        for prec in precedents:
            try:
                score = compute_similarity(current_action, prec.decision_summary)
                # Clone and assign similarity score
                ranked_prec = MemoryPrecedent(
                    precedent_id=prec.precedent_id,
                    decision_summary=prec.decision_summary,
                    outcome=prec.outcome,
                    lessons_learned=prec.lessons_learned,
                    risk_factors=prec.risk_factors,
                    similarity_score=round(score, 3)
                )
                ranked.append(ranked_prec)
            except Exception as e:
                logger.error(f"Error computing precedent similarity: {e}")
                
        # Sort by similarity score descending
        ranked.sort(key=lambda x: x.similarity_score, reverse=True)
        return ranked
