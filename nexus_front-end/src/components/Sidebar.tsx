"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import Beiplas from '../../public/images/Beiplas.png';
import { RiArrowRightSLine } from "react-icons/ri";

const sidebarLinks = [
  {
    href: '/pot',
    label: 'Dashboard',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    subMenu: [
      { href: '/pot', label: 'Analytics' },
      { href: '/reports', label: 'Reports' },
    ]
  },
  {
    href: '/pot/users',
    label: 'Users',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    subMenu: [
      { href: '/products/create', label: 'Create Product' },
      { href: '/products/manage', label: 'Manage Products' },
    ]
  },
  {
    href: '/orders',
    label: 'Orders',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState("");
  const pathname = usePathname();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Always open on large screens (lg+)
      }
    };

    window.addEventListener('resize', handleResize);

    // Set initial state based on screen size
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (menu: string) => {
    if (activeSubmenu === menu) {
      setActiveSubmenu(""); // Close the submenu if it's already active
    } else {
      setActiveSubmenu(menu); // Open the clicked submenu
    }
  };

  return (
    <>
      <div className={`xl:h-screen overflow-y-auto fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-full h-full top-0 flex flex-col z-50 ${isOpen ? "left-0" : "-left-full"} ${isDarkMode ? 'bg-black text-gray-300' : 'bg-white text-gray-700'} shadow-blue-600 shadow-xl transition-all`}>
        <div className={`flex justify-between items-center p-3 border-b border-blue-600 mb-1`}>
          <Image src={Beiplas} alt="Beiplas" width={40} height={40} className={`rounded-full`}/>
          <h1 className='text-3xl font-bold animate-pulse'>NEXUS</h1>
        </div>
        <nav className='p-2'>
          <ul>
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <div>
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between px-2 py-2 rounded-lg transition-colors duration-200 ${pathname === link.href ? (isDarkMode ? 'bg-blue-600/30 text-white' : 'bg-blue-500/70 text-black') : (isDarkMode ? 'hover:bg-blue-600/30' : 'hover:bg-blue-500/70')} ml-1 mt-1 relative text-sm`}
                    onClick={() => handleNavClick(link.href)}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {isOpen && <span className='ml-2'>{link.label}</span>}
                    </span>
                    {link.subMenu && (
                      <RiArrowRightSLine className={`transition-transform duration-300 ${activeSubmenu === link.href && 'rotate-90'}`} />
                    )}
                  </Link>
                  {link.subMenu && activeSubmenu === link.href && (
                    <ul className={`pl-4 overflow-hidden transition-all ${activeSubmenu === link.href ? "h-auto mb-1" : "h-0"}`}>
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
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg transition-transform duration-300 ${isOpen ? 'transform rotate-90' : ''} xl:hidden`}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  );
};

export default Sidebar;
