import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SessionProvider from '@/components/auth/SessionProvider'
import { safeFetch } from '@/lib/sanity.client'
import { siteSettingsQuery, navigationQuery } from '@/lib/sanity.queries'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Artiste Peintre',
  description: 'Découvrez les œuvres et expositions de l\'artiste peintre.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await safeFetch(siteSettingsQuery)
  const navigation = await safeFetch<{ items: { label: string; href: string }[] }>(navigationQuery)

  return (
    <html lang="fr">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        <SessionProvider>
          <Header siteName={settings?.siteName} navItems={navigation?.items} />
          <main className="site-main" id="site-main">
            {children}
          </main>
          <Footer settings={settings} />
        </SessionProvider>
      </body>
    </html>
  )
}
