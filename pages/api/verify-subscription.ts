import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed')
  }

  const { session_id } = req.query

  if (!session_id) {
    return res.status(400).json({ error: 'Missing session_id' })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id as string)
    
    if (session.payment_status === 'paid') {
      // Aquí puedes actualizar el estado de suscripción del usuario en tu base de datos si es necesario
      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ error: 'Payment not completed' })
    }
  } catch (error) {
    console.error('Error verifying subscription:', error)
    return res.status(500).json({ error: 'Error verifying subscription' })
  }
}