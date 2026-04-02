import { useCallback, useState } from "react";
import { fetchToken } from "../api/client";

/**
 * Manages token fetching and connection info.
 * Actual room connection is handled by <LiveKitRoom> in VoiceInterface.
 */
export function useVoiceSession() {
  const [connectionInfo, setConnectionInfo] = useState(null); // { token, livekit_url }
  const [appState, setAppState] = useState("idle"); // idle | connecting | in-call | ended | error
  const [error, setError] = useState(null);

  const connect = useCallback(async (visitorName) => {
    setAppState("connecting");
    setError(null);
    try {
      const data = await fetchToken(visitorName);
      setConnectionInfo(data);
      setAppState("in-call");
    } catch (err) {
      console.error("Token fetch failed:", err);
      setError(err.message || "Failed to connect");
      setAppState("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAppState("ended");
  }, []);

  return { connectionInfo, appState, error, connect, disconnect };
}
