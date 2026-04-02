import asyncio
import logging
import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from livekit.agents import WorkerOptions
from livekit.agents.worker import AgentServer
from livekit.api import AccessToken, VideoGrants
from pydantic import BaseModel

from agent.config import settings
from agent.zara import entrypoint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_agent_task: asyncio.Task | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _agent_task

    # Start the LiveKit agent worker in the background alongside FastAPI
    worker_options = WorkerOptions(
        entrypoint_fnc=entrypoint,
        ws_url=settings.LIVEKIT_URL,
        api_key=settings.LIVEKIT_API_KEY,
        api_secret=settings.LIVEKIT_API_SECRET,
    )
    server = AgentServer.from_server_options(worker_options)
    _agent_task = asyncio.create_task(server.run())
    logger.info("LiveKit agent worker started alongside FastAPI")

    yield

    if _agent_task:
        _agent_task.cancel()
        try:
            await _agent_task
        except asyncio.CancelledError:
            pass


app = FastAPI(title="Portfolio Voice Agent API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://plasmacat420.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TokenRequest(BaseModel):
    visitor_name: str


class TokenResponse(BaseModel):
    token: str
    room: str
    livekit_url: str


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/token", response_model=TokenResponse)
async def create_token(request: TokenRequest):
    """Generate a LiveKit access token for a visitor."""
    if not request.visitor_name or not request.visitor_name.strip():
        raise HTTPException(status_code=400, detail="visitor_name is required")

    room_name = f"portfolio-{uuid.uuid4().hex[:8]}"
    identity = f"visitor-{request.visitor_name.strip().replace(' ', '-').lower()}"

    token = (
        AccessToken(
            api_key=settings.LIVEKIT_API_KEY,
            api_secret=settings.LIVEKIT_API_SECRET,
        )
        .with_identity(identity)
        .with_name(request.visitor_name.strip())
        .with_grants(
            VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
            )
        )
        .to_jwt()
    )

    logger.info(f"Token created for visitor '{request.visitor_name}' in room '{room_name}'")

    return TokenResponse(
        token=token,
        room=room_name,
        livekit_url=settings.LIVEKIT_URL,
    )
