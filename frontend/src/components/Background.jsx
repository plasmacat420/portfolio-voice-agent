import { motion } from "framer-motion";

/**
 * Persistent full-screen background — aurora blobs + noise grain + dot grid + vignette.
 * Mounted once in App.jsx and stays across all screens.
 */
export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* ── Blob A: deep violet · top-right · primary glow ──────────────── */}
      <motion.div
        className="absolute -top-64 -right-64 w-[900px] h-[900px]"
        style={{
          background: "radial-gradient(circle at center, rgba(109,40,217,0.48) 0%, transparent 65%)",
          filter: "blur(160px)",
        }}
        animate={{
          x: [0, 45, -18, 30, 0],
          y: [0, -35, 22, -12, 0],
          scale: [1, 1.08, 0.96, 1.06, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Blob B: indigo · bottom-left · secondary depth ──────────────── */}
      <motion.div
        className="absolute -bottom-56 -left-56 w-[800px] h-[800px]"
        style={{
          background: "radial-gradient(circle at center, rgba(67,56,202,0.42) 0%, transparent 65%)",
          filter: "blur(150px)",
        }}
        animate={{
          x: [0, -28, 18, -20, 0],
          y: [0, 30, -22, 18, 0],
          scale: [1, 0.94, 1.09, 0.98, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* ── Blob C: fuchsia · center-left · accent warmth ───────────────── */}
      <motion.div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px]"
        style={{
          background: "radial-gradient(circle at center, rgba(168,85,247,0.20) 0%, transparent 60%)",
          filter: "blur(130px)",
        }}
        animate={{
          x: [0, 30, -35, 12, 0],
          y: [0, -25, 18, -28, 0],
          scale: [1, 1.14, 0.91, 1.07, 1],
        }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 9 }}
      />

      {/* ── Blob D: cyan ghost · bottom-right · barely visible ──────────── */}
      <motion.div
        className="absolute -bottom-20 -right-20 w-[450px] h-[450px]"
        style={{
          background: "radial-gradient(circle at center, rgba(6,182,212,0.11) 0%, transparent 58%)",
          filter: "blur(120px)",
        }}
        animate={{
          x: [0, -22, 12, 0],
          y: [0, -16, 10, 0],
          scale: [1, 1.12, 0.94, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 13 }}
      />

      {/* ── Noise grain · breaks digital flatness, adds tactile feel ─────── */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.045,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "250px 250px",
        }}
      />

      {/* ── Dot grid · structural depth, very quiet ──────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.10) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* ── Vignette · slightly darkens edges, keeps eye at center ───────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 40%, rgba(5,5,14,0.65) 100%)",
        }}
      />

    </div>
  );
}
