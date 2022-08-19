import dotenv from "dotenv";
import KeyManagerContract from "@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json";
import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import PG from "pg-promise";
import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";
import Quota from "../../types/quota";
import txQueue from "../../jobs/transaction/queue";
import { checkSignerPermissions } from "../../utils";
dotenv.config();

const CHAIN_ID = process.env.CHAIN_ID;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PK;
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

export async function execute(req: Request, res: Response, next: NextFunction) {
  try {
    const address: string = req.body.address;
    const nonce: string = req.body.transaction.nonce;
    const abi: string = req.body.transaction.abi;
    const signature: string = req.body.transaction.signature;
    validateExecuteParams(address, nonce, abi, signature);

    const db = req.app.get("db");
    const { kmAddress, keyManager } = await setUpKeyManager(address);
    const signerAddress = getSignerAddress(kmAddress, nonce, abi, signature);
    await checkSignerPermissions(address, signerAddress);
    const estimatedGas = await estimateGas(keyManager, signature, nonce, abi);
    const quota = await ensureRemainingQuota(db, estimatedGas, address);
    const channelId = extractChannelId(nonce);
    const walletNonce = await getWalletNonce(db);
    const hash = await calcHash(keyManager, signature, nonce, abi, walletNonce);

    const transaction = await createTransaction(
      db,
      estimatedGas,
      quota,
      address,
      nonce,
      signature,
      abi,
      channelId,
      signerAddress,
      walletNonce,
      hash!
    );

    txQueue.add({
      kmAddress,
      transactionId: transaction["id"],
    });
    res.json({ transactionHash: hash });
  } catch (err) {
    console.log(err);
    next("Failed to execute");
  }
}

async function calcHash(
  keyManager: ethers.Contract,
  signature: string,
  nonce: string,
  abi: string,
  walletNonce: number
) {
  const unsignedTx = await keyManager.populateTransaction.executeRelayCall(
    signature,
    nonce,
    abi
  );
  const populatedUnsignedTx = await wallet.populateTransaction(unsignedTx);
  populatedUnsignedTx.nonce = walletNonce;
  const signedTx = await keyManager.signer.signTransaction(populatedUnsignedTx);
  const parsedTx = ethers.utils.parseTransaction(signedTx);
  return parsedTx.hash;
}

async function createTransaction(
  db: any,
  estimatedGas: number,
  quota: Quota,
  address: string,
  nonce: string,
  signature: string,
  abi: string,
  channelId: number,
  signerAddress: string,
  walletNonce: number,
  hash: string
) {
  const transaction = await db.tx(async (t: PG.ITask<{}>) => {
    await t.none("UPDATE quotas SET gas_used = gas_used + $1 WHERE id = $2", [
      estimatedGas,
      quota.id,
    ]);
    return await t.one(
      "INSERT INTO transactions(universal_profile_address, nonce, signature, abi, channel_id, status, signer_address, relayer_nonce, relayer_address, estimated_gas, gas_used, hash) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        address,
        nonce,
        signature,
        abi,
        channelId,
        "PENDING",
        signerAddress,
        walletNonce,
        wallet.address,
        estimatedGas,
        0,
        hash,
      ]
    );
  });
  if (!transaction) throw "no transaction";
  return transaction;
}

async function getWalletNonce(db: any) {
  const pendingWalletTransaction = await db.oneOrNone(
    "SELECT * FROM transactions WHERE relayer_address = $1 AND status = 'PENDING' ORDER BY relayer_nonce DESC LIMIT 1",
    [wallet.address]
  );
  let walletNonce: number;
  if (pendingWalletTransaction) {
    walletNonce = Number(pendingWalletTransaction.relayer_nonce) + 1;
  } else {
    walletNonce = await wallet.getTransactionCount();
  }
  return walletNonce;
}

async function estimateGas(
  keyManager: ethers.Contract,
  signature: string,
  nonce: string,
  abi: string
) {
  const estimatedGasBN = await keyManager.estimateGas.executeRelayCall(
    signature,
    nonce,
    abi
  );
  const estimatedGas = estimatedGasBN.toNumber();
  return estimatedGas;
}

function getSignerAddress(
  kmAddress: any,
  nonce: string,
  abi: string,
  signature: string
) {
  const message = ethers.utils.solidityKeccak256(
    ["uint", "address", "uint", "bytes"],
    [CHAIN_ID, kmAddress, nonce, abi]
  );

  // Need to arrayify here to get correct address.
  const signerAddress = ethers.utils.verifyMessage(
    ethers.utils.arrayify(message),
    signature
  );
  return signerAddress;
}

async function setUpKeyManager(address: string) {
  const universalProfileContract = new ethers.Contract(
    address,
    UniversalProfileContract.abi,
    wallet
  );
  const kmAddress = await universalProfileContract.owner();
  const keyManager = new ethers.Contract(
    kmAddress,
    KeyManagerContract.abi,
    wallet
  );
  return { kmAddress, keyManager };
}

export async function quota(req: Request, res: Response, next: NextFunction) {
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
    await checkSignerPermissions(address, signerAddress);

    const { transactionQuota, approvedQuotas } = await db.task(
      async (t: PG.ITask<{}>) => {
        let transactionQuota;
        transactionQuota = await t.oneOrNone(
          "SELECT * FROM quotas WHERE universal_profile_address = $1",
          address
        );

        if (!transactionQuota) {
          transactionQuota = await t.one(
            "INSERT INTO quotas(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
            [address, 650000, 0]
          );
        }

        const approvedUPs = await t.any(
          "SELECT * FROM approved_universal_profiles WHERE approved_address = $1",
          address
        );
        let approvedQuotas;
        if (approvedUPs && approvedUPs.length > 0) {
          const approverAddresses = approvedUPs.map(
            (aup) => aup.approver_address
          );
          approvedQuotas = await t.any(
            "SELECT * FROM quotas WHERE universal_profile_address IN ($1:csv)",
            [approverAddresses]
          );
        }
        return { transactionQuota, approvedQuotas };
      }
    );

    // TODO: Need to add a quota amount to the approved_universal_profiles table, that keep strack of how much of each quota this contract can use.
    let totalQuota = transactionQuota.monthly_gas;
    let gasUsed = transactionQuota.gas_used;
    if (approvedQuotas && approvedQuotas.length > 0) {
      totalQuota = approvedQuotas.reduce(
        (acc: number, aq: any) => aq.monthly_gas + acc,
        totalQuota
      );
      gasUsed = approvedQuotas.reduce(
        (acc: number, aq: any) => aq.gas_used + acc,
        gasUsed
      );
    }

    const date = new Date();
    const firstOfNextMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      1
    );

    res.json({
      quota: gasUsed,
      unit: "gas",
      totalQuota: totalQuota,
      resetDate: firstOfNextMonth.getTime(),
    });
  } catch (err) {
    console.log(err);
    return next("failed to get quota");
  }
}

function validateExecuteParams(
  address: string,
  nonce: string,
  abi: string,
  sig: string
): void {
  if (address === undefined || address === "") throw "address must be present";
  if (nonce === undefined || nonce === "") throw "nonce must be present";
  if (abi === undefined || abi === "") throw "abi must be present";
  if (sig === undefined || sig === "") throw "signature must be present";
}

async function ensureRemainingQuota(
  db: PG.IDatabase<{}>,
  estimatedGas: number,
  address: string
): Promise<Quota> {
  return await db.task(async (t: PG.ITask<{}>) => {
    let quota = await t.oneOrNone(
      "SELECT * FROM quotas WHERE universal_profile_address = $1",
      address
    );

    if (!quota) {
      // Initialize a new quota for this UP.
      const up = await t.oneOrNone(
        "SELECT * FROM universal_profiles WHERE address = $1",
        address
      );
      if (!up) {
        await t.none(
          "INSERT INTO universal_profiles(address, created_at) VALUES($1, $2)",
          [address, new Date()]
        );
      }

      quota = await t.one(
        "INSERT INTO quotas(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
        [address, 650000, 0]
      );
      return quota;
    }

    if (quota.gas_used + estimatedGas <= quota.monthly_gas) return quota;

    // Making it here means they are out of gas on the main UP
    const approvedUniversalProfiles = await t.any(
      "SELECT * FROM approved_universal_profiles WHERE approved_address = $1",
      address
    );
    if (approvedUniversalProfiles.length === 0) throw "gas limit reached";

    // Get the quota of the UP that approved this UP
    for (let i = 0; i < approvedUniversalProfiles.length; i++) {
      quota = await t.oneOrNone(
        "SELECT * FROM quotas WHERE universal_profile_address = $1",
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

function extractChannelId(nonce: string): number {
  const bn = ethers.BigNumber.from(nonce);
  return bn.shr(128).toNumber();
}
