import ethers from "ethers";
import { Request, Response, NextFunction } from "express";

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { address, signature } = req.body;
    if (address === "" || address === undefined)
      throw "address must be present";
    const message = ethers.utils.solidityKeccak256(["address"], [address]);

    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );

    if (signerAddress !== address)
      throw "only owner can add to transaction quota";

    const db = req.app.get("db");
    const tq = await db.one(
      "INSERT INTO transaction_quotas(owner_address, monthly_gas, gas_used) VALUES($1, $2, $3) RETURNING *",
      [signerAddress, 650000, 0]
    );

    res.json(tq);
  } catch (err) {
    console.log(err);
    return next("failed to create quota");
  }
}

module.exports = { create };
