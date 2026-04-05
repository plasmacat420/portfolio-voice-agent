import { motion } from "framer-motion";
import { Github, Linkedin, Mail, RotateCcw } from "lucide-react";

export default function SummaryCard({ onRestart }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 z-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Check mark */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}
            className="w-16 h-16 bg-violet-600/20 border border-violet-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.25)]"
          >
            <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Thanks for talking with Zara!</h1>
          <p className="text-slate-500 text-sm">A summary has been sent to Faiz.</p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-5 space-y-3 mb-6"
        >
          <p className="text-slate-600 text-xs uppercase tracking-wider font-medium mb-1">Connect with Faiz</p>
          {[
            { icon: Mail, label: "faiz.corsair@gmail.com", href: "mailto:faiz.corsair@gmail.com", accent: "hover:text-violet-300" },
            { icon: Github, label: "github.com/plasmacat420", href: "https://github.com/plasmacat420", accent: "hover:text-slate-200" },
            { icon: Linkedin, label: "linkedin.com/in/prepreater", href: "https://linkedin.com/in/prepreater", accent: "hover:text-sky-300" },
          ].map(({ icon: Icon, label, href, accent }, i) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              whileHover={{ x: 3 }}
              className={`flex items-center gap-3 text-slate-500 ${accent} transition-colors text-sm py-0.5`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </motion.a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-300 transition-colors text-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start a new conversation
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
