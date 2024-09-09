'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-xl font-bold">
        Subscription App
      </Link>
      <nav>
        {!isLoading && !user && (
          <Link href="/api/auth/login" className="text-blue-500 hover:text-blue-700">
            Log In
          </Link>
        )}
        {user && (
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name}!</span>
            <Link href="/api/auth/logout" className="text-blue-500 hover:text-blue-700">
              Log Out
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}