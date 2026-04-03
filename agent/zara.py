import asyncio
import logging

from livekit.agents import Agent, AgentSession, JobContext
from livekit.agents import llm as agents_llm
from livekit.agents import stt as agents_stt
from livekit.plugins import cartesia, openai, silero

from agent.config import settings
from agent.emailer import send_summary_email
from agent.guardrails import get_redirect_response, is_off_topic
from agent.knowledge import get_system_prompt
from agent.summarizer import summarize_conversation

logger = logging.getLogger(__name__)

GROQ_BASE_URL = "https://api.groq.com/openai/v1"


class Zara(Agent):
    def __init__(self):
        super().__init__(instructions=get_system_prompt())

    async def on_enter(self) -> None:
        await self.session.say(
            "Hey! I'm Zara — built by Faiz Shaikh. I'm here to talk about AI: "
            "how it actually works, what you can build with it, and where it's heading. "
            "What are you curious about?",
            allow_interruptions=True,
        )

    async def on_user_turn_completed(
        self, turn_ctx: agents_llm.ChatContext, new_message: agents_llm.ChatMessage
    ) -> None:
        text = new_message.text_content or ""
        if is_off_topic(text):
            # Don't call super() — prevents LLM from generating a response
            await self.session.say(get_redirect_response(), allow_interruptions=True)
            return
        await super().on_user_turn_completed(turn_ctx, new_message)


async def _post_call(transcript: list[dict]) -> None:
    try:
        summary = await summarize_conversation(transcript)
        await send_summary_email(summary, transcript)
        logger.info("Post-call summary email sent.")
    except Exception as e:
        logger.error(f"Post-call processing failed: {e}")


async def entrypoint(ctx: JobContext):
    await ctx.connect()

    transcript: list[dict] = []

    session = AgentSession(
        # Groq Whisper is batch (non-streaming), so wrap with StreamAdapter + Silero VAD
        # Silero detects end-of-speech → sends buffered audio to Whisper in one shot
        stt=agents_stt.StreamAdapter(
            stt=openai.STT.with_groq(
                model="whisper-large-v3-turbo",
                api_key=settings.GROQ_API_KEY,
            ),
            vad=silero.VAD.load(
                sample_rate=8000,          # half the audio data → half the CPU
                min_silence_duration=0.6,  # slightly longer pause before turn ends
            ),
        ),
        # Groq LLM via OpenAI-compatible base_url (free)
        llm=openai.LLM(
            model="llama-3.3-70b-versatile",
            base_url=GROQ_BASE_URL,
            api_key=settings.GROQ_API_KEY,
        ),
        tts=cartesia.TTS(
            api_key=settings.CARTESIA_API_KEY,
            model="sonic-2",
            voice="794f9389-aac1-45b6-b726-9d9369183238",  # "Barbra" — warm professional female
        ),
    )

    @session.on("user_input_transcribed")
    def on_user_transcribed(ev) -> None:
        if ev.is_final and ev.transcript.strip():
            transcript.append({"role": "user", "content": ev.transcript.strip()})

    @session.on("conversation_item_added")
    def on_item_added(ev) -> None:
        if ev.item.role == "assistant":
            text = ev.item.text_content
            if text:
                transcript.append({"role": "assistant", "content": text})

    @session.on("close")
    def on_close(ev) -> None:
        if len(transcript) > 2:
            # Safe way to schedule async work from a sync handler in Python 3.10+
            asyncio.get_running_loop().create_task(_post_call(transcript.copy()))

    # agent is first positional arg; room is keyword-only
    await session.start(Zara(), room=ctx.room)
