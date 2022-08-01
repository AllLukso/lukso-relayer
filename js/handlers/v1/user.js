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
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const saltRounds = 10;
const Queue = require("bull");
require("dotenv").config();
const userVerificationQueue = new Queue("user-verification", process.env.REDIS_URL);
function create(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { email, password, confirmPassword } = req.body;
            if (password !== confirmPassword)
                throw "passwords do not match";
            if (email == "")
                throw "email can not be blank";
            bcrypt.hash(password, saltRounds, function (err, hash) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        db.task((t) => __awaiter(this, void 0, void 0, function* () {
                            const user = yield t.one("INSERT INTO users(email, password, verified) VALUES(${email}, ${password}, ${verified}) RETURNING *", {
                                email: email,
                                password: hash,
                                verified: false,
                            });
                            const guid = uuid.v4();
                            console.log(guid);
                            const user_verification = yield t.one("INSERT INTO user_verifications(guid, user_id) VALUES(${guid}, ${user_id}) RETURNING *", {
                                guid: guid,
                                user_id: user.id,
                            });
                            yield t.none("INSERT INTO transaction_quotas(user_id, monthly_gas, gas_used) VALUES($1, $2, $3)", [user.id, 650000, 0]);
                            return guid;
                        }))
                            .then((guid) => {
                            userVerificationQueue.add({ email, guid });
                            res.send("user created");
                        })
                            .catch((err) => {
                            console.log(err);
                            return next(err);
                        });
                    }
                    catch (err) {
                        return next(err.message);
                    }
                });
            });
        }
        catch (err) {
            return next(err);
        }
    });
}
function verify(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { guid } = req.params;
            db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const userVerification = yield t.one("SELECT user_id FROM user_verifications WHERE guid = $1", guid);
                yield t.none("UPDATE users SET verified = true WHERE id = $1", userVerification.user_id);
                yield t.none("DELETE FROM user_verifications WHERE guid = $1", guid);
                const authToken = uuid.v4();
                yield t.none("UPDATE users SET token = $1 WHERE id = $2", [
                    authToken,
                    userVerification.user_id,
                ]);
                return authToken;
            }))
                .then((authToken) => {
                // TODO: Need to redirect the the users dashboard and save the auth token in storage.
                res.redirect(`${process.env.FRONTEND_HOST}/dashboard?authToken=${authToken}`);
            })
                .catch((err) => {
                console.log(err);
                return next("failed to verify user");
            });
        }
        catch (err) {
            console.log(err);
            return next("failed to verify user");
        }
    });
}
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { email, password } = req.body;
            db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const user = yield t.one("SELECT * FROM users WHERE email = $1", email);
                if (!user.verified)
                    return next("user not verified");
                const match = yield bcrypt.compare(password, user.password);
                if (match) {
                    const authToken = uuid.v4();
                    yield t.none("UPDATE users SET token = $1 WHERE id = $2", [
                        authToken,
                        user.id,
                    ]);
                    res.json({ authToken });
                }
                else {
                    return next("wrong password");
                }
            }));
        }
        catch (err) {
            console.log(err);
            return next("login failed");
        }
    });
}
function get(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { email } = req.params;
            const user = yield db.one("SELECT * FROM users WHERE email = $1", email);
            res.json(user);
        }
        catch (err) {
            console.log(err);
            return next("failed to get user");
        }
    });
}
function resendVerification(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = req.app.get("db");
            const { email } = req.body;
            yield db.task((t) => __awaiter(this, void 0, void 0, function* () {
                const user = yield t.oneOrNone("SELECT * FROM users WHERE email = $1", email);
                if (!user)
                    throw "failed to find user";
                yield t.none("DELETE FROM user_verifications WHERE user_id = $1", user.id);
                const guid = uuid.v4();
                yield t.none("INSERT INTO user_verifications(guid, user_id) VALUES($1, $2)", [guid, user.id]);
                userVerificationQueue.add({ email, guid });
            }));
            res.send("verification sent");
        }
        catch (err) {
            console.log(err);
            return next(err);
        }
    });
}
module.exports = { create, get, verify, login, resendVerification };
//# sourceMappingURL=user.js.map