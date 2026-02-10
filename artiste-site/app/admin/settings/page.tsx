'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface Settings {
  id?: string
  artist_name: string
  artist_title: string
  artist_bio: string
  hero_image: string
  contact_email: string
  header_galerie?: string
  header_boutique?: string
  header_contact?: string
  opening_hours?: string
  location?: string
  footer_description?: string
  footer_address?: string
  footer_phone?: string
  social_x?: string
  social_instagram?: string
  social_facebook?: string
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings>({
    artist_name: '',
    artist_title: '',
    artist_bio: '',
    hero_image: '',
    contact_email: '',
    header_galerie: '',
    header_boutique: '',
    header_contact: '',
    opening_hours: 'Lundi - Vendredi: 9h - 18h',
    location: 'Nord de la France',
    footer_description: '',
    footer_address: '',
    footer_phone: '',
    social_x: '',
    social_instagram: '',
    social_facebook: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*').single()
    if (data) setSettings({ ...settings, ...data })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: string) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    const fileExt = file.name.split('.').pop()
    const fileName = `${field}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('artiste-images')
      .upload(fileName, file)

    if (uploadError) {
      alert('Erreur upload: ' + uploadError.message)
      setUploadingField(null)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('artiste-images')
      .getPublicUrl(fileName)

    setSettings({ ...settings, [field]: publicUrl })
    setUploadingField(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    const { id, ...data } = settings

    if (id) {
      await supabase.from('settings').update(data).eq('id', id)
    } else {
      const { data: newData } = await supabase.from('settings').insert(data).select().single()
      if (newData) setSettings(newData)
    }

    setIsSaving(false)
    setMessage('Paramètres enregistrés !')
    setTimeout(() => setMessage(''), 3000)
  }

  const ImageUploader = ({ field, label, currentImage }: { field: string, label: string, currentImage: string | undefined }) => (
    <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
      <h2 className="text-xl font-medium mb-4">{label}</h2>
      <div>
        <input
          type="text"
          value={currentImage || ''}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          placeholder="URL de l'image ou uploadez ci-dessous"
          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none mb-3"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, field)}
          className="w-full text-sm text-[var(--text-muted)]"
          disabled={uploadingField === field}
        />
        {uploadingField === field && <p className="text-sm text-[var(--accent)] mt-2">Upload en cours...</p>}
        {currentImage && (
          <div className="mt-4 relative w-full h-40 rounded overflow-hidden">
            <Image src={currentImage} alt={label} fill className="object-cover" />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <h1 className="text-3xl font-light mb-8">Paramètres du site</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        
        {/* Informations artiste */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-6">👤 Informations de l'artiste</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Nom de l'artiste</label>
              <input
                type="text"
                value={settings.artist_name}
                onChange={(e) => setSettings({ ...settings, artist_name: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: J. Wattebled"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Titre / Spécialité</label>
              <input
                type="text"
                value={settings.artist_title}
                onChange={(e) => setSettings({ ...settings, artist_title: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Peintre Impressionniste"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Biographie</label>
              <textarea
                value={settings.artist_bio}
                onChange={(e) => setSettings({ ...settings, artist_bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                placeholder="Décrivez votre parcours artistique..."
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Email de contact</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="contact@exemple.com"
              />
            </div>
          </div>
        </div>

        {/* Infos pratiques */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-6">📍 Informations pratiques</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Horaires d'ouverture</label>
              <input
                type="text"
                value={settings.opening_hours || ''}
                onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Lundi - Vendredi: 9h - 18h"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Localisation</label>
              <input
                type="text"
                value={settings.location || ''}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Nord de la France"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-6">📝 Pied de page (Footer)</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Description</label>
              <input
                type="text"
                value={settings.footer_description || ''}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Artiste peintre"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Adresse</label>
              <input
                type="text"
                value={settings.footer_address || ''}
                onChange={(e) => setSettings({ ...settings, footer_address: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Nord de la France"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Téléphone</label>
              <input
                type="text"
                value={settings.footer_phone || ''}
                onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: +33 6 12 34 56 78"
              />
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-6">🌐 Réseaux sociaux</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">X (Twitter)</label>
              <input
                type="url"
                value={settings.social_x || ''}
                onChange={(e) => setSettings({ ...settings, social_x: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://x.com/votre-compte"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Instagram</label>
              <input
                type="url"
                value={settings.social_instagram || ''}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://instagram.com/votre-compte"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Facebook</label>
              <input
                type="url"
                value={settings.social_facebook || ''}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://facebook.com/votre-page"
              />
            </div>
          </div>
        </div>

        {/* Images des headers */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-2">🖼️ Images des pages</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">Ces images apparaissent en fond des headers de chaque page</p>
        </div>

        <ImageUploader 
          field="hero_image" 
          label="🏠 Page d'accueil (Hero)" 
          currentImage={settings.hero_image} 
        />

        <ImageUploader 
          field="header_galerie" 
          label="🎨 Page Galerie" 
          currentImage={settings.header_galerie} 
        />

        <ImageUploader 
          field="header_boutique" 
          label="🛒 Page Boutique" 
          currentImage={settings.header_boutique} 
        />

        <ImageUploader 
          field="header_contact" 
          label="📧 Page Contact" 
          currentImage={settings.header_contact} 
        />

        <div className="flex items-center gap-4 sticky bottom-0 bg-[var(--background)] py-4 border-t border-[var(--border)]">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[var(--accent)] text-black font-medium hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Enregistrement...' : '💾 Enregistrer tous les paramètres'}
          </button>
          {message && (
            <span className="text-green-400 font-medium">{message}</span>
          )}
        </div>
      </form>
    </div>
  )
}
