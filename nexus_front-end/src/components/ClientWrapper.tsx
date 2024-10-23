'use client'

import React from 'react'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { useTheme } from '@/contexts/ThemeContext'
import { usePathname } from 'next/navigation'
import { Tooltip } from "@nextui-org/tooltip";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme()
  const pathname = usePathname()

  const isPotPath = pathname.startsWith('/pot')

  if (isPotPath) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <main className="pt-20">
          {children}
        </main>
      </div>
    </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
        <Tooltip content="Rodolfo" className='bg-gray-200 text-black dark:bg-gray-800 dark:text-white'>
          <img src="https://res.cloudinary.com/db5lqptwu/image/upload/v1729621638/logos/rodolfo.gif" alt="Rodolfo" className="fixed bottom-0 left-0 w-[10%] hover:cursor-pointer" />
        </Tooltip>
      </div>
    </div>
  )
}
