'use client'

import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SubscriptionButton() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      
      if (data.sessionId) {
        const stripe = await stripePromise
        const { error } = await stripe!.redirectToCheckout({
          sessionId: data.sessionId,
        })
        if (error) {
          console.error('Stripe redirect error:', error)
        }
      } else {
        console.error('Failed to create Stripe session')
      }
    } catch (error) {
      console.error('Subscription error:', error)
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isLoading || !user}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isLoading ? 'Processing...' : 'Subscribe Now'}
    </button>
  )
}