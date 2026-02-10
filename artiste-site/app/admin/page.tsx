'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ paintings: 0, exhibitions: 0 })
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const [paintingsRes, exhibitionsRes] = await Promise.all([
        supabase.from('paintings').select('id', { count: 'exact' }),
        supabase.from('exhibitions').select('id', { count: 'exact' })
      ])
      
      setStats({
        paintings: paintingsRes.count || 0,
        exhibitions: exhibitionsRes.count || 0
      })
    }
    fetchStats()
  }, [])

  const cards = [
    {
      title: 'Tableaux',
      count: stats.paintings,
      href: '/admin/paintings',
      description: 'Gérer vos peintures et œuvres'
    },
    {
      title: 'Expositions',
      count: stats.exhibitions,
      href: '/admin/exhibitions',
      description: 'Gérer vos expositions et récompenses'
    },
    {
      title: 'Paramètres',
      count: null,
      href: '/admin/settings',
      description: 'Configurer votre profil et le site'
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-light mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
          >
            <h2 className="text-xl font-medium mb-2">{card.title}</h2>
            {card.count !== null && (
              <p className="text-4xl text-[var(--accent)] font-light mb-2">
                {card.count}
              </p>
            )}
            <p className="text-[var(--text-muted)] text-sm">{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-[var(--surface)] border border-[var(--border)]">
        <h2 className="text-xl font-medium mb-4">Actions rapides</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/paintings?new=true"
            className="px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] transition-colors"
          >
            + Nouveau tableau
          </Link>
          <Link
            href="/admin/exhibitions?new=true"
            className="px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] transition-colors"
          >
            + Nouvelle exposition
          </Link>
        </div>
      </div>
    </div>
  )
}
