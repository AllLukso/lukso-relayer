import cron from "cron";
import db from "../db";
import { ethers } from "ethers";

const CronJob = cron.CronJob;
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

new CronJob({
  cronTime: "0-59 * * * *",
  onTick: async function () {
    const pendingTransactions = await db.any(
      "SELECT * FROM transactions WHERE status = 'PENDING'"
    );

    pendingTransactions.forEach(async (transaction) => {
      const receipt = await provider.getTransactionReceipt(transaction.hash);
      if (!receipt) return;

      await db.task(async (t) => {
        await t.none(
          "UPDATE transactions SET status = 'COMPLETED', gas_used = $1 WHERE id = $2",
          [receipt.gasUsed.toNumber(), transaction.id]
        );

        await t.none(
          "UPDATE quotas SET gas_used = gas_used - $1 + $2 WHERE universal_profile_address = $3",
          [
            transaction.estimated_gas,
            receipt.gasUsed.toNumber(),
            transaction.universal_profile_address,
          ]
        );

        if (transaction.approved_quota_id) {
          await t.none(
            "UPDATE approved_quotas SET gas_used = gas_used - $1 + $2 WHERE id = $3",
            [
              transaction.estimated_gas,
              receipt.gasUsed.toNumber(),
              transaction.approved_quota_id,
            ]
          );
        }
      });
    });
  },
  start: true,
});
