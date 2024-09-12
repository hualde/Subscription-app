import './globals.css'
import { Inter } from 'next/font/google'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Header from '../components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Subscription App',
  description: 'A simple subscription app using Next.js, Auth0, and Stripe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={`${inter.className} bg-white min-h-screen flex flex-col`}>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </body>
      </UserProvider>
    </html>
  )
}