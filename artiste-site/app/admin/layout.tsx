'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Calendar, 
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/paintings', label: 'Tableaux', icon: ImageIcon },
  { href: '/admin/exhibitions', label: 'Expositions', icon: Calendar },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(false)
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  // Show login page without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-[#1a1a1a] transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#1a1a1a]">
            <Link href="/" className="font-serif text-xl tracking-wider flex items-center gap-2 hover:text-[#c9a86c] transition-colors">
              ARTISTE
              <ExternalLink size={14} className="text-[#555]" />
            </Link>
            <p className="text-xs text-[#555] mt-1 uppercase tracking-wider">Administration</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-300 ${
                        isActive 
                          ? 'bg-[#c9a86c]/10 text-[#c9a86c] border-l-2 border-[#c9a86c]' 
                          : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-[#1a1a1a]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-sm text-[#888] hover:text-white hover:bg-[#1a1a1a] transition-colors duration-300"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#111] border-b border-[#1a1a1a] p-4 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white/80 hover:text-white"
          >
            <Menu size={24} />
          </button>
          <span className="font-serif text-lg">Admin</span>
          <div className="w-10" />
        </header>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* Mobile close button */}
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="fixed top-4 right-4 z-50 p-2 bg-[#1a1a1a] lg:hidden"
        >
          <X size={24} />
        </button>
      )}
    </div>
  )
}
