import ethers from "ethers";
import { Request, Response, NextFunction } from "express";
import PG from "pg-promise";

async function create(req: Request, res: Response, next: NextFunction) {
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

    let user = req.user as User;
    await db.task(async (t: PG.ITask<{}>) => {
      await t.none("INSERT INTO signers(address, user_id) VALUES($1, $2)", [
        address,
        user.id,
      ]);
    });

    res.send("added signer");
  } catch (err) {
    console.log(err);
    return next("Failed to create signer");
  }
}

module.exports = { create };
