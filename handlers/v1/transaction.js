require("dotenv").config();
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const UniversalProfileContract = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const ethers = require("ethers");

const controllingAccountPrivateKey = process.env.PK;

async function execute(req, res, next) {
  try {
    const db = req.app.get("db");

    // TODO: Recover the signers address from the signature, use this to authenticate them and the look them up in the DB
    // Check to make sure they have enough gas to execute the transaciton and reduce their total available gas amount.

    // TODO: query this user and check if they have any remaining gas.
    // const users = await db.any("SELECT * FROM users WHERE token = $1", [req.body.token]);

    // TODO: Switch out for my own node(s)?
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.l16.lukso.network"
    );

    const wallet = new ethers.Wallet(controllingAccountPrivateKey, provider);

    const universalProfile = new ethers.Contract(
      req.body.address,
      UniversalProfileContract.abi,
      wallet
    );

    const keyManagerAddress = await universalProfile.owner();

    const keyManager = new ethers.Contract(
      keyManagerAddress,
      KeyManagerContract.abi,
      wallet
    );

    const networkDetails = await provider.getNetwork();
    const chainId = networkDetails.chainId;

    const message = ethers.utils.soliditySha256(
      ["uint256", "address", "uint256", "bytes"],
      [
        chainId,
        keyManagerAddress,
        req.body.transaction.nonce,
        req.body.transaction.abi,
      ]
    );

    console.log("message: ", message);

    const signer = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      req.body.transaction.signature
    );

    console.log("signer: ", signer);

    return;

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
