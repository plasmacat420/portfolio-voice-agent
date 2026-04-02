import asyncio
import logging

from livekit.agents import Agent, AgentSession, JobContext
from livekit.agents import llm as agents_llm
from livekit.plugins import elevenlabs, openai, silero

from agent.config import settings
from agent.emailer import send_summary_email
from agent.guardrails import get_redirect_response, is_off_topic
from agent.knowledge import get_system_prompt
from agent.summarizer import summarize_conversation

logger = logging.getLogger(__name__)


class Zara(Agent):
    def __init__(self):
        super().__init__(instructions=get_system_prompt())

    async def on_enter(self) -> None:
        await self.session.say(
            "Hi! I'm Zara, Faiz's AI assistant. I'm here to tell you about his "
            "background, skills, and projects. What would you like to know?",
            allow_interruptions=True,
        )

    async def on_user_turn_completed(
        self, turn_ctx: agents_llm.ChatContext, new_message: agents_llm.ChatMessage
    ) -> None:
        text = new_message.text_content or ""
        if is_off_topic(text):
            turn_ctx.items.clear()
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
        stt=openai.STT(model="whisper-1"),
        llm=openai.LLM(model="gpt-4o"),
        tts=elevenlabs.TTS(
            voice_id=settings.ELEVENLABS_VOICE_ID,
            api_key=settings.ELEVENLABS_API_KEY,
            model="eleven_turbo_v2",
        ),
        vad=silero.VAD.load(),
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
            asyncio.ensure_future(_post_call(transcript.copy()))

    await session.start(ctx.room, agent=Zara())
