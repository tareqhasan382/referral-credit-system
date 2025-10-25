import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import referralRoutes from "./routes/referral.routes";
import purchaseRoutes from "./routes/purchase.routes";
dotenv.config();

const app = express();
app.use(helmet()); // Security headers
app.use(express.json());
app.use(cookieParser());
// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

//app.use(compression()); 
app.use("/api/v1", healthRoutes); // health check
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/referral", referralRoutes);
app.use("/api/v1/Purchase", purchaseRoutes);
app.use(notFound);
app.use(errorHandler); 

export default app;