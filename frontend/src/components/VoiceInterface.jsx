import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Volume2, Loader2 } from "lucide-react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  useTranscriptions,
  useConnectionState,
  useRemoteParticipants,
  useLocalParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import StatusBadge from "./StatusBadge.jsx";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/** Shown while room is connected but agent hasn't joined yet (Render cold start) */
function WarmingUp({ waitSeconds }) {
  const tips = [
    "Zara runs on Groq + Cartesia — sub-second responses once she's live.",
    "Ask about LLM agents, RAG, MCP servers, or AI in production.",
    "This assistant is fully open source — check github.com/plasmacat420.",
    "Powered by Llama 3.3 70B via Groq and Cartesia voice synthesis.",
  ];
  const tip = tips[Math.floor(waitSeconds / 8) % tips.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">Zara is warming up...</h2>
        <p className="text-slate-400 text-sm mb-6">
          The server is starting up — this takes about 30–60 seconds on first load.
          Hang tight.
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                (waitSeconds % 5) >= i ? "bg-violet-400" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Rotating tip */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
          <p className="text-slate-400 text-xs leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}

/** Inner component — runs inside <LiveKitRoom> so hooks work */
function CallUI({ onEnd }) {
  const { state: agentState } = useVoiceAssistant();
  const connectionState = useConnectionState();
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const transcriptions = useTranscriptions();

  const [callDuration, setCallDuration] = useState(0);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const transcriptRef = useRef(null);
  const timerRef = useRef(null);
  const waitTimerRef = useRef(null);

  const isConnected = connectionState === ConnectionState.Connected;
  const agentJoined = remoteParticipants.length > 0;

  // Count up while waiting for agent
  useEffect(() => {
    if (isConnected && !agentJoined) {
      waitTimerRef.current = setInterval(
        () => setWaitSeconds((s) => s + 1),
        1000
      );
    } else {
      if (waitTimerRef.current) clearInterval(waitTimerRef.current);
    }
    return () => {
      if (waitTimerRef.current) clearInterval(waitTimerRef.current);
    };
  }, [isConnected, agentJoined]);

  // Call duration timer — starts once agent has joined
  useEffect(() => {
    if (agentJoined) {
      const start = Date.now();
      timerRef.current = setInterval(
        () => setCallDuration(Math.floor((Date.now() - start) / 1000)),
        1000
      );
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [agentJoined]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcriptions]);

  // Show warm-up screen while room connected but agent not yet joined
  if (isConnected && !agentJoined) {
    return <WarmingUp waitSeconds={waitSeconds} />;
  }

  const badgeState =
    connectionState === ConnectionState.Connected ? "connected"
    : connectionState === ConnectionState.Connecting ||
      connectionState === ConnectionState.Reconnecting ? "connecting"
    : connectionState === ConnectionState.Disconnected ? "disconnected"
    : "idle";

  const isSpeaking = agentState === "speaking";
  const isListening = agentState === "listening";

  const statusText =
    agentState === "speaking" ? "Zara is speaking..."
    : agentState === "thinking" ? "Processing..."
    : agentState === "listening" ? "Listening..."
    : "Ready";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-start pt-8 px-4 pb-8">
      <RoomAudioRenderer />

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Zara</h1>
            <p className="text-slate-400 text-sm">AI by Faiz Shaikh</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge state={badgeState} />
            <span className="text-slate-400 text-sm font-mono">
              {formatDuration(callDuration)}
            </span>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping scale-150" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping scale-125" />
              </>
            )}
            <div
              className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-2xl transition-all duration-300 ${
                isSpeaking ? "scale-110 shadow-violet-500/50" : "scale-100"
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-10 h-10 text-white" />
              ) : isListening ? (
                <Mic className="w-10 h-10 text-white" />
              ) : (
                <MicOff className="w-10 h-10 text-white/60" />
              )}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="text-slate-400 text-sm">{statusText}</span>
        </div>

        {/* Transcript */}
        <div
          ref={transcriptRef}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 h-72 overflow-y-auto scrollbar-hide mb-6 space-y-3"
        >
          {transcriptions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-600 text-sm text-center">
                Conversation will appear here...
                <br />
                Start speaking to Zara!
              </p>
            </div>
          ) : (
            transcriptions.map((seg) => {
              const isUser =
                seg.participantInfo.identity === localParticipant?.identity;
              return (
                <div
                  key={seg.streamInfo.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-violet-600/80 text-white rounded-tr-sm"
                        : "bg-slate-700/80 text-slate-100 rounded-tl-sm"
                    }`}
                  >
                    {seg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* End button */}
        <div className="flex justify-center">
          {showEndConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">End conversation?</span>
              <button
                onClick={onEnd}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Yes, end
              </button>
              <button
                onClick={() => setShowEndConfirm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowEndConfirm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 hover:text-red-300 font-medium rounded-2xl transition-all duration-200"
            >
              <PhoneOff className="w-4 h-4" />
              End Conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VoiceInterface({ token, serverUrl, onEnd }) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onDisconnected={onEnd}
    >
      <CallUI onEnd={onEnd} />
    </LiveKitRoom>
  );
}
