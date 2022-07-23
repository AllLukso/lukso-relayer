require("dotenv").config();
const KeyManagerContract = require("@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json");
const UniversalProfileContract = require("@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json");
const ethers = require("ethers");

const controllingAccountPrivateKey = process.env.PK;

async function execute(req, res, next) {
  try {
    // Switch out for my own node(s)?
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

    console.log(req.body);

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
