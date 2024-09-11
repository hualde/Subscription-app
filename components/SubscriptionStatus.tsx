'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    return <div>Checking subscription status...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="mt-4 space-y-4">
      {isSubscribed ? (
        <div>
          <p className="text-green-500 font-bold mb-2">You are subscribed.</p>
          <Button
            onClick={handleUnsubscribe}
            disabled={isUnsubscribing}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            {isUnsubscribing ? 'Cancelling...' : 'Unsubscribe'}
          </Button>
        </div>
      ) : (
        <p className="text-red-500 font-bold">You are not subscribed.</p>
      )}
      {unsubscribeMessage && (
        <Alert>
          <AlertDescription>{unsubscribeMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}