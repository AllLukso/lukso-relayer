import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";

// Handlers.
import { execute, quota } from "./handlers/v1/transaction";

const expressApp: Express = express();

// Database.
import db from "./db";
expressApp.set("db", db);

// Jobs.
import "./jobs/transaction/execute";

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

// Middleware.
expressApp.use(express.json());
// TODO: Restrict this to only the front end expressApp.
expressApp.use(cors());

// Transaction endpoints.
expressApp.post("/v1/execute", execute);
expressApp.post("/v1/quota", quota);

// Error handler middleware should be last.
expressApp.use((err: string, req: Request, res: Response, next: any) => {
  res.status(500).json({ error: err });
});

export default expressApp;
