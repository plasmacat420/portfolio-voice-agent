import { useState } from "react";
import { Mic, Github, Linkedin, X } from "lucide-react";

export default function HeroSection({ onStart }) {
  const [showModal, setShowModal] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!visitorName.trim()) return;
    setLoading(true);
    try {
      await onStart(visitorName.trim());
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleStart();
    if (e.key === "Escape") setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Mic icon with pulse animation */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-violet-500/10 animate-pulse-slow" />
          <div className="relative bg-gradient-to-br from-violet-600 to-blue-600 p-6 rounded-full shadow-2xl">
            <Mic className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
          Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Zara</span>
        </h1>
        <p className="text-xl text-slate-400 mb-2 font-medium">Faiz Shaikh&apos;s AI Assistant</p>
        <p className="text-base text-slate-500 mb-10 leading-relaxed max-w-lg mx-auto">
          Have a real voice conversation to learn about Faiz&apos;s work, skills, and how he can help your team.
          Ask anything — Zara knows it all.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold rounded-2xl text-lg shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-105 hover:shadow-violet-500/40 active:scale-95"
        >
          Start Conversation
        </button>

        {/* What you can ask */}
        <div className="mt-10 flex flex-wrap gap-2 justify-center">
          {[
            "What projects has Faiz built?",
            "What are his AI skills?",
            "Is he open to work?",
            "How do I contact him?",
          ].map((q) => (
            <span
              key={q}
              className="text-xs text-slate-500 bg-slate-800/60 border border-slate-700 px-3 py-1.5 rounded-full"
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* Footer links */}
      <div className="absolute bottom-8 flex gap-6 items-center">
        <a
          href="https://github.com/plasmacat420"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          <Github className="w-4 h-4" />
          plasmacat420
        </a>
        <span className="text-slate-700">·</span>
        <a
          href="https://linkedin.com/in/prepreater"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
        >
          <Linkedin className="w-4 h-4" />
          prepreater
        </a>
      </div>

      {/* Name Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Before we start</h2>
                <p className="text-slate-400 text-sm mt-1">What should Zara call you?</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Your name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all mb-4"
            />
            <button
              onClick={handleStart}
              disabled={!visitorName.trim() || loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200"
            >
              {loading ? "Connecting..." : "Start Talking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
