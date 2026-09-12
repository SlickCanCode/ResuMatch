import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Providers } from './providers'
import { MotionConfig } from 'framer-motion'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ResuMatch - Optimize Your Resume with AI',
  description: 'AI-powered resume analyzer that helps you optimize your resume for ATS systems and land your dream job.',
    icons: {
    icon: "/icon.svg",
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MotionConfig reducedMotion="user">
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
    </MotionConfig>
  )
}
