'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'

export default function SubscriptionStatus() {
  const { user, isLoading: userLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUnsubscribing, setIsUnsubscribing] = useState(false)
  const [message, setMessage] = useState('')

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
      setMessage('Error checking subscription status. Please refresh the page.')
    }
    setIsLoading(false)
  }

  const handleUnsubscribe = async () => {
    try {
      setIsUnsubscribing(true)
      const response = await fetch('/api/cancel-subscription', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok && data.success) {
        setIsSubscribed(false)
        setMessage('Subscription cancelled successfully.')
      } else {
        throw new Error(data.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      setMessage('An error occurred while cancelling your subscription. Please try again.')
    } finally {
      setIsUnsubscribing(false)
      setTimeout(() => setMessage(''), 5000) // Clear message after 5 seconds
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
        <div>
          <p className="text-red-500 font-bold mb-2">You are not subscribed.</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            Subscribe Now
          </button>
        </div>
      )}
      {message && (
        <div className={`border-l-4 p-4 ${isSubscribed ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-red-100 border-red-500 text-red-700'}`} role="alert">
          <p>{message}</p>
        </div>
      )}
      <div className="mt-4">
        <Link href="/protected" className="text-blue-600 hover:text-blue-800">
          Access Protected Content
        </Link>
      </div>
    </div>
  )
}