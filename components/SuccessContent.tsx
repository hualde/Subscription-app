'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const searchParams = useSearchParams()

  useEffect(() => {
    const session_id = searchParams?.get('session_id')
    if (session_id) {
      verifySubscription(session_id)
    } else {
      setStatus('error')
    }
  }, [searchParams])

  const verifySubscription = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/verify-subscription?session_id=${sessionId}`)
      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      console.error('Error verifying subscription:', error)
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return <div className="text-center py-8">Verifying your subscription...</div>
  }

  if (status === 'error') {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="mb-4">We couldn&apos;t verify your subscription. Please contact support.</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center py-8">
      <h1 className="text-2xl font-bold mb-4">Subscription Successful!</h1>
      <p className="mb-4">Thank you for subscribing. Your account has been updated.</p>
      <Link href="/" className="text-blue-500 hover:text-blue-700">
        Return to Home
      </Link>
    </div>
  )
}