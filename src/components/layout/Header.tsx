'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface NavItem {
  label: string
  href: string
}

const defaultNavItems: NavItem[] = [
  { href: '/', label: 'Accueil' },
  { href: '/l-artiste', label: "L'artiste" },
  { href: '/galerie', label: 'Galerie' },
  { href: '/expositions', label: 'Expositions' },
  { href: '/contact', label: 'Contact' },
]

interface HeaderProps {
  siteName?: string
  navItems?: NavItem[]
}

export default function Header({ siteName, navItems }: HeaderProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()

  const items = navItems && navItems.length > 0 ? navItems : defaultNavItems

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Add is-home class to body on homepage for transparent header
  useEffect(() => {
    if (pathname === '/') {
      document.body.classList.add('is-home')
    } else {
      document.body.classList.remove('is-home')
    }
    return () => document.body.classList.remove('is-home')
  }, [pathname])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`} id="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-logo" aria-label="Accueil">
          <span className="site-logo__text">{siteName || 'Artiste Peintre'}</span>
        </Link>

        <button
          className={`nav-toggle${isOpen ? ' is-active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          <span className="nav-toggle__line" />
          <span className="nav-toggle__line" />
          <span className="nav-toggle__line" />
        </button>

        <nav className={`main-nav${isOpen ? ' is-open' : ''}`} role="navigation" aria-label="Navigation principale">
          {items.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? 'is-active' : ''}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href={session ? '/mon-compte' : '/connexion'}
            className={pathname === '/mon-compte' || pathname === '/connexion' ? 'is-active' : ''}
          >
            {session ? 'Mon compte' : 'Connexion'}
          </Link>
        </nav>

        {isOpen && (
          <div
            className="nav-overlay is-visible"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  )
}
