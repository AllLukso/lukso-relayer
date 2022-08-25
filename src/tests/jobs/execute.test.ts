import { handleExecute } from "../../jobs/transaction/execute";
import Queue from "bull";
import db from "../../db";
import { ethers } from "ethers";
import transactionQueue from "../../jobs/transaction/queue";

jest.mock("ethers");
jest.mock("../../jobs/transaction/queue");

const kmAddress = "0xcBD46606f1373B26795551657B8Ec5235FB13040";

describe("handleExecute", () => {
  afterEach(async () => {
    await db.task(async (t) => {
      t.none("DELETE FROM transactions");
      t.none("DELETE FROM universal_profiles");
    });
  });

  beforeEach(async () => {
    await db.none(
      "INSERT INTO universal_profiles(address) VALUES($1)",
      "0xtest"
    );
  });

  describe("when there is not another pending transaction", () => {
    let transaction: any;
    beforeEach(async () => {
      transaction = await db.one(
        "INSERT INTO transactions(universal_profile_address, nonce, channel_id, status) VALUES($1, $2, $3, $4) RETURNING *",
        ["0xtest", 0, 0, "PENDING"]
      );
    });

    test("it executes the transaction", async () => {
      await handleExecute(kmAddress, transaction.id);
    });
  });

  describe("when there is a pending transaction with a lower nonce", () => {
    let transaction: any;
    let enqueued = false;
    beforeEach(async () => {
      await db.one(
        "INSERT INTO transactions(universal_profile_address, nonce, channel_id, status) VALUES($1, $2, $3, $4) RETURNING *",
        ["0xtest", 0, 0, "PENDING"]
      );
      transaction = await db.one(
        "INSERT INTO transactions(universal_profile_address, nonce, channel_id, status) VALUES($1, $2, $3, $4) RETURNING *",
        ["0xtest", 1, 0, "PENDING"]
      );
    });

    test.todo("it reenqueues the transaction");
  });

  describe("when there is a pending transaction with a higher nonce", () => {
    test.todo("it executes the transaction");
  });
});

function mockFunction<T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}
