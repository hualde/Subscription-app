'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function SubscriptionStatus() {
  const { user, isLoading: userLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setError('Failed to check subscription status')
    }
    setIsLoading(false)
  }

  if (isLoading || userLoading) {
    return <div>Checking subscription status...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!user) {
    return <div>Please log in to see subscription status.</div>
  }

  return (
    <div>
      {isSubscribed ? (
        <p className="text-green-500">You are currently subscribed.</p>
      ) : (
        <p className="text-red-500">You are not currently subscribed.</p>
      )}
    </div>
  )
}