'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const pathname = usePathname()

  return (
    <header className="fixed w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500"
        >
          <a href='/' className='flex items-center'>
            <img src='https://res.cloudinary.com/db5lqptwu/image/upload/v1729079758/logos/n0dak8ohwtbuxy6xwuvu.png' alt="Beiplas logo" className='mr-2 w-12 h-12 hover:cursor-pointer'/>
            Beiplas
          </a>
        </motion.h1>
        <nav className="hidden md:flex space-x-6">
          {['Inicio', 'Productos', 'Sobre Nosotros', 'Contáctanos', 'POT'].map((item, index) => {
            const itemPath = item === 'Inicio' ? '/' : item === 'Productos' ? '/products' : item === 'Sobre Nosotros' ? '/about-us' : item === 'Contáctanos' ? '/contact-us' : `/${item.toLowerCase().replace(' ', '-')}`
            const isActive = pathname === itemPath
            return (
              <motion.a
                key={item}
                href={itemPath}
                className={`transition-colors relative group ${
                  isActive ? 'text-blue-600 dark:text-cyan-300' : 'hover:text-blue-600 dark:hover:text-cyan-300'
                }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
                <span className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 dark:bg-cyan-300 transition-transform origin-left ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </motion.a>
            )
          })}
        </nav>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          <motion.button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              {['Inicio', 'Productos', 'Sobre Nosotros', 'Contacto', 'POT'].map((item) => {
                const itemPath = item === 'Inicio' ? '/' : item === 'Productos' ? '/products' : `/${item.toLowerCase().replace(' ', '-')}`
                const isActive = pathname === itemPath
                return (
                  <a 
                    key={item} 
                    href={itemPath} 
                    className={`transition-colors ${
                      isActive ? 'text-blue-600 dark:text-cyan-300' : 'hover:text-blue-600 dark:hover:text-cyan-300 '
                    }`}
                  >
                    {item}
                  </a>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
