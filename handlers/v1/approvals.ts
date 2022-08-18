import { Request, Response, NextFunction } from "express";

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
    const { approvedAddress, approverAddress } = req.body;
    // TODO: Check that the approverAddress has control of the UP it is approving spend for.

    // 1. Require user to send signed transaction
    // 2. Extract signer address
    // 3. Check that signer address has permission on the UP it is approving
    // Alternatively save this info in the database so we don't have the query the chain everytime for this data. Can just query once, store and then reference our database in the future.
  } catch (err) {
    console.log(err);
    next("failed to create approval");
  }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
  try {
    const { approvedAddress, approverAddress } = req.body;
    // TODO: Check that the signer has permissions to remove from this UP similar to the logic from the create endpoint
    // TODO: Remove the requested address from approved addresses.
  } catch (err) {
    console.log(err);
    next("failed to delete approval");
  }
}
