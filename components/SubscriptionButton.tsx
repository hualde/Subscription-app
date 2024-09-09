'use client'

import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SubscriptionButton() {
  const { user } = useUser()
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async () => {
    setIsSubscribing(true)
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      const stripe = await stripePromise
      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        })
        if (result.error) {
          console.error(result.error)
        }
      }
    } catch (error) {
      console.error('Error:', error)
    }
    setIsSubscribing(false)
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isSubscribing || !user}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isSubscribing ? 'Processing...' : 'Subscribe Now'}
    </button>
  )
}