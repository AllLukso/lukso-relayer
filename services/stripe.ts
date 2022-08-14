import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

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
