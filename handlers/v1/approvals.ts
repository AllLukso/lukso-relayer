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
