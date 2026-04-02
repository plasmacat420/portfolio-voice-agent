import { useState, useCallback } from "react";
import HeroSection from "./components/HeroSection.jsx";
import VoiceInterface from "./components/VoiceInterface.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import { useVoiceSession } from "./hooks/useVoiceSession.js";

export default function App() {
  const { connectionInfo, appState, error, connect, disconnect } = useVoiceSession();

  const handleStart = useCallback(
    async (visitorName) => {
      await connect(visitorName);
    },
    [connect]
  );

  const handleEnd = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleRestart = useCallback(() => {
    window.location.reload();
  }, []);

  if (appState === "idle" || appState === "connecting" || appState === "error") {
    return <HeroSection onStart={handleStart} error={error} />;
  }

  if (appState === "in-call" && connectionInfo) {
    return (
      <VoiceInterface
        token={connectionInfo.token}
        serverUrl={connectionInfo.livekit_url}
        onEnd={handleEnd}
      />
    );
  }

  return <SummaryCard onRestart={handleRestart} />;
}
