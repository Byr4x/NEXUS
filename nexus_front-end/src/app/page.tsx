'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Leaf, Recycle } from 'lucide-react'

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-200 to-blue-600 dark:from-cyan-300 dark:to-blue-700"></div>
        <div className="relative z-10 text-center text-black px-6">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold"
          >
            MAHÍZ
          </motion.h2>
          <motion.h2>
            <hr className='my-2 border-black'/>
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-2xl md:text-3xl mb-8"
          >
            BOLSA A BASE DE MAÍZ
          </motion.h3>
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-gray-700 text-black dark:text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors inline-flex items-center group"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.transition = 'transform 0.3s ease';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onClick={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
              window.location.href = 'https://www.mahiz.co/';
            }}
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
              { title: 'Bolsas de Maíz', description: 'Nuestras bolsas biodegradables de maíz son la opción ecológica para un futuro sostenible.', icon: Leaf, color: 'from-amber-50 to-amber-100' }
            ].map((product, index) => (
              <motion.div 
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg"
              >
                <div className={`bg-gradient-to-b ${product.color} p-6 flex items-center`}>
                  <product.icon className="w-10 h-10 text-black" />
                  <h5 className="text-xl font-bold text-black ml-4">{product.title}</h5>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
