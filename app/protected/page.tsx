'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProtectedPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
    } else if (user) {
      checkSubscription()
    }
  }, [user, isLoading, router])

  const checkSubscription = async () => {
    const response = await fetch('/api/check-subscription')
    const data = await response.json()
    setIsSubscribed(data.isSubscribed)
    if (!data.isSubscribed) {
      router.push('/')
    }
  }

  if (isLoading) return <div>Loading...</div>

  if (!isSubscribed) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Protected Content</h1>
      <p>This is a protected page only accessible to subscribed users.</p>
    </div>
  )
}