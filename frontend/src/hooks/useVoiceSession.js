import { useCallback, useEffect, useRef, useState } from "react";
import { Room, RoomEvent, ConnectionState } from "livekit-client";
import { fetchToken } from "../api/client";

export function useVoiceSession() {
  const [connectionState, setConnectionState] = useState("idle"); // idle | connecting | connected | disconnected | error
  const [transcript, setTranscript] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const roomRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const addMessage = useCallback((role, content) => {
    setTranscript((prev) => [
      ...prev,
      { role, content, timestamp: new Date().toISOString() },
    ]);
  }, []);

  const connect = useCallback(
    async (visitorName) => {
      setConnectionState("connecting");
      setError(null);
      setTranscript([]);
      setSummary(null);

      try {
        const { token, livekit_url } = await fetchToken(visitorName);

        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        roomRef.current = room;

        room.on(RoomEvent.Connected, () => {
          setConnectionState("connected");
          startTimer();
          setIsListening(true);
        });

        room.on(RoomEvent.Disconnected, async () => {
          setConnectionState("disconnected");
          stopTimer();
          setIsListening(false);
          setIsSpeaking(false);
        });

        room.on(RoomEvent.ConnectionStateChanged, (state) => {
          if (state === ConnectionState.Reconnecting) {
            setConnectionState("connecting");
          }
        });

        // Track agent speaking state via active speakers
        room.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
          const agentSpeaking = speakers.some(
            (p) => p.identity !== "local" && p.isSpeaking
          );
          setIsSpeaking(agentSpeaking);
          setIsListening(!agentSpeaking);
        });

        // Handle data messages for transcript from agent
        room.on(RoomEvent.DataReceived, (data) => {
          try {
            const msg = JSON.parse(new TextDecoder().decode(data));
            if (msg.type === "transcript") {
              addMessage(msg.role, msg.content);
            } else if (msg.type === "summary") {
              setSummary(msg.data);
            }
          } catch {
            // Not JSON data, ignore
          }
        });

        await room.connect(livekit_url, token);

        // Enable microphone
        await room.localParticipant.setMicrophoneEnabled(true);
      } catch (err) {
        console.error("Connection failed:", err);
        setError(err.message || "Failed to connect");
        setConnectionState("error");
      }
    },
    [startTimer, stopTimer, addMessage]
  );

  const disconnect = useCallback(async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
      stopTimer();
    };
  }, [stopTimer]);

  return {
    connectionState,
    transcript,
    isSpeaking,
    isListening,
    callDuration,
    summary,
    error,
    connect,
    disconnect,
    room: roomRef.current,
  };
}
