import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Artiste Portfolio | Peintre Contemporain',
    template: '%s | Artiste Portfolio',
  },
  description: 'Découvrez l\'univers artistique d\'un peintre contemporain. Galerie de tableaux, expositions et œuvres originales.',
  keywords: ['artiste', 'peintre', 'galerie', 'art contemporain', 'tableaux', 'expositions'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
