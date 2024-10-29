// app/components/ClientWrapper.tsx

'use client'

import React from 'react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useTheme } from '@/contexts/ThemeContext'
import { usePathname } from 'next/navigation'
import { Tooltip } from "@nextui-org/tooltip"
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme()
  const pathname = usePathname()
  const isPotPath = pathname?.startsWith('/pot')
  
  // Añadimos los estados necesarios para el layout de POT
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const mainContentClass = () => {
    if (windowWidth >= 1024) {
      return isMinimized ? 'lg:ml-[5%]' : 'lg:ml-[18%]'
    }
    return 'md:ml-[5%]'
  }

  if (isPotPath) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header 
            toggleSidebar={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
            isMinimized={isMinimized}
            toggleMinimize={toggleMinimize}
          />
          <div className="flex flex-1 relative">
            <Sidebar 
              isOpen={isSidebarOpen} 
              setIsOpen={setIsSidebarOpen}
              isMinimized={isMinimized}
              setIsMinimized={setIsMinimized}
            />
            <main className={`flex-1 p-5 pt-2 ${mainContentClass()} transition-all duration-500 h-full`}>
              {children}
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 h-full">
        <Navbar />
        <main className="pt-2 h-full overflow-y-auto">
          {children}
        </main>
        <Footer />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="fixed bottom-0 left-0 w-[10%]"
        >
          <Tooltip content="Rodolfo" className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
            <img
              src="https://res.cloudinary.com/db5lqptwu/image/upload/v1729621638/logos/rodolfo.gif"
              alt="Rodolfo"
              className="hover:cursor-pointer"
            />
          </Tooltip>
        </motion.div>
      </div>
    </div>
  )
}
