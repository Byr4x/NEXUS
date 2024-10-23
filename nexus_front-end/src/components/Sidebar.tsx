"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiArrowDropRightLine, RiDashboardLine, RiProductHuntLine, RiGroupLine, RiTeamLine } from 'react-icons/ri'
import { MdOutlinePrecisionManufacturing, MdOutlinePlaylistAddCircle } from "react-icons/md";
import { LiaUsersCogSolid, LiaHandshakeSolid, LiaUserTieSolid, LiaIndustrySolid, LiaFileInvoiceDollarSolid  } from 'react-icons/lia'
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
    icon: <RiDashboardLine size={24} />,
  },
  {
    href: '/pot/customers',
    label: 'Clientes',
    icon: <LiaHandshakeSolid  size={24} />,
    subMenu: [
      { href: '/pot/customers/references', label: 'Referencias', icon: <RiProductHuntLine size={20} /> },
    ]
  },
  {
    href: '/pot/purchase-orders',
    label: 'Ordenes de compra',
    icon: <LiaFileInvoiceDollarSolid  size={24} />
  },
  {
    href: '/pot/production',
    label: 'Producción',
    icon: <LiaIndustrySolid size={24} />,
    subMenu: [
      { href: '/pot/production/touch', label: 'Touch', icon: <MdOutlinePlaylistAddCircle size={20} /> },
      { href: '/pot/production/machines', label: 'Maquinaria', icon: <MdOutlinePrecisionManufacturing size={20} /> },
    ]
  },
  {
    href: '/pot/employees',
    label: 'Personal',
    icon: <RiTeamLine size={24}/>,
    subMenu: [
      { href: '/pot/employees/positions', label: 'Cargos', icon: <LiaUserTieSolid size={20} /> },
    ]
  },
  {
    href: '/pot/users',
    label: 'Usuarios',
    icon: <RiGroupLine size={24}/>,
    subMenu: [
      { href: '/pot/users/roles', label: 'Roles', icon: <LiaUsersCogSolid size={20} /> },
    ]
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
    <div className={`h-full overflow-y-auto fixed top-16 left-0 ${sidebarWidth} flex flex-col z-40 transition-all duration-500 ${isOpen ? "translate-x-0" : "-translate-x-full"} bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-xl shadow-sky-500/10 mt-2 border-r border-gray-200 dark:border-sky-500`}>
      <nav className='p-2'>
        <ul>
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <div className={isMinimized ? "justify-items-center" : ""}>
                <Link
                  href={link.href}
                  className={`flex justify-between px-2 py-2 rounded-lg  ${
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
                    <RiArrowDropRightLine className={`transition-transform duration-200 ${activeSubmenu === link.href ? 'rotate-90' : ''}`} size={24}/>
                  )}
                </Link>
                {link.subMenu && activeSubmenu === link.href && !isMinimized && (
                  <ul className="pl-4 overflow-hidden h-auto mb-2">
                    {link.subMenu.map((subLink) => (
                      <li key={subLink.href}>
                        <Link
                          href={subLink.href}
                          className={`py-2 px-4 border-l border-gray-500 block relative before:w-3 before:h-3 before:absolute ${
                            pathname === subLink.href 
                              ? "text-gray-900 dark:text-white before:bg-sky-500 font-semibold" 
                              : "before:bg-black dark:before:bg-white"
                          } before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-3 before:border-white dark:before:border-gray-900 hover:text-black dark:hover:text-white text-sm flex items-center`}
                        >
                          {subLink.icon}
                          <span className="ml-2">{subLink.label}</span>
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
