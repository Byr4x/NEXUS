'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin } from 'lucide-react'

const contactInfo = [
  { icon: Phone, text: '+57 (604) 301 27 00', href: 'tel:+576043012700' },
  { icon: Mail, text: 'recepcion@beiplas.com', href: 'mailto:recepcion@beiplas.com' },
  { icon: MapPin, text: 'Carrera 43A # 61Sur 152 INT. 227 Sabaneta, Antioquia', href: 'https://maps.app.goo.gl/6ZoDc8KPwECo4TXMA' },
]

// const salesAdvisors = [
//   {
//     name: 'Jose Camilo Estrada',
//     image: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729353160/logos/camilo.jpg',
//     position: 'Asesor Comercial',
//     email: 'camilo.estrada@beiplas.com',
//     phone: '301 2700 ext. 111',
//   },
//   {
//     name: 'Juan Sebastian Estrada',
//     image: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729353160/logos/sebastian.jpg',
//     position: 'Asesor Comercial',
//     email: 'jsebastian@beiplas.com',
//     phone: '301 2700 ext. 112',
//   },
//   {
//     name: 'Huber Agudelo Bedoya',
//     image: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729354098/logos/huber.jpg',
//     position: 'Asesor Comercial',
//     email: 'ventas3@beiplas.com',
//     phone: '301 2700 ext. 104',
//   }
// ]

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white"
        >
          Contáctanos
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Información de Contacto</h2>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center">
                  <item.icon className="w-6 h-6 mr-4 text-blue-600" />
                  <a href={item.href} className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Envíanos un Mensaje</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
            </form>
          </motion.div>
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12"
        >
          
          <div className="grid md:grid-cols-2 gap-8">
            {salesAdvisors.map((advisor, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex">
                <div className="w-1/3 relative">
                  <img
                    src={advisor.image}
                    alt={advisor.name}
                  />
                </div>
                <div className="w-2/3 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{advisor.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{advisor.position}</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-blue-600" />
                      <a href={`mailto:${advisor.email}`} className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                        {advisor.email}
                      </a>
                    </li>
                    <li className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-blue-600" />
                      <a href={`tel:${advisor.phone}`} className="text-gray-600 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-500 transition-colors">
                        {advisor.phone}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1983.415702282954!2d-75.60940571173158!3d6.153329265217112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e468300748ef511%3A0xef3849321de88d83!2sBeiplas!5e0!3m2!1ses-419!2sco!4v1729355294432!5m2!1ses-419!2sco"
            width="100%" 
            height="450" 
            style={{border:0}} 
            allowFullScreen={true} 
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </div>
  )
}
