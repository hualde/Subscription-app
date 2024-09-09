'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function UserInfo() {
  const { user, isLoading, error } = useUser()

  if (isLoading) return <div>Loading user information...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>Please log in to see your information.</div>

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <p><strong>Name:</strong> {user.name || 'Not provided'}</p>
      <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
    </div>
  )
}