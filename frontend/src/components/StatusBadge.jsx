export default function StatusBadge({ state }) {
  const config = {
    idle: { label: "Ready", color: "bg-slate-400" },
    connecting: { label: "Connecting...", color: "bg-yellow-400 animate-pulse" },
    connected: { label: "Connected", color: "bg-green-400" },
    disconnected: { label: "Disconnected", color: "bg-slate-400" },
    error: { label: "Error", color: "bg-red-400" },
  };

  const { label, color } = config[state] || config.idle;

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-sm text-slate-300 font-medium">{label}</span>
    </div>
  );
}
