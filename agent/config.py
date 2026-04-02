from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # LiveKit
    LIVEKIT_URL: str = "wss://your-livekit-server.livekit.cloud"
    LIVEKIT_API_KEY: str = ""
    LIVEKIT_API_SECRET: str = ""

    # Groq (free) — used for LLM + STT
    GROQ_API_KEY: str = ""

    # OpenAI (fallback / summarizer)
    OPENAI_API_KEY: str = ""

    # Cartesia TTS (free tier)
    CARTESIA_API_KEY: str = ""

    # ElevenLabs (kept for reference)
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"

    # Gmail SMTP
    GMAIL_APP_PASSWORD: str = ""
    OWNER_EMAIL: str = "prepreater1@gmail.com"
    FROM_EMAIL: str = "prepreater1@gmail.com"

    # App
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = {"env_file": ".env"}


settings = Settings()
