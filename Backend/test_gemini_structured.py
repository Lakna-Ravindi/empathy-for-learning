#!/usr/bin/env python3
"""Regression test for Gemini structured response handling."""

import sys
import types

dotenv_stub = types.ModuleType("dotenv")
dotenv_stub.load_dotenv = lambda *args, **kwargs: None
sys.modules.setdefault("dotenv", dotenv_stub)

from app.services.gemini_service import GeminiService


class FakeResponse:
    def __init__(self, text: str):
        self.text = text


def run_case(name: str, stub_response: str, expected_error: str) -> None:
    service = GeminiService()
    service._call_gemini = lambda prompt, temperature=0.7, response_mime_type=None: FakeResponse(stub_response)

    result = service.generate_structured("Test prompt", output_format="json")

    assert "error" in result, f"{name}: expected error in result, got {result}"
    assert expected_error in result["error"], f"{name}: unexpected error {result['error']}"
    print(f"{name}: OK")


def main() -> None:
    run_case("empty-response", "", "Empty structured response")
    run_case("plain-text-response", "I'm here to listen.", "JSON object")

    service = GeminiService()
    service._call_gemini = lambda prompt, temperature=0.7, response_mime_type=None: FakeResponse('{"response": "All good"}')
    result = service.generate_structured("Test prompt", output_format="json")
    assert result == {"response": "All good"}, result
    print("valid-json-response: OK")


if __name__ == "__main__":
    main()