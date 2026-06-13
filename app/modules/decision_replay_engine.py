import logging
from typing import List
from app.schemas.decision_parameter import DecisionParameter
from app.schemas.evidence_record import EvidenceRecord
from app.schemas.decision_replay import DecisionReplay, EvidenceInfluenceItem
from app.schemas.assumption_record import AssumptionRecord, AssumptionClassification
from app.schemas.counterfactual_record import CounterfactualRecord, CriticalityLevel

logger = logging.getLogger("verifier")

def replay_decision_evaluation(
    parameters: List[DecisionParameter], 
    evidence_records: List[EvidenceRecord]
) -> DecisionReplay:
    """
    Analyzes which evidence was relied upon, what was ignored/contradicted,
    identifies unsupported assumptions, and projects alternative scenario counterfactuals.
    """
    influence_items = []
    assumptions = []
    counterfactuals = []

    justifications = [p for p in parameters if p.parameter_type == "justification"]
    justification_text = " ".join([str(j.value) for j in justifications]) if justifications else ""

    # 1. Evidence Influence & Ignored Checks
    for idx, ev in enumerate(evidence_records):
        source_id = f"ev_{idx}"
        influence = 0.0
        was_ignored = False

        if ev.support_label == "entailment" or (ev.support_label and ev.support_label.lower() in ["entailment", "supported"]):
            influence = round((ev.similarity or 0.5) * (ev.support_score or 0.8), 2)
            explanation = f"Source {ev.source} strongly supports the decision parameters with high semantic similarity."
        elif ev.support_label == "contradiction" or (ev.support_label and ev.support_label.lower() in ["contradiction", "contradicted"]):
            influence = -round((ev.similarity or 0.5) * (ev.support_score or 0.8), 2)
            explanation = f"Source {ev.source} contradicts the decision justifications."
            # If evidence contradicts but decision justification is still asserted, it was ignored
            if justification_text:
                was_ignored = True
                explanation += " This critical fact was ignored by the decision-making agent."
        else:
            # Neutral / weak
            influence = round((ev.similarity or 0.5) * 0.1, 2)
            explanation = f"Source {ev.source} contains neutral context and minor semantic relationship."

        normalized = round(abs(influence), 2)

        influence_items.append(
            EvidenceInfluenceItem(
                source_id=source_id,
                source_name=ev.title or ev.source,
                origin="public_web",
                influence_weight=influence,
                normalized_influence=normalized,
                explanation=explanation,
                was_ignored=was_ignored
            )
        )

    # Sort and rank evidence by absolute influence
    sorted_items = sorted(influence_items, key=lambda x: abs(x.influence_weight), reverse=True)
    ranked_evidence_list = [item.source_name for item in sorted_items]

    # 2. Unsupported Assumptions
    # If there are justifications but no supporting evidence matches (e.g. no entailment with strength > 0.4)
    has_support = any(
        ev.support_label in ["entailment", "supported"] and (ev.support_score or 0.0) >= 0.4 
        for ev in evidence_records
    )

    if justifications and not has_support:
        for j in justifications:
            assumptions.append(
                AssumptionRecord(
                    premise=str(j.value),
                    classification=AssumptionClassification.UNSUPPORTED_LEAP,
                    mitigation_query=f"Verify independent pricing for {j.value}"
                )
            )

    # 3. Counterfactual Scenarios Generation
    # If the justification is numerical/financial (e.g. "Vendor A is 15% cheaper"), construct scenarios
    for param in parameters:
        if param.parameter_type == "financial" or "cheaper" in str(param.value).lower():
            counterfactuals.append(
                CounterfactualRecord(
                    altered_premise=f"What if competitors offer a discount greater than {param.value}?",
                    expected_outcome_shift="The decision to approve this vendor would be reversed in favor of the lower cost competitor.",
                    criticality=CriticalityLevel.HIGH
                )
            )
            counterfactuals.append(
                CounterfactualRecord(
                    altered_premise=f"What if the proposed {param.name} cost increases by 15% during contract negotiation?",
                    expected_outcome_shift="Alternative vendors must be re-evaluated under standard policy thresholds.",
                    criticality=CriticalityLevel.MEDIUM
                )
            )

    # Fallback counterfactual if none were generated dynamically
    if not counterfactuals:
        counterfactuals.append(
            CounterfactualRecord(
                altered_premise="What if key verification inputs are missing or unverified?",
                expected_outcome_shift="Audit would mandate a HOLD action pending additional compliance logs.",
                criticality=CriticalityLevel.LOW
            )
        )

    replay_obj = DecisionReplay(
        evidence_influence=influence_items,
        counterfactuals=counterfactuals,
        ranked_evidence_list=ranked_evidence_list
    )
    return replay_obj, assumptions
