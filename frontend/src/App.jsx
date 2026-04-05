import { useState, useCallback } from "react";
import Background from "./components/Background.jsx";
import HeroSection from "./components/HeroSection.jsx";
import VoiceInterface from "./components/VoiceInterface.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import { useVoiceSession } from "./hooks/useVoiceSession.js";

export default function App() {
  const { connectionInfo, appState, error, connect, disconnect } = useVoiceSession();

  const handleStart = useCallback(async (visitorName) => {
    await connect(visitorName);
  }, [connect]);

  const handleEnd = useCallback(() => disconnect(), [disconnect]);
  const handleRestart = useCallback(() => window.location.reload(), []);

  return (
    <>
      {/* Persistent aurora background — renders behind every screen */}
      <Background />

      {(appState === "idle" || appState === "connecting" || appState === "error") && (
        <HeroSection onStart={handleStart} error={error} />
      )}

      {appState === "in-call" && connectionInfo && (
        <VoiceInterface
          token={connectionInfo.token}
          serverUrl={connectionInfo.livekit_url}
          onEnd={handleEnd}
        />
      )}

      {appState === "ended" && (
        <SummaryCard onRestart={handleRestart} />
      )}
    </>
  );
}
