'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState, useEffect } from 'react'

export default function Header() {
  const { user, isLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus()
    }
  }, [user])

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
  }

  const handleUnsubscribeClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmUnsubscribe = async () => {
    try {
      const response = await fetch('/api/cancel-subscription', { method: 'POST' })
      if (response.ok) {
        setIsSubscribed(false)
        // Opcionalmente, puedes redirigir al usuario o mostrar un mensaje de éxito
      } else {
        throw new Error('Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    } finally {
      setShowConfirmation(false)
    }
  }

  const handleCancelUnsubscribe = () => {
    setShowConfirmation(false)
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-black">
          Subscription App
        </Link>
        <nav>
          {isLoading ? (
            <div className="text-black">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="text-black">{user.email}</span>
              {isSubscribed && (
                <button
                  onClick={handleUnsubscribeClick}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Unsubscribe
                </button>
              )}
              <Link href="/api/auth/logout" className="text-blue-600 hover:text-blue-800 font-medium">
                Log Out
              </Link>
            </div>
          ) : (
            <Link href="/api/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Log In
            </Link>
          )}
        </nav>
      </div>

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
    </header>
  )
}