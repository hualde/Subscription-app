'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <Link href="/" className="text-xl font-bold text-black">
        Subscription App
      </Link>
      <nav>
        {isLoading ? (
          <div className="text-black">Loading...</div>
        ) : user ? (
          <div className="flex items-center space-x-4">
            <span className="text-black">{user.email}</span>
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
    </header>
  )
}