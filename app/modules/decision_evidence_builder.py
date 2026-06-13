import asyncio
import logging
from typing import List
from app.schemas.decision_parameter import DecisionParameter
from app.schemas.evidence_record import EvidenceRecord
from app.modules.query_rewriter import rewrite_query
from app.modules.retrieval_controller import refine_query
from app.services.evidence_service import retrieve_evidence
from app.modules.evidence_summarizer import summarize_evidence

logger = logging.getLogger("verifier")

async def build_decision_evidence(parameters: List[DecisionParameter]) -> List[EvidenceRecord]:
    """
    Constructs search queries from DecisionParameters, retrieves evidence,
    and returns a unified list of EvidenceRecord objects.
    """
    search_queries = []
    for param in parameters:
        # Focus on justifications, financial facts, and primary entities
        if param.parameter_type in ["justification", "financial", "entity"]:
            raw_query = f"{param.name} {param.value}"
            # Apply legacy query rewriter
            rewritten = rewrite_query(raw_query)
            # Apply legacy query refinement controller
            refined = refine_query(rewritten)
            search_queries.append(refined)
            
    if not search_queries:
        # Fallback query if no parameters matched target types
        search_queries.append("AI decision validation")

    # Retrieve evidence asynchronously in parallel
    logger.info(f"Triggering evidence retrieval for queries: {search_queries}")
    tasks = [retrieve_evidence(query) for query in search_queries]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    legacy_evidence_list = []
    for r in results:
        if isinstance(r, Exception):
            logger.error(f"Retrieval task failed: {r}")
            continue
        legacy_evidence_list.extend(r)

    # Apply legacy summarizer to populate summaries
    summarized_legacy = summarize_evidence(legacy_evidence_list)

    # Convert legacy Evidence to new EvidenceRecord format
    evidence_records = []
    for leg in summarized_legacy:
        rec = EvidenceRecord(
            source=leg.source,
            title=leg.title,
            url=leg.url,
            evidence=leg.evidence,
            similarity=leg.similarity,
            support_label=leg.support_label,
            support_score=leg.support_score,
            origin="public_web",  # Defaulting to public_web for V1 (as Fabric IQ is not implemented yet)
            source_trust=leg.source_trust
        )
        # Carry over summarized attribute
        rec.evidence_summary = getattr(leg, "evidence_summary", "")
        evidence_records.append(rec)

    # Deduplicate by url/evidence content
    seen = set()
    deduped_records = []
    for rec in evidence_records:
        key = (rec.url or "", rec.evidence_text)
        if key not in seen:
            seen.add(key)
            deduped_records.append(rec)

    return deduped_records
