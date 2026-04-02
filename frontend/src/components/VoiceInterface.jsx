import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VoiceInterface({
  connectionState,
  transcript,
  isSpeaking,
  isListening,
  callDuration,
  onEnd,
}) {
  const transcriptRef = useRef(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const statusText = isSpeaking
    ? "Zara is speaking..."
    : isListening
    ? "Listening..."
    : "Processing...";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-start pt-8 px-4 pb-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Zara</h1>
            <p className="text-slate-400 text-sm">Faiz Shaikh&apos;s AI Assistant</p>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge state={connectionState} />
            <span className="text-slate-400 text-sm font-mono">
              {formatDuration(callDuration)}
            </span>
          </div>
        </div>

        {/* Zara Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Outer rings */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping scale-150" />
                <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping scale-125 animation-delay-150" />
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

        {/* Status indicator */}
        <div className="text-center mb-6">
          <span className="text-slate-400 text-sm">{statusText}</span>
        </div>

        {/* Transcript */}
        <div
          ref={transcriptRef}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 h-72 overflow-y-auto scrollbar-hide mb-6 space-y-3"
        >
          {transcript.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-600 text-sm text-center">
                Conversation will appear here...
                <br />
                Start speaking to Zara!
              </p>
            </div>
          ) : (
            transcript.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600/80 text-white rounded-tr-sm"
                      : "bg-slate-700/80 text-slate-100 rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))
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
