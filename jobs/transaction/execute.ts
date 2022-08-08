import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import { ethers } from "ethers";
import db from "../../db";

const transactionQueue = new Queue(
  "transaction-execution",
  process.env.REDIS_URL!
);

const controllingAccountPrivateKey = process.env.PK;
const rpcURL = process.env.RPC_URL;

transactionQueue.process(async (job: Queue.Job) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  const wallet = new ethers.Wallet(controllingAccountPrivateKey!, provider);
  const { keyManagerAddress, transactionId } = job.data;

  console.log("RUNNING JOB");
  console.log("keyManagerAddress: ", keyManagerAddress);
  console.log("transactionId: ", transactionId);

  const keyManager = new ethers.Contract(
    keyManagerAddress,
    KeyManagerContract.abi,
    wallet
  );

  const transaction = await db.one(
    "SELECT * FROM transactions WHERE id = $1",
    transactionId
  );

  // Check if there are other pending transactions from this signer on the same channel?
  const pendingTransactions = await db.any(
    "SELECT * FROM transactions WHERE signer_address = $1 and channel_id = $2 and status = 'PENDING' and nonce < $3",
    [transaction.signer_address, transaction.channel_id, transaction.nonce]
  );

  if (pendingTransactions && pendingTransactions.length > 0) {
    // We are waiting for another transaction to clear
    // queue another job for a few minutes later and return
    transactionQueue.add(
      { keyManagerAddress, transactionId },
      { delay: 60000 } // Wait one minute and try again to see if other jobs have cleared yet...
    );
    return;
  }

  // If we made it here then this transaction is ready to be submitted, submit it.

  console.log("about to executeRelayCall");
  console.time("executeRelayCall");
  const executeRelayCallTransaction = await keyManager.executeRelayCall(
    transaction.signature,
    transaction.nonce,
    transaction.abi,
    {
      nonce: transaction.relayer_nonce,
    }
  );
  console.timeEnd("executeRelayCall");
  console.log("finished executeRelayCall");

  console.log(executeRelayCallTransaction);

  const receipt = await executeRelayCallTransaction.wait();

  console.log("receipt: ", receipt);

  // TODO: Use the gasLimit returned here to immediately decrement the "pending gas limit", if sending another transaction takes their pending limit down too low reject the transaction.
  // Wait until their "pending gas limit" equals their actual "gas remaining" we can sync these values when the transaction confirms. We need to start a job to monitor this transaction and wait until it confirms?
});
