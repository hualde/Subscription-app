import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import stripe from '../../lib/stripe';

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
    let customer = await stripe.customers.list({ email: session.user.email });
    let customerId;

    if (customer.data.length === 0) {
      const newCustomer = await stripe.customers.create({
        email: session.user.email,
      });
      customerId = newCustomer.id;
    } else {
      customerId = customer.data[0].id;
    }

    // Crear la suscripción en Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: 'price_1MlGU5JCRikowGArAXiMfLCN' }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating subscription' });
  }
}