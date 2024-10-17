'use client'

import React from 'react'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { useTheme } from '@/contexts/ThemeContext'

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme()

  return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </div>
  )
}
