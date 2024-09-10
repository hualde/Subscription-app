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
    const customer = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    })

    if (customer.data.length === 0) {
      return res.status(404).json({ error: 'No customer found' })
    }

    const customerId = customer.data[0].id

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    })

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'No active subscription found' })
    }

    const subscription = subscriptions.data[0]
    await stripe.subscriptions.cancel(subscription.id)

    res.status(200).json({ message: 'Subscription cancelled successfully' })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    res.status(500).json({ error: 'Error cancelling subscription' })
  }
}