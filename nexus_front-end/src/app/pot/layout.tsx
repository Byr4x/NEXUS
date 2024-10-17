'use client'

import React, { useState } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-5 pt-3">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}