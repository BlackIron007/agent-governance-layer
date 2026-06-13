import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app.modules.query_rewriter import rewrite_query
except ImportError as e:
    print(f"ERROR: Could not import the application. Make sure you are in the correct environment and all dependencies are installed.")
    print(f"Original error: {e}")
    sys.exit(1)
except Exception as e:
    print(f"An unexpected error occurred during import: {e}")
    print("Please ensure all dependencies and data models (NLTK, Spacy) are downloaded and installed.")
    sys.exit(1)

TEST_CASES = [
    {
        "name": "Extracts entities and keywords",
        "claim": "Marie Curie, born in 1867, discovered Polonium.",
        "expected": "Marie Curie Polonium 1867 born discovered"
    },
    {
        "name": "Removes stopwords",
        "claim": "The Earth is round and it is not flat.",
        "expected": "earth round flat"
    },
    {
        "name": "Handles numbers",
        "claim": "The speed of light is approximately 300,000 km/s.",
        "expected": "speed light approximately 300,000 km/s"
    },
    {
        "name": "Returns original if query is empty after processing",
        "claim": "it is a and the",
        "expected": "it is a and the"
    },
    {
        "name": "Handles mixed case and punctuation",
        "claim": "What did Albert Einstein invent? He developed relativity.",
        "expected": "Albert Einstein invent developed relativity"
    }
]

def run_tests():
    """Runs all test cases and reports results."""
    print("Running unit tests for query_rewriter...")
    total_tests = len(TEST_CASES)
    passed_tests = 0
    failed_tests = []

    for i, test in enumerate(TEST_CASES):
        name = test["name"]
        claim = test["claim"]
        expected = test["expected"]
        
        print(f"  [{i+1}/{total_tests}] Running: {name}...", end=" ")
        
        try:
            actual = rewrite_query(claim)
            assert actual == expected
            print("PASSED")
            passed_tests += 1
        except AssertionError:
            print("FAILED")
            failed_tests.append({
                "name": name,
                "claim": claim,
                "expected": expected,
                "actual": actual
            })
        except Exception as e:
            print(f"CRASHED")
            failed_tests.append({"name": name, "claim": claim, "error": str(e)})

    print("-" * 50)
    if not failed_tests:
        print(f"SUMMARY: ALL {total_tests} TESTS PASSED!")
        sys.exit(0)
    else:
        print(f"SUMMARY: {len(failed_tests)}/{total_tests} TESTS FAILED.")
        for failure in failed_tests:
            print(f"\n--- FAILURE: {failure['name']} ---")
            print(f"  Input Claim: '{failure['claim']}'")
            if 'error' in failure:
                print(f"  Error: {failure['error']}")
            else:
                print(f"  Expected:    '{failure['expected']}'")
                print(f"  Actual:      '{failure['actual']}'")
        sys.exit(1)

if __name__ == "__main__":
    print("NOTE: This test requires 'spacy' and its 'en_core_web_sm' model.")
    print("If it fails on the first run, please execute: python -m spacy download en_core_web_sm\n")
    run_tests()