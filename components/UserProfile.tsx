'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import SubscriptionButton from './SubscriptionButton'

export default function UserProfile() {
  const { user, error, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  if (user) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
        <SubscriptionButton />
      </div>
    )
  }

  return <p>Please log in to manage your subscription.</p>
}