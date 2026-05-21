# ai-service/tests/test_main.py
# Test suite cho AI Service (FastAPI)
# Dùng: pytest + httpx + pytest-asyncio

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json
import sys
import os

# Thêm parent dir vào path để import main
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app, is_solution_confirmed, solved_response, build_system_prompt, ChatRequest

client = TestClient(app)


# ─────────────────────────────────────────────────────────────
# Unit tests: is_solution_confirmed()
# ─────────────────────────────────────────────────────────────
class TestIsSolutionConfirmed:
    def test_accepted_returns_true(self):
        assert is_solution_confirmed("accepted") is True

    def test_AC_returns_true(self):
        assert is_solution_confirmed("AC") is True

    def test_passed_returns_true(self):
        assert is_solution_confirmed("passed") is True

    def test_da_giai_dung_returns_true(self):
        assert is_solution_confirmed("đã giải đúng") is True

    def test_none_returns_false(self):
        assert is_solution_confirmed(None) is False

    def test_empty_string_returns_false(self):
        assert is_solution_confirmed("") is False

    def test_wrong_answer_returns_false(self):
        assert is_solution_confirmed("Wrong Answer") is False

    def test_incorrect_returns_false(self):
        assert is_solution_confirmed("incorrect") is False

    def test_khong_dung_returns_false(self):
        assert is_solution_confirmed("không đúng") is False

    def test_time_limit_returns_false(self):
        assert is_solution_confirmed("Time Limit Exceeded") is False

    def test_runtime_error_returns_false(self):
        assert is_solution_confirmed("Runtime Error") is False


# ─────────────────────────────────────────────────────────────
# Unit tests: build_system_prompt()
# ─────────────────────────────────────────────────────────────
class TestBuildSystemPrompt:
    def test_includes_problem_title_when_provided(self):
        req = ChatRequest(
            question="Giúp tôi",
            problem_title="Two Sum",
            problem_difficulty="Easy"
        )
        prompt = build_system_prompt(req, context_docs="")
        assert "Two Sum" in prompt
        assert "Easy" in prompt

    def test_no_problem_info_when_title_missing(self):
        req = ChatRequest(question="Giúp tôi")
        prompt = build_system_prompt(req, context_docs="")
        assert "Bài đang làm" not in prompt

    def test_includes_context_docs_when_provided(self):
        req = ChatRequest(question="test")
        prompt = build_system_prompt(req, context_docs="Tài liệu mẫu ABC")
        assert "Tài liệu mẫu ABC" in prompt

    def test_includes_user_code_when_provided(self):
        req = ChatRequest(
            question="test",
            problem_title="Test",
            user_code="def solution(): pass"
        )
        prompt = build_system_prompt(req, context_docs="")
        assert "def solution(): pass" in prompt


# ─────────────────────────────────────────────────────────────
# Integration tests: GET /health
# ─────────────────────────────────────────────────────────────
class TestHealthEndpoint:
    def test_health_returns_ok(self):
        res = client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"
        assert "model" in data


# ─────────────────────────────────────────────────────────────
# Integration tests: POST /chat
# ─────────────────────────────────────────────────────────────
class TestChatEndpoint:
    def test_chat_returns_solved_response_when_accepted(self):
        """Khi bài đã Accepted, trả về thông báo không cần hint thêm"""
        payload = {
            "question": "Bài này đúng chưa?",
            "last_submission_status": "accepted"
        }
        res = client.post("/chat", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "answer" in data
        # Phải là một trong các câu trả lời xác nhận đúng
        assert len(data["answer"]) > 0

    @patch("main.get_relevant_context", return_value="")
    @patch("main.requests.post")
    def test_chat_returns_answer_from_ollama(self, mock_post, mock_rag):
        """Mock Ollama thành công, trả về answer"""
        mock_response = MagicMock()
        mock_response.raise_for_status = MagicMock()
        mock_response.json.return_value = {"response": "Bạn nên dùng hash map để tối ưu."}
        mock_post.return_value = mock_response

        payload = {
            "question": "Gợi ý cho bài Two Sum",
            "problem_title": "Two Sum",
            "problem_difficulty": "Easy"
        }
        res = client.post("/chat", json=payload)
        assert res.status_code == 200
        assert res.json()["answer"] == "Bạn nên dùng hash map để tối ưu."

    @patch("main.get_relevant_context", return_value="")
    @patch("main.requests.post")
    def test_chat_fallback_when_ollama_down(self, mock_post, mock_rag):
        """Mock Ollama bị lỗi kết nối, trả về fallback message"""
        import requests as req_lib
        mock_post.side_effect = req_lib.exceptions.ConnectionError("Connection refused")

        payload = {
            "question": "Giúp tôi với",
            "problem_title": "Two Sum"
        }
        res = client.post("/chat", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert "answer" in data
        assert "Ollama" in data["answer"] or "không hoạt động" in data["answer"]

    @patch("main.get_relevant_context", return_value="")
    @patch("main.requests.post")
    def test_chat_504_when_ollama_timeout(self, mock_post, mock_rag):
        """Mock Ollama timeout, trả về 504"""
        import requests as req_lib
        mock_post.side_effect = req_lib.exceptions.Timeout("Timeout")

        payload = {"question": "Test timeout"}
        res = client.post("/chat", json=payload)
        assert res.status_code == 504

    def test_chat_requires_question_field(self):
        """Thiếu field 'question' phải trả về 422 Unprocessable Entity"""
        res = client.post("/chat", json={"problem_title": "No question"})
        assert res.status_code == 422

    def test_chat_with_empty_question(self):
        """question rỗng vẫn được chấp nhận (không bị validation error)"""
        with patch("main.get_relevant_context", return_value=""), \
             patch("main.requests.post") as mock_post:
            mock_response = MagicMock()
            mock_response.raise_for_status = MagicMock()
            mock_response.json.return_value = {"response": "Hỏi gì đó đi."}
            mock_post.return_value = mock_response

            res = client.post("/chat", json={"question": ""})
            assert res.status_code == 200


# ─────────────────────────────────────────────────────────────
# Integration tests: POST /chat/stream
# ─────────────────────────────────────────────────────────────
class TestChatStreamEndpoint:
    def test_stream_returns_solved_response_when_accepted(self):
        """Khi đã Accepted, stream trả về SSE với token rồi [DONE]"""
        payload = {
            "question": "test",
            "last_submission_status": "passed"
        }
        with client.stream("POST", "/chat/stream", json=payload) as res:
            assert res.status_code == 200
            assert "text/event-stream" in res.headers["content-type"]
            content = res.read().decode("utf-8")
            assert "[DONE]" in content

    def test_stream_requires_question_field(self):
        """Thiếu 'question' phải 422"""
        res = client.post("/chat/stream", json={})
        assert res.status_code == 422
