import { Github, Linkedin, Mail, RefreshCw, MessageSquare } from "lucide-react";

export default function SummaryCard({ summary, transcript, onRestart }) {
  const defaultSummary = {
    summary: "You had a great conversation with Zara about Faiz's background and experience.",
    visitor_interest: "Faiz's AI engineering skills and projects.",
    key_topics: ["AI Engineering", "Projects", "Experience"],
    recommended_action: "Reach out to Faiz directly to discuss opportunities.",
  };

  const data = summary || defaultSummary;
  const topics = Array.isArray(data.key_topics) ? data.key_topics : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Thanks for chatting with Zara!</h1>
          <p className="text-slate-400">Here&apos;s a summary of your conversation.</p>
        </div>

        {/* Summary card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6 space-y-5">
          {/* Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Conversation Summary
            </h3>
            <p className="text-slate-200 leading-relaxed">{data.summary}</p>
          </div>

          {/* Visitor interest */}
          {data.visitor_interest && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Your Interest
              </h3>
              <p className="text-slate-300 text-sm">{data.visitor_interest}</p>
            </div>
          )}

          {/* Key topics */}
          {topics.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Topics Covered
              </h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended action */}
          {data.recommended_action && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                Next Step
              </h3>
              <p className="text-blue-200 text-sm">{data.recommended_action}</p>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <a
            href="mailto:faiz.corsair@gmail.com"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Mail className="w-4 h-4" />
            Email Faiz
          </a>
          <a
            href="https://github.com/plasmacat420"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Github className="w-4 h-4" />
            View GitHub
          </a>
          <a
            href="https://linkedin.com/in/prepreater"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </div>

        {/* Restart */}
        <div className="text-center">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Start a new conversation
          </button>
        </div>
      </div>
    </div>
  );
}
