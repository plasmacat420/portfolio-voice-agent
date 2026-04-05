import logging

from livekit import agents
from livekit.agents import WorkerOptions, cli
from livekit.plugins import cartesia, deepgram, openai

from agent.config import settings
from agent.zara import entrypoint

logger = logging.getLogger(__name__)

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


def prewarm_fnc(proc: agents.JobProcess):
    """Preload STT/LLM/TTS into the worker process before any participant joins.
    This eliminates cold-start lag — models are ready the moment a room is created."""
    proc.userdata["stt"] = deepgram.STT(
        api_key=settings.DEEPGRAM_API_KEY,
        model="nova-3",
        language="en-US",
    )
    proc.userdata["llm"] = openai.LLM(
        model="llama-3.3-70b-versatile",
        base_url=GROQ_BASE_URL,
        api_key=settings.GROQ_API_KEY,
    )
    proc.userdata["tts"] = cartesia.TTS(
        api_key=settings.CARTESIA_API_KEY,
        model="sonic-turbo",
        voice="794f9389-aac1-45b6-b726-9d9369183238",
    )


async def request_fnc(req: agents.JobRequest):
    """Accept all incoming job requests unconditionally."""
    await req.accept()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm_fnc,
            request_fnc=request_fnc,
            agent_name="zara",  # enables explicit dispatch from backend
        )
    )
