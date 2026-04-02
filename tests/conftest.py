from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.fixture
def mock_openai_client():
    """Mock OpenAI async client."""
    with patch("agent.summarizer.AsyncOpenAI") as mock_cls:
        client = AsyncMock()
        mock_cls.return_value = client
        yield client


@pytest.fixture
def mock_sendgrid():
    """Mock SendGrid client."""
    with patch("agent.emailer.sendgrid.SendGridAPIClient") as mock_cls:
        client = MagicMock()
        mock_cls.return_value = client
        yield client


@pytest.fixture
def sample_transcript():
    return [
        {"role": "assistant", "content": "Hi! I'm Zara, Faiz's AI assistant. What would you like to know?"},
        {"role": "user", "content": "What are Faiz's main skills?"},
        {"role": "assistant", "content": "Faiz specialises in AI engineering — LangChain, LangGraph, RAG pipelines, and real-time voice AI with LiveKit. He's also strong in Python, FastAPI, and React."},
        {"role": "user", "content": "Is he looking for work?"},
        {"role": "assistant", "content": "Yes! Faiz is actively looking for Senior AI Engineer or Founding Engineer roles — in Pune or fully remote. He's an immediate joiner."},
    ]


@pytest.fixture
def sample_summary():
    return {
        "summary": "The visitor asked about Faiz's skills and job availability. Zara explained his AI engineering expertise and confirmed he is actively job seeking.",
        "visitor_interest": "AI engineering skills and job availability",
        "key_topics": ["AI Skills", "Job Search", "LangChain", "Voice AI"],
        "recommended_action": "Follow up — strong interest in hiring Faiz for an AI role.",
    }
