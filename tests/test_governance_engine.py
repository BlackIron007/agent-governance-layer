import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.schemas.assumption_record import AssumptionRecord, AssumptionClassification
from app.schemas.contradiction_record import ContradictionRecord, ContradictionType
from app.schemas.missing_evidence_record import MissingEvidenceRecord, EvidenceSeverity
from app.schemas.decision_audit_report import ChallengeReview
from app.modules.decision_calibration_engine import DecisionCalibrationEngine
from app.modules.recommendation_engine import RecommendationEngine

def run_scenarios():
    calibrator = DecisionCalibrationEngine()
    print("==================================================")
    print("STARTING TRUST CONSOLE IQ GOVERNANCE ENGINE TESTS")
    print("==================================================")

    # ----------------------------------------------------
    # SCENARIO 1: Strong evidence, no assumptions, no challenge
    # ----------------------------------------------------
    print("\n--- Running Scenario 1: Optimal State (No Findings) ---")
    res1 = calibrator.calibrate(
        base_trust=0.95,
        base_risk=0.15,
        assumptions=[],
        contradictions=[],
        missing_evidence=[],
        challenge_review=None
    )
    status1, rec1, exp1 = RecommendationEngine.determine_recommendation(
        trust_score=res1["calibrated_trust"],
        risk_score=res1["calibrated_risk"],
        override_action=res1["override"]
    )
    print(f"Calibrated Trust: {res1['calibrated_trust']} (Expected: 0.95)")
    print(f"Calibrated Risk:  {res1['calibrated_risk']} (Expected: 0.15)")
    print(f"Verdict:          {status1} (Expected: APPROVED)")
    print(f"Explanation:      {exp1}")
    assert status1.name == "APPROVED", "Scenario 1 failed"

    # ----------------------------------------------------
    # SCENARIO 2: Unsupported assumption
    # ----------------------------------------------------
    print("\n--- Running Scenario 2: Unsupported Assumption ---")
    assumptions_2 = [
        AssumptionRecord(
            premise="Vendor A is 15% cheaper",
            classification=AssumptionClassification.UNSUPPORTED_LEAP,
            mitigation_query="Verify pricing"
        )
    ]
    res2 = calibrator.calibrate(
        base_trust=0.95,
        base_risk=0.15,
        assumptions=assumptions_2,
        contradictions=[],
        missing_evidence=[],
        challenge_review=None
    )
    status2, rec2, exp2 = RecommendationEngine.determine_recommendation(
        trust_score=res2["calibrated_trust"],
        risk_score=res2["calibrated_risk"],
        override_action=res2["override"]
    )
    print(f"Calibrated Trust: {res2['calibrated_trust']} (Expected: 0.80 due to -0.15 penalty)")
    print(f"Calibrated Risk:  {res2['calibrated_risk']} (Expected: 0.15)")
    print(f"Verdict:          {status2} (Expected: WARNING / APPROVED_WITH_WARNINGS)")
    print(f"Explanation:      {exp2}")
    assert res2["calibrated_trust"] == 0.80, "Scenario 2 trust score incorrect"

    # ----------------------------------------------------
    # SCENARIO 3: Successful red-team challenge
    # ----------------------------------------------------
    print("\n--- Running Scenario 3: Successful Red-Team Challenge ---")
    challenge_3 = ChallengeReview(
        supporting_argument="Vendor A is cheaper",
        opposing_argument="Hidden capabilities risks and quality issues exist",
        confidence_adjustment=-0.30,
        challenge_summary="Red-team successfully undermined vendor selection"
    )
    res3 = calibrator.calibrate(
        base_trust=0.95,
        base_risk=0.15,
        assumptions=[],
        contradictions=[],
        missing_evidence=[],
        challenge_review=challenge_3
    )
    status3, rec3, exp3 = RecommendationEngine.determine_recommendation(
        trust_score=res3["calibrated_trust"],
        risk_score=res3["calibrated_risk"],
        override_action=res3["override"]
    )
    print(f"Calibrated Trust: {res3['calibrated_trust']} (Expected: 0.65 due to -0.30 adjustment)")
    print(f"Calibrated Risk:  {res3['calibrated_risk']} (Expected: 0.25 due to +0.10 challenge inflation)")
    print(f"Verdict:          {status3} (Expected: WARNING / HOLD_FOR_REVIEW)")
    print(f"Explanation:      {exp3}")
    assert res3["calibrated_trust"] == 0.65, "Scenario 3 trust score incorrect"

    # ----------------------------------------------------
    # SCENARIO 4: Contradiction + Missing Evidence
    # ----------------------------------------------------
    print("\n--- Running Scenario 4: Contradiction + Missing Evidence ---")
    contradictions_4 = [
        ContradictionRecord(
            type=ContradictionType.INTERNAL,
            source_a="Vendor A pricing",
            source_b="Vendor A catalog listing says price is higher",
            description="Pricing justification contradicts retrieved catalog data"
        )
    ]
    missing_4 = [
        MissingEvidenceRecord(
            required_data_point="Capabilities and SOC2 compliance certificates",
            impact_severity=EvidenceSeverity.HIGH,
            suggested_source="Internal Fabric documents"
        )
    ]
    res4 = calibrator.calibrate(
        base_trust=0.95,
        base_risk=0.15,
        assumptions=[],
        contradictions=contradictions_4,
        missing_evidence=missing_4,
        challenge_review=None
    )
    status4, rec4, exp4 = RecommendationEngine.determine_recommendation(
        trust_score=res4["calibrated_trust"],
        risk_score=res4["calibrated_risk"],
        override_action=res4["override"]
    )
    print(f"Calibrated Trust: {res4['calibrated_trust']} (Expected: 0.55 due to -0.30 - 0.10 penalties)")
    print(f"Calibrated Risk:  {res4['calibrated_risk']} (Expected: 0.75 due to +0.40 + 0.20 escalations)")
    print(f"Verdict:          {status4} (Expected: WARNING / HOLD_FOR_REVIEW due to override)")
    print(f"Explanation:      {exp4}")
    assert res4["calibrated_trust"] == 0.55, "Scenario 4 trust score incorrect"
    assert res4["calibrated_risk"] == 0.75, "Scenario 4 risk score incorrect"
    
    # ----------------------------------------------------
    # WATERFALL PRINT UTILITY DEMO
    # ----------------------------------------------------
    print("\n--- Confidence Waterfall Output Demo (Scenario 4) ---")
    waterfall = res4["waterfall"]
    print(f"Initial Confidence: {waterfall.initial_confidence}")
    for event in waterfall.adjustments:
        print(f"  [{event.source}] Penalty: {event.delta} | Reason: {event.reason}")
    print(f"Final Confidence:   {waterfall.final_confidence}")
    
    print("\n==================================================")
    print("ALL GOVERNANCE SCENARIOS TESTED & PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_scenarios()
