import smtplib
from unittest.mock import MagicMock, patch

import pytest


@pytest.mark.asyncio
async def test_send_summary_email_success(sample_summary, sample_transcript):
    """send_summary_email should return True on success."""
    mock_smtp = MagicMock()
    mock_smtp.__enter__ = MagicMock(return_value=mock_smtp)
    mock_smtp.__exit__ = MagicMock(return_value=False)

    with patch("agent.emailer.smtplib.SMTP", return_value=mock_smtp):
        from agent.emailer import send_summary_email
        result = await send_summary_email(sample_summary, sample_transcript)

    assert result is True
    mock_smtp.sendmail.assert_called_once()


@pytest.mark.asyncio
async def test_send_summary_email_failure(sample_summary, sample_transcript):
    """send_summary_email should return False gracefully when SMTP raises."""
    mock_smtp = MagicMock()
    mock_smtp.__enter__ = MagicMock(return_value=mock_smtp)
    mock_smtp.__exit__ = MagicMock(return_value=False)
    mock_smtp.sendmail.side_effect = smtplib.SMTPException("SMTP error")

    with patch("agent.emailer.smtplib.SMTP", return_value=mock_smtp):
        from agent.emailer import send_summary_email
        result = await send_summary_email(sample_summary, sample_transcript)

    assert result is False


@pytest.mark.asyncio
async def test_send_summary_email_html_content(sample_summary, sample_transcript):
    """send_summary_email should include summary content in the email body."""
    import base64
    mock_smtp = MagicMock()
    mock_smtp.__enter__ = MagicMock(return_value=mock_smtp)
    mock_smtp.__exit__ = MagicMock(return_value=False)

    with patch("agent.emailer.smtplib.SMTP", return_value=mock_smtp):
        from agent.emailer import send_summary_email
        result = await send_summary_email(sample_summary, sample_transcript)

    assert result is True
    call_args = mock_smtp.sendmail.call_args
    raw_email = call_args.args[2]
    # Body is base64-encoded — decode each chunk and check content
    decoded = ""
    for chunk in raw_email.split("\n"):
        try:
            decoded += base64.b64decode(chunk).decode("utf-8", errors="ignore")
        except Exception:
            decoded += chunk
    assert sample_summary["summary"] in decoded
