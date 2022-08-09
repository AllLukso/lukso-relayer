import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import { ethers } from "ethers";
import db from "../../db";

const transactionQueue = new Queue("transaction", process.env.REDIS_URL!);

const controllingAccountPrivateKey = process.env.PK;
const rpcURL = process.env.RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
// TODO: Need to make sure we use the same wallet here that was used in trasaction.execute
const wallet = new ethers.Wallet(controllingAccountPrivateKey!, provider);

transactionQueue.process(async (job: Queue.Job) => {
  const { keyManagerAddress, transactionId } = job.data;
  const keyManager = new ethers.Contract(
    keyManagerAddress,
    KeyManagerContract.abi,
    wallet
  );

  let transaction: any;
  let pendingTransactions: any;
  await db.task(async (t) => {
    transaction = await t.one(
      "SELECT * FROM transactions WHERE id = $1",
      transactionId
    );

    pendingTransactions = await t.any(
      "SELECT * FROM transactions WHERE signer_address = $1 and channel_id = $2 and status = 'PENDING' and nonce < $3",
      [transaction.signer_address, transaction.channel_id, transaction.nonce]
    );
  });

  if (pendingTransactions && pendingTransactions.length > 0) {
    transactionQueue.add(
      { keyManagerAddress, transactionId },
      { delay: 60000 } // Wait one minute and try again to see if other jobs have cleared yet...
    );
    return;
  }

  const executeRelayCallTransaction = await keyManager.executeRelayCall(
    transaction.signature,
    transaction.nonce,
    transaction.abi,
    {
      nonce: transaction.relayer_nonce,
    }
  );
  const receipt = await executeRelayCallTransaction.wait();

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
  });
});
