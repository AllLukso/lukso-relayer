import { Request, Response, NextFunction, request } from "express";
import { createStripeSession, constructEvent } from "../../services/stripe";

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { priceId } = req.body;
  const session = await createStripeSession(priceId);
  res.json({ url: session.url! });
}

export async function webhooks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = await constructEvent(
        req.body,
        signature as string,
        webhookSecret
      );
    } catch (err) {
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
      console.log("session completed");
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      console.log("invoice paid");
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      console.log("failed invoice pay");
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
}
