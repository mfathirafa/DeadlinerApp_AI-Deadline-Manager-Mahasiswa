import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/components/providers/QueryProvider'
import { Toaster } from 'react-hot-toast'

import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'AuraAI Deadliner - AI-Powered Deadline Management',
  description:
    'Premium AI productivity dashboard for smart deadline management, task analysis, and academic performance optimization.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`
          ${inter.variable}
          ${jakarta.variable}
          bg-[#0f0d13]
          text-white
          antialiased
        `}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,

              style: {
                background: 'rgba(26, 22, 37, 0.95)',
                backdropFilter: 'blur(20px)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                fontSize: '14px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              },

              success: {
                iconTheme: {
                  primary: '#cfbcff',
                  secondary: '#0f0d13',
                },
              },

              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0f0d13',
                },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  )
}