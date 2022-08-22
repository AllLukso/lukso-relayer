import app from "../../../app";
import request from "supertest";
import { toUtf8Bytes } from "ethers/lib/utils";

describe("/execute", () => {
  describe("with invalid params", () => {
    describe("when 'address' is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/execute")
          .send({
            transaction: { nonce: 1, abi: "a", signature: "sig" },
          });
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("address must be present");
      });
    });

    describe("when nonce is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/execute")
          .send({ address: "0x", transaction: { abi: "a", signature: "sig" } });
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("nonce must be present");
      });
    });

    describe("when abi is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/execute")
          .send({
            address: "0x",
            transaction: { nonce: "0", signature: "sig" },
          });
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("abi must be present");
      });
    });

    describe("when signature is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/execute")
          .send({
            address: "0x",
            transaction: { abi: "a", nonce: "0" },
          });
        expect(response.statusCode).toBe(500);
        expect(response.body.error).toBe("signature must be present");
      });
    });
  });

  describe("with valid params", () => {
    test("it queues the transaction", async () => {
      const response = await request(app)
        .post("/v1/execute")
        .send({
          address: "0x93776992CE0b044aA042fABBc38CDf76C3e54856",
          transaction: {
            abi: "0x44c028fe00000000000000000000000000000000000000000000000000000000000000000000000000000000000000004abb4a4b5a578f25f2c1f2d1d9c24029cb3aea41000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000",
            signature:
              "0xd59103adbfd733132c063206c24022e8f430456820d8fae6b5d06a311432ec0d61b2021d9f50efbe67bfd4be207ab58579e914f70d972e043fabfa6c07bc13df1c",
            nonce: 0,
          },
        });
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe("address must be present");
    });
  });
});
