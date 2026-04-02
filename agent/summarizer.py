import json

from openai import AsyncOpenAI

from agent.config import settings


async def summarize_conversation(transcript: list[dict]) -> dict:
    """
    Takes conversation transcript as list of {role, content} dicts.
    Returns {
        summary: str,           # 3-5 sentence summary of what was discussed
        visitor_interest: str,  # what the visitor seemed interested in
        key_topics: list[str],  # topics covered
        recommended_action: str # e.g. "Follow up — showed strong interest in AI agent work"
    }
    """
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    transcript_text = "\n".join(
        [f"{m['role'].upper()}: {m['content']}" for m in transcript]
    )

    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a professional conversation analyst. Analyze this conversation "
                    "transcript and return a JSON object with keys: summary, visitor_interest, "
                    "key_topics (array), recommended_action."
                ),
            },
            {"role": "user", "content": f"Transcript:\n{transcript_text}"},
        ],
        response_format={"type": "json_object"},
    )

    return json.loads(response.choices[0].message.content)
