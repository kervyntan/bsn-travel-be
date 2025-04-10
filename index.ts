import dotenv from "dotenv";
import express, { Express } from "express";

import Routes from "./controllers/index.controller";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", Routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
