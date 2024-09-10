import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed')
  }

  const session = await getSession(req, res)
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  try {
    // Aquí deberías obtener el ID de suscripción de Stripe del usuario
    // Esto podría estar almacenado en tu base de datos
    const stripeCustomerId = 'customer_id_from_your_database'

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
    })

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0]
      await stripe.subscriptions.del(subscription.id)

      // Aquí deberías actualizar el estado de suscripción en tu base de datos

      res.json({ success: true, message: 'Subscription cancelled successfully' })
    } else {
      res.status(404).json({ success: false, message: 'No active subscription found' })
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    res.status(500).json({ success: false, message: 'Error cancelling subscription' })
  }
}