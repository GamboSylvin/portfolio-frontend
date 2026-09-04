import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import Layout from '@/components/layout/Layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sylvin dev | Portfolio',
  description: 'Personal portfolio and blog for a full-stack developer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
