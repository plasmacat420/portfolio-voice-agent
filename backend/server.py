import logging
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from livekit import api as lkapi
from livekit.api import AccessToken, VideoGrants
from pydantic import BaseModel

from agent.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio Voice Agent API", version="0.1.0")

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
    """Generate a LiveKit access token and dispatch the Zara agent to the room."""
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

    # Dispatch the Zara agent (running on LiveKit Cloud) to this room
    lk = lkapi.LiveKitAPI(
        url=settings.LIVEKIT_URL,
        api_key=settings.LIVEKIT_API_KEY,
        api_secret=settings.LIVEKIT_API_SECRET,
    )
    try:
        await lk.agent_dispatch.create_dispatch(
            lkapi.CreateAgentDispatchRequest(
                room=room_name,
                agent_name="zara",
            )
        )
        logger.info(f"Agent dispatched to room '{room_name}' for visitor '{request.visitor_name}'")
    except Exception as e:
        logger.error(f"Agent dispatch failed for room '{room_name}': {e}")
        raise HTTPException(status_code=502, detail="Failed to dispatch voice agent")
    finally:
        await lk.aclose()

    return TokenResponse(
        token=token,
        room=room_name,
        livekit_url=settings.LIVEKIT_URL,
    )
