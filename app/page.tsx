'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to our Subscription App</h1>
      <p className="mb-4">This is a simple subscription app using Next.js, Auth0, and Stripe.</p>
      {!user && (
        <Link href="/api/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Log In to Get Started
        </Link>
      )}
    </div>
  )
}