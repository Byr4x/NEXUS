"use client"

import React, { useState } from 'react'
import { ChevronDown, User, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold">TITTLE</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="/placeholder.svg?height=32&width=32"
                  alt="User avatar"
                />
                <span>John Doe</span>
                <ChevronDown size={20} />
              </button>
              {isMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} flex items-center`}>
                    <User size={16} className="mr-2" />
                    Profile
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} flex items-center`}>
                    <Settings size={16} className="mr-2" />
                    Settings
                  </a>
                  <a href="#" className={`block px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'} flex items-center`}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header