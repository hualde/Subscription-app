'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState, useEffect } from 'react'
import { Search, User, LogOut } from 'lucide-react'

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
        // Optionally, you can redirect the user or show a success message
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
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Subscription App
        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          {isLoading ? (
            <div className="text-gray-600">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="text-gray-600" size={20} />
                <span className="text-gray-800 font-medium">{user.email}</span>
              </div>
              {isSubscribed && (
                <button
                  onClick={handleUnsubscribeClick}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                >
                  Unsubscribe
                </button>
              )}
              <Link href="/api/auth/logout" className="text-gray-600 hover:text-orange-500 transition-colors">
                <LogOut size={20} />
              </Link>
            </div>
          ) : (
            <Link
              href="/api/auth/login"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Unsubscribe</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to cancel your subscription?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelUnsubscribe}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleConfirmUnsubscribe}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                Unsubscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}