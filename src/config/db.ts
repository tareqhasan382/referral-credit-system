import mongoose from "mongoose";
import config from "."; 
import logger from "./logger";

const connectDB = async (): Promise<void> => {
  try {
    if (!config.database_url) {
      throw new Error("Database URL is missing.");
    }

    await mongoose.connect(config.database_url);
    logger ? 
    logger.info("✅ MongoDB Connected Successfully!") 
    : console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    logger
      ? logger.error("❌ MongoDB Connection Failed:", error)
      : console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit if DB fails to connect
  }

  // Handle disconnection
  mongoose.connection.on("disconnected", () => {
    logger
      ? logger.warn("⚠️ MongoDB disconnected!")
      : console.warn("⚠️ MongoDB disconnected!");
  });
};

export default connectDB;