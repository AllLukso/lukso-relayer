import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});
import PG from "pg-promise";

export async function createSubscription() {
  const product = await stripe.products.create({
    name: "Starter Subscription",
    description: "$12/Month subscription",
  });
  const price = await stripe.prices.create({
    unit_amount: 1200,
    currency: "usd",
    recurring: {
      interval: "month",
    },
    product: product.id,
  });
  console.log(
    "Success! Here is your starter subscription product id: " + product.id
  );
  console.log(
    "Success! Here is your premium subscription price id: " + price.id
  );
}

export async function createCustomer(db: PG.IDatabase<{}>, upAddress: string) {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: upAddress,
  });

  // TODO: Save the customer.id in your database alongside your user.
  const user = await db.one(
    "INSERT INTO stripe_users(universal_profile_address, stripe_user_id) VALUES($1, $2)",
    [upAddress, customer.id]
  );

  return user.id;
}

export async function createStripeSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        // For metered billing, do not pass quantity
        quantity: 1,
      },
    ],
    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
    // the actual Session ID is returned in the query parameter when your customer
    // is redirected to the success page.
    success_url: `http://${process.env.FRONTEND_HOST}/stripe_success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://${process.env.FRONTEND_HOST}/`,
  });
  return session;
}

export async function constructEvent(
  body: string,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(body, signature, secret);
}
