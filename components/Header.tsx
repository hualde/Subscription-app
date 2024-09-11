'use client'

import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
      </div>
    </header>
  )
}