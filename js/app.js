"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer");
const cors = require("cors");
// Handlers.
const transaction = require("./handlers/v1/transaction");
const user = require("./handlers/v1/user");
const universalProfile = require("./handlers/v1/universalProfile");
const signers = require("./handlers/v1/signer");
const transactionQuota = require("./handlers/v1/transaction_quotas");
const expressApp = (0, express_1.default)();
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
passport.use(new BearerStrategy(function (token, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield db.one("SELECT * FROM users WHERE token = $1", token);
            if (!user)
                return done(null, false);
            return done(null, user, { scope: "all" });
        }
        catch (err) {
            return done("failed to authenticate");
        }
    });
}));
// Middleware.
expressApp.use(express_1.default.json());
// TODO: Restrict this to only the front end expressApp .
expressApp.use(cors());
// Transaction endpoints.
expressApp.post("/v1/execute", transaction.execute_v2);
expressApp.post("/v1/quota", transaction.quota);
// User endpoints.
expressApp.post("/v1/user", user.create);
expressApp.post("/v1/user/login", user.login);
expressApp.get("/v1/user/verify/:guid", user.verify);
expressApp.get("/v1/user/:email", user.get);
expressApp.post("/v1/user/resend_verification", user.resendVerification);
// Universal profile endpoints.
expressApp.post("/v1/universal_profile", passport.authenticate("bearer", { session: false }), universalProfile.create);
// Signer endpoints.
expressApp.post("/v1/signer", passport.authenticate("bearer", { session: false }), signers.create);
// Transaction quota endpoints.
expressApp.post("/v1/transaction_quota", transactionQuota.create);
// Error handler middleware should be last.
expressApp.use((err, req, res, next) => {
    res.status(500).json({ error: err });
});
module.exports = expressApp;
//# sourceMappingURL=app.js.map