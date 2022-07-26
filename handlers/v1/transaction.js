require("dotenv").config();
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const UniversalProfileContract = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const ethers = require("ethers");
const Queue = require("bull");

const transactionQueue = new Queue(
  "transaction-execution",
  process.env.REDIS_URL
);

const chainId = process.env.CHAIN_ID;
const rpcURL = process.env.RPC_URL;
const controllingAccountPrivateKey = process.env.PK;

async function execute(req, res, next) {
  try {
    const db = req.app.get("db");
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(controllingAccountPrivateKey, provider);
    const { address, transaction } = req.body;

    const universalProfileContract = new ethers.Contract(
      address,
      UniversalProfileContract.abi,
      wallet
    );

    console.time("owner");
    const keyManagerAddress = await universalProfileContract.owner();
    console.timeEnd("owner");

    const message = ethers.utils.solidityKeccak256(
      ["uint", "address", "uint", "bytes"],
      [chainId, keyManagerAddress, transaction.nonce, transaction.abi]
    );

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      transaction.signature
    );

    console.time("database");
    const signer = await db.task(async (t) => {
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
    return next(err);
  }
}

async function quota(req, res, next) {
  try {
    const db = req.app.get("db");
    const { address, timestamp, signature } = req.body;

    // TODO: verify that the timestamp is +/- 5 seconds?

    const message = ethers.utils.solidityKeccak256(
      ["address", "uint"],
      [address, timestamp]
    );

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );

    await db.task(async (t) => {
      const signer = await t.one(
        "SELECT * FROM signers WHERE address = $1",
        signerAddress
      );

      const transactionQuota = await t.one(
        "SELECT * FROM transaction_quotas WHERE user_id = $1",
        signer.user_id
      );
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

module.exports = { execute, quota };
