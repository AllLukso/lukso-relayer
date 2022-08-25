import app from "../../../app";
import request from "supertest";
import { ethers } from "ethers";
import {
  setUpKeyManager,
  estimateGas,
  getWalletNonce,
  calcHash,
} from "../../../services/lukso";
import { checkSignerPermissions } from "../../../utils";
import contractAbi from "../../assets/contractAbi.json";
import db from "../../../db";
import txQueue from "../../../jobs/transaction/queue";
import cronJob from "../../../cron/pending_transactions";

jest.mock("../../../services/lukso.ts");
jest.mock("../../../utils");
jest.mock("../../../jobs/transaction/queue");

const upAddress = "0xtest";

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
    afterEach(async () => {
      await db.task(async (t) => {
        await t.none("DELETE FROM transactions");
        await t.none("DELETE FROM quotas");
        await t.none("DELETE FROM approved_quotas");
        await t.none("DELETE FROM universal_profiles");
      });
    });

    describe("when the universal profile does not have any remaining quota", () => {
      describe("when the universal profile does not have any approved quotas", () => {
        beforeEach(async () => {
          await db.none(
            "INSERT INTO universal_profiles(address) VALUES($1)",
            upAddress
          );
          // Create a quota to simulate a user being over their monthly gas limit.
          await db.none(
            "INSERT INTO quotas(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3)",
            [upAddress, 650000, 650000]
          );
        });

        test("it returns the correct errror", async () => {
          mockLukso();
          const response = await request(app)
            .post("/v1/execute")
            .send({
              address: upAddress,
              transaction: {
                abi: "test",
                signature: "test",
                nonce: 0,
              },
            });
          expect(response.statusCode).toBe(500);
          expect(response.body.error).toBe("gas limit reached");
        });
      });

      describe("when the universal profile has an approved quota(s)", () => {
        beforeEach(async () => {
          await db.task(async (t) => {
            await t.none(
              "INSERT INTO universal_profiles(address) VALUES($1)",
              upAddress
            );
            // Create a quota which is over the gas limit
            await t.none(
              "INSERT INTO quotas(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3)",
              [upAddress, 650000, 650000]
            );
            // Create a up and quota that is under gas limit
            await t.none(
              "INSERT INTO universal_profiles(address) VALUES($1)",
              "0xapprover"
            );
            await t.none(
              "INSERT INTO quotas(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3)",
              ["0xapprover", 650000, 0]
            );
            // Share second quota with first UP
            await t.none(
              "INSERT INTO approved_quotas(approved_address, approver_address, monthly_gas, gas_used) VALUES($1, $2, $3, $4)",
              [upAddress, "0xapprover", 650000, 0]
            );
          });
        });

        describe("when the approver's quota has enough gas to execute the tranasction", () => {
          describe("when the approved quota has enough gas to execute the transaction", () => {
            test("it creates the transaction", async () => {
              mockLukso();
              const response = await request(app)
                .post("/v1/execute")
                .send({
                  address: upAddress,
                  transaction: {
                    abi: "test",
                    signature: "test",
                    nonce: 0,
                  },
                });
              expect(response.statusCode).toBe(200);
              const transaction = await db.one(
                "SELECT * FROM transactions WHERE universal_profile_address = $1",
                upAddress
              );

              expect(transaction.estimated_gas).toBe(65432);
              expect(transaction.status).toBe("PENDING");
            });
          });

          describe("when the approved quota does not have enough gas to execute the transaction", () => {
            beforeEach(async () => {
              await db.none("UPDATE approved_quotas SET gas_used = 650000");
            });

            test("it returns the correct error", async () => {
              mockLukso();
              const response = await request(app)
                .post("/v1/execute")
                .send({
                  address: upAddress,
                  transaction: {
                    abi: "test",
                    signature: "test",
                    nonce: 0,
                  },
                });
              expect(response.statusCode).toBe(500);
              expect(response.body.error).toBe("gas limit reached");
            });
          });
        });

        describe("when the approver's quota does not have enough gas to execute the transaction", () => {
          beforeEach(async () => {
            await db.none(
              "UPDATE quotas SET gas_used = 650000 WHERE universal_profile_address = '0xapprover'"
            );
          });

          test("it returns the correct error", async () => {
            mockLukso();
            const response = await request(app)
              .post("/v1/execute")
              .send({
                address: upAddress,
                transaction: {
                  abi: "test",
                  signature: "test",
                  nonce: 0,
                },
              });
            expect(response.statusCode).toBe(500);
            expect(response.body.error).toBe("gas limit reached");
          });
        });
      });
    });

    describe("when the universal profile has enough gas to execute the transaction", () => {
      test("it creates the transaction", async () => {
        mockLukso();
        const response = await request(app)
          .post("/v1/execute")
          .send({
            address: upAddress,
            transaction: {
              abi: "test",
              signature: "test",
              nonce: 0,
            },
          });
        expect(response.statusCode).toBe(200);

        const transaction = await db.one(
          "SELECT * FROM transactions WHERE universal_profile_address = $1",
          upAddress
        );

        expect(transaction.estimated_gas).toBe(65432);
        expect(transaction.status).toBe("PENDING");
      });
    });
  });
});

describe("/quota", () => {
  afterEach(async () => {
    await db.task(async (t) => {
      await t.none("DELETE FROM quotas");
      await t.none("DELETE FROM approved_quotas");
      await t.none("DELETE FROM universal_profiles");
    });
  });

  describe("with invalid params", () => {
    describe("when address is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/quota")
          .send({ timestamp: 1, signature: "abc" });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("address must be present");
      });
    });

    describe("when timestamp is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/quota")
          .send({ address: upAddress, signature: "abc" });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("timestamp must be present");
      });
    });

    describe("when signature is missing", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/quota")
          .send({ address: upAddress, timestamp: 1 });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("signature must be present");
      });
    });

    describe("when timestamp is +/- five seconds from current timestamp", () => {
      test("it returns the correct error", async () => {
        const response = await request(app)
          .post("/v1/quota")
          .send({ address: upAddress, timestamp: 1, signature: "abc" });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("timestamp must be +/- 5 seconds");
      });
    });
  });

  describe("with valid params", () => {
    describe("when the up does not have a quota", () => {
      test("it initializes a new up and quota", async () => {
        const timestamp = new Date().getTime();
        const response = await request(app).post("/v1/quota").send({
          address: "0xcBD46606f1373B26795551657B8Ec5235FB13040",
          timestamp: timestamp,
          signature:
            "0x05def6618f809120e6b4b2a55fe6b3e3bf73a72068fb1fa46371d94a9e368a131d28a6ce7bba50cbc4098372e532b00430f1a83cf1573d731825e0ee880378941c",
        });
        const date = new Date();
        const firstOfNextMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          1
        );
        expect(response.status).toBe(200);
        expect(response.body.quota).toBe(0);
        expect(response.body.unit).toBe("gas");
        expect(response.body.totalQuota).toBe(650000);
        expect(response.body.resetDate).toBe(firstOfNextMonth.getTime());
      });
    });

    describe("when the up already has a quota", () => {
      beforeEach(async () => {
        await db.none(
          "INSERT INTO universal_profiles(address) VALUES($1)",
          "0xcBD46606f1373B26795551657B8Ec5235FB13040"
        );
        // Create a quota to simulate a user being over their monthly gas limit.
        await db.none(
          "INSERT INTO quotas(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3)",
          ["0xcBD46606f1373B26795551657B8Ec5235FB13040", 650000, 650000]
        );
      });

      test("it returns the qutoa", async () => {
        const timestamp = new Date().getTime();
        const response = await request(app).post("/v1/quota").send({
          address: "0xcBD46606f1373B26795551657B8Ec5235FB13040",
          timestamp: timestamp,
          signature:
            "0x05def6618f809120e6b4b2a55fe6b3e3bf73a72068fb1fa46371d94a9e368a131d28a6ce7bba50cbc4098372e532b00430f1a83cf1573d731825e0ee880378941c",
        });
        const date = new Date();
        const firstOfNextMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          1
        );
        expect(response.status).toBe(200);
        expect(response.body.quota).toBe(650000);
        expect(response.body.unit).toBe("gas");
        expect(response.body.totalQuota).toBe(650000);
        expect(response.body.resetDate).toBe(firstOfNextMonth.getTime());
      });

      describe("when the up also has approved quota(s)", () => {
        test.todo(
          "it should add the approved quota to the total quota and quota fields correctly"
        );
      });
    });
  });
});

function mockFunction<T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}

function mockLukso() {
  const contract = new ethers.Contract(
    "0xd9145CCE52D386f254917e481eB44e9943F39138",
    contractAbi
  );
  const setUpKeyManagerMock = mockFunction(setUpKeyManager);
  setUpKeyManagerMock.mockResolvedValue({
    kmAddress: "abc",
    keyManager: contract,
  });
  mockFunction(checkSignerPermissions);
  const estimateGasMock = mockFunction(estimateGas);
  estimateGasMock.mockResolvedValue(65432);
  const getWalletNonceMock = mockFunction(getWalletNonce);
  getWalletNonceMock.mockResolvedValue(0);
  const calcHashMock = mockFunction(calcHash);
  calcHashMock.mockResolvedValue("0xabc");
  mockFunction(txQueue.add);
}
