import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, PhoneOff, Loader2 } from "lucide-react";
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

function formatDuration(s) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function WarmingUp() {
  const tips = [
    "Powered by Groq + Cartesia · sub-second responses",
    "Ask about LLM agents, RAG, MCP, or AI in production",
    "Fully open source · github.com/plasmacat420",
    "Running on LiveKit Cloud · ap-south region",
  ];
  const [tip, setTip] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTip((p) => (p + 1) % tips.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 z-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="relative inline-flex mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-500/30"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
          </div>
        </div>
        <p className="text-white font-semibold mb-1">Zara is joining…</p>
        <p className="text-slate-500 text-sm mb-8">Should be a few seconds</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={tip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="text-xs text-slate-600 bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 rounded-xl max-w-xs"
          >
            {tips[tip]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function WaveBars({ active }) {
  return (
    <div className="flex items-center gap-[3px] h-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-gradient-to-t from-violet-700 to-violet-300 ${active ? "wave-bar" : ""}`}
          style={{ height: "100%", transform: active ? undefined : "scaleY(0.15)", transformOrigin: "bottom", opacity: active ? 1 : 0.3 }}
        />
      ))}
    </div>
  );
}

function CallUI({ onEnd }) {
  const { state: agentState } = useVoiceAssistant();
  const connectionState = useConnectionState();
  const remoteParticipants = useRemoteParticipants();
  const { localParticipant } = useLocalParticipant();
  const transcriptions = useTranscriptions();
  const [callDuration, setCallDuration] = useState(0);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const transcriptRef = useRef(null);

  const isConnected = connectionState === ConnectionState.Connected;
  const agentJoined = remoteParticipants.length > 0;
  const isSpeaking = agentState === "speaking";
  const isListening = agentState === "listening";
  const isThinking = agentState === "thinking";

  useEffect(() => {
    if (isConnected && !agentJoined) {
      const t = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
      return () => clearInterval(t);
    }
  }, [isConnected, agentJoined]);

  useEffect(() => {
    if (agentJoined) {
      const start = Date.now();
      const t = setInterval(() => setCallDuration(Math.floor((Date.now() - start) / 1000)), 1000);
      return () => clearInterval(t);
    }
  }, [agentJoined]);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcriptions]);

  if (isConnected && !agentJoined) return <WarmingUp waitSeconds={waitSeconds} />;

  const stateLabel = isSpeaking ? "Speaking" : isThinking ? "Thinking…" : isListening ? "Listening" : "Ready";
  const stateColor = isSpeaking ? "text-violet-300" : isThinking ? "text-amber-300" : isListening ? "text-sky-300" : "text-slate-500";
  const orbGlow = isSpeaking
    ? "shadow-[0_0_60px_rgba(139,92,246,0.7),0_0_120px_rgba(139,92,246,0.3)]"
    : isListening
    ? "shadow-[0_0_40px_rgba(56,189,248,0.4)]"
    : "shadow-[0_0_20px_rgba(139,92,246,0.2)]";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between py-8 px-4 z-10">
      <RoomAudioRenderer />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg flex items-center justify-between"
      >
        <div>
          <p className="text-white font-semibold">Zara</p>
          <p className="text-slate-600 text-xs">AI by Faiz Shaikh</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-slate-400 text-xs font-mono">{formatDuration(callDuration)}</span>
        </div>
      </motion.div>

      {/* Orb area */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Outer pulse rings */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {isSpeaking && (
              <>
                {[1.6, 1.35, 1.15].map((scale, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.4 }}
                    animate={{ scale: [1, scale], opacity: [0.4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                    className="absolute w-28 h-28 rounded-full bg-violet-500/20"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Orb */}
          <motion.div
            animate={{ scale: isSpeaking ? 1.08 : 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 flex items-center justify-center transition-shadow duration-700 ${orbGlow}`}
          >
            <Mic className={`w-10 h-10 transition-all duration-300 ${isSpeaking ? "text-white scale-110" : isListening ? "text-sky-200" : "text-white/60"}`} />
          </motion.div>
        </div>

        {/* Wave + status */}
        <div className="flex flex-col items-center gap-2">
          <WaveBars active={isSpeaking} />
          <motion.p
            key={stateLabel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-medium ${stateColor}`}
          >
            {stateLabel}
          </motion.p>
        </div>
      </div>

      {/* Transcript */}
      <div className="relative z-10 w-full max-w-lg flex flex-col gap-4">
        <div
          ref={transcriptRef}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 h-52 overflow-y-auto scrollbar-hide space-y-2"
        >
          {transcriptions.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-700 text-xs text-center">Conversation will appear here…</p>
            </div>
          ) : (
            transcriptions.map((seg) => {
              const isUser = seg.participantInfo.identity === localParticipant?.identity;
              return (
                <motion.div
                  key={seg.streamInfo.id}
                  initial={{ opacity: 0, x: isUser ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-violet-600/70 text-white rounded-tr-sm"
                      : "bg-white/[0.05] text-slate-200 rounded-tl-sm"
                  }`}>
                    {seg.text}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* End button */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {confirmEnd ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <span className="text-slate-500 text-xs">End conversation?</span>
                <button onClick={onEnd} className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white text-xs font-medium rounded-lg transition-colors">
                  End
                </button>
                <button onClick={() => setConfirmEnd(false)} className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-medium rounded-lg transition-colors">
                  Cancel
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfirmEnd(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.04] hover:bg-red-500/10 border border-white/[0.07] hover:border-red-500/40 text-slate-500 hover:text-red-400 text-sm font-medium rounded-xl transition-all duration-200"
              >
                <PhoneOff className="w-4 h-4" /> End call
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function VoiceInterface({ token, serverUrl, onEnd }) {
  return (
    <LiveKitRoom token={token} serverUrl={serverUrl} connect audio video={false} onDisconnected={onEnd}>
      <CallUI onEnd={onEnd} />
    </LiveKitRoom>
  );
}
