// app/layout.tsx
import React from 'react'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Metadata } from 'next'
import ClientWrapper from '@/components/ClientWrapper'

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
    <html lang="es" className="h-full overflow-hidden">
      <body className={`${inter.className} antialiased h-full overflow-y-auto`}>
        <ThemeProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}