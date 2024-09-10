import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription event: ${event.type}`);
      console.log(`Subscription status: ${subscription.status}`);
      // Add your subscription handling logic here
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice paid: ${invoice.id}`);
      // Add your invoice payment success handling logic here
      break;
    case 'invoice.paid':
      const paidInvoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice marked as paid: ${paidInvoice.id}`);
      // Add your invoice paid handling logic here
      break;
    case 'invoice.finalized':
      const finalizedInvoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice finalized: ${finalizedInvoice.id}`);
      // Add your invoice finalized handling logic here
      break;
    case 'invoice.created':
      const createdInvoice = event.data.object as Stripe.Invoice;
      console.log(`Invoice created: ${createdInvoice.id}`);
      // Add your invoice created handling logic here
      break;
    case 'payment_intent.created':
      const createdPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment intent created: ${createdPaymentIntent.id}`);
      // Add your payment intent created handling logic here
      break;
    case 'payment_intent.succeeded':
      const succeededPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment intent succeeded: ${succeededPaymentIntent.id}`);
      // Add your payment intent succeeded handling logic here
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}