import express from "express";
import { _config } from "./config/config.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import logger from "./utils/logger.js";
import morgan from "morgan";
import accessLogStream from "./utils/morgan.js";
import connectDB from "./config/database.js";

const app = express();
const PORT = _config.PORT;

// Database connection
connectDB().then(() => {
  logger.info("MongoDB connected successfully");
});

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err}`);
  process.exit(1);
});

export default app; 