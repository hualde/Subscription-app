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
      await fetch('/api/cancel-subscription', { method: 'POST' })
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    } finally {
      // Recargar la página inmediatamente después de la acción de cancelación
      window.location.reload()
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