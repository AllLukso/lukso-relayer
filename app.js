require("dotenv").config();
const express = require("express");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");
const cors = require("cors");

// Handlers.
const transaction = require("./handlers/v1/transaction");
const user = require("./handlers/v1/user");
const universalProfile = require("./handlers/v1/universalProfile");
const signers = require("./handlers/v1/signer");
const transactionQuota = require("./handlers/v1/transaction_quotas");

const app = express();

// Database.
const dbPort = 5432;
const pgp = require("pg-promise")({});
const dbConnection = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${dbPort}/${process.env.DB_DATABASE}`;
const db = pgp(dbConnection);
app.set("db", db);

// Jobs.
// Transaction jobs.
require("./jobs/transaction/execute");
require("./jobs/email/userVerification");

// Passport.
passport.use(
  new BearerStrategy(async function (token, done) {
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
app.use(express.json());
// TODO: Restrict this to only the front end app.
app.use(cors());

// Transaction endpoints.
app.post("/v1/execute", transaction.execute_v2);
app.post("/v1/quota", transaction.quota);

// User endpoints.
app.post("/v1/user", user.create);
app.post("/v1/user/login", user.login);
app.get("/v1/user/verify/:guid", user.verify);
app.get("/v1/user/:email", user.get);
app.post("/v1/user/resend_verification", user.resendVerification);

// Universal profile endpoints.
app.post(
  "/v1/universal_profile",
  passport.authenticate("bearer", { session: false }),
  universalProfile.create
);

// Signer endpoints.
app.post(
  "/v1/signer",
  passport.authenticate("bearer", { session: false }),
  signers.create
);

// Transaction quota endpoints.
app.post("/v1/transaction_quota", transactionQuota.create);

// Error handler middleware should be last.
app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

module.exports = app;
