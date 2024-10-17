"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LuChevronRight, LuLayoutDashboard, LuUsers, LuFileText } from 'react-icons/lu'
import { useTheme } from '@/contexts/ThemeContext'

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
    icon: <LuLayoutDashboard size={24} />,
  },
  {
    href: '/pot/users',
    label: 'Usuarios',
    icon: <LuUsers size={24}/>,
    subMenu: [
      { href: '/pot/users/roles', label: 'Roles', icon: <LuChevronRight /> },
    ]
  },
  {
    href: '/pot/employees',
    label: 'Empleados',
    icon: <LuFileText size={24} />
  },
  {
    href: '/pot/employees',
    label: 'Ordenes de compra',
    icon: <LuFileText size={24}   />
  },
  {
    href: '/pot/employees',
    label: 'Ordenes de trabajo',
    icon: <LuFileText size={24} />
  },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  isMinimized: boolean
  setIsMinimized: (isMinimized: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMinimized, setIsMinimized }) => {
  const [activeSubmenu, setActiveSubmenu] = useState("")
  const pathname = usePathname()
  const { isDarkMode } = useTheme()
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth
      setWindowWidth(newWidth)
      if (newWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsMinimized(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsOpen, setIsMinimized])

  const handleNavClick = (menu: string) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu("")
    } else {
      setActiveSubmenu(menu)
    }
  }

  const sidebarWidth = windowWidth >= 1024
    ? (isMinimized ? 'w-[5%]' : 'w-[18%]')
    : 'w-64'

  return (
    <div className={`h-full overflow-y-auto fixed top-16 left-0 ${sidebarWidth} flex flex-col z-40 transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-xl shadow-sky-500/10 mt-2 border-r border-gray-200 dark:border-sky-500`}>
      <nav className='p-2'>
        <ul>
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <div className='justify-items-center'>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors duration-200 ${
                    (pathname === link.href || (link.subMenu && link.subMenu.some(subLink => pathname === subLink.href)))
                      ? 'bg-sky-500/10 dark:bg-sky-500/10 text-sky-500' 
                      : 'hover:bg-gray-500/20 dark:hover:bg-gray-600/20 hover:text-black dark:hover:text-white'
                  }`}
                  onClick={() => handleNavClick(link.href)}
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    {!isMinimized && <span>{link.label}</span>}
                  </span>
                  {link.subMenu && !isMinimized && (
                    <LuChevronRight className={`transition-transform duration-300 ${activeSubmenu === link.href ? 'rotate-90' : ''}`} />
                  )}
                </Link>
                {link.subMenu && activeSubmenu === link.href && !isMinimized && (
                  <ul className="pl-4 overflow-hidden transition-all h-auto mb-1">
                    {link.subMenu.map((subLink) => (
                      <li key={subLink.href}>
                        <Link
                          href={subLink.href}
                          className={`py-2 px-4 border-l border-gray-500 block relative before:w-3 before:h-3 before:absolute ${
                            pathname === subLink.href 
                              ? "text-gray-900 dark:text-white before:bg-sky-500 font-semibold" 
                              : "before:bg-black dark:before:bg-white"
                          } before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-3 transition-colors before:border-white dark:before:border-gray-900 hover:text-black dark:hover:text-white text-sm`}
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
    </div>
  )
}

export default Sidebar
