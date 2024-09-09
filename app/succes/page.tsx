'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const router = useRouter()

  useEffect(() => {
    const { session_id } = router.query
    if (session_id) {
      verifySubscription(session_id as string)
    }
  }, [router.query])

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
    return <div>Verifying your subscription...</div>
  }

  if (status === 'error') {
    return (
      <div>
        <h1>Oops! Something went wrong.</h1>
        <p>We couldn't verify your subscription. Please contact support.</p>
        <Link href="/">Return to Home</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Subscription Successful!</h1>
      <p>Thank you for subscribing. Your account has been updated.</p>
      <Link href="/">Return to Home</Link>
    </div>
  )
}