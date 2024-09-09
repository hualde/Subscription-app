import Header from '../components/Header'
import SubscriptionStatus from '../components/SubscriptionStatus'
import SubscriptionButton from '../components/SubscriptionButton'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to our Subscription App</h1>
        <p className="mb-4">This is a simple subscription app using Next.js, Auth0, and Stripe.</p>
        <SubscriptionStatus />
        <SubscriptionButton />
      </main>
    </div>
  )
}