'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Image as ImageIcon, Calendar, TrendingUp, Eye, Plus, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalPaintings: number
  availablePaintings: number
  soldPaintings: number
  upcomingExhibitions: number
  totalExhibitions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPaintings: 0,
    availablePaintings: 0,
    soldPaintings: 0,
    upcomingExhibitions: 0,
    totalExhibitions: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [paintingsRes, exhibitionsRes] = await Promise.all([
        supabase.from('paintings').select('id, available'),
        supabase.from('exhibitions').select('id, start_date'),
      ])

      const paintings = paintingsRes.data || []
      const exhibitions = exhibitionsRes.data || []
      const now = new Date()

      setStats({
        totalPaintings: paintings.length,
        availablePaintings: paintings.filter((p: { available: boolean }) => p.available).length,
        soldPaintings: paintings.filter((p: { available: boolean }) => !p.available).length,
        totalExhibitions: exhibitions.length,
        upcomingExhibitions: exhibitions.filter((e: { start_date: string }) => new Date(e.start_date) > now).length,
      })
      setIsLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Tableaux',
      value: stats.totalPaintings,
      icon: ImageIcon,
      color: 'text-blue-400',
      href: '/admin/paintings',
    },
    {
      title: 'Disponibles',
      value: stats.availablePaintings,
      icon: Eye,
      color: 'text-green-400',
      href: '/admin/paintings',
    },
    {
      title: 'Vendus',
      value: stats.soldPaintings,
      icon: TrendingUp,
      color: 'text-[#c9a86c]',
      href: '/admin/paintings',
    },
    {
      title: 'Expositions',
      value: stats.totalExhibitions,
      icon: Calendar,
      color: 'text-purple-400',
      href: '/admin/exhibitions',
    },
  ]

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
        <p className="text-[#888] font-light">Vue d'ensemble de votre portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link 
              key={stat.title} 
              href={stat.href} 
              className="group bg-[#111] border border-[#1a1a1a] p-6 hover:border-[#2a2a2a] transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon size={24} className={stat.color} />
                <ArrowRight size={16} className="text-[#555] group-hover:text-[#888] transition-colors" />
              </div>
              <p className="text-3xl font-serif mb-1">
                {isLoading ? '-' : stat.value}
              </p>
              <p className="text-[#888] text-sm">{stat.title}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="font-serif text-xl mb-6">Actions Rapides</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link 
            href="/admin/paintings?action=new"
            className="group bg-[#111] border border-[#1a1a1a] p-6 flex items-center gap-4 hover:border-[#c9a86c]/50 transition-colors duration-300"
          >
            <div className="w-12 h-12 border border-[#c9a86c]/30 flex items-center justify-center group-hover:border-[#c9a86c] transition-colors">
              <Plus size={20} className="text-[#c9a86c]" />
            </div>
            <div>
              <p className="font-medium group-hover:text-[#c9a86c] transition-colors">Ajouter un Tableau</p>
              <p className="text-sm text-[#888]">Créer une nouvelle œuvre</p>
            </div>
          </Link>

          <Link 
            href="/admin/exhibitions?action=new"
            className="group bg-[#111] border border-[#1a1a1a] p-6 flex items-center gap-4 hover:border-[#c9a86c]/50 transition-colors duration-300"
          >
            <div className="w-12 h-12 border border-[#c9a86c]/30 flex items-center justify-center group-hover:border-[#c9a86c] transition-colors">
              <Plus size={20} className="text-[#c9a86c]" />
            </div>
            <div>
              <p className="font-medium group-hover:text-[#c9a86c] transition-colors">Ajouter une Exposition</p>
              <p className="text-sm text-[#888]">Planifier un événement</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Upcoming Notice */}
      {stats.upcomingExhibitions > 0 && (
        <div className="bg-[#c9a86c]/10 border border-[#c9a86c]/30 p-6">
          <p className="text-[#c9a86c]">
            📅 Vous avez {stats.upcomingExhibitions} exposition{stats.upcomingExhibitions > 1 ? 's' : ''} à venir
          </p>
        </div>
      )}
    </div>
  )
}
