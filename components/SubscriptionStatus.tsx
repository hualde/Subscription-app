'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function SubscriptionStatus() {
  const { user, isLoading: userLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)

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

  const handleUnsubscribeClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmUnsubscribe = async () => {
    try {
      setIsLoading(true)
      await fetch('/api/cancel-subscription', { method: 'POST' })
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    } finally {
      setShowConfirmation(false)
      window.location.reload()
    }
  }

  const handleCancelUnsubscribe = () => {
    setShowConfirmation(false)
  }

  if (isLoading || userLoading) {
    return <div>Checking subscription status...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="mt-4 relative">
      {isSubscribed ? (
        <div>
          <p className="text-green-500 font-bold mb-2">You are subscribed.</p>
          <button
            onClick={handleUnsubscribeClick}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Unsubscribe
          </button>
        </div>
      ) : (
        <p className="text-red-500 font-bold">You are not subscribed.</p>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Confirm Unsubscribe</h2>
            <p className="mb-4">Are you sure you want to cancel your subscription?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelUnsubscribe}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                No, keep my subscription
              </button>
              <button
                onClick={handleConfirmUnsubscribe}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes, unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}