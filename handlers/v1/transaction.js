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
const privateKey = process.env.PK;

async function execute(req, res, next) {
  try {
    const db = req.app.get("db");
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey, provider);
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
    console.log(err);
    return next("failed to execute transaction");
  }
}

async function quota(req, res, next) {
  try {
    const db = req.app.get("db");
    const { address, timestamp, signature } = req.body;

    // const now = new Date().getTime();
    // const timeDiff = now - timestamp;
    // if (timeDiff > 5 || timeDiff < -5) throw "timestamp must be +/- 5 seconds";

    // const message = ethers.utils.solidityKeccak256(
    //   ["address", "uint"],
    //   [address, timestamp]
    // );

    // const signerAddress = ethers.utils.verifyMessage(
    //   ethers.utils.arrayify(message),
    //   signature
    // );

    const transactionQuota = await db.task(async (t) => {
      // const signer = await t.one(
      //   "SELECT * FROM signers WHERE address = $1",
      //   signerAddress
      // );
      let transactionQuota;
      transactionQuota = await t.oneOrNone(
        "SELECT * FROM transaction_quotas_UP WHERE universal_profile_address = $1",
        address
      );

      if (!transactionQuota) {
        transactionQuota = await t.one(
          "INSERT INTO transaction_quotas_UP(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
          [address, 650000, 0]
        );
      }
      // TODO: Need to also query for the singer and see if they ahve a quota, and add that to the free UP level quota to return their "totalQuota"
      return transactionQuota;
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

async function execute_v2(req, res, next) {
  try {
    // Verify all params
    const {
      address,
      transaction: { nonce, abi, signature },
    } = req.body;
    validateExecuteParams(address, nonce, abi, signature);

    const db = req.app.get("db");
    let quota;
    // TODO: Ok so every UP will by default get a certain gas limit, a specific signer can choose to purchase more and this will be only on their leve, i.e. they are the only ones who can use it.
    // Have them sign a message to confirm they want to increase their quota.
    await db.task(async (t) => {
      quota = await t.oneOrNone(
        "SELECT * FROM transaction_quotas_UP WHERE universal_profile_address = $1",
        address
      );
      if (!quota) {
        quota = await t.none(
          "INSERT INTO transaction_quotas_UP(universal_profile_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
          [address, 650000, 0]
        );
      }
      if (quota.gas_used >= quota.monthly_gas) throw "over gas limit";
    });
    // If we make it here we are not over the gas limit
    const provider = new ethers.providers.JsonRpcProvider(rpcURL);
    const wallet = new ethers.Wallet(privateKey, provider);

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

    console.log("keyManagerAddress: ", keyManagerAddress);
    console.log("address: ", address);
    console.log("signature: ", signature);
    console.log("nonce: ", nonce);
    console.log("abi: ", abi);

    const estimatedGasBN = await keyManager.estimateGas.executeRelayCall(
      signature,
      nonce,
      abi
    );
    const estimatedGas = estimatedGasBN.toNumber();

    if (quota.gas_used + estimatedGas > quota.monthly_gas)
      throw "transaction would exceed gas limit, upgrade to a pro plan to increase gas limit";

    await db.none(
      "UPDATE transaction_quotas_UP SET gas_used = gas_used + $1 WHERE universal_profile_address = $2",
      [estimatedGas, address]
    );

    const executeRelayCallTransaction = await keyManager.executeRelayCall(
      signature,
      nonce,
      abi
    );

    // TODO: Ok maybe this is the wrong hash. Maybe I can just calculate the hash of the transaction that will be executed on the KeyManager and ignore the has of the transaction my EOA is submitting?
    // This would be nice because I could calculate that and return it and then just queue the transaction and submit it whenever I want without worrying about the nonce of my wallet address.
    res.json({ transactionHash: executeRelayCallTransaction.hash });
  } catch (err) {
    return next(err);
  }
}

function validateExecuteParams(address, nonce, abi, signature) {
  if (address === undefined || address === "") throw "address must be present";
  if (nonce === undefined) throw "nonce must be present";
  if (abi === undefined || abi === "") throw "abi must be present";
  if (signature === undefined || signature === "")
    throw "signature must be present";
}

module.exports = { execute, quota, execute_v2 };
