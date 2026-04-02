import { useState, useCallback } from "react";
import HeroSection from "./components/HeroSection.jsx";
import VoiceInterface from "./components/VoiceInterface.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import { useVoiceSession } from "./hooks/useVoiceSession.js";

export default function App() {
  const [appState, setAppState] = useState("idle"); // idle | in-call | summary

  const {
    connectionState,
    transcript,
    isSpeaking,
    isListening,
    callDuration,
    summary,
    error,
    connect,
    disconnect,
  } = useVoiceSession();

  const handleStart = useCallback(
    async (visitorName) => {
      await connect(visitorName);
      setAppState("in-call");
    },
    [connect]
  );

  const handleEnd = useCallback(async () => {
    await disconnect();
    setAppState("summary");
  }, [disconnect]);

  const handleRestart = useCallback(() => {
    setAppState("idle");
  }, []);

  if (appState === "idle") {
    return <HeroSection onStart={handleStart} />;
  }

  if (appState === "in-call") {
    return (
      <VoiceInterface
        connectionState={connectionState}
        transcript={transcript}
        isSpeaking={isSpeaking}
        isListening={isListening}
        callDuration={callDuration}
        onEnd={handleEnd}
      />
    );
  }

  return (
    <SummaryCard
      summary={summary}
      transcript={transcript}
      onRestart={handleRestart}
    />
  );
}
