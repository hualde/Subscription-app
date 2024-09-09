import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';
import stripeClient from '../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Crear o recuperar el cliente de Stripe
    const customerList = await stripeClient.customers.list({ email: session.user.email });
    let customerId: string;

    if (customerList.data.length === 0) {
      const newCustomer = await stripeClient.customers.create({
        email: session.user.email,
      });
      customerId = newCustomer.id;
    } else {
      customerId = customerList.data[0].id;
    }

    // Crear la suscripción en Stripe
    const subscription = await stripeClient.subscriptions.create({
      customer: customerId,
      items: [{ price: 'price_1MlGU5JCRikowGArAXiMfLCN' }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: 'Error creating subscription' });
  }
}