import Queue from "bull";

require("dotenv").config();
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const ethers = require("ethers");

const transactionQueue = new Queue(
  "transaction-execution",
  process.env.REDIS_URL!
);

const controllingAccountPrivateKey = process.env.PK;
const rpcURL = process.env.RPC_URL;

transactionQueue.process(async (job: Queue.Job) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  const wallet = new ethers.Wallet(controllingAccountPrivateKey, provider);
  const { keyManagerAddress, transaction } = job.data;

  const keyManager = new ethers.Contract(
    keyManagerAddress,
    KeyManagerContract.abi,
    wallet
  );

  console.log("about to executeRelayCall");
  console.time("executeRelayCall");
  const executeRelayCallTransaction = await keyManager.executeRelayCall(
    transaction.signature,
    transaction.nonce,
    transaction.abi
  );
  console.time("executeRelayCall");
  console.log("finished executeRelayCall");

  console.log(executeRelayCallTransaction);

  // TODO: Use the gasLimit returned here to immediately decrement the "pending gas limit", if sending another transaction takes their pending limit down too low reject the transaction.
  // Wait until their "pending gas limit" equals their actual "gas remaining" we can sync these values when the transaction confirms. We need to start a job to monitor this transaction and wait until it confirms?
});
