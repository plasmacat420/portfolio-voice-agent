import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from agent.config import settings

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


async def send_summary_email(summary: dict, transcript: list[dict]) -> bool:
    """Send conversation summary email to Faiz via Gmail SMTP."""

    transcript_html = "".join(
        [
            f"<p><strong>{m['role'].upper()}:</strong> {m['content']}</p>"
            for m in transcript
        ]
    )

    html_content = f"""
    <h2>New Conversation with Zara 🎙️</h2>
    <p><strong>Time:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>

    <h3>Summary</h3>
    <p>{summary.get('summary', 'N/A')}</p>

    <h3>Visitor Interest</h3>
    <p>{summary.get('visitor_interest', 'N/A')}</p>

    <h3>Key Topics Covered</h3>
    <ul>{''.join(f"<li>{t}</li>" for t in summary.get('key_topics', []))}</ul>

    <h3>Recommended Action</h3>
    <p><strong>{summary.get('recommended_action', 'N/A')}</strong></p>

    <hr>
    <h3>Full Transcript</h3>
    {transcript_html}
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Zara: New portfolio conversation — {datetime.now().strftime('%b %d')}"
    msg["From"] = settings.FROM_EMAIL
    msg["To"] = settings.OWNER_EMAIL
    msg.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.FROM_EMAIL, settings.GMAIL_APP_PASSWORD)
            server.sendmail(settings.FROM_EMAIL, settings.OWNER_EMAIL, msg.as_string())
        return True
    except Exception as e:
        print(f"Email failed: {e}")
        return False
