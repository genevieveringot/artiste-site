'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface Settings {
  id?: string
  artist_name: string
  artist_title: string
  artist_bio: string
  logo_main?: string
  logo_light?: string
  hero_image: string
  hero_overlay_opacity?: number
  contact_email: string
  header_galerie?: string
  header_galerie_opacity?: number
  header_boutique?: string
  header_boutique_opacity?: number
  header_contact?: string
  header_contact_opacity?: number
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
    logo_main: '',
    logo_light: '',
    hero_image: '',
    hero_overlay_opacity: 40,
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
    // Fetch main settings
    const { data } = await supabase.from('settings').select('*').single()
    
    // Fetch logo section
    const { data: logoSection } = await supabase
      .from('page_sections')
      .select('custom_data')
      .eq('page_name', 'global')
      .eq('section_key', 'logo')
      .single()
    
    const logos = logoSection?.custom_data || {}
    
    if (data) {
      setSettings({ 
        ...settings, 
        ...data,
        logo_main: logos.logo_main || '',
        logo_light: logos.logo_light || ''
      })
    }
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

    // Separate logos from other settings
    const { id, logo_main, logo_light, ...data } = settings

    // Save main settings (without fields that don't exist in DB)
    const settingsData = { ...data }
    delete (settingsData as any).header_galerie
    delete (settingsData as any).header_galerie_opacity
    delete (settingsData as any).header_boutique
    delete (settingsData as any).header_boutique_opacity
    delete (settingsData as any).header_contact
    delete (settingsData as any).header_contact_opacity
    delete (settingsData as any).opening_hours
    delete (settingsData as any).location

    if (id) {
      await supabase.from('settings').update(settingsData).eq('id', id)
    } else {
      const { data: newData } = await supabase.from('settings').insert(settingsData).select().single()
      if (newData) setSettings({ ...settings, ...newData })
    }

    // Save logos to global/logo section
    await supabase
      .from('page_sections')
      .update({ 
        custom_data: { logo_main, logo_light }
      })
      .eq('page_name', 'global')
      .eq('section_key', 'logo')

    // Sync hero overlay opacity to hero section
    if (settingsData.hero_overlay_opacity !== undefined) {
      await supabase
        .from('page_sections')
        .update({ 
          image_overlay_opacity: (settingsData.hero_overlay_opacity as number) / 100
        })
        .eq('page_name', 'home')
        .eq('section_key', 'hero')
    }

    setIsSaving(false)
    setMessage('Paramètres enregistrés !')
    setTimeout(() => setMessage(''), 3000)
  }

  const ImageUploader = ({ 
    field, 
    label, 
    currentImage, 
    opacityField,
    currentOpacity 
  }: { 
    field: string
    label: string
    currentImage: string | undefined
    opacityField?: string
    currentOpacity?: number 
  }) => (
    <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
      <h2 className="text-xl font-medium mb-4">{label}</h2>
      <div>
        <input
          type="text"
          value={currentImage || ''}
          onChange={(e) => setSettings({ ...settings, [field]: e.target.value })}
          placeholder="URL de l'image ou uploadez ci-dessous"
          className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none mb-3"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, field)}
          className="w-full text-sm text-[var(--text-muted)]"
          disabled={uploadingField === field}
        />
        {uploadingField === field && <p className="text-sm text-[var(--accent)] mt-2">Upload en cours...</p>}
        
        {/* Filtre sombre */}
        {opacityField && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-muted)]">🌗 Filtre sombre : {currentOpacity ?? 30}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentOpacity ?? 30}
              onChange={(e) => setSettings({ ...settings, [opacityField]: parseInt(e.target.value) })}
              className="w-full h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
          </div>
        )}
        
        {currentImage && (
          <div className="mt-4 space-y-2">
            <div className="relative w-full h-40 rounded overflow-hidden">
              <Image src={currentImage} alt={label} fill className="object-cover" />
              {opacityField && (
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: `rgba(0,0,0,${(currentOpacity ?? 30) / 100})` }}
                >
                  <span className="text-white text-sm font-medium">Aperçu du filtre</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, [field]: '' })}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              🗑️ Supprimer l'image
            </button>
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
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: J. Wattebled"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Titre / Spécialité</label>
              <input
                type="text"
                value={settings.artist_title}
                onChange={(e) => setSettings({ ...settings, artist_title: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Peintre Impressionniste"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Biographie</label>
              <textarea
                value={settings.artist_bio}
                onChange={(e) => setSettings({ ...settings, artist_bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none resize-none"
                placeholder="Décrivez votre parcours artistique..."
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Email de contact</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
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
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Lundi - Vendredi: 9h - 18h"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Localisation</label>
              <input
                type="text"
                value={settings.location || ''}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Nord de la France"
              />
            </div>
          </div>
        </div>

        {/* Contact Info - shown on Contact page and Footer */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-2">📞 Informations de contact</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">Ces informations apparaissent sur la page Contact et dans le pied de page</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Téléphone</label>
              <input
                type="text"
                value={settings.footer_phone || ''}
                onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: +33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Adresse</label>
              <input
                type="text"
                value={settings.footer_address || ''}
                onChange={(e) => setSettings({ ...settings, footer_address: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Nord de la France"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Description (footer)</label>
              <input
                type="text"
                value={settings.footer_description || ''}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="Ex: Artiste peintre"
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
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://x.com/votre-compte"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Instagram</label>
              <input
                type="url"
                value={settings.social_instagram || ''}
                onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://instagram.com/votre-compte"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">Facebook</label>
              <input
                type="url"
                value={settings.social_facebook || ''}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                placeholder="https://facebook.com/votre-page"
              />
            </div>
          </div>
        </div>

        {/* Logos */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-2">🎨 Logos du site</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">Le logo apparaît dans la navigation et le footer</p>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">🌙 Logo principal (navigation, footer - fond sombre)</label>
              <input
                type="text"
                value={settings.logo_main || ''}
                onChange={(e) => setSettings({ ...settings, logo_main: e.target.value })}
                placeholder="URL du logo ou uploadez ci-dessous"
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo_main')}
                className="w-full text-sm text-[var(--text-muted)]"
                disabled={uploadingField === 'logo_main'}
              />
              {uploadingField === 'logo_main' && <p className="text-sm text-[var(--accent)] mt-2">Upload en cours...</p>}
              {settings.logo_main && (
                <div className="mt-4 space-y-2">
                  <div className="p-4 bg-[#13130d] border rounded">
                    <img src={settings.logo_main} alt="Logo principal" className="h-16 w-auto" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logo_main: '' })}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-[var(--text-muted)] mb-2">☀️ Logo alternatif (optionnel - si besoin d'un logo pour fonds clairs)</label>
              <input
                type="text"
                value={settings.logo_light || ''}
                onChange={(e) => setSettings({ ...settings, logo_light: e.target.value })}
                placeholder="URL du logo alternatif (optionnel)"
                className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'logo_light')}
                className="w-full text-sm text-[var(--text-muted)]"
                disabled={uploadingField === 'logo_light'}
              />
              {uploadingField === 'logo_light' && <p className="text-sm text-[var(--accent)] mt-2">Upload en cours...</p>}
              {settings.logo_light && (
                <div className="mt-4 space-y-2">
                  <div className="p-4 bg-white border rounded">
                    <img src={settings.logo_light} alt="Logo alternatif" className="h-16 w-auto" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, logo_light: '' })}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
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

        {/* Filtre sombre hero */}
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-medium mb-4">🌗 Filtre sombre (Hero)</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Ajuste l'opacité du filtre noir sur l'image d'accueil pour améliorer la lisibilité du texte
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Opacité : {settings.hero_overlay_opacity ?? 40}%</span>
              <span className="text-xs text-[var(--text-muted)]">0% = pas de filtre, 100% = noir total</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.hero_overlay_opacity ?? 40}
              onChange={(e) => setSettings({ ...settings, hero_overlay_opacity: parseInt(e.target.value) })}
              className="w-full h-2 bg-[var(--background)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
            />
            {/* Aperçu du filtre */}
            {settings.hero_image && (
              <div className="mt-4 relative w-full h-32 rounded overflow-hidden">
                <Image src={settings.hero_image} alt="Aperçu" fill className="object-cover" />
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ backgroundColor: `rgba(0,0,0,${(settings.hero_overlay_opacity ?? 40) / 100})` }}
                >
                  <span className="text-white text-lg font-medium">Aperçu du filtre</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <ImageUploader 
          field="header_galerie" 
          label="🎨 Page Galerie" 
          currentImage={settings.header_galerie}
          opacityField="header_galerie_opacity"
          currentOpacity={settings.header_galerie_opacity}
        />

        <ImageUploader 
          field="header_boutique" 
          label="🛒 Page Boutique" 
          currentImage={settings.header_boutique}
          opacityField="header_boutique_opacity"
          currentOpacity={settings.header_boutique_opacity}
        />

        <ImageUploader 
          field="header_contact" 
          label="📧 Page Contact" 
          currentImage={settings.header_contact}
          opacityField="header_contact_opacity"
          currentOpacity={settings.header_contact_opacity}
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
