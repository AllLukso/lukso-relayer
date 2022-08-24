import { Request, Response, NextFunction } from "express";

export async function getSubscription(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { upAddress } = req.params;
    const db = req.app.get("db");

    const subscriptions = await db.any(
      "SELECT * FROM subscriptions WHERE universal_profile_address = $1 and status = 'paid'",
      upAddress
    );

    res.json({ subscriptions });
  } catch (err) {
    console.log(err);
    next("failed to get subscription");
  }
}
