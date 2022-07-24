require("dotenv").config();
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const UniversalProfileContract = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const ethers = require("ethers");

const controllingAccountPrivateKey = process.env.PK;

async function execute(req, res, next) {
  try {
    const db = req.app.get("db");
    // TODO: It shouldn't be the UP that has a quota, rather a user who is signing the transaction?
    const transactionQuota = await db.oneOrNone(
      "SELECT monthly_gas, gas_used FROM universal_profiles as up JOIN users as u on u.id = up.user_id JOIN transaction_quotas as tq on tq.user_id = u.id WHERE up.address = $1",
      req.body.address
    );

    if (!transactionQuota)
      throw "universal profile not found, please sign up and register your universal profile to execute requests";

    if (transactionQuota.gas_used > transactionQuota.monthly_gas)
      throw "over gas limit";

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

    const keyManager = new ethers.Contract(
      keyManagerAddress,
      KeyManagerContract.abi,
      wallet
    );

    const message = ethers.utils.solidityKeccak256(
      ["uint", "address", "uint", "bytes"],
      [
        2828,
        keyManagerAddress,
        req.body.transaction.nonce,
        req.body.transaction.abi,
      ]
    );

    // TODO: This is the address of the controlling account that signed this message.
    // I should use this to look the user up in the database and get their quota info etc.
    // Require this to be linked to a user in our database, and also require this user to have set up this UP as a profile they would like to send requests to.
    const signer = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      req.body.transaction.signature
    );
    console.log("signer: ", signer);

    return res.send("complete");

    // TODO: From the docs "Calculate and return transaction hash in response."
    // Maybe this means I just queue the transaction and manually calculate what the transaction hash will be.
    // Return this and then I can execute the transactions as I see fit.
    const executeRelayCallTransaction = await keyManager.executeRelayCall(
      req.body.transaction.signature,
      req.body.transaction.nonce,
      req.body.transaction.abi
    );

    res.json({ transactionHash: executeRelayCallTransaction.hash });
  } catch (err) {
    return next(err);
  }
}

function quota(req, res) {
  res.send("quota");
}

module.exports = { execute, quota };
