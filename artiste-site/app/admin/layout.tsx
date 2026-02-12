'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // Fermer le menu quand on change de page
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
    
    if (res.ok) {
      sessionStorage.setItem('admin_auth', 'true')
      setIsAuthenticated(true)
    } else {
      setError('Mot de passe incorrect')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-light text-center mb-8">Administration</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#c9a050] text-[#13130d] focus:border-[#c9a050] focus:outline-none pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[var(--accent)] text-black font-medium hover:bg-[var(--accent-hover)] transition-colors"
            >
              Connexion
            </button>
          </form>
          <Link href="/" className="block text-center mt-6 text-[var(--text-muted)] hover:text-[var(--accent)]">
            ← Retour au site
          </Link>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', label: '🏠 Dashboard', exact: true },
    { href: '/admin/visual', label: '✨ Éditeur visuel' },
    { href: '/admin/sections', label: '📄 Sections' },
    { href: '/admin/paintings', label: '🎨 Tableaux' },
    { href: '/admin/exhibitions', label: '🏆 Expositions' },
    { href: '/admin/settings', label: '⚙️ Paramètres' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="bg-[var(--surface)] border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/admin" className="text-xl font-light text-[var(--accent)]">
              Admin
            </Link>
            
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-white'} transition-colors`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-white">
                Voir le site
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Déconnexion
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#13130d]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#c9a050]/30 pt-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = item.exact 
                    ? pathname === item.href 
                    : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`py-3 px-4 rounded text-base ${isActive ? 'bg-[#c9a050]/20 text-[#c9a050]' : 'text-[#13130d]'}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                <hr className="border-[#c9a050]/30 my-2" />
                <Link href="/" className="py-3 px-4 text-[#13130d]">
                  👁️ Voir le site
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-3 px-4 text-left text-red-500"
                >
                  🚪 Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  )
}
