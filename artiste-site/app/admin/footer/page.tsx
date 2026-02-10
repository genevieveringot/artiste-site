'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface FooterLink {
  label: string
  href: string
}

interface FooterSettings {
  id?: string
  footer_description: string
  footer_address: string
  footer_phone: string
  footer_col1_title: string
  footer_col1_links: FooterLink[]
  footer_col2_title: string
  footer_col2_links: FooterLink[]
  footer_col3_title: string
  social_x: string
  social_instagram: string
  social_facebook: string
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

export default function FooterAdmin() {
  const [settings, setSettings] = useState<FooterSettings>({
    footer_description: 'Artiste peintre',
    footer_address: 'Nord de la France',
    footer_phone: '',
    footer_col1_title: 'Links',
    footer_col1_links: defaultCol1Links,
    footer_col2_title: 'Info',
    footer_col2_links: defaultCol2Links,
    footer_col3_title: 'Sociale',
    social_x: '',
    social_instagram: '',
    social_facebook: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').single()
    if (data) {
      setSettings({
        id: data.id,
        footer_description: data.footer_description || 'Artiste peintre',
        footer_address: data.footer_address || 'Nord de la France',
        footer_phone: data.footer_phone || '',
        footer_col1_title: data.footer_col1_title || 'Links',
        footer_col1_links: data.footer_col1_links || defaultCol1Links,
        footer_col2_title: data.footer_col2_title || 'Info',
        footer_col2_links: data.footer_col2_links || defaultCol2Links,
        footer_col3_title: data.footer_col3_title || 'Sociale',
        social_x: data.social_x || '',
        social_instagram: data.social_instagram || '',
        social_facebook: data.social_facebook || ''
      })
    }
  }

  function updateLink(column: 'col1' | 'col2', index: number, field: 'label' | 'href', value: string) {
    const key = column === 'col1' ? 'footer_col1_links' : 'footer_col2_links'
    const links = [...settings[key]]
    links[index] = { ...links[index], [field]: value }
    setSettings({ ...settings, [key]: links })
  }

  function addLink(column: 'col1' | 'col2') {
    const key = column === 'col1' ? 'footer_col1_links' : 'footer_col2_links'
    setSettings({
      ...settings,
      [key]: [...settings[key], { label: 'NOUVEAU', href: '/' }]
    })
  }

  function removeLink(column: 'col1' | 'col2', index: number) {
    const key = column === 'col1' ? 'footer_col1_links' : 'footer_col2_links'
    const links = settings[key].filter((_, i) => i !== index)
    setSettings({ ...settings, [key]: links })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    const { id, ...data } = settings

    if (id) {
      await supabase.from('settings').update(data).eq('id', id)
    } else {
      await supabase.from('settings').insert(data)
    }

    setIsSaving(false)
    setMessage('Footer enregistré !')
    setTimeout(() => setMessage(''), 3000)
  }

  const LinksEditor = ({ 
    column, 
    title, 
    links, 
    onTitleChange 
  }: { 
    column: 'col1' | 'col2'
    title: string
    links: FooterLink[]
    onTitleChange: (value: string) => void
  }) => (
    <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
      <div className="mb-4">
        <label className="block text-sm text-[var(--text-muted)] mb-2">Titre de la colonne</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
        />
      </div>
      
      <label className="block text-sm text-[var(--text-muted)] mb-2">Liens</label>
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              value={link.label}
              onChange={(e) => updateLink(column, index, 'label', e.target.value)}
              placeholder="Texte"
              className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-white text-sm focus:border-[var(--accent)] focus:outline-none"
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => updateLink(column, index, 'href', e.target.value)}
              placeholder="/page"
              className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-white text-sm focus:border-[var(--accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeLink(column, index)}
              className="p-2 text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => addLink(column)}
        className="mt-3 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]"
      >
        + Ajouter un lien
      </button>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-light mb-8">Paramètres du Footer</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        
        {/* Informations principales */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-6">📝 Colonne principale (Logo)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Description (sous le logo)</label>
              <input
                type="text"
                value={settings.footer_description}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Artiste peintre"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Adresse / Localisation</label>
              <input
                type="text"
                value={settings.footer_address}
                onChange={(e) => setSettings({ ...settings, footer_address: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Nord de la France"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Téléphone (optionnel)</label>
              <input
                type="text"
                value={settings.footer_phone}
                onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: +33 6 12 34 56 78"
              />
            </div>
          </div>
        </div>

        {/* Colonne 1 - Links */}
        <LinksEditor
          column="col1"
          title={settings.footer_col1_title}
          links={settings.footer_col1_links}
          onTitleChange={(value) => setSettings({ ...settings, footer_col1_title: value })}
        />

        {/* Colonne 2 - Info */}
        <LinksEditor
          column="col2"
          title={settings.footer_col2_title}
          links={settings.footer_col2_links}
          onTitleChange={(value) => setSettings({ ...settings, footer_col2_title: value })}
        />

        {/* Colonne 3 - Réseaux sociaux */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <div className="mb-4">
            <label className="block text-sm text-[var(--text-muted)] mb-2">Titre de la colonne</label>
            <input
              type="text"
              value={settings.footer_col3_title}
              onChange={(e) => setSettings({ ...settings, footer_col3_title: e.target.value })}
              className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">X (Twitter)</label>
              <input
                type="url"
                value={settings.social_x}
                onChange={(e) => setSettings({ ...settings, social_x: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://x.com/votre-compte"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Instagram</label>
              <input
                type="url"
                value={settings.social_instagram}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://instagram.com/votre-compte"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Facebook</label>
              <input
                type="url"
                value={settings.social_facebook}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://facebook.com/votre-page"
              />
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <div className="bg-[#1a1816] border border-[var(--border)] p-6 rounded">
          <h2 className="text-xl font-medium mb-6 text-white">👁️ Aperçu du footer</h2>
          <div className="grid grid-cols-4 gap-8">
            {/* Logo & Info */}
            <div>
              <Image src="/logo.png" alt="Logo" width={150} height={40} className="h-10 w-auto mb-4" />
              <p className="text-[#a09a92] italic text-sm">{settings.footer_description}</p>
              <p className="text-[#a09a92] text-xs mt-1">{settings.footer_address}</p>
              {settings.footer_phone && <p className="text-[#a09a92] text-xs">{settings.footer_phone}</p>}
            </div>

            {/* Col 1 */}
            <div>
              <h4 className="text-[#c9a962] mb-3 text-sm">{settings.footer_col1_title}</h4>
              <div className="text-[#a09a92] text-xs space-y-1">
                {settings.footer_col1_links.map((link, i) => (
                  <p key={i}>{link.label}</p>
                ))}
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="text-[#c9a962] mb-3 text-sm">{settings.footer_col2_title}</h4>
              <div className="text-[#a09a92] text-xs space-y-1">
                {settings.footer_col2_links.map((link, i) => (
                  <p key={i}>{link.label}</p>
                ))}
              </div>
            </div>

            {/* Col 3 - Social */}
            <div>
              <h4 className="text-[#c9a962] mb-3 text-sm">{settings.footer_col3_title}</h4>
              <div className="text-[#a09a92] text-xs space-y-1">
                {settings.social_x && <p>X</p>}
                {settings.social_instagram && <p>INSTAGRAM</p>}
                {settings.social_facebook && <p>FACEBOOK</p>}
                {!settings.social_x && !settings.social_instagram && !settings.social_facebook && (
                  <p className="text-[#6b6963]">(aucun réseau)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sticky bottom-0 bg-[var(--background)] py-4 border-t border-[var(--border)]">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[var(--accent)] text-black font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Enregistrement...' : '💾 Enregistrer le footer'}
          </button>
          {message && (
            <span className="text-green-400 font-medium">{message}</span>
          )}
        </div>
      </form>
    </div>
  )
}
