'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

type Language = 'en' | 'es' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language
    if (storedLanguage && ['en', 'es', 'fr'].includes(storedLanguage)) {
      setLanguage(storedLanguage)
    } else {
      const browserLanguage = navigator.language.split('-')[0].toLowerCase()
      setLanguage(['es', 'fr'].includes(browserLanguage) ? browserLanguage as Language : 'en')
    }
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}