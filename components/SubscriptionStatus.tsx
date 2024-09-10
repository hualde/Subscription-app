'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function SubscriptionStatus() {
  const { user, isLoading: userLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && !userLoading) {
      checkSubscriptionStatus()
    } else if (!userLoading) {
      setIsLoading(false)
    }
  }, [user, userLoading])

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/check-subscription')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }
      const data = await response.json()
      setIsSubscribed(data.isSubscribed)
    } catch (error) {
      console.error('Error checking subscription status:', error)
    }
    setIsLoading(false)
  }

  const handleUnsubscribe = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/cancel-subscription', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }
      const data = await response.json()
      if (data.success) {
        setIsSubscribed(false)
        // Opcional: Mostrar un mensaje de éxito al usuario
      } else {
        // Opcional: Mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      // Opcional: Mostrar un mensaje de error al usuario
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || userLoading) {
    return <div>Checking subscription status...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="mt-4">
      {isSubscribed ? (
        <div>
          <p className="text-green-500 font-bold mb-2">You are subscribed.</p>
          <button
            onClick={handleUnsubscribe}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Unsubscribe
          </button>
        </div>
      ) : (
        <p className="text-red-500 font-bold">You are not subscribed.</p>
      )}
    </div>
  )
}