'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Don't show footer in admin
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-serif text-3xl tracking-wide">
              ARTISTE
            </Link>
            <p className="mt-6 text-[#888] text-sm leading-relaxed font-light">
              Artiste peintre impressionniste, créant des œuvres uniques 
              qui capturent la lumière et l'émotion.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[#888] mb-6">
              Navigation
            </h4>
            <ul className="space-y-4">
              {['Accueil', 'Galerie', 'Expositions', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`}
                    className="text-white/70 hover:text-[#c9a86c] transition-colors duration-300 text-sm font-light"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[#888] mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm font-light">
              <li>
                <a 
                  href="mailto:contact@artiste.com" 
                  className="text-white/70 hover:text-[#c9a86c] transition-colors duration-300"
                >
                  contact@artiste.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+33612345678" 
                  className="text-white/70 hover:text-[#c9a86c] transition-colors duration-300"
                >
                  +33 6 12 34 56 78
                </a>
              </li>
              <li className="text-white/70">
                Paris, France
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-[#888] mb-6">
              Suivez-moi
            </h4>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Twitter, href: 'https://twitter.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a 
                  key={i}
                  href={href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[#2a2a2a] flex items-center justify-center text-white/70 hover:border-[#c9a86c] hover:text-[#c9a86c] transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#1a1a1a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#555] text-xs font-light">
            © {new Date().getFullYear()} Artiste. Tous droits réservés.
          </p>
          <Link 
            href="/admin" 
            className="text-[#333] hover:text-[#555] text-xs transition-colors duration-300"
          >
            Administration
          </Link>
        </div>
      </div>
    </footer>
  )
}
