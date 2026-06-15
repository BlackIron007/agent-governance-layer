import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.model_client import ModelClient

try:
    print("Sending prompt to ModelClient...")
    res = ModelClient.generate("Test. Respond with exactly 'Hello World'.")
    print(f"Response: '{res}'")
except Exception as e:
    print("Error:", e)
