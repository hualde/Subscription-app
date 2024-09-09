import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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
      return res.status(200).json({ isSubscribed: false })
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
      status: 'active',
    })

    res.status(200).json({ isSubscribed: subscriptions.data.length > 0 })
  } catch (error) {
    console.error('Error checking subscription status:', error)
    res.status(500).json({ error: 'Error checking subscription status' })
  }
}