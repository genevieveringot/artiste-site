'use client'

import Link from 'next/link'
import Image from 'next/image'

interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  settings?: {
    logo_main?: string
    logo_light?: string
    artist_name?: string
    footer_description?: string
    footer_address?: string
    footer_phone?: string
    footer_col1_title?: string
    footer_col1_links?: FooterLink[]
    footer_col2_title?: string
    footer_col2_links?: FooterLink[]
    footer_col3_title?: string
    social_x?: string
    social_instagram?: string
    social_facebook?: string
  }
}

const defaultCol1Links: FooterLink[] = [
  { label: 'MAISON', href: '/' },
  { label: 'EXPOSITIONS', href: '/expositions' },
  { label: 'COLLECTIONS', href: '/galerie' },
  { label: 'ÉVÉNEMENTS', href: '/calendrier' },
  { label: 'BOUTIQUE', href: '/boutique' }
]

const defaultCol2Links: FooterLink[] = [
  { label: 'À PROPOS', href: '/contact' },
  { label: 'CONTACT', href: '/contact' },
  { label: 'BLOG', href: '/galerie' },
  { label: 'BOUTIQUE', href: '/boutique' }
]

export default function Footer({ settings }: FooterProps) {
  const col1Links = settings?.footer_col1_links?.length ? settings.footer_col1_links : defaultCol1Links
  const col2Links = settings?.footer_col2_links?.length ? settings.footer_col2_links : defaultCol2Links

  return (
    <footer className="py-20 px-6 bg-[#13130d]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* Logo & Info */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src={settings?.logo_main || "/logo.png"}
              alt={settings?.artist_name || "Logo"}
              width={280}
              height={80}
              className="h-20 w-auto object-contain mb-8"
            />
            <p className="text-[#9a9588] font-['Cormorant_Garamond'] text-xl italic mb-2">
              {settings?.footer_description || "Artiste peintre"}
            </p>
            <p className="text-[#9a9588] text-base mb-1">
              {settings?.footer_address || "Nord de la France"}
            </p>
            {settings?.footer_phone && (
              <p className="text-[#9a9588] text-base">{settings.footer_phone}</p>
            )}
          </div>

          {/* Column 1 - Links */}
          <div>
            <h4 className="text-2xl font-['Cormorant_Garamond'] text-[#c9a050] mb-8">
              {settings?.footer_col1_title || 'Links'}
            </h4>
            <div className="space-y-4">
              {col1Links.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="block text-[#9a9588] hover:text-[#c9a050] text-sm tracking-wider transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2 - Info */}
          <div>
            <h4 className="text-2xl font-['Cormorant_Garamond'] text-[#c9a050] mb-8">
              {settings?.footer_col2_title || 'Info'}
            </h4>
            <div className="space-y-4">
              {col2Links.map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="block text-[#9a9588] hover:text-[#c9a050] text-sm tracking-wider transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 - Social */}
          <div>
            <h4 className="text-2xl font-['Cormorant_Garamond'] text-[#c9a050] mb-8">
              {settings?.footer_col3_title || 'Sociale'}
            </h4>
            <div className="space-y-4">
              {settings?.social_x && (
                <a href={settings.social_x} target="_blank" rel="noopener noreferrer" className="block text-[#9a9588] hover:text-[#c9a050] text-sm tracking-wider transition-colors">X</a>
              )}
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="block text-[#9a9588] hover:text-[#c9a050] text-sm tracking-wider transition-colors">INSTAGRAM</a>
              )}
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="block text-[#9a9588] hover:text-[#c9a050] text-sm tracking-wider transition-colors">FACEBOOK</a>
              )}
              {!settings?.social_x && !settings?.social_instagram && !settings?.social_facebook && (
                <>
                  <span className="block text-[#9a9588] text-sm tracking-wider">X</span>
                  <span className="block text-[#9a9588] text-sm tracking-wider">INSTAGRAM</span>
                  <span className="block text-[#9a9588] text-sm tracking-wider">FACEBOOK</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-5">
            {settings?.social_x && (
              <a href={settings.social_x} target="_blank" rel="noopener noreferrer" className="text-[#9a9588] hover:text-[#c9a050] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {settings?.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-[#9a9588] hover:text-[#c9a050] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            )}
            {settings?.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-[#9a9588] hover:text-[#c9a050] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
          </div>
          <p className="text-[#6b6963] text-sm tracking-wider">
            J. WATTEBLED © {new Date().getFullYear()}. TOUS DROITS RÉSERVÉS.
          </p>
        </div>
      </div>
    </footer>
  )
}
