const ethers = require("ethers");

async function create(req, res, next) {
  try {
    const db = req.app.get("db");
    const { address, signature } = req.body;

    // Ensure that they own the address they are adding as a signer.
    const message = ethers.utils.solidityKeccak256(["address"], [address]);

    const signer = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );

    if (address !== signer) throw "not address owner";

    await db.task(async (t) => {
      await t.none("INSERT INTO signers(address, user_id) VALUES($1, $2)", [
        address,
        req.user.id,
      ]);
    });

    res.send("added signer");
  } catch (err) {
    console.log(err);
    return next("Failed to create signer");
  }
}

module.exports = { create };
