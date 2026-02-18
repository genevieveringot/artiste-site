'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
]

interface Exhibition {
  id: string
  title: string
  location: string
  start_date: string
  end_date: string | null
  description: string | null
  image_url: string | null
  is_upcoming: boolean
  year: number | null
  month: string | null
  day: number | null
}

export default function ExhibitionsAdmin() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    image_url: '',
    is_upcoming: false,
    year: new Date().getFullYear(),
    month: MONTHS[new Date().getMonth()],
    day: new Date().getDate()
  })
  
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    fetchExhibitions()
    if (searchParams.get('new') === 'true') {
      openNewModal()
    }
  }, [searchParams])

  async function fetchExhibitions() {
    const { data } = await supabase
      .from('exhibitions')
      .select('*')
      .order('start_date', { ascending: false })
    if (data) setExhibitions(data)
  }

  function openNewModal() {
    setEditingExhibition(null)
    const now = new Date()
    setFormData({
      title: '',
      location: '',
      start_date: now.toISOString().split('T')[0],
      end_date: '',
      description: '',
      image_url: '',
      is_upcoming: true,
      year: now.getFullYear(),
      month: MONTHS[now.getMonth()],
      day: now.getDate()
    })
    setIsModalOpen(true)
  }

  function openEditModal(exhibition: Exhibition) {
    setEditingExhibition(exhibition)
    const startDate = new Date(exhibition.start_date)
    setFormData({
      title: exhibition.title,
      location: exhibition.location,
      start_date: exhibition.start_date,
      end_date: exhibition.end_date || '',
      description: exhibition.description || '',
      image_url: exhibition.image_url || '',
      is_upcoming: exhibition.is_upcoming,
      year: exhibition.year || startDate.getFullYear(),
      month: exhibition.month || MONTHS[startDate.getMonth()],
      day: exhibition.day || startDate.getDate()
    })
    setIsModalOpen(true)
  }

  // Auto-fill year/month/day from start_date
  function handleStartDateChange(dateStr: string) {
    const date = new Date(dateStr)
    setFormData({
      ...formData,
      start_date: dateStr,
      year: date.getFullYear(),
      month: MONTHS[date.getMonth()],
      day: date.getDate()
    })
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `exhibitions/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('artiste-images')
      .upload(fileName, file)

    if (uploadError) {
      alert('Erreur upload: ' + uploadError.message)
      setIsUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('artiste-images')
      .getPublicUrl(fileName)

    setFormData({ ...formData, image_url: publicUrl })
    setIsUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const data = {
      title: formData.title,
      location: formData.location,
      start_date: formData.start_date,
      end_date: formData.end_date || null,
      description: formData.description || null,
      image_url: formData.image_url || null,
      is_upcoming: formData.is_upcoming,
      year: formData.year,
      month: formData.month,
      day: formData.day
    }

    if (editingExhibition) {
      await supabase.from('exhibitions').update(data).eq('id', editingExhibition.id)
    } else {
      await supabase.from('exhibitions').insert(data)
    }

    setIsModalOpen(false)
    fetchExhibitions()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette exposition ?')) return
    await supabase.from('exhibitions').delete().eq('id', id)
    fetchExhibitions()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Expositions & Événements</h1>
        <button
          onClick={openNewModal}
          className="px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] transition-colors"
        >
          + Nouvel événement
        </button>
      </div>

      <p className="text-[var(--text-muted)] mb-6">
        Les événements ajoutés ici apparaissent dans le calendrier et la page expositions.
      </p>

      {exhibitions.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <p className="mb-4">Aucun événement pour le moment</p>
          <button onClick={openNewModal} className="text-[var(--accent)] hover:underline">
            Ajouter votre premier événement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {exhibitions.map((exhibition) => (
            <div key={exhibition.id} className="bg-[var(--surface)] border border-[var(--border)] p-6 flex gap-6">
              {exhibition.image_url && (
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image src={exhibition.image_url} alt={exhibition.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-medium mb-1">{exhibition.title}</h3>
                    <p className="text-[var(--accent)] text-sm mb-2">
                      {exhibition.day} {exhibition.month} {exhibition.year}
                      {exhibition.end_date && ` - ${new Date(exhibition.end_date).toLocaleDateString('fr-FR')}`}
                    </p>
                    <p className="text-[var(--text-muted)]">{exhibition.location}</p>
                    {exhibition.description && (
                      <p className="text-[var(--text-muted)] text-sm mt-2 line-clamp-2">{exhibition.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {exhibition.is_upcoming && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs">À venir</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => openEditModal(exhibition)}
                  className="px-4 py-2 border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(exhibition.id)}
                  className="px-4 py-2 border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-[var(--surface)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
              <h2 className="text-xl font-medium">
                {editingExhibition ? 'Modifier l\'événement' : 'Nouvel événement'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-[var(--text-muted)] hover:text-white">
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                  required
                  placeholder="Ex: Exposition Impressionnisme"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Lieu *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                  required
                  placeholder="Ex: Galerie Moderne, Paris"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Date début *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Date fin (optionnel)</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>

              {/* Calendar display info */}
              <div className="bg-[var(--background)] p-4 border border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)] mb-2">📅 Affichage dans le calendrier :</p>
                <p className="text-sm text-[var(--accent)]">
                  {formData.day} {formData.month} {formData.year}
                </p>
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-[var(--text-muted)]"
                  disabled={isUploading}
                />
                {isUploading && <p className="text-sm text-[var(--accent)] mt-1">Upload en cours...</p>}
                {formData.image_url && (
                  <div className="mt-2">
                    <div className="relative w-32 h-32 group">
                      <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '' })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        title="Supprimer l'image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none resize-none"
                  placeholder="Décrivez l'événement..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_upcoming"
                  checked={formData.is_upcoming}
                  onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_upcoming" className="text-sm">Événement à venir</label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] transition-colors"
                >
                  {editingExhibition ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
