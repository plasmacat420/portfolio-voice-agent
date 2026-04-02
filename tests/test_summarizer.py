import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.mark.asyncio
async def test_summarize_returns_required_keys(sample_transcript, sample_summary):
    """summarize_conversation should return all 4 required keys."""
    mock_response = MagicMock()
    mock_response.choices[0].message.content = json.dumps(sample_summary)

    mock_client = AsyncMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    with patch("agent.summarizer.AsyncOpenAI", return_value=mock_client):
        from agent.summarizer import summarize_conversation
        result = await summarize_conversation(sample_transcript)

    assert "summary" in result
    assert "visitor_interest" in result
    assert "key_topics" in result
    assert "recommended_action" in result


@pytest.mark.asyncio
async def test_summarize_returns_correct_values(sample_transcript, sample_summary):
    """summarize_conversation should return the parsed summary content."""
    mock_response = MagicMock()
    mock_response.choices[0].message.content = json.dumps(sample_summary)

    mock_client = AsyncMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    with patch("agent.summarizer.AsyncOpenAI", return_value=mock_client):
        from agent.summarizer import summarize_conversation
        result = await summarize_conversation(sample_transcript)

    assert result["summary"] == sample_summary["summary"]
    assert isinstance(result["key_topics"], list)
    assert len(result["key_topics"]) > 0


@pytest.mark.asyncio
async def test_summarize_handles_short_transcript():
    """summarize_conversation should work with a minimal 2-message transcript."""
    short_transcript = [
        {"role": "assistant", "content": "Hi! I'm Zara."},
        {"role": "user", "content": "Hello."},
    ]

    minimal_summary = {
        "summary": "Brief introductory exchange.",
        "visitor_interest": "Unknown — conversation too short.",
        "key_topics": ["Introduction"],
        "recommended_action": "No clear action — conversation was brief.",
    }

    mock_response = MagicMock()
    mock_response.choices[0].message.content = json.dumps(minimal_summary)

    mock_client = AsyncMock()
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    with patch("agent.summarizer.AsyncOpenAI", return_value=mock_client):
        from agent.summarizer import summarize_conversation
        result = await summarize_conversation(short_transcript)

    assert "summary" in result
    assert "key_topics" in result
