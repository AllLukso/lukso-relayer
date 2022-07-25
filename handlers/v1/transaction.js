require("dotenv").config();
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const UniversalProfileContract = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const ethers = require("ethers");

const controllingAccountPrivateKey = process.env.PK;

async function execute(req, res, next) {
  try {
    const db = req.app.get("db");
    // TODO: Switch out for my own node(s)?
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.l16.lukso.network"
    );

    const wallet = new ethers.Wallet(controllingAccountPrivateKey, provider);

    const universalProfileContract = new ethers.Contract(
      req.body.address,
      UniversalProfileContract.abi,
      wallet
    );

    const keyManagerAddress = await universalProfileContract.owner();

    const message = ethers.utils.solidityKeccak256(
      ["uint", "address", "uint", "bytes"],
      [
        2828,
        keyManagerAddress,
        req.body.transaction.nonce,
        req.body.transaction.abi,
      ]
    );

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      req.body.transaction.signature
    );

    await db.task(async (t) => {
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

      if (!transactionQuota)
        throw "universal profile not found, please sign up and register your universal profile to execute requests";

      if (transactionQuota.gas_used > transactionQuota.monthly_gas)
        throw "over gas limit";
    });

    const keyManager = new ethers.Contract(
      keyManagerAddress,
      KeyManagerContract.abi,
      wallet
    );

    // TODO: From the docs "Calculate and return transaction hash in response."
    // Maybe this means I just queue the transaction and manually calculate what the transaction hash will be.
    // Return this and then I can execute the transactions as I see fit.
    const executeRelayCallTransaction = await keyManager.executeRelayCall(
      req.body.transaction.signature,
      req.body.transaction.nonce,
      req.body.transaction.abi
    );

    console.log(executeRelayCallTransaction);

    // TODO: Use the gasLimit returned here to immediately decrement the "pending gas limit", if sending another transaction takes their pending limit down too low reject the transaction.
    // Wait until their "pending gas limit" equals their actual "gas remaining" we can sync these values when the transaction confirms. We need to start a job to monitor this transaction and wait until it confirms?

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
