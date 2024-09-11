'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function SubscriptionStatus() {
  const { user, isLoading: userLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [unsubscribeMessage, setUnsubscribeMessage] = useState('')

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
      setIsUnsubscribing(true)
      const response = await fetch('/api/cancel-subscription', { method: 'POST' })
      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }
      const data = await response.json()
      if (data.success) {
        setIsSubscribed(false)
        setUnsubscribeMessage('Subscription cancelled successfully. Changes will be reflected soon.')
        setTimeout(() => setUnsubscribeMessage(''), 5000) // Clear message after 5 seconds
      } else {
        throw new Error('Cancellation was not successful')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      setUnsubscribeMessage('An error occurred while cancelling your subscription. Please try again.')
    } finally {
      setIsUnsubscribing(false)
    }
  }

  if (isLoading || userLoading) {
    return <div className="text-center py-4">Checking subscription status...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="mt-4 space-y-4">
      {isSubscribed ? (
        <div>
          <p className="text-green-500 font-bold mb-2">You are subscribed.</p>
          <button
            onClick={handleUnsubscribe}
            disabled={isUnsubscribing}
            className={`
              bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
              transition-colors duration-200
              ${isUnsubscribing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isUnsubscribing ? 'Cancelling...' : 'Unsubscribe'}
          </button>
        </div>
      ) : (
        <p className="text-red-500 font-bold">You are not subscribed.</p>
      )}
      {unsubscribeMessage && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p>{unsubscribeMessage}</p>
        </div>
      )}
    </div>
  )
}