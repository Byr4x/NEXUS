'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Target, Zap } from 'lucide-react'

const timelineEvents = [
  { year: 1995, title: 'Fundación', description: 'Nace BEIPLAS S.A.S para atender las necesidades del sector textilero.', icon: Calendar },
  { year: 'Hoy', title: 'Expansión', description: 'Abastecemos diversos sectores industriales en Antioquia y Colombia.', icon: Users },
]

const values = [
  { title: 'Compromiso', description: 'Ofrecer la mejor solución a las necesidades de nuestros clientes.', icon: Target },
  { title: 'Innovación', description: 'Utilizar equipos con tecnología adecuada y personal comprometido.', icon: Zap },
]

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-12"
        >
          Sobre Nosotros
        </motion.h1>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestra Historia</h2>
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div 
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center"
              >
                <div className="flex-shrink-0 w-24 text-right mr-4">
                  <span className="font-bold">{event.year}</span>
                </div>
                <div className="w-px h-16 bg-blue-500"></div>
                <div className="flex-grow pl-4">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <value.icon className="w-8 h-8 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                </div>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-6">BEIPLAS S.A.S</h2>
          <div className="space-y-4">
            <p>
              En octubre de 1995 nace la empresa, al ver las necesidades de sectores tan importantes para la región como el textilero. Con unas cuantas máquinas selladoras se da inicio a BEIPLAS S.A.S, que con el paso de los años adquiere nueva y mejorada maquinaria para la extrusión y el sellado, abasteciendo hoy en día diversos sectores industriales antioqueños y colombianos.
            </p>
            <p>
              Hoy contamos con productos como tubulares y bolsas en polietileno (alta y baja densidad), siendo autosuficientes en toda nuestra cadena productiva, desde la transformación de la materia prima hasta su distribución final.
            </p>
            <p>
              BEIPLAS S.A.S se compromete a ofrecer y aportar al mercado de industriales y comerciantes que necesiten de nuestros productos, la mejor solución a sus necesidades, por lo tanto, requieren y ameritan un cuidado especial.
            </p>
            <p>
              Nuestras actividades se realizan con equipos de una adecuada tecnología y un recurso humano decididamente comprometido y satisfecho.
            </p>
            <p>
              Trabajamos para que BEIPLAS S.A.S sea la primera y mejor opción en el mercado del plástico, desarrollando actividades con tecnología de vanguardia y con condiciones seguras para entregar unos productos acordes con las exigencias de nuestros clientes y con un elevado nivel de competitividad.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}