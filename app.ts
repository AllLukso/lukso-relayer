require("dotenv").config();
import express, { Express, Request, Response } from "express";
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");
const cors = require("cors");

// Handlers.
const transaction = require("./handlers/v1/transaction");
const user = require("./handlers/v1/user");
const universalProfile = require("./handlers/v1/universalProfile");
const signers = require("./handlers/v1/signer");
const transactionQuota = require("./handlers/v1/transaction_quotas");

const expressApp: Express = express();

// Database.
const dbPort = 5432;
const pgp = require("pg-promise")({});
const dbConnection = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${dbPort}/${process.env.DB_DATABASE}`;
const db = pgp(dbConnection);
expressApp.set("db", db);

// Jobs.
// Transaction jobs.
require("./jobs/transaction/execute");
require("./jobs/email/userVerification");

// Passport.
passport.use(
  new BearerStrategy(async function (token: string, done: any) {
    try {
      const user = await db.one("SELECT * FROM users WHERE token = $1", token);
      if (!user) return done(null, false);
      return done(null, user, { scope: "all" });
    } catch (err) {
      return done("failed to authenticate");
    }
  })
);

// Middleware.
expressApp.use(express.json());
// TODO: Restrict this to only the front end expressApp .
expressApp.use(cors());

// Transaction endpoints.
expressApp.post("/v1/execute", transaction.execute_v3);
expressApp.post("/v1/quota", transaction.quota);

// User endpoints.
expressApp.post("/v1/user", user.create);
expressApp.post("/v1/user/login", user.login);
expressApp.get("/v1/user/verify/:guid", user.verify);
expressApp.get("/v1/user/:email", user.get);
expressApp.post("/v1/user/resend_verification", user.resendVerification);

// Universal profile endpoints.
expressApp.post(
  "/v1/universal_profile",
  passport.authenticate("bearer", { session: false }),
  universalProfile.create
);

// Signer endpoints.
expressApp.post(
  "/v1/signer",
  passport.authenticate("bearer", { session: false }),
  signers.create
);

// Transaction quota endpoints.
expressApp.post("/v1/transaction_quota", transactionQuota.create);

// Error handler middleware should be last.
expressApp.use((err: string, req: Request, res: Response, next: any) => {
  res.status(500).json({ error: err });
});

module.exports = expressApp;
