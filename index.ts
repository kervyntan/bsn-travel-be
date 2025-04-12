import dotenv from "dotenv";
import express, { Express } from "express";

import Routes from "./controllers/index.controller";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["https://bsn-travel-fe.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", Routes);

app.listen(port, async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URI!)
      .then(() => console.log("Connected to MongoDB"))
      .catch((error) => console.error("Connection error", error));
    console.log(`[server]: Server is running at http://localhost:${port}`);
  } catch (e) {
    console.error(e);
  }
});
