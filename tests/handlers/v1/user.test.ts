const app = require("../../../app");
const request = require("supertest");

describe("create", () => {
  test("when passwords don't match", (done) => {
    request(app)
      .post("/v1/user")
      .send({
        email: "test@example.com",
        password: "abc",
        confirmPassword: "def",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });

  test("when email is blank", (done) => {
    request(app)
      .post("/v1/user")
      .send({
        email: "",
        password: "abc",
        confirmPassword: "abc",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(500)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });

  test("when all params are provided", (done) => {
    request(app)
      .post("/v1/user")
      .send({
        email: "test@example.com",
        password: "abc",
        confirmPassword: "abc",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
