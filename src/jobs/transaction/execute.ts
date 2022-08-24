import Queue from "bull";
import dotenv from "dotenv";
dotenv.config();
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import { ethers } from "ethers";
import db from "../../db";
import transactionQueue from "./queue";

const controllingAccountPrivateKey = process.env.PK;
const rpcURL = process.env.RPC_URL;
const provider = new ethers.providers.JsonRpcProvider(rpcURL);
// TODO: Need to make sure we use the same wallet here that was used in trasaction.execute
// When we start using multiple wallets, we can look up the private key using the relayer_address that was set when the transaction was created.
// Each instance of the relayer will have a private key injected into it, we will need to know which relayer handled the initial request so we can have that same relayer job pick it up.
const wallet = new ethers.Wallet(controllingAccountPrivateKey!, provider);

transactionQueue.process(async (job: Queue.Job) => {
  try {
    const { kmAddress, transactionId } = job.data;
    const keyManager = new ethers.Contract(
      kmAddress,
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
      // TODO: Need to set a maximum number of retries here so we don't retry infinitely.

      // TODO: In the above case need to change nonces for all other transactions so they don't get stuck, this changes all the hashes too.. Bad last resort type scenario.
      transactionQueue.add(
        { kmAddress, transactionId },
        { delay: 60000 } // Wait one minute and try again to see if other jobs have cleared yet...
      );
      return;
    }

    // TODO: Force this to fail and see what happens. How can we recover from this?
    const executeRelayCallTransaction = await keyManager.executeRelayCall(
      transaction.signature,
      transaction.nonce,
      transaction.abi,
      {
        nonce: transaction.relayer_nonce,
      }
    );
  } catch (err) {
    console.log(err);
  }
});
