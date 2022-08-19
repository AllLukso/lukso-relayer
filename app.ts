import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import "./services/stripe";

// Handlers.
import { execute, quota } from "./handlers/v1/transaction";
import {
  get as getApprovals,
  create as createApproval,
  destroy as destroyApproval,
  destroy,
} from "./handlers/v1/approvals";
import {
  createSession,
  webhooks,
  createPortalSession,
} from "./handlers/v1/stripe";
import { getSubscription } from "./handlers/v1/subscription";

const expressApp: Express = express();

// Database.
import db from "./db";
expressApp.set("db", db);

// Jobs.
import "./jobs/transaction/execute";

// Cron.
import "./cron/pending_transactions";
import { createStripePortalSession } from "./services/stripe";

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

// Middleware.
// TODO: Restrict this to only the front end expressApp.
expressApp.use(cors());

// Transaction endpoints.
expressApp.post("/v1/execute", express.json(), execute);
expressApp.post("/v1/quota", express.json(), quota);
// Approval endpoints.
expressApp.get("/v1/approvals/:address", getApprovals);
expressApp.post("/v1/approvals", express.json(), createApproval);
expressApp.post("/v1/approvals/delete", express.json(), destroyApproval);
// Subscription endpoints.
expressApp.get("/v1/subscriptions/:upAddress", express.json(), getSubscription);
// Stripe endpoints.
expressApp.post("/v1/stripe/session", express.json(), createSession);
expressApp.post("/v1/stripe/portal", express.json(), createPortalSession);
// Stripe webhooks.
expressApp.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhooks
);

// Error handler middleware should be last.
expressApp.use((err: string, req: Request, res: Response, next: any) => {
  res.status(500).json({ error: err });
});

export default expressApp;
