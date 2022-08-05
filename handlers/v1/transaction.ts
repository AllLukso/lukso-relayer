require("dotenv").config();
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import PG from "pg-promise";
import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";
import Queue from "bull";
const CHAIN_ID = process.env.CHAIN_ID;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PK;

const transactionQueue = new Queue("transaction-execution", {
  redis: { port: 6379, host: process.env.REDIS_HOST },
});

async function execute(req: Request, res: Response, next: NextFunction) {
  try {
    const db = req.app.get("db");
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(
      ethers.utils.formatBytes32String(PRIVATE_KEY!),
      provider
    );
    const { address, transaction } = req.body;

    const universalProfileContract = new ethers.Contract(
      address,
      UniversalProfileContract.abi,
      wallet
    );

    console.time("owner");
    const keyManagerAddress = await universalProfileContract.owner();
    console.timeEnd("owner");

    // TODO: may need to extract the channelId and nonce from the transaction.nonce, then check to make sure I don't try to submit out of order nonces on the same channel?
    // First 128 bits of the nonce are the channelId and last 128 bits are the actual nonce.
    const message = ethers.utils.solidityKeccak256(
      ["uint", "address", "uint", "bytes"],
      [CHAIN_ID, keyManagerAddress, transaction.nonce, transaction.abi]
    );

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      transaction.signature
    );

    console.time("database");
    const signer = await db.task(async (t: PG.ITask<{}>) => {
      const signer = await t.oneOrNone(
        "SELECT * FROM signers WHERE address = $1",
        signerAddress
      );

      if (!signer) throw "signer was not approved";

      const universalProfile = await t.oneOrNone(
        "SELECT * FROM universal_profiles WHERE user_id = $1 AND address = $2",
        [signer.user_id, req.body.address]
      );

      if (!universalProfile)
        throw "universal profile not approved please approve for your account and try again";

      const transactionQuota = await db.oneOrNone(
        "SELECT monthly_gas, gas_used FROM transaction_quotas WHERE user_id = $1",
        signer.user_id
      );

      if (!transactionQuota) throw "transaction quota not found";

      if (transactionQuota.gas_used > transactionQuota.monthly_gas)
        throw "over gas limit";

      return signer;
    });
    console.timeEnd("database");

    const keyManager = new ethers.Contract(
      keyManagerAddress,
      KeyManagerContract.abi,
      wallet
    );

    console.time("gas");
    const estimatedGas = await keyManager.estimateGas.executeRelayCall(
      transaction.signature,
      transaction.nonce,
      transaction.abi
    );
    console.timeEnd("gas");
    console.log("estimatedGas: ", estimatedGas.toNumber());

    await db.none(
      "UPDATE transaction_quotas SET gas_used = gas_used + $1 WHERE user_id = $2",
      [estimatedGas.toNumber(), signer.user_id]
    );

    // TODO: This takes about 5 seconds, if we can stick this in a job that would be great, but need to figure out how to calculate the correct transaction hash AND ensure it is still the same
    // When this actually executes.
    console.time("call");
    const executeRelayCallTransaction = await keyManager.executeRelayCall(
      transaction.signature,
      transaction.nonce,
      transaction.abi
    );
    console.timeEnd("call");

    console.log(executeRelayCallTransaction);

    // Enqueue a job here that will get the transaction receipt for this transaction and upate the actual gas used.

    res.json({ transactionHash: executeRelayCallTransaction.hash });
  } catch (err) {
    console.log(err);
    return next("failed to execute transaction");
  }
}

async function quota(req: Request, res: Response, next: NextFunction) {
  try {
    const db = req.app.get("db");
    const { address, timestamp, signature } = req.body;

    const now = new Date().getTime();
    const timeDiff = now - timestamp;
    if (timeDiff > 5000 || timeDiff < -5000)
      throw "timestamp must be +/- 5 seconds";

    const message = ethers.utils.solidityKeccak256(
      ["address", "uint"],
      [address, timestamp]
    );

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );

    const transactionQuota = await db.task(async (t: PG.ITask<{}>) => {
      let transactionQuota;
      transactionQuota = await t.oneOrNone(
        "SELECT * FROM transaction_quotas WHERE owner_address = $1",
        address
      );

      if (!transactionQuota) {
        transactionQuota = await t.one(
          "INSERT INTO transaction_quotas(owner_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
          [address, 650000, 0]
        );
      }

      if (signerAddress === address) return transactionQuota;

      const signerQuota = await t.oneOrNone(
        "SELECT * FROM transaction_quotas WHERE owner_address = $1",
        signerAddress
      );

      return {
        gas_used: transactionQuota.gas_used + signerQuota.gas_used,
        monthly_gas: transactionQuota.monthly_gas + signerQuota.monthly_gas,
      };
    });

    const date = new Date();
    const firstOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    );

    res.json({
      quota: transactionQuota.gas_used,
      unit: "gas",
      totalQuota: transactionQuota.monthly_gas,
      resetDate: firstOfNextMonth.getTime(),
    });
  } catch (err) {
    console.log(err);
    return next("failed to get quota");
  }
}

async function execute_v2(req: Request, res: Response, next: NextFunction) {
  try {
    const address: string = req.body.address;
    const nonce: string = req.body.nonce;
    const abi: string = req.body.abi;
    const signature: string = req.body.signature;
    validateExecuteParams(address, nonce, abi, signature);

    const db = req.app.get("db");
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(
      ethers.utils.formatBytes32String(PRIVATE_KEY!),
      provider
    );

    const universalProfileContract = new ethers.Contract(
      address,
      UniversalProfileContract.abi,
      wallet
    );
    const keyManagerAddress = await universalProfileContract.owner();
    const keyManager = new ethers.Contract(
      keyManagerAddress,
      KeyManagerContract.abi,
      wallet
    );

    const estimatedGasBN = await keyManager.estimateGas.executeRelayCall(
      signature,
      nonce,
      abi
    );
    const estimatedGas = estimatedGasBN.toNumber();

    await db.task((t: PG.ITask<{}>) =>
      ensureRemainingQuota(
        t,
        estimatedGas,
        address,
        keyManagerAddress,
        nonce,
        abi,
        signature
      )
    );

    // TODO: Doing all this extra work to populate X2, sign, and parse, the transaction almost equals the amount of time to just submit and wait for it to come back...
    // const unsignedTx = await keyManager.populateTransaction.executeRelayCall(
    //   signature,
    //   nonce,
    //   abi
    // );

    // const populatedUnsignedTx = await wallet.populateTransaction(unsignedTx);
    // const signedTx = await keyManager.signer.signTransaction(
    //   populatedUnsignedTx
    // );
    // const parsedTx = ethers.utils.parseTransaction(signedTx);
    // console.log("parsedTx: ", parsedTx);

    // TODO: I think I can use a KeyManager to submit my transactions, then I would be able to create a nonce and assign it to the transaction to be used and it won't conflict with any other transactions going out.
    // 1. Create a UP for the relayer to use
    // 2. Store the signers private key
    // 3. Store "pending transactions" in the database with a random nonce assigned to them.
    // 4. When executing these transactions they won't conflict with each other on my UP.

    const tx = await keyManager.executeRelayCall(signature, nonce, abi);

    res.json({ transactionHash: tx.hash });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

async function execute_v3(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      address,
      transaction: { nonce, abi, signature },
    } = req.body;
    validateExecuteParams(address, nonce, abi, signature);

    const db = req.app.get("db");
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

    const universalProfileContract = new ethers.Contract(
      address,
      UniversalProfileContract.abi,
      wallet
    );
    const keyManagerAddress = await universalProfileContract.owner();
    const keyManager = new ethers.Contract(
      keyManagerAddress,
      KeyManagerContract.abi,
      wallet
    );

    const estimatedGasBN = await keyManager.estimateGas.executeRelayCall(
      signature,
      nonce,
      abi
    );
    const estimatedGas = estimatedGasBN.toNumber();
    const quota = await ensureRemainingQuotaV3(db, estimatedGas, address);
    const channel_id = extractChannelId(nonce);

    const message = ethers.utils.solidityKeccak256(
      ["uint", "address", "uint", "bytes"],
      [CHAIN_ID, keyManagerAddress, nonce, abi]
    );

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );
    await db.none(
      "INSERT INTO transactions_v3(universal_profile_address, nonce, signature, abi, channel_id, status, signer_address) VALUES($1, $2, $3, $4, $5, $6, $7)",
      [address, nonce, signature, abi, channel_id, "PENDING", signerAddress]
    );

    // Calculate hash and return to caller.

    // Wait 5 seconds to let other transactions come in.

    // Check if there is a pending transaction on the same channel with a smaller nonce?
    res.json({ transactionHash: "0xabc" });
  } catch (err) {
    console.log(err);
    next("Failed to execute_v3");
  }
}

function extractChannelId(nonce: string): number {
  const bn = ethers.BigNumber.from(nonce);
  return bn.shr(128).toNumber();
}

function validateExecuteParams(
  address: string,
  nonce: string,
  abi: string,
  signature: string
) {
  if (address === undefined || address === "") throw "address must be present";
  if (nonce === undefined) throw "nonce must be present";
  if (abi === undefined || abi === "") throw "abi must be present";
  if (signature === undefined || signature === "")
    throw "signature must be present";
}

type Quota = {
  monthly_gas: Number;
  gas_used: Number;
  estimated_gas_used: Number;
  universal_profile_address: String;
};

async function ensureRemainingQuotaV3(
  db: PG.IDatabase<{}>,
  estimatedGas: number,
  address: string
): Promise<Quota> {
  return await db.task(async (t: PG.ITask<{}>) => {
    let quota = await t.oneOrNone(
      "SELECT * FROM quotas_v3 WHERE universal_profile_address = $1",
      address
    );
    if (quota && quota.gas_used + estimatedGas <= quota.monthly_gas)
      return quota;

    // Making it here means they are out of gas on the main UP
    const approvedUniversalProfiles = await t.any(
      "SELECT * FROM approved_universal_profiles_v3 WHERE approved_address = $1",
      address
    );
    if (approvedUniversalProfiles.length === 0) throw "gas limit reached";

    // Get the quota of the UP that approved this UP
    for (let i = 0; i < approvedUniversalProfiles.length; i++) {
      quota = await t.oneOrNone(
        "SELECT * FROM quotas_v3 WHERE universal_profile_address = $1",
        approvedUniversalProfiles[i].approver_address
      );
      // Found a quota with enough gas to run the transaction
      if (quota.gas_used + estimatedGas <= quota.monthly_gas) break;
    }

    if (!quota) throw "gas limit reached";
    if (quota.gas_used + estimatedGas > quota.monthly_gas)
      throw "gas limit reached";
    return quota;
  });
}

async function ensureRemainingQuota(
  t: PG.ITask<{}>,
  estimatedGas: number,
  address: string,
  keyManagerAddress: string,
  nonce: string,
  abi: string,
  signature: string
) {
  let usingSignerQuota = false;
  let signerAddress;
  let tq;
  tq = await t.oneOrNone(
    "SELECT * FROM transaction_quotas WHERE owner_address = $1",
    address
  );
  if (!tq) {
    tq = await t.one(
      "INSERT INTO transaction_quotas(owner_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
      [address, 650000, 0]
    );
  }

  if (tq.gas_used + estimatedGas > tq.monthly_gas) {
    // The UP has run out of gas, check if they have a signer with gas available.
    const message = ethers.utils.solidityKeccak256(
      ["uint", "address", "uint", "bytes"],
      [CHAIN_ID, keyManagerAddress, nonce, abi]
    );

    signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );

    // If this UP is over the gas limit then see if there is a signer registered to it that does have available gas.
    tq = await t.oneOrNone(
      "SELECT * FROM transaction_quotas WHERE owner_address = $1",
      signerAddress
    );
    if (!tq) throw "out of gas, upgrade to a pro plan to increase gas limit";
    usingSignerQuota = true;
  }

  if (tq.gas_used + estimatedGas > tq.monthly_gas)
    throw "transaction would exceed gas limit, upgrade to a pro plan to increase gas limit";

  const updateAddress = usingSignerQuota ? signerAddress : address;
  await t.none(
    "UPDATE transaction_quotas SET gas_used = gas_used + $1 WHERE owner_address = $2",
    [estimatedGas, updateAddress]
  );
}

module.exports = { execute, quota, execute_v2, execute_v3 };
