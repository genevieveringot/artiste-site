'use client'

import { useEffect, useState, useRef } from 'react'
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
}

interface Settings {
  id: string
  artist_name: string
  artist_title: string
  hero_image: string
  hero_overlay_opacity: number
  contact_email: string
  footer_phone: string
  footer_address: string
  opening_hours: string
  location: string
  header_contact: string
}

// Pages principales (onglets directs)
const MAIN_PAGES = [
  { name: 'home', label: 'Accueil', path: '/' },
  { name: 'artiste', label: "L'artiste", path: '/artiste' },
  { name: 'galerie', label: 'Galerie', path: '/galerie' },
  { name: 'boutique', label: 'Boutique', path: '/boutique' },
  { name: 'contact', label: 'Contact', path: '/contact' },
  { name: 'expositions', label: 'Expositions', path: '/expositions' },
]

// Pages compte/commandes (sous-menu)
const ACCOUNT_PAGES = [
  { name: 'panier', label: '🛒 Panier', path: '/panier' },
  { name: 'connexion', label: '🔐 Connexion', path: '/connexion' },
  { name: 'inscription', label: '📝 Inscription', path: '/inscription' },
  { name: 'compte', label: '👤 Mon compte', path: '/compte' },
  { name: 'commandes', label: '📦 Mes commandes', path: '/commandes' },
  { name: 'checkout', label: '💳 Paiement', path: '/checkout' },
]

// Toutes les pages (pour la recherche)
const ALL_PAGES = [...MAIN_PAGES, ...ACCOUNT_PAGES]

const SECTION_KEYS = [
  { value: 'hero', label: 'Hero (En-tête)', icon: '🖼️' },
  { value: 'page-header', label: 'En-tête de page', icon: '📄' },
  { value: 'about', label: 'À propos', icon: '👤' },
  { value: 'featured', label: 'Collection', icon: '🎨' },
  { value: 'awards', label: 'Récompenses', icon: '🏆' },
  { value: 'shop', label: 'Boutique', icon: '🛒' },
  { value: 'newsletter', label: 'Newsletter', icon: '📧' },
  { value: 'text', label: 'Texte simple', icon: '📝' },
  { value: 'gallery', label: 'Galerie', icon: '🖼️' },
  { value: 'cta', label: 'Call to Action', icon: '👆' },
  { value: 'form', label: 'Formulaire', icon: '📋' },
  { value: 'faq', label: 'FAQ', icon: '❓' },
  { value: 'info', label: 'Infos contact', icon: 'ℹ️' },
  { value: 'list', label: 'Liste événements', icon: '📅' },
]

export default function VisualEditor() {
  const [activePage, setActivePage] = useState('home')
  const [sections, setSections] = useState<Section[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [activePage])

  async function fetchData() {
    const [sectionsRes, settingsRes] = await Promise.all([
      supabase.from('page_sections').select('*').eq('page_name', activePage).order('section_order'),
      supabase.from('settings').select('*').single()
    ])
    if (sectionsRes.data) setSections(sectionsRes.data)
    if (settingsRes.data) setSettings(settingsRes.data)
  }

  async function createSection(sectionKey: string) {
    const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.section_order || 0)) : 0
    const sectionInfo = SECTION_KEYS.find(s => s.value === sectionKey)
    
    const newSection = {
      page_name: activePage,
      section_key: sectionKey,
      section_order: maxOrder + 1,
      is_visible: true,
      title: sectionInfo?.label || 'Nouvelle section',
      subtitle: '',
      description: '',
      button_text: '',
      button_link: '',
      image_url: '',
      background_color: '#f7f6ec',
      text_color: '#13130d',
      accent_color: '#c9a050',
      image_overlay_opacity: 0.3,
      custom_data: sectionKey === 'faq' ? { questions: [] } : {},
    }

    const { data, error } = await supabase
      .from('page_sections')
      .insert(newSection)
      .select()
      .single()

    if (error) {
      alert('Erreur: ' + error.message)
    } else if (data) {
      setSections([...sections, data])
      setEditingSection(data)
      setShowAddSection(false)
      // Refresh iframe
      if (iframeRef.current) {
        setTimeout(() => {
          iframeRef.current!.src = iframeRef.current!.src
        }, 500)
      }
    }
  }

  async function deleteSection(id: string) {
    if (!confirm('Supprimer cette section ?')) return
    
    const { error } = await supabase
      .from('page_sections')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setSections(sections.filter(s => s.id !== id))
      if (editingSection?.id === id) {
        setEditingSection(null)
      }
      setMenuOpenId(null)
      // Refresh iframe
      if (iframeRef.current) {
        setTimeout(() => {
          iframeRef.current!.src = iframeRef.current!.src
        }, 500)
      }
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
      setMenuOpenId(null)
      // Refresh iframe
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src
      }
    }
  }

  async function saveSection() {
    if (!editingSection) return
    setSaving(true)
    
    const { error } = await supabase
      .from('page_sections')
      .update({
        title: editingSection.title,
        subtitle: editingSection.subtitle,
        description: editingSection.description,
        button_text: editingSection.button_text,
        button_link: editingSection.button_link,
        image_url: editingSection.image_url,
        background_color: editingSection.background_color,
        text_color: editingSection.text_color,
        accent_color: editingSection.accent_color,
        custom_data: editingSection.custom_data,
      })
      .eq('id', editingSection.id)
    
    if (!error) {
      setLastSaved(new Date())
      setSections(sections.map(s => s.id === editingSection.id ? editingSection : s))
      // Refresh iframe
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src
      }
    }
    setSaving(false)
  }

  // Auto-save après 1.5 seconde d'inactivité
  useEffect(() => {
    if (!editingSection) return
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }
    
    autoSaveTimer.current = setTimeout(() => {
      saveSection()
    }, 1500)
    
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [editingSection])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editingSection) return

    setUploadingImage(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `sections/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('artiste-images')
      .upload(fileName, file)

    if (uploadError) {
      alert('Erreur upload: ' + uploadError.message)
      setUploadingImage(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('artiste-images')
      .getPublicUrl(fileName)

    setEditingSection({ ...editingSection, image_url: publicUrl })
    setUploadingImage(false)
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

  // Info section helpers
  function getCustomField(field: string): string {
    return editingSection?.custom_data?.[field] || ''
  }

  function updateCustomField(field: string, value: string) {
    setEditingSection({
      ...editingSection!,
      custom_data: { ...editingSection!.custom_data, [field]: value }
    })
  }

  const currentPath = ALL_PAGES.find(p => p.name === activePage)?.path || '/'

  // Render section-specific editor
  function renderSectionEditor() {
    if (!editingSection) return null

    const sectionType = editingSection.section_key

    return (
      <div ref={editorRef} className="p-4 border-t border-[#c9a050]/30 bg-[#f7f6ec] space-y-4">
        <h3 className="font-medium text-sm text-[#13130d] flex items-center gap-2">
          <span className="text-lg">
            {sectionType === 'hero' && '🖼️'}
            {sectionType === 'about' && '👤'}
            {sectionType === 'faq' && '❓'}
            {sectionType === 'info' && 'ℹ️'}
            {sectionType === 'form' && '📋'}
            {!['hero', 'about', 'faq', 'info', 'form'].includes(sectionType) && '📝'}
          </span>
          Modifier : {sectionType}
        </h3>
        
        {/* Champs CONTACT en premier pour section info */}
        {sectionType === 'info' && (
          <div className="space-y-3 p-3 bg-[#c9a050]/10 border border-[#c9a050]/30 rounded mb-4">
            <label className="block text-sm text-[#c9a050] font-medium">📍 Informations de contact</label>
            
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">📞 Téléphone</label>
              <input
                type="text"
                value={getCustomField('phone')}
                onChange={(e) => updateCustomField('phone', e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6b6860] mb-1">📧 Email</label>
              <input
                type="email"
                value={getCustomField('email')}
                onChange={(e) => updateCustomField('email', e.target.value)}
                placeholder="contact@exemple.fr"
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6b6860] mb-1">📍 Adresse (utilisée pour Google Maps)</label>
              <input
                type="text"
                value={getCustomField('address')}
                onChange={(e) => updateCustomField('address', e.target.value)}
                placeholder="38 route Wierre, 62240 Longfossé"
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6b6860] mb-1">🕐 Horaires (format: Jour: Heures)</label>
              <textarea
                value={getCustomField('hours')}
                onChange={(e) => updateCustomField('hours', e.target.value)}
                placeholder="Du lundi au vendredi: 9h00 – 18h00&#10;Samedi: Sur rendez-vous&#10;Dimanche: Fermé"
                rows={4}
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Champs communs */}
        <div className="space-y-3">
          {/* Hero: 2 lignes séparées pour le titre */}
          {sectionType === 'hero' ? (
            <>
              <div>
                <label className="block text-xs text-[#6b6860] mb-1">Titre - Ligne 1</label>
                <input
                  type="text"
                  value={(editingSection.title || '').split('|')[0]?.trim() || ''}
                  onChange={(e) => {
                    const line2 = (editingSection.title || '').split('|')[1]?.trim() || ''
                    setEditingSection({ ...editingSection, title: line2 ? `${e.target.value}|${line2}` : e.target.value })
                  }}
                  placeholder="Je suis J. Wattebled"
                  className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6b6860] mb-1">Titre - Ligne 2</label>
                <input
                  type="text"
                  value={(editingSection.title || '').split('|')[1]?.trim() || ''}
                  onChange={(e) => {
                    const line1 = (editingSection.title || '').split('|')[0]?.trim() || ''
                    setEditingSection({ ...editingSection, title: e.target.value ? `${line1}|${e.target.value}` : line1 })
                  }}
                  placeholder="Artiste peintre"
                  className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Titre</label>
              <input
                type="text"
                value={editingSection.title || ''}
                onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-[#6b6860] mb-1">Sous-titre</label>
            <input
              type="text"
              value={editingSection.subtitle || ''}
              onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#6b6860] mb-1">Description</label>
            <textarea
              value={editingSection.description || ''}
              onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Traductions anglaises */}
        <details className="border border-[#e8e7dd] rounded">
          <summary className="px-3 py-2 bg-[#e8e7dd]/50 cursor-pointer text-sm font-medium flex items-center gap-2">
            🇬🇧 English version (optionnel)
          </summary>
          <div className="p-3 space-y-3">
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Title (EN)</label>
              <input
                type="text"
                value={getCustomField('title_en')}
                onChange={(e) => updateCustomField('title_en', e.target.value)}
                placeholder="English title..."
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Subtitle (EN)</label>
              <input
                type="text"
                value={getCustomField('subtitle_en')}
                onChange={(e) => updateCustomField('subtitle_en', e.target.value)}
                placeholder="English subtitle..."
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Description (EN)</label>
              <textarea
                value={getCustomField('description_en')}
                onChange={(e) => updateCustomField('description_en', e.target.value)}
                placeholder="English description..."
                rows={3}
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Button text (EN)</label>
              <input
                type="text"
                value={getCustomField('button_text_en')}
                onChange={(e) => updateCustomField('button_text_en', e.target.value)}
                placeholder="English button text..."
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>
          </div>
        </details>

        {/* Éditeur FAQ spécifique */}
        {sectionType === 'faq' && (
          <div className="space-y-3 pt-2 border-t border-[#e8e7dd]">
            <div className="flex justify-between items-center">
              <label className="block text-xs text-[#6b6860] font-medium">Questions / Réponses</label>
              <button
                onClick={addFaqQuestion}
                className="text-xs px-2 py-1 bg-[#c9a050] text-black hover:bg-[#b8923f]"
              >
                + Ajouter
              </button>
            </div>
            
            {getFaqQuestions().length === 0 ? (
              <p className="text-xs text-[#6b6860] italic">Aucune question. Cliquez sur + Ajouter</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {getFaqQuestions().map((faq, index) => (
                  <div key={index} className="bg-white border border-[#e8e7dd] p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs text-[#c9a050] font-medium">Q{index + 1}</span>
                      <button
                        onClick={() => removeFaqQuestion(index)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => updateFaqQuestion(index, 'q', e.target.value)}
                      placeholder="Question..."
                      className="w-full px-2 py-1 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                    />
                    <textarea
                      value={faq.a}
                      onChange={(e) => updateFaqQuestion(index, 'a', e.target.value)}
                      placeholder="Réponse..."
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Éditeur Info spécifique */}
        {/* Gallery section - categories */}
        {sectionType === 'gallery' && (
          <div className="space-y-3 pt-2 border-t border-[#e8e7dd]">
            <label className="block text-xs text-[#6b6860] font-medium">🏷️ Options de la galerie</label>
            
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Texte bouton "Tous"</label>
              <input
                type="text"
                value={getCustomField('allLabel') || 'TOUS'}
                onChange={(e) => updateCustomField('allLabel', e.target.value)}
                placeholder="TOUS"
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Catégories (une par ligne)</label>
              <textarea
                value={(editingSection?.custom_data?.categories || []).join('\n')}
                onChange={(e) => {
                  const cats = e.target.value.split('\n').map(c => c.trim()).filter(c => c)
                  setEditingSection({
                    ...editingSection!,
                    custom_data: { ...editingSection!.custom_data, categories: cats }
                  })
                }}
                placeholder="PAYSAGES&#10;MARINES&#10;PORTRAITS&#10;FLEURS"
                rows={5}
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none resize-none font-mono"
              />
              <p className="text-xs text-[#6b6860] mt-1">⚠️ Ces noms doivent correspondre aux catégories de vos tableaux (Admin &gt; Tableaux)</p>
            </div>

            <div className="bg-[#f7f6ec] p-3 rounded text-xs text-[#6b6860]">
              <p className="font-medium mb-1">💡 Comment ça marche :</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Définissez vos catégories ici (ex: PAYSAGES)</li>
                <li>Dans Admin &gt; Tableaux, assignez la même catégorie à chaque tableau</li>
                <li>Les filtres fonctionneront automatiquement</li>
              </ol>
            </div>
          </div>
        )}

        {/* Image upload pour sections avec image (about, awards, newsletter, hero) */}
        {['about', 'awards', 'newsletter', 'hero'].includes(sectionType) && (
          <div className="space-y-3 pt-2 border-t border-[#e8e7dd]">
            <label className="block text-xs text-[#6b6860] font-medium">🖼️ Image {sectionType === 'awards' ? 'de gauche' : sectionType === 'newsletter' ? 'de fond' : ''}</label>
            
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">URL de l'image</label>
              <input
                type="text"
                value={editingSection.image_url || ''}
                onChange={(e) => setEditingSection({ ...editingSection, image_url: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Ou télécharger une image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-[#6b6860]"
              />
              {uploadingImage && <p className="text-xs text-[#c9a050] mt-1">Upload en cours...</p>}
            </div>

            {/* Slider opacité pour hero et newsletter */}
            {['hero', 'newsletter'].includes(sectionType) && (
              <div>
                <label className="block text-xs text-[#6b6860] mb-1">🌗 Filtre sombre : {Math.round((editingSection.image_overlay_opacity || 0.3) * 100)}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round((editingSection.image_overlay_opacity || 0.3) * 100)}
                  onChange={(e) => setEditingSection({ ...editingSection, image_overlay_opacity: parseInt(e.target.value) / 100 })}
                  className="w-full"
                />
              </div>
            )}

            {editingSection.image_url && (
              <div className="space-y-2">
                <div className="relative w-full h-32 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={editingSection.image_url} 
                    alt="Aperçu" 
                    className="w-full h-full object-cover"
                  />
                  {['hero', 'newsletter'].includes(sectionType) && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: `rgba(0,0,0,${editingSection.image_overlay_opacity || 0.3})` }}
                    >
                      <span className="text-white text-xs">Aperçu filtre</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingSection({ ...editingSection, image_url: '' })}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  🗑️ Supprimer l'image
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bouton (pour les sections avec CTA) */}
        {['hero', 'about', 'awards', 'shop', 'featured', 'cta', 'text', 'newsletter'].includes(sectionType) && (
          <div className="space-y-3 pt-2 border-t border-[#e8e7dd]">
            <label className="block text-xs text-[#6b6860] font-medium">Bouton d'action</label>
            
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Texte du bouton</label>
              <input
                type="text"
                value={editingSection.button_text || ''}
                onChange={(e) => setEditingSection({ ...editingSection, button_text: e.target.value })}
                placeholder="DÉCOUVRIR"
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Lien du bouton</label>
              <input
                type="text"
                value={editingSection.button_link || ''}
                onChange={(e) => setEditingSection({ ...editingSection, button_link: e.target.value })}
                placeholder="/galerie"
                className="w-full px-3 py-2 text-sm border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Image de l'artiste (hero uniquement) */}
        {sectionType === 'hero' && (
          <div className="space-y-3 pt-2 border-t border-[#e8e7dd]">
            <label className="block text-xs text-[#6b6860] font-medium">🖼️ Image (affichée à droite)</label>
            
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Choisir une image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  // Afficher le chargement
                  setEditingSection({ 
                    ...editingSection, 
                    custom_data: { ...editingSection.custom_data, uploading: true }
                  })
                  
                  try {
                    // Lire les dimensions de l'image
                    const img = new window.Image()
                    img.src = URL.createObjectURL(file)
                    await new Promise(resolve => img.onload = resolve)
                    const imgWidth = img.naturalWidth
                    const imgHeight = img.naturalHeight
                    
                    const fileExt = file.name.split('.').pop()
                    const fileName = `portraits/${Date.now()}.${fileExt}`
                    const { error } = await supabase.storage.from('artiste-images').upload(fileName, file)
                    if (error) { 
                      alert('Erreur: ' + error.message)
                      setEditingSection({ ...editingSection, custom_data: { ...editingSection.custom_data, uploading: false }})
                      return 
                    }
                    const { data: { publicUrl } } = supabase.storage.from('artiste-images').getPublicUrl(fileName)
                    setEditingSection({ 
                      ...editingSection, 
                      custom_data: { 
                        ...editingSection.custom_data, 
                        portrait_url: publicUrl,
                        img_width: imgWidth,
                        img_height: imgHeight,
                        uploading: false
                      }
                    })
                  } catch (err) {
                    alert('Erreur lors de l\'upload')
                    setEditingSection({ ...editingSection, custom_data: { ...editingSection.custom_data, uploading: false }})
                  }
                }}
                className="text-xs text-[#6b6860]"
              />
            </div>

            {editingSection.custom_data?.uploading && (
              <p className="text-sm text-[#c9a050] animate-pulse">⏳ Upload en cours...</p>
            )}

            {editingSection.custom_data?.portrait_url && !editingSection.custom_data?.uploading && (
              <div className="space-y-3">
                <div className="relative bg-gray-100 rounded overflow-hidden" style={{ width: '150px', height: '100px' }}>
                  <img 
                    src={editingSection.custom_data.portrait_url} 
                    alt="Image" 
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${(editingSection.custom_data?.zoom || 100) / 100})` }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-[#6b6860] mb-1">🔍 Zoom : {editingSection.custom_data?.zoom || 100}%</label>
                  <input 
                    type="range" 
                    min="100" 
                    max="200" 
                    value={editingSection.custom_data?.zoom || 100} 
                    onChange={(e) => setEditingSection({ ...editingSection, custom_data: { ...editingSection.custom_data, zoom: parseInt(e.target.value) } })} 
                    className="w-full" 
                  />
                  <p className="text-xs text-[#6b6860] mt-1">Augmente le zoom pour masquer les bords blancs</p>
                </div>
                
                <button type="button" onClick={() => setEditingSection({ ...editingSection, custom_data: { ...editingSection.custom_data, portrait_url: '', img_width: null, img_height: null, zoom: 100 } })} className="text-xs text-red-500 hover:text-red-700">🗑️ Supprimer</button>
              </div>
            )}

          </div>
        )}

        {/* Couleurs */}
        <div className="space-y-3 pt-2 border-t border-[#e8e7dd]">
          <label className="block text-xs text-[#6b6860] font-medium">🎨 Couleurs</label>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Fond</label>
              <input
                type="color"
                value={editingSection.background_color || '#f7f6ec'}
                onChange={(e) => setEditingSection({ ...editingSection, background_color: e.target.value })}
                className="w-full h-8 cursor-pointer border border-[#e8e7dd]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Texte</label>
              <input
                type="color"
                value={editingSection.text_color || '#13130d'}
                onChange={(e) => setEditingSection({ ...editingSection, text_color: e.target.value })}
                className="w-full h-8 cursor-pointer border border-[#e8e7dd]"
              />
            </div>
            <div>
              <label className="block text-xs text-[#6b6860] mb-1">Accent</label>
              <input
                type="color"
                value={editingSection.accent_color || '#c9a050'}
                onChange={(e) => setEditingSection({ ...editingSection, accent_color: e.target.value })}
                className="w-full h-8 cursor-pointer border border-[#e8e7dd]"
              />
            </div>
          </div>
        </div>

        <button
          onClick={saveSection}
          disabled={saving}
          className="w-full py-2 bg-[#c9a050] text-black text-sm font-medium hover:bg-[#b8923f] disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h1 className="text-xl md:text-2xl font-light">✨ Éditeur visuel</h1>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs sm:text-sm text-green-500">
              ✓ Sauvegardé à {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {saving && (
            <span className="text-xs sm:text-sm text-[#c9a050]">Sauvegarde...</span>
          )}
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {/* Pages principales */}
        {MAIN_PAGES.map(page => (
          <button
            key={page.name}
            onClick={() => {
              setActivePage(page.name)
              setEditingSection(null)
              setShowAccountMenu(false)
            }}
            className={`px-3 py-2 text-xs md:text-sm whitespace-nowrap transition-colors ${
              activePage === page.name
                ? 'bg-[#c9a050] text-black'
                : 'bg-white border border-[#c9a050]/30 text-[#13130d] hover:border-[#c9a050]'
            }`}
          >
            {page.label}
          </button>
        ))}
        
        {/* Menu déroulant Compte/Commandes */}
        <div className="relative">
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className={`px-3 py-2 text-xs md:text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
              ACCOUNT_PAGES.some(p => p.name === activePage)
                ? 'bg-[#c9a050] text-black'
                : 'bg-white border border-[#c9a050]/30 text-[#13130d] hover:border-[#c9a050]'
            }`}
          >
            🛍️ Compte
            <span className={`transition-transform ${showAccountMenu ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {showAccountMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#c9a050]/30 shadow-lg z-20 min-w-[180px]">
              {ACCOUNT_PAGES.map(page => (
                <button
                  key={page.name}
                  onClick={() => {
                    setActivePage(page.name)
                    setEditingSection(null)
                    setShowAccountMenu(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f7f6ec] transition-colors ${
                    activePage === page.name ? 'bg-[#c9a050]/20 font-medium' : ''
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Editor panel */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-white border border-[#c9a050]/30 overflow-y-auto max-h-[60vh] lg:max-h-none">
          
          {/* Mobile: Show only editor when section selected */}
          {editingSection ? (
            <div className="lg:hidden">
              <div className="p-4 border-b border-[#c9a050]/30 bg-[#f7f6ec] flex items-center gap-3">
                <button 
                  onClick={() => setEditingSection(null)}
                  className="text-[#c9a050] font-medium"
                >
                  ← Retour
                </button>
                <span className="text-[#13130d] font-medium">
                  {editingSection.section_key.charAt(0).toUpperCase() + editingSection.section_key.slice(1)}
                </span>
              </div>
              {renderSectionEditor()}
            </div>
          ) : (
            <div className="lg:hidden">
              <div className="p-4 border-b border-[#c9a050]/30 bg-[#f7f6ec]">
                <h2 className="font-medium text-[#13130d]">Sections de la page</h2>
                <p className="text-xs text-[#6b6860] mt-1">Cliquez pour modifier</p>
              </div>
              <div className="p-2">
                {sections.length === 0 ? (
                  <p className="text-sm text-[#6b6860] p-3">Aucune section</p>
                ) : (
                  sections.map(section => (
                    <div
                      key={section.id}
                      className={`relative mb-2 border border-[#e8e7dd] hover:border-[#c9a050]/50 transition-colors ${!section.is_visible ? 'opacity-50' : ''}`}
                    >
                      <button
                        onClick={() => {
                          setEditingSection(section)
                          setMenuOpenId(null)
                          // Scroll iframe to section
                          if (iframeRef.current) {
                            const baseUrl = `https://artiste-site-seven.vercel.app${currentPath}`
                            iframeRef.current.src = `${baseUrl}#section-${section.section_key}`
                          }
                        }}
                        className="w-full text-left p-3 pr-16"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {section.section_key === 'hero' && '🖼️'}
                            {section.section_key === 'about' && '👤'}
                            {section.section_key === 'bio' && '📖'}
                            {section.section_key === 'gallery' && '🖼️'}
                            {section.section_key === 'faq' && '❓'}
                            {section.section_key === 'info' && 'ℹ️'}
                            {section.section_key === 'form' && '📋'}
                            {section.section_key === 'featured' && '🎨'}
                            {section.section_key === 'newsletter' && '📧'}
                            {section.section_key === 'awards' && '🏆'}
                            {section.section_key === 'shop' && '🛒'}
                            {!['hero', 'about', 'bio', 'gallery', 'faq', 'info', 'form', 'featured', 'newsletter', 'awards', 'shop'].includes(section.section_key) && '📝'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-[#13130d]">
                              {section.section_key.charAt(0).toUpperCase() + section.section_key.slice(1)}
                            </div>
                            <div className="text-xs text-[#6b6860] truncate">
                              {section.title || '(sans titre)'}
                            </div>
                          </div>
                          <span className="text-[#c9a050]">→</span>
                        </div>
                      </button>
                      
                      {/* Menu 3 points mobile */}
                      <div className="absolute top-2 right-8">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpenId(menuOpenId === section.id ? null : section.id)
                          }}
                          className="p-1 hover:bg-[#e8e7dd] rounded"
                        >
                          <span className="text-[#6b6860]">⋮</span>
                        </button>
                        
                        {menuOpenId === section.id && (
                          <div className="absolute right-0 top-8 bg-white border border-[#e8e7dd] shadow-lg z-10 min-w-[140px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleVisibility(section)
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f6ec] flex items-center gap-2"
                            >
                              {section.is_visible ? '👁️ Masquer' : '👁️ Afficher'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteSection(section.id)
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {/* Bouton ajouter section mobile */}
                <button
                  onClick={() => setShowAddSection(true)}
                  className="w-full p-3 mt-2 border-2 border-dashed border-[#c9a050]/50 text-[#c9a050] hover:border-[#c9a050] hover:bg-[#c9a050]/10 transition-colors text-sm"
                >
                  + Ajouter une section
                </button>
              </div>
            </div>
          )}

          {/* Desktop: Show both list and editor */}
          <div className="hidden lg:block">
            <div className="p-4 border-b border-[#c9a050]/30 bg-[#f7f6ec]">
              <h2 className="font-medium text-[#13130d]">Sections de la page</h2>
              <p className="text-xs text-[#6b6860] mt-1">Cliquez pour modifier tous les contenus</p>
            </div>
            
            <div className="p-2">
              {sections.length === 0 ? (
                <p className="text-sm text-[#6b6860] p-3">Aucune section</p>
              ) : (
                sections.map(section => (
                  <div
                    key={section.id}
                    className={`relative mb-2 border transition-colors ${
                      editingSection?.id === section.id
                        ? 'border-[#c9a050] bg-[#c9a050]/10'
                        : 'border-[#e8e7dd] hover:border-[#c9a050]/50'
                    } ${!section.is_visible ? 'opacity-50' : ''}`}
                  >
                    <button
                      onClick={() => {
                        setEditingSection(section)
                        setMenuOpenId(null)
                        // Scroll iframe to section
                        if (iframeRef.current) {
                          const baseUrl = `https://artiste-site-seven.vercel.app${currentPath}`
                          iframeRef.current.src = `${baseUrl}#section-${section.section_key}`
                        }
                      }}
                      className="w-full text-left p-3 pr-10"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {section.section_key === 'hero' && '🖼️'}
                          {section.section_key === 'about' && '👤'}
                          {section.section_key === 'bio' && '📖'}
                          {section.section_key === 'gallery' && '🖼️'}
                          {section.section_key === 'faq' && '❓'}
                          {section.section_key === 'info' && 'ℹ️'}
                          {section.section_key === 'form' && '📋'}
                          {section.section_key === 'featured' && '🎨'}
                          {section.section_key === 'newsletter' && '📧'}
                          {section.section_key === 'awards' && '🏆'}
                          {section.section_key === 'shop' && '🛒'}
                          {!['hero', 'about', 'bio', 'gallery', 'faq', 'info', 'form', 'featured', 'newsletter', 'awards', 'shop'].includes(section.section_key) && '📝'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[#13130d]">
                            {section.section_key.charAt(0).toUpperCase() + section.section_key.slice(1)}
                          </div>
                          <div className="text-xs text-[#6b6860] truncate">
                            {section.title || '(sans titre)'}
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {/* Menu 3 points */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpenId(menuOpenId === section.id ? null : section.id)
                        }}
                        className="p-1 hover:bg-[#e8e7dd] rounded"
                      >
                        <span className="text-[#6b6860]">⋮</span>
                      </button>
                      
                      {menuOpenId === section.id && (
                        <div className="absolute right-0 top-8 bg-white border border-[#e8e7dd] shadow-lg z-10 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleVisibility(section)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#f7f6ec] flex items-center gap-2"
                          >
                            {section.is_visible ? '👁️ Masquer' : '👁️ Afficher'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSection(section.id)
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Bouton ajouter section */}
              <button
                onClick={() => setShowAddSection(true)}
                className="w-full p-3 mt-2 border-2 border-dashed border-[#c9a050]/50 text-[#c9a050] hover:border-[#c9a050] hover:bg-[#c9a050]/10 transition-colors text-sm"
              >
                + Ajouter une section
              </button>
            </div>

            {renderSectionEditor()}
          </div>
        </div>

        {/* Modal ajouter section */}
        {showAddSection && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-[#c9a050]/30 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b border-[#c9a050]/30 bg-[#f7f6ec] flex justify-between items-center sticky top-0">
                <h3 className="font-medium text-[#13130d]">Ajouter une section</h3>
                <button onClick={() => setShowAddSection(false)} className="text-xl text-[#6b6860] hover:text-[#13130d]">×</button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {SECTION_KEYS.map(section => (
                  <button
                    key={section.value}
                    onClick={() => createSection(section.value)}
                    className="p-4 border border-[#e8e7dd] hover:border-[#c9a050] hover:bg-[#c9a050]/10 transition-colors text-left"
                  >
                    <span className="text-2xl block mb-2">{section.icon}</span>
                    <span className="text-sm text-[#13130d]">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview iframe */}
        <div className="flex-1 border border-[#c9a050]/30 bg-white overflow-hidden min-h-[400px] lg:min-h-0">
          <div className="h-10 bg-[#f7f6ec] border-b border-[#c9a050]/30 flex items-center px-3 md:px-4 gap-2">
            <div className="hidden sm:flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 text-center text-xs text-[#6b6860] truncate">
              {currentPath}
            </div>
            <button
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = iframeRef.current.src
                }
              }}
              className="text-xs text-[#c9a050] hover:underline whitespace-nowrap"
            >
              🔄 Rafraîchir
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={`https://artiste-site-seven.vercel.app${currentPath}`}
            className="w-full h-[calc(100%-40px)] min-h-[360px]"
            title="Aperçu"
          />
        </div>
      </div>
    </div>
  )
}
