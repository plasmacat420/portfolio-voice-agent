# Portfolio Voice Agent — Zara

> A real-time AI voice assistant that represents Faiz Shaikh. Talk to Zara, learn about his work, and she'll email Faiz a full conversation summary.

[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![LiveKit](https://img.shields.io/badge/LiveKit-Agents-orange)](https://livekit.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![CI](https://github.com/plasmacat420/portfolio-voice-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/plasmacat420/portfolio-voice-agent/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-purple)](https://plasmacat420.github.io/portfolio-voice-agent)

---

## What is this?

Static portfolio websites are forgettable. A recruiter or founder visits, skims a list of skills and projects, and moves on. There's no engagement, no personality, no way to quickly ask "can this person solve my problem?"

**Portfolio Voice Agent** solves this by replacing the static page with a live voice conversation. Visitors talk to **Zara** — a real-time AI voice assistant powered by OpenAI Whisper (transcription), GPT-4o (reasoning), and ElevenLabs (natural speech). Zara knows everything about Faiz's background, projects, and skills, and can answer questions naturally in real time.

When the conversation ends, the visitor receives an on-screen summary card and Faiz gets an email with the full transcript, a GPT-4o analysis of what the visitor was interested in, and a recommended next step. Every conversation becomes a qualified lead.

---

## Live Demo

**[https://plasmacat420.github.io/portfolio-voice-agent](https://plasmacat420.github.io/portfolio-voice-agent)**

> Note: The live demo requires a running backend with valid API keys (LiveKit Cloud, OpenAI, ElevenLabs, SendGrid). See [Setup & Deployment](#setup--deployment) to run it yourself.

---

## How it works

1. **Visitor clicks "Talk to Zara"** — enters their name, browser requests a LiveKit token from the FastAPI backend, and joins a private room.
2. **Real-time voice pipeline** — Whisper transcribes speech -> GPT-4o generates a response -> ElevenLabs synthesises natural audio -> streamed back in under a second.
3. **Guardrails keep it professional** — any off-topic, inappropriate, or jailbreak attempt is caught before it reaches the LLM and redirected politely.
4. **Call ends -> automatic summary** — GPT-4o analyses the full transcript, extracts key topics and visitor intent, and sends the full report to Faiz's inbox via SendGrid.

---

## Architecture

```
Visitor Browser
      |
      | HTTPS
      v
React + LiveKit SDK  ---- WebRTC ---->  LiveKit Cloud Room
      |                                        |
      | /api/token                             | Agent joins room
      v                                        v
FastAPI Backend                          Zara Agent (Python)
(token generator)                        +-- OpenAI Whisper (STT)
                                         +-- GPT-4o (LLM)
                                         +-- ElevenLabs (TTS)
                                         +-- Guardrails
                                         +-- On session end:
                                              +-- GPT-4o Summarizer
                                              +-- SendGrid -> Faiz's inbox
```

---

## Features

- **Real-time voice** — sub-second latency via LiveKit WebRTC infrastructure
- **Natural TTS** — ElevenLabs Rachel voice, warm and professional
- **Hard guardrails** — keyword + LLM-based detection keeps conversations on-topic always
- **Automatic conversation summariser** — GPT-4o extracts intent, topics, and recommended next step
- **Email notification** — full HTML email with transcript and analysis sent to owner after every call
- **Summary card** — visitor sees conversation highlights and direct links to contact Faiz
- **Fully open source** — fork, replace `knowledge.py`, and you have your own voice portfolio

---

## Tech Stack

| Layer | Technology |
|---|---|
| Voice pipeline | LiveKit Agents SDK, OpenAI Whisper, GPT-4o, ElevenLabs |
| Backend API | Python 3.11, FastAPI, livekit-api |
| Frontend | React 18, Vite, TailwindCSS, LiveKit React SDK |
| Email | SendGrid |
| Infra | Docker, docker-compose, GitHub Actions, GHCR, GitHub Pages |

---

## Setup & Deployment

### Prerequisites

You'll need accounts and API keys for:
- [LiveKit Cloud](https://livekit.io) — free tier available
- [OpenAI](https://platform.openai.com) — Whisper + GPT-4o
- [ElevenLabs](https://elevenlabs.io) — free tier available
- [SendGrid](https://sendgrid.com) — free tier (100 emails/day)

### Local development

```bash
# 1. Clone
git clone https://github.com/plasmacat420/portfolio-voice-agent.git
cd portfolio-voice-agent

# 2. Copy and fill in env vars
cp .env.example .env
# Edit .env with your API keys

# 3. Install Python deps
pip install -e ".[dev]"

# 4. Run tests
pytest -v

# 5. Start everything with Docker Compose
docker compose up
```

Frontend: http://localhost:5173
Backend API: http://localhost:8000
API docs: http://localhost:8000/docs

### Running without Docker

```bash
# Backend
uvicorn backend.server:app --reload --port 8000

# Agent (separate terminal)
python agent/main.py start

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

---

## Deploying to Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Build Command**: `pip install -e .`
4. Set **Start Command**: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env.example`
6. Deploy — copy your Render URL to use as `VITE_API_URL` in GitHub secrets

For the agent worker, create a separate **Background Worker** service with start command:
```
python agent/main.py start
```

---

## Customise for yourself

Want your own voice portfolio? It takes 10 minutes:

1. **Fork this repo**
2. **Edit `agent/knowledge.py`** — replace everything in `KNOWLEDGE` with your own background, projects, and skills. Update `OWNER_NAME`, `OWNER_EMAIL`, etc.
3. **Update `.env`** — add your own API keys and set `OWNER_EMAIL` to your email
4. **Update `frontend/src/components/SummaryCard.jsx`** — change the contact links to point to your profiles
5. **Redeploy** — push to main, GitHub Actions handles the rest

---

## Project structure

```
portfolio-voice-agent/
+-- agent/              # LiveKit agent -- Zara's brain
|   +-- main.py         # Worker entrypoint
|   +-- zara.py         # Agent class -- orchestrates pipeline
|   +-- knowledge.py    # Faiz's full knowledge base
|   +-- guardrails.py   # Off-topic detection
|   +-- summarizer.py   # GPT-4o conversation analysis
|   +-- emailer.py      # SendGrid email sender
|   +-- config.py       # Pydantic settings
+-- backend/            # FastAPI -- token API
|   +-- server.py
+-- frontend/           # React UI
|   +-- src/
|       +-- components/ # HeroSection, VoiceInterface, SummaryCard, StatusBadge
|       +-- hooks/      # useVoiceSession
|       +-- api/        # client.js
+-- tests/              # pytest test suite
+-- .github/workflows/  # CI, Docker publish, GitHub Pages
+-- Dockerfile
+-- docker-compose.yml
```

---

## License

MIT — free to fork, adapt, and use for your own portfolio.

---

Built by [Faiz Shaikh](https://linkedin.com/in/prepreater) — Senior AI & Full Stack Engineer
