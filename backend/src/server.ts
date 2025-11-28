import express from "express";
import cors from "cors";
import "dotenv/config";

import sleepRoutes from "./routes/sleepRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/sleep-logs", sleepRoutes);
app.use("/api/goals", goalRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`SleepTrack backend listening on port ${PORT}`);
});

