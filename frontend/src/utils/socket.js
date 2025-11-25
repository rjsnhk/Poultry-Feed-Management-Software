import { io } from "socket.io-client";
import { BASE_URL } from "./apiPaths";

// const socket = io("https://poultry-feed-management-software-3.onrender.com", {
// const socket = io("http://localhost:5000", {
// const socket = io("https://anand-erp.onrender.com", {
const socket = io(BASE_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

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
