"use client"

import React, { useState, useEffect } from 'react'
import { ChevronDown, User, Settings, LogOut, Moon, Sun, Menu, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { usePathname } from 'next/navigation'
import axios from 'axios'

interface HeaderProps {
  toggleSidebar: () => void
  isSidebarOpen: boolean
  isMinimized: boolean
  toggleMinimize: () => void
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, isMinimized, toggleMinimize }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [windowWidth, setWindowWidth] = useState(0)
  const pathname = usePathname() || ''
  const [currentCustomer, setCurrentCustomer] = useState<string | null>(null)

  const getPageName = (path: string) => {
    const routes: { [key: string]: string } = {
      '/pot': 'Dashboard',
      '/pot/purchase-orders': 'Ordenes de Compra',
      '/pot/customers': 'Clientes',
      '/pot/customers/references': 'Referencias',
      '/pot/employees': 'Empleados',
      '/pot/employees/positions': 'Cargos',
      '/pot/products': 'Productos',
      '/pot/products/materials': 'Materiales',
      '/pot/products/product-types': 'Tipos de productos',
    }

    if (path.startsWith('/pot/customers/references/')) {
      return currentCustomer ? `Referencias - ${currentCustomer}` : 'Referencias'
    }

    return routes[path] || ''
  }

  useEffect(() => {
    const fetchCustomerName = async () => {
      if (pathname.startsWith('/pot/customers/references/')) {
        const customerID = pathname.split('/').pop()
        try {
          const response = await axios.get(`http://127.0.0.1:8000/beiplas/business/customers/${customerID}/`)
          setCurrentCustomer(response.data.company_name)
        } catch (error) {
          console.error('Error fetching customer:', error)
          setCurrentCustomer(null)
        }
      } else {
        setCurrentCustomer(null)
      }
    }

    fetchCustomerName()
  }, [pathname])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSidebarToggle = () => {
    if (windowWidth >= 1024) {
      toggleMinimize()
    } else {
      toggleSidebar()
    }
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 border-b border-gray-200 dark:border-sky-500">
      <div className="pr-[2%] pl-[1%]">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}>
              <button
                onClick={handleSidebarToggle}
                className="mr-4 p-2 rounded-md"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {windowWidth >= 1024 ?
                  (isMinimized ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />) :
                  (isSidebarOpen ? <PanelLeftClose size={24} /> : <Menu size={24} />)
                }
              </button>
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-800"
            >
              <a href='http://localhost:3000/pot' className='flex items-center'>
                <img src='https://res.cloudinary.com/db5lqptwu/image/upload/v1729079758/logos/n0dak8ohwtbuxy6xwuvu.png' alt="Beiplas logo" className='mr-2 w-10 h-10' />
                NEXPOT
              </a>
            </motion.h1>
            {getPageName(pathname) && (
              <div className="flex items-center ml-4">
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="text-2xl font-semibold text-gray-600 dark:text-gray-300 mr-2"
                >
                  |
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-2xl font-semibold text-gray-600 dark:text-gray-300 -left-0 animate-pulse"
                >
                  {getPageName(pathname)}
                </motion.span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
            <div className="relative">
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png"
                    alt="User avatar"
                  />
                  <span className="hidden sm:inline">Beiplas</span>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              </motion.h1>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700" role="menu">
                  <a href="#" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center" role="menuitem">
                    <User size={16} className="mr-2" />
                    Profile
                  </a>
                  <a href="#" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center" role="menuitem">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </a>
                  <a href="/" className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center" role="menuitem">
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
