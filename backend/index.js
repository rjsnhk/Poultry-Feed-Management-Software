// Import core modules and packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const os = require("os");
const cluster = require("cluster");
const cookieParser = require("cookie-parser");
const http = require("http");
const { initSocket } = require("./config/socket");

// Import custom route files
const salesmanRoutes = require("./routes/salesmanRouter");
const adminRoutes = require("./routes/adminRouter");
const managerRoutes = require("./routes/managerRouter");
const authorizerRoutes = require("./routes/authorizerRouter");
const plantHeadRoutes = require("./routes/plantheadRouter");
const accountantRoutes = require("./routes/accountantRouter");
const notificationRoutes = require("./routes/notificationRouter");
const messageRoutes = require("./routes/messageRouter");
const meRoutes = require("./routes/meRouter");

// Create Express app instance
const app = express();

// Import database connection function
const connectDatabase = require("./config/db");

// Define port from .env or fallback to 5000
const PORT = process.env.PORT || 5000;

// Get the number of CPU cores available
const numCPUs = os.cpus().length;

// Use clustering only in production; run single-process in development
// Check if current process is the Master process
if (cluster.isPrimary && process.env.NODE_ENV === "production") {
  console.log(`🔧 Master process ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // Creates a new worker process
  }

  // Restart a worker if it crashes or exits
  let restartCount = 0;
  const MAX_RESTARTS = 5;

  cluster.on("exit", (worker, code, signal) => {
    if (restartCount < MAX_RESTARTS) {
      console.log(`Restarting worker ${worker.process.pid}...`);
      cluster.fork();
      restartCount++;
    } else {
      console.log(`Max restart limit reached. Not forking anymore.`);
    }
  });
} else {
  // Worker process logic starts here

  // 🔗 Connect to MongoDB
  connectDatabase();

  // Enable CORS and parse JSON body
  app.use(
    cors({
      origin: "https://poultry-feed-management-software-4.onrender.com/",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Mount route handlers for each user role
  app.use("/api/admin", adminRoutes);
  app.use("/api/salesman", salesmanRoutes);
  app.use("/api/manager", managerRoutes);
  app.use("/api/authorizer", authorizerRoutes);
  app.use("/api/planthead", plantHeadRoutes);
  app.use("/api/accountant", accountantRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/me", meRoutes);

  // Root route (API health check)
  app.get("/", (req, res) => {
    res.send("<h1>🐣 Poultry Feed Management API Running...</h1>");
  });

  // Start Express server
  const server = http.createServer(app);
  // IMPORTANT: initialize socket.io on the same server instance that listens, inside the worker
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} running at http://localhost:${PORT}`);
  });
}
