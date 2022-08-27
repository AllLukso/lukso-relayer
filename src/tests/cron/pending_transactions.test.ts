import {
  handlePendingTransactions,
  getTransactionReceipt,
} from "../../cron/pending_transactions";
import db from "../../db";
import { ethers } from "ethers";

jest.mock("ethers");

describe("handlePendingTransactions", () => {
  afterEach(async () => {
    await db.task(async (t) => {
      await t.none("DELETE FROM transactions");
      await t.none("DELETE FROM approved_quotas");
      await t.none("DELETE FROM quotas");
      await t.none("DELETE FROM universal_profiles");
    });
  });

  describe("when there is a pending transaction", () => {
    beforeEach(async () => {
      await db.task(async (t) => {
        await t.none(
          "INSERT INTO universal_profiles(address) VALUES($1)",
          "0xtest"
        );

        await t.none(
          "INSERT INTO quotas(universal_profile_address, gas_used) VALUES($1, $2)",
          ["0xtest", 0]
        );
        await t.none(
          "INSERT INTO transactions(universal_profile_address, status) VALUES($1, $2)",
          ["0xtest", "PENDING"]
        );
      });
    });

    describe("when there receipt is available", () => {
      describe("when the transaction did not use an approved quota", () => {
        it.todo("updates the transactions and quotas gas_used");
      });

      describe("when the transaction used an approved quota", () => {});
    });
  });
});

function mockFunction<T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}
