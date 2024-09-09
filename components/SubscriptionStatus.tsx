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

  if (isLoading || userLoading) {
    return <div>Checking subscription status...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="mt-4">
      {isSubscribed ? (
        <p className="text-green-500 font-bold">You are subscribed.</p>
      ) : (
        <p className="text-red-500 font-bold">You are not subscribed.</p>
      )}
    </div>
  )
}