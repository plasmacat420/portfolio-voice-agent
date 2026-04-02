import logging

from livekit.agents import Agent, AgentSession, JobContext
from livekit.agents.llm import ChatContext
from livekit.plugins import elevenlabs, openai, silero

from agent.config import settings
from agent.emailer import send_summary_email
from agent.guardrails import get_redirect_response, is_off_topic
from agent.knowledge import get_system_prompt
from agent.summarizer import summarize_conversation

logger = logging.getLogger(__name__)


class ZaraAgent:
    def __init__(self):
        self.transcript: list[dict] = []
        self.session: AgentSession | None = None

    async def start(self, ctx: JobContext):
        """Initialize and start the Zara agent session."""

        self.session = AgentSession(
            stt=openai.STT(model="whisper-1"),
            llm=openai.LLM(model="gpt-4o"),
            tts=elevenlabs.TTS(
                voice_id=settings.ELEVENLABS_VOICE_ID,
                api_key=settings.ELEVENLABS_API_KEY,
                model="eleven_turbo_v2",
            ),
            vad=silero.VAD.load(),
            chat_ctx=ChatContext().append(
                role="system",
                text=get_system_prompt(),
            ),
        )

        await ctx.connect()

        @self.session.on("user_speech_committed")
        async def on_user_speech(msg):
            """Intercept user messages for guardrail check."""
            if is_off_topic(msg.content):
                await self.session.say(
                    get_redirect_response(), allow_interruptions=True
                )
                return
            self.transcript.append({"role": "user", "content": msg.content})

        @self.session.on("agent_speech_committed")
        async def on_agent_speech(msg):
            """Track agent responses."""
            self.transcript.append({"role": "assistant", "content": msg.content})

        @self.session.on("session_ended")
        async def on_session_ended():
            """Generate summary and send email when call ends."""
            if len(self.transcript) > 2:
                try:
                    summary = await summarize_conversation(self.transcript)
                    await send_summary_email(summary, self.transcript)
                    logger.info("Summary email sent successfully")
                except Exception as e:
                    logger.error(f"Post-call processing failed: {e}")

        await self.session.start(
            ctx.room,
            agent=Agent(instructions=get_system_prompt()),
        )

        await self.session.say(
            "Hi! I'm Zara, Faiz's AI assistant. I'm here to tell you about his background, "
            "skills, and projects. What would you like to know?",
            allow_interruptions=True,
        )
