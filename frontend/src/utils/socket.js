import { io } from "socket.io-client";

const socket = io("https://poultry-feed-management-software-3.onrender.com", {
  transports: ["websocket", "polling"], // Add polling as fallback
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add connection listeners for debugging
socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Disconnected:", reason);
});

export default socket;
