import { Request, Response, NextFunction, request } from "express";
import {
  createStripeSession,
  constructEvent,
  createStripePortalSession,
} from "../../services/stripe";
import PG from "pg-promise";

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: Use signed message here to verify that a user who owns the up is attempting to sign up for a subscription.
  const { priceId, upAddress } = req.body;
  const session = await createStripeSession(priceId, upAddress);
  res.json({ url: session.url! });
}

export async function createPortalSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let { returnUrl, upAddress } = req.body;

    const db = req.app.get("db");
    const subscriptions = await db.any(
      "SELECT * FROM subscriptions WHERE universal_profile_address = $1",
      upAddress
    );

    if (!subscriptions) throw "no subscriptions";
    if (!returnUrl) returnUrl = "http://localhost:3001/";

    const portalSession = await createStripePortalSession(
      subscriptions[0].stripe_user_id,
      returnUrl
    );
    res.json({ url: portalSession.url! });
  } catch (err) {
    console.log(err);
    next("failed to create portal session");
  }
}

export async function webhooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let data: any;
  let eventType;
  const db = req.app.get("db");
  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = await constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      console.log(err);
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      await db.oneOrNone(
        "INSERT INTO subscriptions(universal_profile_address, stripe_user_id, plan, status) VALUES($1, $2, $3, $4)",
        [
          data.object.client_reference_id,
          data.object.customer,
          "basic",
          data.object.payment_status,
        ]
      );
      await db.none(
        "UPDATE quotas set monthly_gas = 1600000 WHERE universal_profile_address = $1",
        data.object.client_reference_id
      );
      console.log("session completed");
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      // TODO: Verify the subscription is active
      const customerId = data.customer;
      console.log("invoice paid");
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information

      await db.task(async (t: PG.ITask<{}>) => {
        await t.none(
          "UPDATE subscriptions SET status = $1 WHERE stripe_user_id = $2",
          [data.status, data.customer]
        );

        const subscriptions = await t.any(
          "SELECT * FROM subscriptions WHERE stripe_user_id = $1",
          data.customer
        );

        if (!subscriptions) return;

        const upAddress = subscriptions[0].universal_profile_address;
        await t.none(
          "UPDATE quotas SET monthly_gas = 650000 WHERE universal_profile_address = $1",
          upAddress
        );
      });

      console.log("failed invoice pay");
      break;
    case "customer.subscription.deleted":
      const customer = data.object.customer;
      const status = data.object.status;

      await db.task(async (t: PG.ITask<{}>) => {
        await t.none(
          "UPDATE subscriptions SET status = $1 WHERE stripe_user_id = $2",
          [status, customer]
        );

        const subscriptions = await t.any(
          "SELECT * FROM subscriptions WHERE stripe_user_id = $1",
          customer
        );

        if (!subscriptions) return;

        const upAddress = subscriptions[0].universal_profile_address;
        await t.none(
          "UPDATE quotas SET monthly_gas = 650000 WHERE universal_profile_address = $1",
          upAddress
        );
      });

      console.log("customer deleted subscription");
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
}
