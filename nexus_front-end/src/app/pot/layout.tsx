'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
        isMinimized={isMinimized}
        toggleMinimize={toggleMinimize}
      />
      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen}
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
        />
        <main className={`flex-1 pt-20 overflow-y-auto p-5 ml-0 ${mainContentClass()} transition-all duration-500 overflow-y-auto`}>
          {children}
        </main>
      </div>
    </div>
  )
}
