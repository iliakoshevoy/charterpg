// src/app/layout.tsx
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { RootLayoutClient } from '@/components/RootLayoutClient'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Charter Proposal Generator',
  description: 'Generate private jet charter proposals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}