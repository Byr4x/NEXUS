'use client'


import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X, ChevronRight, Leaf, Recycle } from 'lucide-react'

export default function Home() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedMode = localStorage.getItem('toolpad-mode')
    if (storedMode === 'dark') {
      setDarkMode(true)
    } else if (storedMode === 'light') {
      setDarkMode(false)
    } else {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isDarkMode)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode ? 'dark' : 'light'
    setDarkMode(!darkMode)
    localStorage.setItem('toolpad-mode', newMode)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="fixed w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md z-50">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            >
              <a href='http://localhost:3000/' className='flex items-center'>
                <img src='https://res.cloudinary.com/db5lqptwu/image/upload/v1729079758/logos/n0dak8ohwtbuxy6xwuvu.png' alt="Beiplas logo" className='mr-2 w-12 h-12 hover:cursor-pointer'/>
                Beiplas
              </a>
            </motion.h1>
            <nav className="hidden md:flex space-x-6">
              {['Productos', 'Sobre Nosotros', 'Contacto', 'POT'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="hover:text-green-500 dark:hover:text-green-400 transition-colors relative group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </motion.a>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
                  {['Productos', 'Sobre Nosotros', 'Contacto', 'POT'].map((item) => (
                    <a key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-green-500 dark:hover:text-green-400 transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main className="pt-20">
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700"></div>
            <div className="relative z-10 text-center text-white px-6">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-bold"
              >
                MAHÍZ
              </motion.h2>
              <motion.h2>
                <hr className='my-2'/>
              </motion.h2>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl mb-8"
              >
                BOLSA A BASE DE MAÍZ
              </motion.h3>
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white text-green-500 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Descubre Más
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-20"></div>
          </section>

          <section id="productos" className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-6">
              <h4 className="text-3xl font-bold text-center mb-12">Nuestros Productos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: 'Bolsas de Plástico', description: 'Nuestras bolsas de plástico son duraderas y reciclables, perfectas para múltiples usos.', icon: Recycle, color: 'from-blue-400 to-blue-600' },
                  { title: 'Bolsas de Maíz', description: 'Nuestras bolsas biodegradables de maíz son la opción ecológica para un futuro sostenible.', icon: Leaf, color: 'from-green-400 to-green-600' }
                ].map((product, index) => (
                  <motion.div 
                    key={product.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className={`bg-gradient-to-b ${product.color} p-6 flex items-center`}>
                      <product.icon className="w-10 h-10 text-white" />
                      <h5 className="text-xl font-bold text-white ml-4">{product.title}</h5>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-900 py-4">
          <div className="container mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">CARG © 2024 Beiplas. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}