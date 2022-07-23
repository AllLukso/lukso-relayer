const express = require("express");
const transaction = require("./handlers/v1/transaction");
const app = express();
const port = 3000;

// Middleware.
app.use(express.json());

// Transaction endpoints.
app.post("/v1/execute", transaction.execute);
app.post("/v1/quota", transaction.quota);

// Error handler middleware should be last.
app.use((err, req, res, next) => {
  res.status(500).json({ error: err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
