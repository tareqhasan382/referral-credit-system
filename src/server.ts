import { Server } from "http";
import app from "./app";
import config from "./config";
import connectDB from "./config/db";
import logger from "./config/logger";

const PORT = config.port || 5000;
process.on("uncaughtException", (error) => {
  logger.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

let server: Server;

async function main() {
  try {
    await connectDB(); 

    server = app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to start Server:", error);
  }

  process.on("unhandledRejection", (reason) => {
    logger.error("❌ Unhandled Rejection:", reason);
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });
}

main();

process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      logger.info("HTTP Server closed.");
    });
  }
});