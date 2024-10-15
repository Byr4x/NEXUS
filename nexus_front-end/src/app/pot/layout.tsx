import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'A powerful admin dashboard built with Next.js',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 border-primary">
            <Sidebar />
            <div className="xl:col-span-5 flex flex-col h-screen">
              <Header />
              <main className={`flex-1 overflow-y-scroll p-5 pt-3 bg-gray-500`}>
                  {children}
              </main>
            </div>
          </div>
      </body>
    </html>
  )
}