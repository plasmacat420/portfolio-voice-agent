import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchToken(visitorName) {
  const response = await apiClient.post("/api/token", {
    visitor_name: visitorName,
  });
  return response.data; // { token, room, livekit_url }
}

export async function checkHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}

export default apiClient;
