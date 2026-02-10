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
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

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
                  className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none pr-12"
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
    { href: '/admin', label: 'Dashboard', exact: true },
    { href: '/admin/pages', label: '📄 Pages' },
    { href: '/admin/paintings', label: '🎨 Tableaux' },
    { href: '/admin/exhibitions', label: '🏆 Expositions' },
    { href: '/admin/footer', label: '🦶 Footer' },
    { href: '/admin/settings', label: '⚙️ Paramètres' },
  ]

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <nav className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-light text-[var(--accent)]">
              Admin
            </Link>
            <div className="flex gap-6">
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
          </div>
          <div className="flex items-center gap-4">
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
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
