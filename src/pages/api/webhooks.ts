import { NextApiRequest, NextApiResponse } from "next";

import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relavantEvents = new Set(["checkout.session.completed"]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      const { type } = event;

      if (relavantEvents.has(type)) {
        try {
          switch (type) {
            case "checkout.session.completed":
              const checkoutSession = event.data
                .object as Stripe.Checkout.Session;
              await saveSubscription(
                checkoutSession.subscription.toString(),
                checkoutSession.customer.toString()
              );
              break;
            default:
              throw new Error("unhandled event");
          }
        } catch (e) {
          console.log(e);
          return res.json({ error: "Webhook handler failed." });
        }
      }

      return res.json({ received: true });
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};