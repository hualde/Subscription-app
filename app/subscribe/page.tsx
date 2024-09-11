'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import SubscriptionButton from '../../components/SubscriptionButton'

export default function SubscribePage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  if (isLoading) return <div>Loading...</div>

  if (!user) {
    router.push('/api/auth/login')
    return null
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Subscribe to Our Service</h1>
      <p className="mb-4">Click the button below to subscribe and access premium content.</p>
      <SubscriptionButton />
    </div>
  )
}