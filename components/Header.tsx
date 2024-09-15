'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState, useEffect } from 'react'
import { Search, User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from './LanguageContext'

const translations = {
  en: {
    'app.title': 'Subscription App',
    'app.search': 'Search...',
    'app.login': 'Log In',
    'app.logout': 'Log Out',
    'app.unsubscribe': 'Unsubscribe',
    'app.confirmUnsubscribe': 'Are you sure you want to cancel your subscription?',
    'app.keepSubscription': 'Keep Subscription',
    'app.confirmUnsubscribeButton': 'Unsubscribe'
  },
  es: {
    'app.title': 'App de Suscripción',
    'app.search': 'Buscar...',
    'app.login': 'Iniciar Sesión',
    'app.logout': 'Cerrar Sesión',
    'app.unsubscribe': 'Cancelar Suscripción',
    'app.confirmUnsubscribe': '¿Estás seguro de que quieres cancelar tu suscripción?',
    'app.keepSubscription': 'Mantener Suscripción',
    'app.confirmUnsubscribeButton': 'Cancelar Suscripción'
  }
}

export default function Header() {
  const { user, isLoading } = useUser()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

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
        setShowConfirmation(false)
        router.push('/subscribe')
      } else {
        throw new Error('Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    }
  }

  const handleCancelUnsubscribe = () => {
    setShowConfirmation(false)
  }

  return (
    <header className="bg-white shadow-md w-full">
      <div className="px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            {translations[language]['app.title']}
          </Link>
          {!isLoading && user && (
            <Link href="/api/auth/logout" className="sm:hidden text-gray-700 hover:text-orange-500 transition-colors">
              <LogOut size={20} />
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
            className="bg-white border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder={translations[language]['app.search']}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          {isLoading ? (
            <div className="text-gray-700">Loading...</div>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="text-gray-700" size={20} />
                <span className="text-gray-800 font-medium">{user.email}</span>
              </div>
              {isSubscribed && (
                <button
                  onClick={handleUnsubscribeClick}
                  className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                >
                  {translations[language]['app.unsubscribe']}
                </button>
              )}
              <Link href="/api/auth/logout" className="hidden sm:inline-block text-gray-700 hover:text-orange-500 transition-colors">
                <LogOut size={20} />
              </Link>
            </div>
          ) : (
            <Link
              href="/api/auth/login"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-full transition-colors"
            >
              {translations[language]['app.login']}
            </Link>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{translations[language]['app.confirmUnsubscribe']}</h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelUnsubscribe}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition-colors"
              >
                {translations[language]['app.keepSubscription']}
              </button>
              <button
                onClick={handleConfirmUnsubscribe}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
              >
                {translations[language]['app.confirmUnsubscribeButton']}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}