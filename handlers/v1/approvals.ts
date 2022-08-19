import { Request, Response, NextFunction } from "express";
import { ethers } from "ethers";
import { checkSignerPermissions } from "../../utils";
import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const web3 = new Web3(RPC_URL!);

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const { address } = req.params;
    const db = req.app.get("db");

    const approvals = await db.any(
      "SELECT * FROM approved_universal_profiles WHERE approver_address = $1",
      address
    );

    res.json({ approvals });
  } catch (err) {
    console.log(err);
    next("Failed to get approvals");
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { approvedAddress, approverAddress, signature } = req.body;
    // TODO: Check that the approverAddress has control of the UP it is approving spend for.

    // 1. Require user to send signed transaction
    const message = ethers.utils.solidityKeccak256(
      ["string"],
      [`I approve ${approvedAddress} to use my quota`]
    );

    // Need to arrayify here to get correct address.
    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );
    await checkSignerPermissions(approverAddress, signerAddress);
    // Getting pas the above check means this signer can approve spend for the UP

    const db = req.app.get("db");

    const approval = await db.one(
      "INSERT INTO approved_universal_profiles(approver_address, approved_address) VALUES($1, $2) RETURNING *",
      [approverAddress, approvedAddress]
    );

    res.json({ approval });
  } catch (err) {
    console.log(err);
    next("failed to create approval");
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const { approvedAddress, approverAddress, signature } = req.body;

    // 1. Require user to send signed transaction
    const message = ethers.utils.solidityKeccak256(
      ["string"],
      [`I revoke ${approvedAddress} to use my quota`]
    );

    // Need to arrayify here to get correct address.
    const signerAddress = ethers.utils.verifyMessage(
      ethers.utils.arrayify(message),
      signature
    );
    await checkSignerPermissions(approverAddress, signerAddress);
    // Getting past the above check means this signer can approve spend for the UP

    const db = req.app.get("db");

    await db.none(
      "DELETE FROM approved_universal_profiles WHERE approver_address = $1 and approved_address = $2",
      [approverAddress, approvedAddress]
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    next("failed to delete approval");
  }
}
