import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, ArrowRight, X, Mic } from "lucide-react";

const chips = [
  "What has Faiz built?",
  "Tell me about his AI skills",
  "Is he open to work?",
  "How do I reach him?",
];

export default function HeroSection({ onStart, error }) {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const val = input.trim();
    if (!val) return;
    setLoading(true);
    try {
      await onStart(val);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden z-10">

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto w-full">

        {/* Orb */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
          className="relative inline-flex items-center justify-center mb-8"
        >
          {/* Orbit dots */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ width: 96, height: 96 }}>
            <span className="orb-dot-1 absolute w-2 h-2 bg-violet-400 rounded-full shadow-[0_0_8px_2px_rgba(167,139,250,0.8)]" />
            <span className="orb-dot-2 absolute w-1.5 h-1.5 bg-sky-400 rounded-full shadow-[0_0_6px_2px_rgba(56,189,248,0.7)]" />
            <span className="orb-dot-3 absolute w-1 h-1 bg-fuchsia-400 rounded-full shadow-[0_0_6px_2px_rgba(232,121,249,0.7)]" />
          </div>

          {/* Ring */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-24 h-24 rounded-full border border-violet-500/30"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-32 h-32 rounded-full border border-violet-500/15"
          />

          {/* Core */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.5)]">
            <Mic className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            AI Voice Agent · Live
          </div>
          <h1 className="text-6xl sm:text-7xl font-bold text-white mb-4 tracking-tight leading-none">
            Meet{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400">
              Zara
            </span>
          </h1>
          <p className="text-lg text-slate-400 mb-2 font-medium">
            Faiz Shaikh&apos;s AI Voice Assistant
          </p>
          <p className="text-sm text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
            Have a real-time voice conversation. Ask anything about Faiz&apos;s work,
            AI expertise, and projects.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl text-base shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-colors duration-200"
          >
            Start Conversation
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          {error && (
            <p className="mt-3 text-red-400 text-sm">{error}</p>
          )}
        </motion.div>

        {/* Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-wrap gap-2 justify-center"
        >
          {chips.map((q, i) => (
            <motion.span
              key={q}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.07 }}
              className="text-xs text-slate-500 bg-white/[0.03] border border-white/[0.07] px-3 py-1.5 rounded-full"
            >
              {q}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 flex gap-6 items-center"
      >
        <a href="https://github.com/plasmacat420" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-300 transition-colors text-sm">
          <Github className="w-4 h-4" /> plasmacat420
        </a>
        <span className="text-slate-700">·</span>
        <a href="https://linkedin.com/in/prepreater" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-300 transition-colors text-sm">
          <Linkedin className="w-4 h-4" /> prepreater
        </a>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="bg-[#0f0f1a] border border-white/[0.08] rounded-3xl p-8 w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Before we begin</h2>
                  <p className="text-slate-500 text-sm mt-1">How should Zara address you?</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-600 hover:text-slate-300 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Your name or email"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleStart(); if (e.key === "Escape") setShowModal(false); }}
                autoFocus
                className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/60 text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors mb-4"
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStart}
                disabled={!input.trim() || loading}
                className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Connecting...
                  </span>
                ) : (
                  <>Let&apos;s Talk <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
