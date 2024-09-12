'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      checkSubscription()
    }
  }, [user, isLoading])

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/check-subscription')
      const data = await response.json()
      if (data.isSubscribed) {
        router.push('/protected')
      } else {
        router.push('/subscribe')
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )

  return (
    <div className="bg-gradient-to-r from-orange-100 to-yellow-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-800">Welcome to our Subscription App</h1>
          <p className="text-xl mb-8 text-gray-600">
            Discover amazing content and unlock premium features with our subscription service.
          </p>
          {!user && (
            <Link
              href="/api/auth/login"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2" size={24} />
            </Link>
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Premium Content', 'Exclusive Features', 'Priority Support'].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{feature}</h2>
              <p className="text-gray-600">
                Enjoy our {feature.toLowerCase()} with a premium subscription. Unlock a world of possibilities and enhance your experience.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}