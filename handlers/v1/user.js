const bcrypt = require("bcrypt");
const emailService = require("../../services/email");
const uuid = require("uuid");
const saltRounds = 10;

async function create(req, res, next) {
  // TODO: Have the user sign a message with the controlling key of their universal profile and then verify that control the private key,
  //    Once verified I can store that address in the database associated with thet user.
  try {
    const db = req.app.get("db");
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) throw "passwords do not match";
    if (email == "") throw "email can not be blank";

    bcrypt.hash(password, saltRounds, async function (err, hash) {
      try {
        db.task(async (t) => {
          const user = await t.one(
            "INSERT INTO users(email, password, verified) VALUES(${email}, ${password}, ${verified}) RETURNING *",
            {
              email: email,
              password: hash,
              verified: false,
            }
          );
          const guid = uuid.v4();
          console.log(guid);
          const user_verification = await t.one(
            "INSERT INTO user_verifications(guid, user_id) VALUES(${guid}, ${user_id}) RETURNING *",
            {
              guid: guid,
              user_id: user.id,
            }
          );

          await t.none(
            "INSERT INTO transaction_quotas(user_id, monthly_gas, gas_used) VALUES($1, $2, $3)",
            [user.id, 650000, 0]
          );

          return guid;
        })
          .then((guid) => {
            emailService.sendUserVerification(email, guid);
            res.send("user created");
          })
          .catch((err) => {
            console.log(err);
            return next(err);
          });
      } catch (err) {
        return next(err.message);
      }
    });
  } catch (err) {
    return next(err);
  }
}

async function verify(req, res, next) {
  try {
    const db = req.app.get("db");
    const { guid } = req.params;

    db.task(async (t) => {
      const userVerification = await t.one(
        "SELECT user_id FROM user_verifications WHERE guid = $1",
        guid
      );

      await t.none(
        "UPDATE users SET verified = true WHERE id = $1",
        userVerification.user_id
      );

      await t.none("DELETE FROM user_verifications WHERE guid = $1", guid);
      const authToken = uuid.v4();
      await t.none("UPDATE users SET token = $1 WHERE id = $2", [
        authToken,
        userVerification.user_id,
      ]);
      return authToken;
    })
      .then((authToken) => {
        res.json({ authToken });
      })
      .catch((err) => {
        console.log(err);
        return next("failed to verify user");
      });
  } catch (err) {
    console.log(err);
    return next("failed to verify user");
  }
}

async function login(req, res, next) {
  try {
    const db = req.app.get("db");
    const { email, password } = req.body;

    db.task(async (t) => {
      const user = await t.one("SELECT * FROM users WHERE email = $1", email);

      if (!user.verified) return next("user not verified");

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const authToken = uuid.v4();
        await t.none("UPDATE users SET token = $1 WHERE id = $2", [
          authToken,
          user.id,
        ]);
        res.json({ authToken });
      } else {
        return next("wrong password");
      }
    });
  } catch (err) {
    console.log(err);
    return next("login failed");
  }
}

module.exports = { create, verify, login };
