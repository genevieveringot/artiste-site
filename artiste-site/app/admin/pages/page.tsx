'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface PageSection {
  id: string
  page_name: string
  section_key: string
  section_order: number
  title: string | null
  subtitle: string | null
  description: string | null
  button_text: string | null
  button_link: string | null
  image_url: string | null
  image_overlay_opacity: number
  background_color: string
  text_color: string
  accent_color: string
  is_visible: boolean
  custom_data: any
}

const PAGES = [
  { key: 'home', label: '🏠 Accueil' },
  { key: 'galerie', label: '🎨 Galerie' },
  { key: 'boutique', label: '🛒 Boutique' },
  { key: 'contact', label: '📧 Contact' },
  { key: 'expositions', label: '🖼️ Expositions' },
  { key: 'calendrier', label: '📅 Calendrier' }
]

export default function PagesAdmin() {
  const [sections, setSections] = useState<PageSection[]>([])
  const [selectedPage, setSelectedPage] = useState('home')
  const [editingSection, setEditingSection] = useState<PageSection | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchSections()
  }, [])

  async function fetchSections() {
    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .order('page_name')
      .order('section_order')
    if (data) setSections(data)
  }

  const pageSections = sections.filter(s => s.page_name === selectedPage)

  function openEditModal(section: PageSection) {
    setEditingSection({ ...section })
    setIsModalOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingSection) return

    setUploadingField('image_url')
    const fileExt = file.name.split('.').pop()
    const fileName = `sections/${editingSection.page_name}/${editingSection.section_key}/${Date.now()}.${fileExt}`

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

    setEditingSection({ ...editingSection, image_url: publicUrl })
    setUploadingField(null)
  }

  async function handleSave() {
    if (!editingSection) return
    setIsSaving(true)

    const { id, ...data } = editingSection
    await supabase
      .from('page_sections')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    setIsSaving(false)
    setIsModalOpen(false)
    setMessage('Section enregistrée !')
    setTimeout(() => setMessage(''), 3000)
    fetchSections()
  }

  async function handleAddSection() {
    const key = prompt('Clé de la section (ex: hero, featured, about):')
    if (!key) return

    await supabase.from('page_sections').insert({
      page_name: selectedPage,
      section_key: key,
      section_order: pageSections.length + 1,
      title: 'Nouvelle section',
      background_color: '#ffffff',
      text_color: '#3d3a36',
      accent_color: '#c9a962',
      image_overlay_opacity: 0.4
    })

    fetchSections()
  }

  async function handleDeleteSection(id: string) {
    if (!confirm('Supprimer cette section ?')) return
    await supabase.from('page_sections').delete().eq('id', id)
    fetchSections()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Contenu des pages</h1>
        {message && <span className="text-green-400">{message}</span>}
      </div>

      <p className="text-[var(--text-muted)] mb-6">
        Modifiez le contenu, les images et les couleurs de chaque section de vos pages.
      </p>

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PAGES.map(page => (
          <button
            key={page.key}
            onClick={() => setSelectedPage(page.key)}
            className={`px-4 py-2 text-sm transition-colors ${
              selectedPage === page.key
                ? 'bg-[var(--accent)] text-black'
                : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {pageSections.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-muted)]">
            <p className="mb-4">Aucune section pour cette page</p>
            <button onClick={handleAddSection} className="text-[var(--accent)] hover:underline">
              Ajouter une section
            </button>
          </div>
        ) : (
          pageSections.map((section) => (
            <div 
              key={section.id} 
              className="bg-[var(--surface)] border border-[var(--border)] p-6"
            >
              <div className="flex gap-6">
                {/* Preview */}
                <div 
                  className="w-48 h-32 flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: section.background_color }}
                >
                  {section.image_url && (
                    <>
                      <Image src={section.image_url} alt="" fill className="object-cover" />
                      <div 
                        className="absolute inset-0" 
                        style={{ backgroundColor: `rgba(0,0,0,${section.image_overlay_opacity})` }}
                      />
                    </>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-2">
                    <span 
                      className="text-xs text-center font-medium truncate"
                      style={{ color: section.text_color }}
                    >
                      {section.title || section.section_key}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">{section.section_key}</h3>
                    {!section.is_visible && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs">Masqué</span>
                    )}
                  </div>
                  {section.title && (
                    <p className="text-[var(--accent)] mb-1">{section.title}</p>
                  )}
                  {section.description && (
                    <p className="text-[var(--text-muted)] text-sm line-clamp-2">{section.description}</p>
                  )}
                  <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-white/20" style={{ backgroundColor: section.background_color }} />
                      <span className="text-xs text-[var(--text-muted)]">Fond</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-white/20" style={{ backgroundColor: section.text_color }} />
                      <span className="text-xs text-[var(--text-muted)]">Texte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-white/20" style={{ backgroundColor: section.accent_color }} />
                      <span className="text-xs text-[var(--text-muted)]">Accent</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => openEditModal(section)}
                    className="px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="px-4 py-2 border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <button
          onClick={handleAddSection}
          className="w-full py-4 border-2 border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          + Ajouter une section
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingSection && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 overflow-y-auto">
          <div className="bg-[var(--surface)] w-full max-w-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--surface)] z-10">
              <h2 className="text-xl font-medium">
                Modifier : {editingSection.section_key}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-[var(--text-muted)] hover:text-white">
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Visibility */}
              <div className="flex items-center gap-3 p-4 bg-[var(--background)] border border-[var(--border)]">
                <input
                  type="checkbox"
                  id="is_visible"
                  checked={editingSection.is_visible}
                  onChange={(e) => setEditingSection({ ...editingSection, is_visible: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="is_visible" className="text-sm">Section visible sur le site</label>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--accent)]">📝 Contenu</h3>
                
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Titre</label>
                  <input
                    type="text"
                    value={editingSection.title || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={editingSection.subtitle || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Description</label>
                  <textarea
                    value={editingSection.description || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">Texte du bouton</label>
                    <input
                      type="text"
                      value={editingSection.button_text || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, button_text: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                      placeholder="Ex: DÉCOUVRIR"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">Lien du bouton</label>
                    <input
                      type="text"
                      value={editingSection.button_link || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, button_link: e.target.value })}
                      className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none"
                      placeholder="Ex: /galerie"
                    />
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--accent)]">🖼️ Image</h3>
                
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">URL de l'image</label>
                  <input
                    type="text"
                    value={editingSection.image_url || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-white focus:border-[var(--accent)] focus:outline-none mb-2"
                    placeholder="https://..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-[var(--text-muted)]"
                    disabled={uploadingField === 'image_url'}
                  />
                  {uploadingField === 'image_url' && <p className="text-sm text-[var(--accent)] mt-1">Upload en cours...</p>}
                </div>

                {editingSection.image_url && (
                  <div className="relative w-full h-40">
                    <Image src={editingSection.image_url} alt="" fill className="object-cover" />
                    <div 
                      className="absolute inset-0" 
                      style={{ backgroundColor: `rgba(0,0,0,${editingSection.image_overlay_opacity})` }}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">
                    Opacité du filtre sombre : {Math.round(editingSection.image_overlay_opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={editingSection.image_overlay_opacity}
                    onChange={(e) => setEditingSection({ ...editingSection, image_overlay_opacity: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--accent)]">🎨 Couleurs</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">Fond</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editingSection.background_color}
                        onChange={(e) => setEditingSection({ ...editingSection, background_color: e.target.value })}
                        className="w-12 h-10 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingSection.background_color}
                        onChange={(e) => setEditingSection({ ...editingSection, background_color: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">Texte</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editingSection.text_color}
                        onChange={(e) => setEditingSection({ ...editingSection, text_color: e.target.value })}
                        className="w-12 h-10 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingSection.text_color}
                        onChange={(e) => setEditingSection({ ...editingSection, text_color: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">Accent</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={editingSection.accent_color}
                        onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                        className="w-12 h-10 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editingSection.accent_color}
                        onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                        className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-white text-sm focus:border-[var(--accent)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Thèmes prédéfinis</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingSection({ 
                        ...editingSection, 
                        background_color: '#1a1816', 
                        text_color: '#e8e4de',
                        accent_color: '#c9a962'
                      })}
                      className="px-3 py-2 bg-[#1a1816] text-[#e8e4de] text-xs border border-[#c9a962]"
                    >
                      Sombre
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection({ 
                        ...editingSection, 
                        background_color: '#ffffff', 
                        text_color: '#3d3a36',
                        accent_color: '#c9a962'
                      })}
                      className="px-3 py-2 bg-white text-[#3d3a36] text-xs border border-[#c9a962]"
                    >
                      Clair
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection({ 
                        ...editingSection, 
                        background_color: '#2a2826', 
                        text_color: '#e8e4de',
                        accent_color: '#c9a962'
                      })}
                      className="px-3 py-2 bg-[#2a2826] text-[#e8e4de] text-xs border border-[#c9a962]"
                    >
                      Gris foncé
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection({ 
                        ...editingSection, 
                        background_color: '#f8f6f3', 
                        text_color: '#3d3a36',
                        accent_color: '#c9a962'
                      })}
                      className="px-3 py-2 bg-[#f8f6f3] text-[#3d3a36] text-xs border border-[#c9a962]"
                    >
                      Beige
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-[var(--accent)]">👁️ Aperçu</h3>
                <div 
                  className="relative p-8 min-h-[200px] flex flex-col items-center justify-center text-center"
                  style={{ backgroundColor: editingSection.background_color }}
                >
                  {editingSection.image_url && (
                    <>
                      <Image src={editingSection.image_url} alt="" fill className="object-cover" />
                      <div 
                        className="absolute inset-0" 
                        style={{ backgroundColor: `rgba(0,0,0,${editingSection.image_overlay_opacity})` }}
                      />
                    </>
                  )}
                  <div className="relative z-10">
                    {editingSection.subtitle && (
                      <p className="text-sm mb-2" style={{ color: editingSection.accent_color }}>
                        {editingSection.subtitle}
                      </p>
                    )}
                    {editingSection.title && (
                      <h2 className="text-2xl font-['Cormorant_Garamond'] mb-4" style={{ color: editingSection.text_color }}>
                        {editingSection.title}
                      </h2>
                    )}
                    {editingSection.description && (
                      <p className="text-sm opacity-80 mb-4 max-w-md" style={{ color: editingSection.text_color }}>
                        {editingSection.description}
                      </p>
                    )}
                    {editingSection.button_text && (
                      <button 
                        className="px-6 py-2 text-sm tracking-wider"
                        style={{ 
                          backgroundColor: editingSection.accent_color,
                          color: editingSection.background_color
                        }}
                      >
                        {editingSection.button_text}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border)] flex gap-4 sticky bottom-0 bg-[var(--surface)]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Enregistrement...' : '💾 Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
