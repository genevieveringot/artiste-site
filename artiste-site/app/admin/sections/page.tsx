'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface FaqItem {
  q: string
  a: string
}

interface Section {
  id: string
  page_name: string
  section_key: string
  section_order: number
  is_visible: boolean
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
  custom_data: any
  // Champs optionnels pour l'UI (pas dans la BDD actuelle)
  background_image?: string | null
  show_items_count?: number
  layout?: string
}

const PAGES = [
  { name: 'home', label: '🏠 Accueil', icon: '🏠' },
  { name: 'galerie', label: '🎨 Galerie', icon: '🎨' },
  { name: 'boutique', label: '🛒 Boutique', icon: '🛒' },
  { name: 'contact', label: '📧 Contact', icon: '📧' },
  { name: 'expositions', label: '🎭 Expositions', icon: '🎭' },
]

const SECTION_KEYS = [
  { value: 'hero', label: 'Hero (En-tête avec image)', icon: '🖼️' },
  { value: 'about', label: 'À propos (Texte + Image)', icon: '👤' },
  { value: 'featured', label: 'Collection (Grille tableaux)', icon: '🎨' },
  { value: 'awards', label: 'Récompenses (Timeline)', icon: '🏆' },
  { value: 'shop', label: 'Boutique (Grille produits)', icon: '🛒' },
  { value: 'newsletter', label: 'Newsletter (Formulaire)', icon: '📧' },
  { value: 'text', label: 'Texte simple', icon: '📝' },
  { value: 'gallery', label: 'Galerie images', icon: '🖼️' },
  { value: 'cta', label: 'Call to Action', icon: '👆' },
  { value: 'form', label: 'Formulaire contact', icon: '📋' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'info', label: 'Informations contact', icon: 'ℹ️' },
  { value: 'list', label: 'Liste événements', icon: '📅' },
]

const defaultSection: Partial<Section> = {
  section_key: 'text',
  section_order: 99,
  is_visible: true,
  title: 'Nouvelle section',
  subtitle: '',
  description: '',
  button_text: '',
  button_link: '',
  image_url: '',
  background_color: '#f7f6ec',
  text_color: '#13130d',
  accent_color: '#c9a050',
  image_overlay_opacity: 0.3,
  custom_data: {},
}

export default function SectionsAdmin() {
  const [sections, setSections] = useState<Section[]>([])
  const [activePage, setActivePage] = useState('home')
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchSections()
  }, [activePage])

  async function fetchSections() {
    const { data, error } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', activePage)
      .order('section_order', { ascending: true })
    
    if (data) setSections(data)
    if (error) console.error('Error fetching sections:', error)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'background_image') {
    const file = e.target.files?.[0]
    if (!file || !editingSection) return

    setUploadingField(field)
    const fileExt = file.name.split('.').pop()
    const fileName = `sections/${Date.now()}.${fileExt}`

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

    setEditingSection({ ...editingSection, [field]: publicUrl })
    setUploadingField(null)
  }

  async function saveSection() {
    if (!editingSection) return
    setSaving(true)

    const { id, ...data } = editingSection

    if (isCreating) {
      const { data: newSection, error } = await supabase
        .from('page_sections')
        .insert({ ...data, page_name: activePage })
        .select()
        .single()
      
      if (error) {
        alert('Erreur: ' + error.message)
      } else {
        setSections([...sections, newSection])
      }
    } else {
      const { error } = await supabase
        .from('page_sections')
        .update(data)
        .eq('id', id)
      
      if (error) {
        alert('Erreur: ' + error.message)
      } else {
        setSections(sections.map(s => s.id === id ? editingSection : s))
      }
    }

    setSaving(false)
    setEditingSection(null)
    setIsCreating(false)
    fetchSections()
  }

  // FAQ helpers
  function getFaqQuestions(): FaqItem[] {
    if (!editingSection?.custom_data?.questions) {
      return []
    }
    return editingSection.custom_data.questions
  }

  function updateFaqQuestion(index: number, field: 'q' | 'a', value: string) {
    const questions = [...getFaqQuestions()]
    questions[index] = { ...questions[index], [field]: value }
    setEditingSection({
      ...editingSection!,
      custom_data: { ...editingSection!.custom_data, questions }
    })
  }

  function addFaqQuestion() {
    const questions = [...getFaqQuestions(), { q: 'Nouvelle question ?', a: 'Réponse...' }]
    setEditingSection({
      ...editingSection!,
      custom_data: { ...editingSection!.custom_data, questions }
    })
  }

  function removeFaqQuestion(index: number) {
    const questions = getFaqQuestions().filter((_, i) => i !== index)
    setEditingSection({
      ...editingSection!,
      custom_data: { ...editingSection!.custom_data, questions }
    })
  }

  async function deleteSection(id: string) {
    if (!confirm('Supprimer cette section ?')) return
    
    const { error } = await supabase
      .from('page_sections')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setSections(sections.filter(s => s.id !== id))
    }
  }

  async function duplicateSection(section: Section) {
    const { id, ...sectionData } = section
    const newSection = {
      ...sectionData,
      title: `${section.title || 'Section'} (copie)`,
      section_order: section.section_order + 1,
    }
    
    const { data, error } = await supabase
      .from('page_sections')
      .insert(newSection)
      .select()
      .single()
    
    if (error) {
      alert('Erreur: ' + error.message)
    } else if (data) {
      fetchSections()
      // Ouvrir l'éditeur avec la nouvelle section
      setEditingSection(data)
      setIsCreating(false)
    }
  }

  async function toggleVisibility(section: Section) {
    const { error } = await supabase
      .from('page_sections')
      .update({ is_visible: !section.is_visible })
      .eq('id', section.id)
    
    if (!error) {
      setSections(sections.map(s => 
        s.id === section.id ? { ...s, is_visible: !s.is_visible } : s
      ))
    }
  }

  async function moveSection(section: Section, direction: 'up' | 'down') {
    const currentIndex = sections.findIndex(s => s.id === section.id)
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (newIndex < 0 || newIndex >= sections.length) return
    
    const otherSection = sections[newIndex]
    
    // Swap orders
    await supabase.from('page_sections').update({ section_order: otherSection.section_order }).eq('id', section.id)
    await supabase.from('page_sections').update({ section_order: section.section_order }).eq('id', otherSection.id)
    
    fetchSections()
  }

  const pageSections = sections.filter(s => s.page_name === activePage)

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-light">Sections des pages</h1>
        <button
          onClick={() => {
            setEditingSection({ ...defaultSection, page_name: activePage } as Section)
            setIsCreating(true)
          }}
          className="w-full sm:w-auto px-4 py-2 md:px-6 md:py-3 bg-[var(--accent)] text-black font-medium hover:bg-[var(--accent-hover)] transition-colors text-sm md:text-base"
        >
          + Nouvelle section
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap overflow-x-auto pb-2">
        {PAGES.map(page => (
          <button
            key={page.name}
            onClick={() => setActivePage(page.name)}
            className={`px-3 py-2 md:px-6 md:py-3 text-xs md:text-sm transition-colors whitespace-nowrap ${
              activePage === page.name
                ? 'bg-[var(--accent)] text-black'
                : 'bg-[var(--surface)] text-[var(--text-muted)] hover:text-white border border-[var(--border)]'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {pageSections.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p className="text-lg mb-4">Aucune section pour cette page</p>
            <p className="text-sm">Cliquez sur "+ Nouvelle section" pour en créer une</p>
          </div>
        ) : (
          pageSections.map((section, index) => (
            <div 
              key={section.id}
              className={`bg-[var(--surface)] border border-[var(--border)] p-4 md:p-6 ${
                !section.is_visible ? 'opacity-50' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                {/* Preview - hidden on mobile */}
                <div 
                  className="hidden md:flex w-32 h-24 flex-shrink-0 items-center justify-center text-3xl rounded"
                  style={{ backgroundColor: section.background_color, color: section.text_color }}
                >
                  {section.background_image ? (
                    <div className="relative w-full h-full">
                      <Image src={section.background_image} alt="" fill className="object-cover rounded" />
                    </div>
                  ) : (
                    SECTION_KEYS.find(t => t.value === section.section_key)?.icon || '📄'
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-[var(--accent)]/20 text-[var(--accent)] rounded">
                      {SECTION_KEYS.find(t => t.value === section.section_key)?.label || section.section_key}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      #{section.section_order}
                    </span>
                    {!section.is_visible && (
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">Masquée</span>
                    )}
                  </div>
                  <h3 className="text-xl font-medium mb-1">{section.title || '(Sans titre)'}</h3>
                  {section.subtitle && (
                    <p className="text-[var(--text-muted)] text-sm mb-2">{section.subtitle}</p>
                  )}
                  {section.description && (
                    <p className="text-[var(--text-muted)] text-sm line-clamp-2">{section.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveSection(section, 'up')}
                      disabled={index === 0}
                      className="p-2 bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-30 text-sm"
                      title="Monter"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(section, 'down')}
                      disabled={index === pageSections.length - 1}
                      className="p-2 bg-[var(--background)] border border-[var(--border)] hover:border-[var(--accent)] disabled:opacity-30 text-sm"
                      title="Descendre"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSection(section)
                      setIsCreating(false)
                    }}
                    className="px-3 py-2 bg-[var(--accent)] text-black text-xs md:text-sm hover:bg-[var(--accent-hover)]"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => duplicateSection(section)}
                    className="px-3 py-2 bg-blue-500/20 text-blue-400 text-xs md:text-sm hover:bg-blue-500/30"
                    title="Dupliquer cette section"
                  >
                    📋 Dupliquer
                  </button>
                  <button
                    onClick={() => toggleVisibility(section)}
                    className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-xs md:text-sm hover:border-[var(--accent)]"
                  >
                    {section.is_visible ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 text-xs md:text-sm hover:bg-red-500/30"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start md:items-center justify-center p-2 md:p-6 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-3xl max-h-[95vh] overflow-y-auto my-auto">
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-2xl font-medium">
                {isCreating ? 'Nouvelle section' : `Modifier : ${editingSection.title}`}
              </h2>
              <button onClick={() => { setEditingSection(null); setIsCreating(false) }} className="text-2xl">×</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Type de section */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Type de section</label>
                <select
                  value={editingSection.section_key}
                  onChange={(e) => setEditingSection({ ...editingSection, section_key: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                >
                  {SECTION_KEYS.map(type => (
                    <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                  ))}
                </select>
              </div>

              {/* Ordre */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={editingSection.section_order}
                  onChange={(e) => setEditingSection({ ...editingSection, section_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              {/* Titre - 2 lignes pour hero, 1 ligne pour les autres */}
              {editingSection.section_key === 'hero' ? (
                <>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">📝 Titre - Ligne 1</label>
                    <input
                      type="text"
                      value={(editingSection.title || '').split('|')[0]?.trim() || ''}
                      onChange={(e) => {
                        const line2 = (editingSection.title || '').split('|')[1]?.trim() || ''
                        setEditingSection({ ...editingSection, title: line2 ? `${e.target.value}|${line2}` : e.target.value })
                      }}
                      className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                      placeholder="Ex: Je suis J. Wattebled"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--text-muted)] mb-2">📝 Titre - Ligne 2</label>
                    <input
                      type="text"
                      value={(editingSection.title || '').split('|')[1]?.trim() || ''}
                      onChange={(e) => {
                        const line1 = (editingSection.title || '').split('|')[0]?.trim() || ''
                        setEditingSection({ ...editingSection, title: e.target.value ? `${line1}|${e.target.value}` : line1 })
                      }}
                      className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                      placeholder="Ex: Artiste peintre"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">📝 Titre</label>
                  <input
                    type="text"
                    value={editingSection.title || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Titre de la section"
                  />
                </div>
              )}

              {/* Sous-titre */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">📝 Sous-titre</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="Sous-titre ou accroche"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">📝 Description</label>
                <textarea
                  value={editingSection.description || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none resize-none"
                  placeholder="Description de la section"
                />
              </div>

              {/* Bouton */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">👆 Texte du bouton</label>
                  <input
                    type="text"
                    value={editingSection.button_text || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, button_text: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Ex: DÉCOUVRIR"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">🔗 Lien du bouton</label>
                  <input
                    type="text"
                    value={editingSection.button_link || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, button_link: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                    placeholder="Ex: /galerie"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">🖼️ Image principale</label>
                <input
                  type="text"
                  value={editingSection.image_url || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none mb-2"
                  placeholder="URL de l'image"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image_url')}
                  className="text-sm text-[var(--text-muted)]"
                />
                {uploadingField === 'image_url' && <p className="text-sm text-[var(--accent)] mt-1">Upload...</p>}
                {editingSection.image_url && (
                  <div className="mt-2 relative w-full h-32">
                    <Image src={editingSection.image_url} alt="" fill className="object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setEditingSection({ ...editingSection, image_url: '' })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      title="Supprimer l'image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Image de fond */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">🖼️ Image de fond</label>
                <input
                  type="text"
                  value={editingSection.background_image || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, background_image: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none mb-2"
                  placeholder="URL de l'image de fond"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'background_image')}
                  className="text-sm text-[var(--text-muted)]"
                />
                {uploadingField === 'background_image' && <p className="text-sm text-[var(--accent)] mt-1">Upload...</p>}
                {editingSection.background_image && (
                  <div className="mt-2 relative w-full h-32">
                    <Image src={editingSection.background_image} alt="" fill className="object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setEditingSection({ ...editingSection, background_image: '' })}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      title="Supprimer l'image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Opacité overlay */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">
                  🌗 Opacité du filtre sombre : {Math.round((editingSection.image_overlay_opacity || 0) * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round((editingSection.image_overlay_opacity || 0) * 100)}
                  onChange={(e) => setEditingSection({ ...editingSection, image_overlay_opacity: parseInt(e.target.value) / 100 })}
                  className="w-full"
                />
              </div>

              {/* Couleurs */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-3">🎨 Couleurs</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Fond</label>
                    <input
                      type="color"
                      value={editingSection.background_color}
                      onChange={(e) => setEditingSection({ ...editingSection, background_color: e.target.value })}
                      className="w-full h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSection.background_color}
                      onChange={(e) => setEditingSection({ ...editingSection, background_color: e.target.value })}
                      className="w-full mt-1 px-2 py-1 bg-white border border-[var(--border)] text-[#13130d] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Texte</label>
                    <input
                      type="color"
                      value={editingSection.text_color}
                      onChange={(e) => setEditingSection({ ...editingSection, text_color: e.target.value })}
                      className="w-full h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSection.text_color}
                      onChange={(e) => setEditingSection({ ...editingSection, text_color: e.target.value })}
                      className="w-full mt-1 px-2 py-1 bg-white border border-[var(--border)] text-[#13130d] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Accent</label>
                    <input
                      type="color"
                      value={editingSection.accent_color}
                      onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                      className="w-full h-12 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSection.accent_color}
                      onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                      className="w-full mt-1 px-2 py-1 bg-white border border-[var(--border)] text-[#13130d] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Nombre d'items */}
              {['featured', 'shop', 'gallery'].includes(editingSection.section_key) && (
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">📊 Nombre d'éléments à afficher</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editingSection.show_items_count}
                    onChange={(e) => setEditingSection({ ...editingSection, show_items_count: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              )}

              {/* Layout */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">📐 Disposition</label>
                <select
                  value={editingSection.layout}
                  onChange={(e) => setEditingSection({ ...editingSection, layout: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                >
                  <option value="default">Par défaut</option>
                  <option value="reverse">Inversé (image à droite)</option>
                  <option value="centered">Centré</option>
                  <option value="full-width">Pleine largeur</option>
                </select>
              </div>

              {/* FAQ Questions/Réponses */}
              {editingSection.section_key === 'faq' && (
                <div className="border-t border-[var(--border)] pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm text-[var(--text-muted)] font-medium">❓ Questions / Réponses</label>
                    <button
                      type="button"
                      onClick={addFaqQuestion}
                      className="px-3 py-1 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)]"
                    >
                      + Ajouter une question
                    </button>
                  </div>
                  
                  {getFaqQuestions().length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] italic py-4 text-center bg-[var(--background)] border border-[var(--border)]">
                      Aucune question. Cliquez sur "+ Ajouter une question" pour commencer.
                    </p>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {getFaqQuestions().map((faq, index) => (
                        <div key={index} className="bg-[var(--background)] border border-[var(--border)] p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-[var(--accent)] font-medium">Question {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeFaqQuestion(index)}
                              className="text-sm text-red-400 hover:text-red-300 px-2"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Question</label>
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => updateFaqQuestion(index, 'q', e.target.value)}
                              placeholder="Entrez votre question..."
                              className="w-full px-3 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[var(--text-muted)] mb-1">Réponse</label>
                            <textarea
                              value={faq.a}
                              onChange={(e) => updateFaqQuestion(index, 'a', e.target.value)}
                              placeholder="Entrez la réponse..."
                              rows={3}
                              className="w-full px-3 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aperçu */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">👁️ Aperçu</label>
                <div 
                  className="p-8 rounded relative overflow-hidden"
                  style={{ 
                    backgroundColor: editingSection.background_color,
                    color: editingSection.text_color
                  }}
                >
                  {editingSection.background_image && (
                    <>
                      <div className="absolute inset-0">
                        <Image src={editingSection.background_image} alt="" fill className="object-cover" />
                      </div>
                      <div 
                        className="absolute inset-0" 
                        style={{ backgroundColor: `rgba(0,0,0,${editingSection.image_overlay_opacity || 0})` }}
                      />
                    </>
                  )}
                  <div className="relative z-10">
                    {editingSection.subtitle && (
                      <p className="text-sm opacity-80 mb-2">{editingSection.subtitle}</p>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{editingSection.title || 'Titre'}</h3>
                    {editingSection.description && (
                      <p className="opacity-80 mb-4">{editingSection.description}</p>
                    )}
                    {editingSection.button_text && (
                      <button 
                        className="px-6 py-2 text-sm"
                        style={{ backgroundColor: editingSection.accent_color, color: '#fff' }}
                      >
                        {editingSection.button_text}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] p-6 flex gap-4">
              <button
                onClick={() => { setEditingSection(null); setIsCreating(false) }}
                className="flex-1 py-3 bg-white border border-[var(--border)] text-[#13130d] hover:border-[var(--accent)]"
              >
                Annuler
              </button>
              <button
                onClick={saveSection}
                disabled={saving}
                className="flex-1 py-3 bg-[var(--accent)] text-black font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : '💾 Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
