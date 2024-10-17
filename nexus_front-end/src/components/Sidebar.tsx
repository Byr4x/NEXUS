"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight, LayoutDashboard, Users, FileText } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import Beiplas from '../../public/images/Beiplas.png'

interface SidebarLink {
  href: string
  label: string
  icon: React.ReactNode
  subMenu?: { href: string; label: string; icon: React.ReactNode }[]
}

const sidebarLinks: SidebarLink[] = [
  {
    href: '/pot',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    subMenu: [
      { href: '/pot', label: 'Analytics', icon: <ChevronRight /> },
      { href: '/reports', label: 'Reports', icon: <ChevronRight /> },
    ]
  },
  {
    href: '/pot/users',
    label: 'Users',
    icon: <Users />,
    subMenu: [
      { href: '/products/create', label: 'Create Product', icon: <ChevronRight /> },
      { href: '/products/manage', label: 'Manage Products', icon: <ChevronRight /> },
    ]
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: <FileText />
  },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [activeSubmenu, setActiveSubmenu] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const pathname = usePathname()
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
        setIsMinimized(false)
      } else {
        setIsMinimized(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen])

  const handleNavClick = (menu: string) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu("")
    } else {
      setActiveSubmenu(menu)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <>
      <div className={`h-screen overflow-y-auto fixed lg:static ${isMinimized ? 'lg:w-[5%]' : 'lg:w-[18%]'} top-0 flex flex-col z-50 transition-all duration-300 ${isOpen ? "left-0" : "-left-full"} ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'} shadow-xl`}>
        <nav className='p-2'>
          <ul>
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <div className='justify-items-center'>
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors duration-200 ${pathname === link.href ? (isDarkMode ? 'bg-blue-600/30 text-white' : 'bg-blue-500/70 text-black') : (isDarkMode ? 'hover:bg-blue-600/30' : 'hover:bg-blue-500/70')}`}
                    onClick={() => handleNavClick(link.href)}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {!isMinimized && <span>{link.label}</span>}
                    </span>
                    {link.subMenu && !isMinimized && (
                      <ChevronRight className={`transition-transform duration-300 ${activeSubmenu === link.href ? 'rotate-90' : ''}`} />
                    )}
                  </Link>
                  {link.subMenu && activeSubmenu === link.href && !isMinimized && (
                    <ul className="pl-4 overflow-hidden transition-all h-auto mb-1">
                      {link.subMenu.map((subLink) => (
                        <li key={subLink.href}>
                          <Link
                            href={subLink.href}
                            className={`py-2 px-4 border-l border-gray-500 block relative before:w-3 before:h-3 before:absolute ${pathname === subLink.href ? (isDarkMode ? "text-white before:bg-blue-600 font-semibold" : "text-black before:bg-blue-600 font-semibold") : (isDarkMode ? "before:bg-white" : "before:bg-black")} before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-3 transition-colors ${isDarkMode ? 'before:border-black hover:text-white' : 'before:border-white hover:text-black'} hover:before:bg-blue-600 text-sm`}
                          >
                            {subLink.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={toggleMinimize}
          className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg transition-transform duration-300 lg:flex hidden"
          aria-label={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
        >
          {isMinimized ? <ChevronRight size={20} /> : <ChevronRight size={20} className="rotate-180" />}
        </button>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''} lg:hidden`}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  )
}

export default Sidebar