'use client'

import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SubscriptionButton() {
  const { user, error, isLoading } = useUser()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <div>
      {!clientSecret && (
        <button
          onClick={handleSubscribe}
          disabled={!user}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Subscribe Now
        </button>
      )}
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{clientSecret}}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}