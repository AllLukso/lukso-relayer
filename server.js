require("dotenv").config();
const express = require("express");
const transaction = require("./handlers/v1/transaction");
const user = require("./handlers/v1/user");
const app = express();
const port = 3000;

// Database.
const dbPort = 5432;
const pgp = require("pg-promise")({});
const dbConnection = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}:${dbPort}/${process.env.DB_DATABASE}`;
const db = pgp(dbConnection);
app.set("db", db);

// Middleware.
app.use(express.json());
// TODO: Add auth middleware that checks if user still has gas left to use.
//  User can be on the free tier or a paid tier that will give them more gas use.
//  Require users to sign up and verify with an email to help avoid bot spam?
//  Need a data base to store user information about their gas usage and user credentials.

// Transaction endpoints.
app.post("/v1/execute", transaction.execute);
app.post("/v1/quota", transaction.quota);

// User endpoints.
app.post("/v1/user", user.create);

// Error handler middleware should be last.
app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
