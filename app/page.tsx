'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '../components/LanguageContext'

const translations = {
  en: {
    'app.welcome': 'Welcome to our Subscription App',
    'app.description': 'Discover amazing content and unlock premium features with our subscription service.',
    'app.getStarted': 'Get Started',
    'app.premiumContent': 'Premium Content',
    'app.exclusiveFeatures': 'Exclusive Features',
    'app.prioritySupport': 'Priority Support',
    'app.featureDescription': 'Enjoy our {feature} with a premium subscription. Unlock a world of possibilities and enhance your experience.'
  },
  es: {
    'app.welcome': 'Bienvenido a nuestra App de Suscripción',
    'app.description': 'Descubre contenido increíble y desbloquea funciones premium con nuestro servicio de suscripción.',
    'app.getStarted': 'Comenzar',
    'app.premiumContent': 'Contenido Premium',
    'app.exclusiveFeatures': 'Funciones Exclusivas',
    'app.prioritySupport': 'Soporte Prioritario',
    'app.featureDescription': 'Disfruta de nuestro {feature} con una suscripción premium. Desbloquea un mundo de posibilidades y mejora tu experiencia.'
  },
  fr: {
    'app.welcome': 'Bienvenue sur notre Application d\'Abonnement',
    'app.description': 'Découvrez un contenu incroyable et débloquez des fonctionnalités premium avec notre service d\'abonnement.',
    'app.getStarted': 'Commencer',
    'app.premiumContent': 'Contenu Premium',
    'app.exclusiveFeatures': 'Fonctionnalités Exclusives',
    'app.prioritySupport': 'Support Prioritaire',
    'app.featureDescription': 'Profitez de notre {feature} avec un abonnement premium. Débloquez un monde de possibilités et améliorez votre expérience.'
  }
}

export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const { language } = useLanguage()

  useEffect(() => {
    if (!isLoading && user) {
      checkSubscription()
    }
  }, [user, isLoading])

  const checkSubscription = async () => {
    try {
      const response = await fetch('/api/check-subscription')
      const data = await response.json()
      if (data.isSubscribed) {
        router.push('/protected')
      } else {
        router.push('/subscribe')
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">{translations[language]['app.welcome']}</h1>
          <p className="text-xl mb-8 text-gray-700">
            {translations[language]['app.description']}
          </p>
          {!user && (
            <Link
              href="/api/auth/login"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-colors"
            >
              {translations[language]['app.getStarted']}
              <ArrowRight className="ml-2" size={24} />
            </Link>
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[translations[language]['app.premiumContent'], translations[language]['app.exclusiveFeatures'], translations[language]['app.prioritySupport']].map((feature, index) => (
            <div key={index} className="bg-gray-50 rounded-lg shadow-md p-6 transform transition duration-500 hover:scale-105">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{feature}</h2>
              <p className="text-gray-700">
                {translations[language]['app.featureDescription'].replace('{feature}', feature.toLowerCase())}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}