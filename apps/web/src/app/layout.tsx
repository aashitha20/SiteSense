import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Button } from '@/components/ui/button'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SiteSense - Website Health Monitoring',
  description: 'A unified and actionable view of overall website health',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <header className="sticky top-0 z-50 bg-white p-5 border-b flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-4">
            <img src="/images/logo.png" alt="SiteSense Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold text-primary">SiteSense</h1>
          </div>
          <nav className="text-secondary text-6xsm text-right space-x-4 flex items-center">
            <a href="#" className="hover:underline">Features</a>
            <a href="#" className="hover:underline">Pricing</a>
            <a href="#" className="hover:underline">Blog</a>
            <Button className="rounded-[0.25rem] button-bg text-tertiary px-6 py-2 font-semibold">
              Login
            </Button>
          </nav>
        </header>
        {children}
        <footer className="mt-auto p-5 border-t text-center bg-primary text-tertiary text-sm">
          &copy; {new Date().getFullYear()} SiteSense. All rights reserved.
        </footer>
      </body>
    </html>
  )
}