import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Metadata } from 'next'
import ClientWrapper from '@/components/ClientWrapper'
import { Tooltip } from "@nextui-org/tooltip";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beiplas',
  description: 'Soluciones sostenibles en empaques',
  icons: {
    icon: 'https://res.cloudinary.com/db5lqptwu/image/upload/v1729079758/logos/n0dak8ohwtbuxy6xwuvu.png',
  }, 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
        <Tooltip content="Rodolfo" className='bg-gray-200 text-black dark:bg-gray-800 dark:text-white'>
          <img src="https://res.cloudinary.com/db5lqptwu/image/upload/v1729621638/logos/rodolfo.gif" alt="Rodolfo" className="fixed bottom-0 left-0 w-[10%] hover:cursor-pointer" />
        </Tooltip>
      </body>
    </html>
  )
}
