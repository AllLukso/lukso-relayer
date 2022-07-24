const bcrypt = require("bcrypt");
const emailService = require("../../services/email");
const uuid = require("uuid");
const saltRounds = 10;

async function create(req, res, next) {
  try {
    const db = req.app.get("db");
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) throw "passwords do not match";
    if (email == "") throw "email can not be blank";

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      try {
        const user = await db.one(
          "INSERT INTO users(email, password, verified) VALUES(${email}, ${password}, ${verified}) RETURNING *",
          {
            email: email,
            password: hash,
            verified: false,
          }
        );
        const guid = uuid.v4();
        const user_verification = await db.one(
          "INSERT INTO user_verifications(guid, user_id) VALUES(${guid}, ${user_id}) RETURNING *",
          {
            guid: guid,
            user_id: user.id,
          }
        );
        emailService.sendUserVerification(email, guid);
        res.send("user created");
      } catch (err) {
        return next(err.message);
      }
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create };
