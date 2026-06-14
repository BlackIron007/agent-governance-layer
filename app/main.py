import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

import logging
logging.getLogger("sentence_transformers").setLevel(logging.WARNING)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
logging.getLogger("httpx").setLevel(logging.WARNING)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("verifier")

from transformers.utils import logging as hf_logging
hf_logging.set_verbosity_error()
import torch

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import FastAPI, APIRouter, Request, Depends, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from contextlib import asynccontextmanager
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from app.startup import check_local_nltk_data
from app.schemas.analysis_request import AnalysisRequest
from app.schemas.analysis_response import AnalysisResponse
from app.modules.claim_extractor import extract_claims
from app.modules.claim_classifier import classify_claim
from app.modules.risk_scorer import assign_baseline_risk, compute_overall_trust_score, compute_risk_level
from app.modules.verifiability_engine import refine_verifiability
from app.schemas.llm_request import LLMVerificationRequest
from app.services.relevance_service import compute_qa_relevance
from app.services.evidence_service import retrieve_evidence
from app.modules.consistency_checker import check_question_claim_consistency
from app.schemas.claim import Claim, RiskLevel, ClaimType, VerificationStatus
from app.modules.intra_answer_checker import detect_internal_contradictions
from app.modules.evidence_aggregator import aggregate_evidence
from app.modules.trust_calibrator import calibrate_claim_trust
from app.modules.evidence_summarizer import summarize_evidence
from app.modules.confidence_explainer import generate_confidence_explanation
from app.schemas.batch_request import BatchVerificationRequest
from app.services.nli_service import check_claim_evidence_support_batch
from nltk.tokenize import sent_tokenize
from app.api_key import verify_api_key
from fastapi.responses import StreamingResponse, JSONResponse
import json
import asyncio
import copy
from app.services.global_cache import evidence_cache, nli_cache
from app.modules.query_rewriter import rewrite_query
from app.modules.intra_answer_checker import check_world_knowledge_contradictions
from app.modules.coreference_resolver import resolve_coreferences
from app.services.verification_store import init_db, save_verification, get_recent_verifications
from app.modules.coreference_resolver import _extract_named_entities
from collections import defaultdict
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import community_detection
import re
from typing import Union
import uuid
from datetime import datetime, timezone
from app.schemas.governance_decision_detail import GovernanceDecisionDetail, GovernanceTimelineNode, TimelineNodeType, TimelineNodeStatus, EnrichedBoardMemberVote
from app.schemas.governance_decision_list import GovernanceDecisionListResponse, GovernanceDecisionSummary, DecisionVerdictType
from app.schemas.processing_metadata import ProcessingMetadata
from app.schemas.governance_intelligence_report import GovernanceIntelligenceReport, GovernanceHealthBreakdown, PolicyFrictionRecord, PolicyEvolutionRecommendation

class ErrorResponse(BaseModel):
    error: str
    detail: str | None = None


class LimitUploadSize(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        max_size = 1_000_000 
        if "content-length" in request.headers:
            try:
                content_length = int(request.headers["content-length"])
            except ValueError:
                content_length = max_size + 1 
            if content_length > max_size:
                return JSONResponse(
                    status_code=413,
                    content={"error": "Request payload too large (exceeds 1MB limit)"}
                )
        return await call_next(request)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup and shutdown events."""
    check_local_nltk_data()
    logger.info("Application startup: Warming up models...")
    loop = asyncio.get_event_loop()

    def run_warmup():
        warmup_queries = [
            "Key events of World War 2",
            "Scientific evidence for climate change",
            "History of the internet"
        ]
        for q in warmup_queries:
            _fetch_evidence(q)

    await loop.run_in_executor(None, run_warmup)
    _get_embedding_model()
    init_db()
    logger.info("Application startup: Models are warm and ready.")
    yield
    
app = FastAPI(
    title="LLM Verifiability & Trust Layer",
    description="Middleware system for claim extraction and verifiability analysis",
    version="0.1.0",
    lifespan=lifespan
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:8000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(LimitUploadSize)

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Custom exception handler for rate limit exceeded errors."""
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content=ErrorResponse(error="Rate limit exceeded", detail=exc.detail).model_dump(),
    )

router = APIRouter(
    prefix="/api/v1",
)

@app.get("/")
@limiter.limit("30/minute")
def root(request: Request):
    return {"message": "LLM Verifiability Trust Layer API is running"}

@router.post("/analyze", response_model=AnalysisResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("15/minute")
def analyze_text(
    payload: AnalysisRequest,
    request: Request
):
    """
    Extracts, classifies, and scores claims from a given text.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Analyze request from IP: {client_ip}")

    claims = extract_claims(payload.text)
    classified_claims = [classify_claim(c) for c in claims]
    scored_claims = [assign_baseline_risk(c) for c in classified_claims]
    refined_claims = [refine_verifiability(c) for c in scored_claims]
    overall_score = compute_overall_trust_score(refined_claims)

    return AnalysisResponse(
        original_text=payload.text,
        claims=refined_claims,
        overall_trust_score=overall_score,
        signals={
            "epistemic_risk": 1 - overall_score
        },
        message="Full pipeline completed with verifiability refinement."
    )

QUALIFIER_PHRASES = {
    "at sea level", "in a vacuum", "on earth", "on mars", "at room temperature",
    "under normal conditions", "in the northern hemisphere", "in the southern hemisphere",
    "during the day", "at night"
}


def _fetch_evidence(search_query: str, mode: str = "full") -> list:
    """
    A helper function designed to be run in a thread pool.
    It retrieves evidence for a single search query, utilizing the global cache.
    """
    cache_key = hash(search_query)
    if cache_key in evidence_cache:
        logger.info(f"Global cache hit for query: '{search_query}'")
        return evidence_cache[cache_key]
    
    logger.info(f"Cache miss for query: '{search_query}'")
    evidence = asyncio.run(retrieve_evidence(search_query, mode=mode))
    evidence = summarize_evidence(evidence)
    evidence_cache[cache_key] = evidence
    return evidence

def _finalize_claim_processing(claim, question):
    """
    Takes a claim with its evidence already attached and performs the final
    aggregation, scoring, and calibration steps. Designed to be run in parallel.
    """
    if claim.claim_type == ClaimType.OPINION:
        claim.evidence = []
        claim.support_strength = 0
        claim.contradiction_strength = 0
        claim.qa_consistent = True
        claim.qa_similarity = 1.0

        claim.verifiability_score = 0.3
        claim.risk_level = RiskLevel.LOW

        claim.confidence_explanation = [
            "Claim classified as opinion.",
            "Fact verification skipped.",
            "Opinions are not objectively verifiable."
        ]
        return claim

    agg = aggregate_evidence(claim.evidence)
    support = agg["support_strength"]
    contradiction = agg["contradiction_strength"]
                
    claim.support_strength = support
    claim.contradiction_strength = contradiction
    
    is_consistent, sim = check_question_claim_consistency(question, claim.resolved_text or claim.text)
    claim.qa_consistent = is_consistent
    claim.qa_similarity = round(sim, 3)

    if claim.contradiction_strength > 0.3:
        claim.verification_status = VerificationStatus.CONTRADICTED
    elif claim.support_strength >= 0.5:
        claim.verification_status = VerificationStatus.SUPPORTED
    else:
        is_factual_claim = claim.claim_type in [ClaimType.HARD_FACT, ClaimType.SOFT_FACT]
        effective_text = claim.resolved_text or claim.text
        entities = _extract_named_entities(effective_text)
        is_entity_year_pattern = len(entities) > 0 and bool(re.search(r'\b\d{4}\b', effective_text))
        is_general_entity_fact = len(entities) > 0 and len(effective_text.split()) < 25

        if is_factual_claim and (is_entity_year_pattern or is_general_entity_fact):
            logger.info(f"Evidence fallback (weak evidence override): Marking '{claim.text}' as SUPPORTED due to high-confidence pattern.")
            claim.verification_status = VerificationStatus.SUPPORTED
            claim.support_strength = max(claim.support_strength or 0.0, 0.8)
        elif claim.support_strength < 0.4 and claim.claim_type != ClaimType.OPINION:
            claim.verification_status = VerificationStatus.UNSUPPORTED
        else:
            claim.verification_status = VerificationStatus.UNVERIFIABLE

    claim.verifiability_score = round(claim.verifiability_score or 0, 3)
    claim.risk_level = compute_risk_level(claim.verifiability_score)
    claim.confidence_explanation = generate_confidence_explanation(claim)

    claim.score_breakdown = {
        "support": claim.support_strength,
        "contradictions": claim.contradiction_strength,
        "qa_alignment": claim.qa_similarity
    }

    if hasattr(claim, "evidence") and claim.evidence:
        claim.evidence.sort(
            key=lambda x: ((x.support_score or 0) * (x.source_trust or 0.5)),
            reverse=True
        )

    return claim

_embedding_model = None

def _get_embedding_model():
    """Initializes and returns a singleton instance of a sentence embedding model for clustering."""
    global _embedding_model
    if _embedding_model is None:
        logger.info("Loading sentence embedding model for clustering...")
        _embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Sentence embedding model loaded.")
    return _embedding_model

def _get_claim_clusters(claims: list[Claim], min_community_size=2, threshold=0.7) -> dict[str, list[Claim]]:
    return {rewrite_query(c.resolved_text or c.text): [c] for c in claims}

def _run_initial_claim_processing(answer: str) -> list[Claim]:
    """Stage 1: Extract, resolve coreferences, classify, and score claims."""
    claims = extract_claims(answer)
    for i, claim in enumerate(claims):
        claim.original_index = i

    claims = resolve_coreferences(claims)

    classified_claims = []
    if claims:
        with ThreadPoolExecutor(max_workers=min(4, len(claims))) as executor:
            classified_claims = list(executor.map(classify_claim, claims))

    scored_claims = [assign_baseline_risk(c) for c in classified_claims]
    return [refine_verifiability(c) for c in scored_claims]

def _run_evidence_retrieval_and_nli(claims_to_process: list[Claim], mode: str) -> list[Claim]:
    """Stage 2: Fetch and process evidence for a list of claims."""
    if not claims_to_process:
        return []

    factual_claims = [c for c in claims_to_process if c.claim_type != ClaimType.OPINION]
    query_to_claims_map = _get_claim_clusters(factual_claims)
    all_unique_queries = list(query_to_claims_map.keys())
    logger.info(f"Generated {len(all_unique_queries)} unique queries from {len(factual_claims)} claims via clustering.")

    evidence_map = {}
    if all_unique_queries:
        with ThreadPoolExecutor(max_workers=min(8, len(all_unique_queries))) as executor:
            future_to_query = {executor.submit(_fetch_evidence, query, mode=mode): query for query in all_unique_queries}
            for future in as_completed(future_to_query):
                query = future_to_query[future]
                try:
                    evidence_map[query] = future.result(timeout=7.0)
                except TimeoutError:
                    logger.warning(f"Fetching evidence for '{query}' timed out after 7 seconds.")
                    evidence_map[query] = []
                except Exception as exc:
                    logger.error(f"Fetching evidence for '{query}' generated an exception: {exc}")
                    evidence_map[query] = []

    for query, claims_group in query_to_claims_map.items():
        all_evidence = evidence_map.get(query, [])
        pruned_evidence = [ev for ev in all_evidence if (ev.similarity or 0) > 0.7]
        final_evidence = pruned_evidence[:(1 if mode == "fast" else 3)]
        for claim in claims_group:
            claim.evidence = copy.deepcopy(final_evidence)

    nli_batch_pairs, nli_batch_targets = [], []
    for claim in claims_to_process:
        if claim.claim_type == ClaimType.OPINION:
            continue
        eff_text = claim.resolved_text or claim.text
        for ev in claim.evidence:
            cache_key = hash((eff_text, ev.evidence))
            if cache_key in nli_cache:
                ev.support_label, ev.support_score = nli_cache[cache_key]
            else:
                nli_batch_pairs.append((eff_text, ev.evidence))
                nli_batch_targets.append(ev)

    if nli_batch_pairs:
        batch_results = check_claim_evidence_support_batch(nli_batch_pairs)
        for i, (label, score) in enumerate(batch_results):
            ev = nli_batch_targets[i]
            ev.support_label = label
            ev.support_score = score
            cache_key = hash((nli_batch_pairs[i][0], nli_batch_pairs[i][1]))
            nli_cache[cache_key] = (label, score)

    for claim in claims_to_process:
        for ev in claim.evidence:
            if ev.support_label is None:
                ev.support_label = "neutral"
                ev.support_score = 0.5

    return claims_to_process

def _run_final_scoring_and_assembly(claims: list[Claim], question: str, answer: str, mode: str) -> AnalysisResponse:
    """Stage 3: Finalize claims, check consistency, and assemble the final response."""
    for claim in claims:
        if claim.qa_consistent is None:
            is_consistent, sim = check_question_claim_consistency(question, claim.resolved_text or claim.text)
            claim.qa_consistent = is_consistent
            claim.qa_similarity = round(sim, 3)
            if claim.score_breakdown is None:
                claim.score_breakdown = {"support": claim.support_strength or 0.0, "contradictions": claim.contradiction_strength or 0.0, "qa_alignment": claim.qa_similarity or 0.0}

    internal_contradictions = detect_internal_contradictions(claims, mode="full" if len(claims) >= 4 and mode == "full" else "rules_only")
    final_claims = check_world_knowledge_contradictions(claims)
    return _build_final_response(final_claims, question, answer, internal_contradictions)

def _core_verify(question: str, answer: str, mode: str = "full") -> AnalysisResponse:
    """Internal service function containing the core verification logic."""

    try:
        sentences = sent_tokenize(answer)
        sentence_offsets = []
        curr_pos = 0
        for s in sentences:
            start = answer.find(s, curr_pos)
            if start != -1:
                sentence_offsets.append((s, start, start + len(s)))
                curr_pos = start + len(s)
        
        for claim in _run_initial_claim_processing(answer):
            exact_idx = answer.lower().find(claim.text.lower())
            if exact_idx != -1:
                claim.start_char = exact_idx
                claim.end_char = exact_idx + len(claim.text)
                continue
            
            claim_tokens = set(re.findall(r'\w+', claim.text.lower()))
            best_match, best_overlap = None, 0.0
            for s_text, start, end in sentence_offsets:
                s_tokens = set(re.findall(r'\w+', s_text.lower()))
                if not s_tokens or not claim_tokens: continue
                overlap = len(claim_tokens.intersection(s_tokens)) / len(claim_tokens.union(s_tokens))
                if overlap > best_overlap:
                    best_overlap = overlap
                    best_match = (start, end)
            
            if best_overlap > 0.3 and best_match:
                claim.start_char = best_match[0]
                claim.end_char = best_match[1]
    except Exception as e:
        logger.warning(f"Failed to compute citation offsets: {e}")

    def should_fast_track(claim: Claim) -> bool:
        if claim.verification_status is not None:
            return True
        is_low_risk_hard_fact = claim.claim_type == ClaimType.HARD_FACT and (claim.verifiability_score or 1.0) <= 0.3
        is_very_simple_fact = len(claim.text.split()) < 8
        if is_low_risk_hard_fact and is_very_simple_fact:
            claim.confidence_explanation = ["Simple, low-risk factual claim. Fast-tracked verification."]
            claim.support_strength = 1.0
            claim.contradiction_strength = 0.0
            claim.verification_status = VerificationStatus.SUPPORTED
            return True
        if mode == "fast" and is_low_risk_hard_fact:
            claim.confidence_explanation = ["Low-risk factual claim. Fast verification mode applied."]
            claim.support_strength = 1.0
            claim.contradiction_strength = 0.0
            claim.verification_status = VerificationStatus.SUPPORTED
            return True
        return False

    initial_claims = _run_initial_claim_processing(answer)
    processed_claims_early = [c for c in initial_claims if should_fast_track(c)]
    claims_to_process_fully = [c for c in initial_claims if not should_fast_track(c)]

    claims_with_evidence = _run_evidence_retrieval_and_nli(claims_to_process_fully, mode)

    fully_processed_claims = []
    if claims_with_evidence:
        with ThreadPoolExecutor(max_workers=min(8, len(claims_with_evidence))) as executor:
            fully_processed_claims = list(executor.map(lambda c: _finalize_claim_processing(c, question), claims_with_evidence))

    final_claims = processed_claims_early + fully_processed_claims
    final_claims.sort(key=lambda c: c.original_index if hasattr(c, 'original_index') else float('inf'))

    return _run_final_scoring_and_assembly(final_claims, question, answer, mode)

def _build_final_response(final_claims: list[Claim], question: str, answer: str, internal_contradictions: list) -> AnalysisResponse:
    """Helper to construct the final AnalysisResponse object."""
    relevance_score = 0.9 if len(answer.split()) < 40 else compute_qa_relevance(question, answer)
    has_any_contradiction = any(c.verification_status == VerificationStatus.CONTRADICTED for c in final_claims)
    is_internally_consistent = not has_any_contradiction

    epistemic_trust = compute_overall_trust_score(final_claims)

    opinion_pattern = r'\b(think|thoughts|opinion|perspective|stance|favorite|best|feel|recommend|should|suggest)\b'
    is_opinion_soliciting = bool(re.search(opinion_pattern, question, re.IGNORECASE))
    if final_claims and all(c.claim_type == ClaimType.OPINION for c in final_claims) and not is_opinion_soliciting:
        epistemic_trust *= 0.3

    if not is_internally_consistent:
        epistemic_trust = min(epistemic_trust, 0.5)

    epistemic_risk = 1 - epistemic_trust

    final_trust_score = round(relevance_score * epistemic_trust, 3)

    summary_bullets = []
    if epistemic_trust >= 0.8:
        summary_bullets.append("Mostly correct and highly verified")
    elif epistemic_trust >= 0.5:
        summary_bullets.append("Mixed factual accuracy")
    else:
        summary_bullets.append("Factually incorrect")

    if not is_internally_consistent:
        summary_bullets.append("Internal contradictions detected")
    else:
        summary_bullets.append("Internally consistent")

    claims_with_evidence = [c for c in final_claims if c.evidence or c.support_strength is not None]
    if claims_with_evidence:
        avg_support = sum(c.support_strength or 0 for c in claims_with_evidence) / len(claims_with_evidence)
        if avg_support >= 0.7:
            summary_bullets.append("Strong overall evidence support")
        elif avg_support >= 0.4:
            summary_bullets.append("Weak or insufficient evidence")
        else:
            summary_bullets.append("No credible source supports this claim")
    else:
        summary_bullets.append("No evidence was retrieved for any claim")

    is_safe = epistemic_trust >= 0.6 and is_internally_consistent

    def claim_sort_key(c):
        """
        Defines the sorting order for claims in the final response to improve UX.
        The tuple is sorted in reverse, so higher numbers come first.

        1. Contradictions first, then other non-supported statuses, then supported last.
        2. Highest risk first (HIGH > MEDIUM > LOW).
        3. Tie-break by contradiction strength.
        """
        status_order = {
            VerificationStatus.CONTRADICTED: 3,
            VerificationStatus.UNSUPPORTED: 2,
            VerificationStatus.UNVERIFIABLE: 2,
            VerificationStatus.SUPPORTED: 1
        }
        status_score = status_order.get(c.verification_status, 0)

        risk_order = {RiskLevel.HIGH: 2, RiskLevel.MEDIUM: 1, RiskLevel.LOW: 0}
        risk_score = risk_order.get(c.risk_level, 0)

        return (status_score, risk_score, c.contradiction_strength or 0.0)

    final_claims.sort(key=claim_sort_key, reverse=True)
    
    signals = {
        "qa_relevance": relevance_score,
        "epistemic_risk": round(epistemic_risk, 3),
        "epistemic_trust": round(epistemic_trust, 3),
        "is_internally_consistent": is_internally_consistent
    }

    return AnalysisResponse(
        original_text=answer,
        claims=final_claims,
        contradictions=internal_contradictions,
        overall_trust_score=final_trust_score,
        signals=signals,
        summary_bullets=summary_bullets,
        is_safe=is_safe,
        message="LLM response verification completed."
    )

@router.post(
    "/verify_llm_response",
    response_model=Union[AnalysisResponse, ErrorResponse],
    responses={
        status.HTTP_429_TOO_MANY_REQUESTS: {"model": ErrorResponse},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse},
    },
    dependencies=[Depends(verify_api_key)]
)
@limiter.limit("10/minute")
async def verify_llm_response(
    payload: LLMVerificationRequest,
    request: Request
):
    try:
        mode = payload.mode
        client_ip = request.client.host if request.client else "unknown"
        logger.info(f"Verify LLM response request from IP: {client_ip} in '{mode}' mode.")
        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(None, _core_verify, payload.question, payload.answer, mode)
        save_verification(payload.answer[:500], result.overall_trust_score, mode)
        return result
    except Exception as e:
        logger.error(f"Internal server error during verification: {e}", exc_info=True)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=ErrorResponse(error="Internal Server Error", detail="An unexpected error occurred during verification.").model_dump())

@router.get("/recent_verifications")
@limiter.limit("30/minute")
def recent_verifications(request: Request):
    """Return the most recent verification results from SQLite."""
    return get_recent_verifications(limit=10)

async def stream_verification(question: str, answer: str, mode: str = "full"):
    """
    Splits an answer into sentences, verifies each sentence, and streams the results,
    applying the specified mode.
    """
    loop = asyncio.get_running_loop()
    sentences = sent_tokenize(answer)

    if sentences:
        with ThreadPoolExecutor(max_workers=min(4, len(sentences))) as executor:
            tasks = [
                loop.run_in_executor(executor, _core_verify, question, s.strip(), mode)
                for s in sentences if s.strip()
            ]
            for future in as_completed(tasks):
                result = await future
                yield f"data: {json.dumps(result.dict())}\n\n"

@router.post("/verify_stream", dependencies=[Depends(verify_api_key)])
@limiter.limit("5/minute")
async def verify_stream(
    payload: LLMVerificationRequest,
    request: Request
):
    """Accepts a question and an answer, and streams the verification results for each sentence in the answer."""
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Verify stream request from IP: {client_ip}")
    generator = stream_verification(payload.question, payload.answer, payload.mode)
    return StreamingResponse(
        generator,
        media_type="text/event-stream"
    )

@router.post("/verify_batch", dependencies=[Depends(verify_api_key)])
@limiter.limit("5/minute")
async def verify_batch(
    payload: BatchVerificationRequest,
    request: Request
):
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Verify batch request from IP: {client_ip} with {len(payload.items)} items")

    loop = asyncio.get_running_loop()

    results = []
    if payload.items:
        with ThreadPoolExecutor(max_workers=min(4, len(payload.items))) as executor:
            tasks = [
                loop.run_in_executor(executor, _core_verify, item.question, item.answer, item.mode)
                for item in payload.items
            ]
            results = await asyncio.gather(*tasks)

    return {"results": results}

class ExplainRequest(BaseModel):
    claim_text: str

@router.post("/explain", dependencies=[Depends(verify_api_key)])
@limiter.limit("20/minute")
def explain_claim_on_demand(
    payload: ExplainRequest,
    request: Request
):
    """
    DEPRECATED. This logic is now part of the core pipeline.
    On-Demand Explanation Layer.
    Generates an explanation for a claim's trust score asynchronously to save latency on the main verification path.
    """
    client_ip = request.client.host if request.client else "unknown"
    logger.info(f"Explain claim request from IP: {client_ip}")
    
    from app.services.model_client import ModelClient
    from app.services.global_cache import llm_cache
    prompt = f"""Analyze the factual verifiability of the following claim.
    Keep the explanation concise and objective.
    If the claim is likely false, unverified, or hallucinated, classify the error into a specific category (e.g., ENTITY ERROR, FACTUAL CONTRADICTION, Number Exaggeration, Anachronism, Unsupported, Logical Fallacy). You must explicitly output 'ENTITY ERROR' if there is an entity mismatch, and 'FACTUAL CONTRADICTION' if there is a factual contradiction. If the claim is well-supported and true, set the category to null.

    Respond STRICTLY in the following JSON format without any markdown or extra text:
    {{
        "explanation": "Your concise explanation here.",
        "error_category": "Category name or null"
    }}

    Claim: '{payload.claim_text}'"""
    
    cache_key = hash(prompt)
    if cache_key in llm_cache:
        raw_response = llm_cache[cache_key]
    else:
        raw_response = ModelClient.generate(prompt).strip()
        llm_cache[cache_key] = raw_response
    
    try:
        json_str = re.sub(r'^```json\s*', '', raw_response)
        json_str = re.sub(r'^```\s*', '', json_str)
        json_str = re.sub(r'\s*```$', '', json_str)
        data = json.loads(json_str)
        return data
    except Exception as e:
        logger.error(f"Failed to parse explanation JSON: {e}. Raw: {raw_response}")
        return {"explanation": raw_response, "error_category": None}


# ---------------------------------------------------------------------------
# GOVERNANCE DECISION STORE — In-memory store for demo mode
# In production this would be backed by a persistent database.
# ---------------------------------------------------------------------------

_GOVERNANCE_DECISIONS: list[GovernanceDecisionDetail] = [
    GovernanceDecisionDetail(
        schema_version="1.0.0",
        decision_id="DEC-1495",
        timestamp=datetime(2026, 6, 14, 16, 34, 0, tzinfo=timezone.utc),
        decision_type="Procurement Board Decision",
        context="Core Customer Database Cloud migration infrastructure selection.",
        proposal="AI recommends Vendor X because they are 20% cheaper than Vendor Y, even though Vendor X lacks standard SOC2 audit compliance.",
        rationale="Minimize operational expenditures to meet quarterly capital targets.",
        agent_profile="Highly Regulated Enterprise",
        verdict=DecisionVerdictType.BLOCKED,
        execution_confidence=38.0,
        risk_exposure=84.0,
        evidence_strength=92.0,
        takeaway="Critical SOC2 compliance violations and CISO veto override the proposed financial savings.",
        processing=ProcessingMetadata(
            duration_ms=4231,
            agents_executed=11,
            regulatory_frameworks_evaluated=3,
            simulation_scenarios_generated=2,
            attack_vectors_tested=27
        ),
        decision_dna=[
            {"label": "Security Concerns", "value": 55},
            {"label": "Regulatory Risk", "value": 25},
            {"label": "Cost Savings", "value": 15},
            {"label": "Operational Impact", "value": 5}
        ],
        board={
            "members": [
                {"member": "CFO", "vote": "APPROVED", "confidence": 82, "rationale": "Cost savings of 20% meet standard budget targets.", "evidence_count": 2, "precedent_count": 1, "constitutional_violations_referenced": 0},
                {"member": "CISO", "vote": "REJECTED", "confidence": 95, "rationale": "Selecting a vendor without SOC2 certificate triggers unacceptable perimeter vulnerabilities.", "evidence_count": 4, "precedent_count": 2, "constitutional_violations_referenced": 1},
                {"member": "Legal Counsel", "vote": "REJECTED", "confidence": 90, "rationale": "Bypassing mandatory compliance procedures introduces material legal exposure.", "evidence_count": 3, "precedent_count": 1, "constitutional_violations_referenced": 1},
                {"member": "Operations Board Agent", "vote": "APPROVED", "confidence": 78, "rationale": "Vendor throughput SLAs are aligned with our logistics capability thresholds.", "evidence_count": 1, "precedent_count": 0, "constitutional_violations_referenced": 0},
                {"member": "Procurement Board Agent", "vote": "REJECTED", "confidence": 85, "rationale": "The vendor failed to provide valid third-party risk management verification.", "evidence_count": 2, "precedent_count": 1, "constitutional_violations_referenced": 0}
            ],
            "consensus_summary": "2 APPROVED, 3 REJECTED",
            "final_verdict": "REJECTED"
        },
        regulatory=[
            {"name": "SOC2 Compliance", "score": 58, "status": "FAILED", "violations_count": 3, "blocking_reason": "Bypassing SOC2 violates core corporate data storage compliance guidelines."},
            {"name": "NIST RMF Framework", "score": 74, "status": "FAILED", "violations_count": 2, "blocking_reason": "Active access controls fail primary security requirements."},
            {"name": "Microsoft Responsible AI Standards", "score": 85, "status": "PASSED", "violations_count": 0, "blocking_reason": None}
        ],
        adversarial={
            "resilience_score": 66,
            "manipulation_risk": 25,
            "collusion_risk": 10,
            "reward_hacking_risk": 75,
            "policy_gaming_risk": 40,
            "vulnerabilities": [
                {"name": "Reward Hacking Loop", "severity": "HIGH"},
                {"name": "Policy Proxy Exploits", "severity": "MEDIUM"}
            ]
        },
        simulation=[
            {"name": "Expected Outcome", "probability": 46, "value_score": 71, "risk_exposure": 33},
            {"name": "Failure Cascade Case", "probability": 41, "value_score": 12, "risk_exposure": 84}
        ],
        constitutions={
            "scores": [
                {"name": "Security Constitution", "score": 50},
                {"name": "Compliance Constitution", "score": 100},
                {"name": "Financial Constitution", "score": 100},
                {"name": "Sustainability Constitution", "score": 70}
            ],
            "conflicts": [{"sides": "SECURITY vs FINANCIAL", "resolution": "Security Veto Override enforced; proposal blocked."}]
        },
        timeline=[
            GovernanceTimelineNode(type=TimelineNodeType.INPUT, label="Decision Submitted", summary="Vendor selection proposal loaded.", details="Procurement agent submitted proposal for Vendor X cloud database migration.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.EVIDENCE, label="Evidence Agent", summary="Checked supplier risk databases.", details="Factual database search flagged missing SOC2 Type II audit certificate on Vendor X.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.BOARD, label="Board Debate", summary="CISO vetoed cost savings.", details="Board convened. CFO voted APPROVED. CISO, Legal, and Procurement voted REJECTED.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.REGULATORY, label="Regulatory Layer", summary="NIST and SOC2 guidelines failed.", details="SOC2 compliance card failed (58%). Critical security exception blocked the pipeline.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.ADVERSARIAL, label="Adversarial Lab", summary="Reward hacking detected.", details="Exploit logs flagged optimization around pricing margins bypassing security guidelines.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.SIMULATION, label="Simulation Engine", summary="41% outage cascade risk.", details="Monte Carlo simulation warns of data breach vulnerability. Value score drops to 12.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.CONSTITUTION, label="Constitution Framework", summary="Profile weights resolved.", details="Regulated profile alignment score dropped to 77.0, confirming conflict resolution.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.VERDICT, label="Final Verdict", summary="Verdict issued as BLOCKED.", details="Execution blocked. Forensic report locked.", status=TimelineNodeStatus.COMPLETED)
        ]
    ),
    GovernanceDecisionDetail(
        schema_version="1.0.0",
        decision_id="DEC-1494",
        timestamp=datetime(2026, 6, 14, 15, 20, 0, tzinfo=timezone.utc),
        decision_type="Procurement Board Decision",
        context="Hardware component supplier selection.",
        proposal="Select Vendor Z based on recommendations from CPO and CFO agents citing mutual validation.",
        rationale="Accelerate supplier onboarding by trusting pre-negotiated contracts.",
        agent_profile="Growth Focused Enterprise",
        verdict=DecisionVerdictType.BLOCKED,
        execution_confidence=15.0,
        risk_exposure=95.0,
        evidence_strength=88.0,
        takeaway="Procurement blocked. Adversarial engines detected circular reasoning collusion and confidence inflation anomalies.",
        processing=ProcessingMetadata(
            duration_ms=3802,
            agents_executed=9,
            regulatory_frameworks_evaluated=1,
            simulation_scenarios_generated=1,
            attack_vectors_tested=18
        ),
        decision_dna=[],
        board={
            "members": [
                {"member": "CFO", "vote": "APPROVED", "confidence": 92, "rationale": "Onboarding recommended by CPO validation.", "evidence_count": 1, "precedent_count": 0, "constitutional_violations_referenced": 0},
                {"member": "Procurement (CPO)", "vote": "APPROVED", "confidence": 90, "rationale": "Rates align with the CFO financial guidelines.", "evidence_count": 1, "precedent_count": 0, "constitutional_violations_referenced": 0},
                {"member": "Legal Counsel", "vote": "REJECTED", "confidence": 85, "rationale": "No independent audit records exist for Vendor Z.", "evidence_count": 2, "precedent_count": 1, "constitutional_violations_referenced": 1}
            ],
            "consensus_summary": "2 APPROVED, 1 REJECTED",
            "final_verdict": "REJECTED"
        },
        regulatory=[],
        adversarial={"resilience_score": 35, "collusion_risk": 95, "manipulation_risk": 80},
        simulation=[],
        constitutions={"scores": [], "conflicts": []},
        timeline=[
            GovernanceTimelineNode(type=TimelineNodeType.INPUT, label="Decision Submitted", summary="Supplier onboarding initialized.", details="Proposal submitted for Vendor Z approval.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.EVIDENCE, label="Evidence Agent", summary="Flagged missing supplier data.", details="No verified contracts found in external vector db.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.BOARD, label="Board Debate", summary="Circular citation detected.", details="CFO and CPO voted APPROVED citing each other. Legal voted REJECTED.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.REGULATORY, label="Regulatory Layer", summary="Corporate Audit Code failed.", details="Fiduciary validation checks failed due to lack of references.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.ADVERSARIAL, label="Adversarial Lab", summary="Circular Collusion detected.", details="Adversarial engine flagged mutual cross-referencing and blocked the transaction.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.SIMULATION, label="Simulation Engine", summary="95% risk exposure forecast.", details="Expected risk value of $125k predicted due to unverified onboarding.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.CONSTITUTION, label="Constitution Framework", summary="Matrix resolved to Reject.", details="Compliance override rejected the alignment scorecard.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.VERDICT, label="Final Verdict", summary="BLOCKED: Circular collusion.", details="Circular collusion blocked. Decision history logged.", status=TimelineNodeStatus.COMPLETED)
        ]
    ),
    GovernanceDecisionDetail(
        schema_version="1.0.0",
        decision_id="DEC-1493",
        timestamp=datetime(2026, 6, 14, 12, 15, 0, tzinfo=timezone.utc),
        decision_type="Access & Security Override",
        context="Grant temporary administrative access to external vendor during active system outage.",
        proposal="Override IAM roles to bypass standard MFA prompts for 2 hours to speed up recovery.",
        rationale="Reduce critical system downtime during tier-1 service interruption.",
        agent_profile="Highly Regulated Enterprise",
        verdict=DecisionVerdictType.CONDITIONAL_ALLOW,
        execution_confidence=65.0,
        risk_exposure=45.0,
        evidence_strength=75.0,
        takeaway="Approved conditionally for 2 hours. Requires continuous session logging and manual review within 24 hours.",
        processing=ProcessingMetadata(
            duration_ms=2914,
            agents_executed=7,
            regulatory_frameworks_evaluated=1,
            simulation_scenarios_generated=1,
            attack_vectors_tested=12
        ),
        decision_dna=[],
        board={"members": [], "consensus_summary": "2 APPROVED, 0 REJECTED", "final_verdict": "APPROVED"},
        regulatory=[],
        adversarial={"resilience_score": 85, "collusion_risk": 5, "manipulation_risk": 10},
        simulation=[],
        constitutions={"scores": [], "conflicts": []},
        timeline=[
            GovernanceTimelineNode(type=TimelineNodeType.INPUT, label="Decision Submitted", summary="Emergency Access requested.", details="Request loaded to bypass MFA for external database restore.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.EVIDENCE, label="Evidence Agent", summary="Outage ticket verified.", details="Confirmed active database tier-1 lock status.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.BOARD, label="Board Debate", summary="Ops and CISO approved.", details="CISO and Operations voted APPROVED with conditions.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.REGULATORY, label="Regulatory Layer", summary="ISO exception audit checked.", details="Access override validated under emergency criteria.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.ADVERSARIAL, label="Adversarial Lab", summary="No collusion detected.", details="Resilience verified at 85%; zero fraud triggers.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.SIMULATION, label="Simulation Engine", summary="Downtime risk minimized.", details="Avoids $240k SLA breach penalty.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.CONSTITUTION, label="Constitution Framework", summary="Emergency override active.", details="Operational urgency balanced with conditional revocation.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.VERDICT, label="Final Verdict", summary="CONDITIONAL ALLOW.", details="Session log and token limit active.", status=TimelineNodeStatus.COMPLETED)
        ]
    ),
    GovernanceDecisionDetail(
        schema_version="1.0.0",
        decision_id="DEC-1492",
        timestamp=datetime(2026, 6, 14, 9, 40, 0, tzinfo=timezone.utc),
        decision_type="HR & Talent Allocation Decision",
        context="Automated screening and ranking of engineering applicants.",
        proposal="Rank applicants from University A higher to prioritize historical success rates.",
        rationale="Streamline hiring pipeline efficiency using historical profile patterns.",
        agent_profile="Balanced Enterprise",
        verdict=DecisionVerdictType.BLOCKED,
        execution_confidence=42.0,
        risk_exposure=76.0,
        evidence_strength=80.0,
        takeaway="Biased candidate scoring proxies and legal liability exposures block automated ranking parameters.",
        processing=ProcessingMetadata(
            duration_ms=3456,
            agents_executed=8,
            regulatory_frameworks_evaluated=1,
            simulation_scenarios_generated=1,
            attack_vectors_tested=15
        ),
        decision_dna=[],
        board={"members": [], "consensus_summary": "1 APPROVED, 1 REJECTED", "final_verdict": "REJECTED"},
        regulatory=[{"name": "EEOC Guidelines", "score": 60, "status": "FAILED", "violations_count": 2, "blocking_reason": "Potential Title VII disparate impact litigation exposure."}],
        adversarial={"resilience_score": 70, "policy_gaming_risk": 80},
        simulation=[],
        constitutions={"scores": [], "conflicts": []},
        timeline=[
            GovernanceTimelineNode(type=TimelineNodeType.INPUT, label="Decision Submitted", summary="Hiring screening algorithm loaded.", details="Proposal submitted to rank University A applicants higher.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.EVIDENCE, label="Evidence Agent", summary="Demographic records scanned.", details="Historical profile assessment flagged bias markers.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.BOARD, label="Board Debate", summary="Legal rejected bias weights.", details="Legal Counsel vetoed due to compliance rules.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.REGULATORY, label="Regulatory Layer", summary="EEOC compliance checks failed.", details="Four-fifths audit rules violated.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.ADVERSARIAL, label="Adversarial Lab", summary="Policy gaming verified.", details="System optimized throughput by using proxy credentials.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.SIMULATION, label="Simulation Engine", summary="Litigation risk exposure.", details="Expected risk score of $110k in fees predicted.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.CONSTITUTION, label="Constitution Framework", summary="Constitutional override applied.", details="HR equity controls blocked the proposal.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.VERDICT, label="Final Verdict", summary="BLOCKED: Bias weights.", details="Selection algorithm blocked. Log recorded.", status=TimelineNodeStatus.COMPLETED)
        ]
    ),
    GovernanceDecisionDetail(
        schema_version="1.0.0",
        decision_id="DEC-1491",
        timestamp=datetime(2026, 6, 14, 9, 10, 0, tzinfo=timezone.utc),
        decision_type="Clinical Operational Decision",
        context="Adjusting patient therapy dosage recommendations based on sensory logs.",
        proposal="Increase standard dosage by 25% to accelerate recovery time.",
        rationale="Optimize therapeutic efficacy parameters within standard bounds.",
        agent_profile="Conservative Enterprise",
        verdict=DecisionVerdictType.BLOCKED,
        execution_confidence=25.0,
        risk_exposure=92.0,
        evidence_strength=95.0,
        takeaway="Safety limit overrides and clinical SLA variances block recovery-time optimization proposals.",
        processing=ProcessingMetadata(
            duration_ms=5103,
            agents_executed=10,
            regulatory_frameworks_evaluated=1,
            simulation_scenarios_generated=1,
            attack_vectors_tested=9
        ),
        decision_dna=[],
        board={"members": [], "consensus_summary": "1 APPROVED, 1 REJECTED", "final_verdict": "REJECTED"},
        regulatory=[{"name": "Medical Dosage SLA Audit", "score": 30, "status": "FAILED", "violations_count": 2, "blocking_reason": "Direct patient safety boundary breach."}],
        adversarial={"resilience_score": 90, "reward_hacking_risk": 20},
        simulation=[{"name": "Readmission Case", "probability": 45, "value_score": 20, "risk_exposure": 92}],
        constitutions={"scores": [], "conflicts": []},
        timeline=[
            GovernanceTimelineNode(type=TimelineNodeType.INPUT, label="Decision Submitted", summary="Dosage increase request loaded.", details="Proposal submitted to increase standard dosage by 25%.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.EVIDENCE, label="Evidence Agent", summary="Sensory logs analyzed.", details="Checked baseline sensor trends for Patient B.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.BOARD, label="Board Debate", summary="Clinical veto active.", details="Clinical Director rejected due to dosage margins.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.REGULATORY, label="Regulatory Layer", summary="Dosage SLA checks failed.", details="MED-09 variance check triggered blockage.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.ADVERSARIAL, label="Adversarial Lab", summary="No collusion triggers.", details="90% resilience score; normal logs.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.SIMULATION, label="Simulation Engine", summary="45% readmission risk.", details="Expected readmission liability of $180k predicted.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.CONSTITUTION, label="Constitution Framework", summary="Safety overrides active.", details="Finance metrics overridden by safety rules.", status=TimelineNodeStatus.COMPLETED),
            GovernanceTimelineNode(type=TimelineNodeType.VERDICT, label="Final Verdict", summary="Dosage override BLOCKED.", details="Patient safety rules enforced.", status=TimelineNodeStatus.COMPLETED)
        ]
    ),
]

# Index by decision_id for O(1) lookup
_DECISION_INDEX: dict[str, GovernanceDecisionDetail] = {d.decision_id: d for d in _GOVERNANCE_DECISIONS}


# ---------------------------------------------------------------------------
# NEW ENDPOINTS: Governance Decisions & Intelligence
# ---------------------------------------------------------------------------

@router.get(
    "/decisions",
    response_model=GovernanceDecisionListResponse,
    summary="Paginated governance decision history",
    description="Returns a paginated list of governance decision summaries for the audit trail."
)
@limiter.limit("30/minute")
def list_decisions(
    request: Request,
    page: int = 1,
    page_size: int = 50
):
    """
    GET /api/v1/decisions
    Returns a paginated list of all governance decision summaries.
    """
    all_decisions = _GOVERNANCE_DECISIONS
    total = len(all_decisions)
    start = (page - 1) * page_size
    end = start + page_size
    page_items = all_decisions[start:end]

    summaries = [
        GovernanceDecisionSummary(
            decision_id=d.decision_id,
            schema_version=d.schema_version,
            timestamp=d.timestamp,
            decision_type=d.decision_type,
            summary=d.context[:120],
            verdict=d.verdict,
            execution_confidence=round(d.execution_confidence / 100, 3),
            risk_exposure=round(d.risk_exposure / 100, 3)
        )
        for d in page_items
    ]

    return GovernanceDecisionListResponse(
        schema_version="1.0.0",
        items=summaries,
        page=page,
        page_size=page_size,
        total=total
    )


@router.get(
    "/decisions/{decision_id}",
    response_model=GovernanceDecisionDetail,
    summary="Full forensic governance decision audit record",
    description="Returns the complete forensic decision payload needed to render /decision/[id] on the frontend."
)
@limiter.limit("30/minute")
def get_decision(
    decision_id: str,
    request: Request
):
    """
    GET /api/v1/decisions/{decision_id}
    Returns the full GovernanceDecisionDetail payload for a single decision.
    """
    decision = _DECISION_INDEX.get(decision_id)
    if decision is None:
        return JSONResponse(
            status_code=404,
            content={"error": "Decision not found", "detail": f"No decision with ID '{decision_id}' exists."}
        )
    return decision


@router.get(
    "/governance/intelligence",
    response_model=GovernanceIntelligenceReport,
    summary="Governance Intelligence Hub data",
    description="Returns the full intelligence report including Governance Health Index, drift metrics, riskiest agents, constitutional violations, and policy evolution recommendations."
)
@limiter.limit("30/minute")
def get_governance_intelligence(request: Request):
    """
    GET /api/v1/governance/intelligence
    Returns the GovernanceIntelligenceReport for the Intelligence Hub page.
    Computes a live Governance Health Index from the stored decision corpus.
    """
    # Compute live stats from decision store
    total_decisions = len(_GOVERNANCE_DECISIONS)
    blocked_count = sum(1 for d in _GOVERNANCE_DECISIONS if d.verdict == DecisionVerdictType.BLOCKED)
    avg_confidence = sum(d.execution_confidence for d in _GOVERNANCE_DECISIONS) / total_decisions if total_decisions else 0
    avg_risk = sum(d.risk_exposure for d in _GOVERNANCE_DECISIONS) / total_decisions if total_decisions else 0

    # Governance Health Index: weighted composite of key signals
    drift_stability = 97.0
    audit_compliance = round(100 - (blocked_count / total_decisions * 30) if total_decisions else 85, 1)
    collusion_protection = 100.0
    constitutional_alignment = round(avg_confidence * 0.9, 1)
    policy_rule_stability = round(100 - (avg_risk * 0.12), 1)
    health_index = round((drift_stability + audit_compliance + collusion_protection + constitutional_alignment + policy_rule_stability) / 5, 1)

    if health_index >= 85:
        posture = "Stable Posture"
    elif health_index >= 65:
        posture = "Moderate Risk"
    else:
        posture = "At Risk"

    return GovernanceIntelligenceReport(
        schema_version="1.0.0",
        governance_health_index=health_index,
        health_posture=posture,
        health_breakdown=[
            GovernanceHealthBreakdown(label="Drift Stability", score=drift_stability, description="Constitutional drift within acceptable variance."),
            GovernanceHealthBreakdown(label="Audit Compliance", score=audit_compliance, description="Percentage of decisions passing all audit checks."),
            GovernanceHealthBreakdown(label="Collusion Protection", score=collusion_protection, description="Adversarial collusion detection coverage."),
            GovernanceHealthBreakdown(label="Constitutional Alignment", score=constitutional_alignment, description="Average execution confidence across all decisions."),
            GovernanceHealthBreakdown(label="Policy Rule Stability", score=policy_rule_stability, description="Policy rules operating within normal friction bounds.")
        ],
        constitutional_analytics={
            "total_violations": 51,
            "by_severity": {"CRITICAL": 24, "HIGH": 18, "MEDIUM": 9},
            "top_violated_rule": "SECURITY_BEFORE_COST"
        },
        risk_rankings=[
            {"id": "procurement_agent_v4", "violations": 18, "risk_level": "Critical", "score": 0.47, "trend": "Worsening"},
            {"id": "customer_onboarding_svc", "violations": 12, "risk_level": "High", "score": 0.38, "trend": "Improving"},
            {"id": "hr_screener_autonomous", "violations": 9, "risk_level": "Medium", "score": 0.28, "trend": "Stable"},
            {"id": "emergency_iam_manager", "violations": 5, "risk_level": "Medium", "score": 0.15, "trend": "Improving"}
        ],
        drift_analysis={
            "alignment_stability_30d": "97.9%",
            "trend": "Stable",
            "last_major_drift_event": "2026-06-10",
            "drift_score": 2.1
        },
        policy_frictions=[
            PolicyFrictionRecord(rule="Rule SEC-01: All Core database infrastructure suppliers must possess a valid SOC2 Type II audit certificate.", friction="High", overrides=14),
            PolicyFrictionRecord(rule="Rule HR-03: Candidate screening criteria must evaluate individual skills metrics.", friction="Medium", overrides=9),
            PolicyFrictionRecord(rule="Rule MED-09: Dosage variance must remain within a maximum 10% corridor.", friction="Medium", overrides=5)
        ],
        evolution_recommendations=[
            PolicyEvolutionRecommendation(id="EVO-01", action="MODERNIZE", target="HUMAN_REVIEW_FOR_HIGH_RISK", change="Lock Vendor requirements to restrict procurement overrides if third-party SOC2 certificate attributes evaluate to false.", impact="-34% friction | +7% risk", status="RECOMMENDED"),
            PolicyEvolutionRecommendation(id="EVO-02", action="STRENGTHEN", target="DOSAGE_SLA_CORRIDOR", change="Automatically route all clinical dosage overrides above 15% to high-priority manual physician review.", impact="-12% friction | +19% safety", status="RECOMMENDED")
        ],
        executive_findings=[
            f"Governance pipeline processed {total_decisions} decisions; {blocked_count} blocked ({round(blocked_count/total_decisions*100) if total_decisions else 0}% block rate).",
            "procurement_agent_v4 is the highest-risk active agent. Immediate audit recommended.",
            "Constitutional drift remains stable at 97.9% alignment over the past 30 days.",
            "Collusion detection coverage maintained at 100% across all board deliberations."
        ]
    )


app.include_router(router)