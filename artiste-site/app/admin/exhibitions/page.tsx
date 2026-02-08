'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Plus, Edit2, Trash2, X, MapPin, Calendar } from 'lucide-react'
import { supabase, uploadImage, deleteImage } from '@/lib/supabase'
import { Exhibition } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { formatDateRange, isUpcoming } from '@/lib/utils'

export default function AdminExhibitionsPage() {
  const searchParams = useSearchParams()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('action') === 'new')
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchExhibitions()
  }, [])

  async function fetchExhibitions() {
    const { data, error } = await supabase
      .from('exhibitions')
      .select('*')
      .order('start_date', { ascending: false })

    if (!error && data) {
      setExhibitions(data)
    }
    setIsLoading(false)
  }

  function openModal(exhibition?: Exhibition) {
    if (exhibition) {
      setEditingExhibition(exhibition)
      setImagePreview(exhibition.image_url || '')
    } else {
      setEditingExhibition(null)
      setImagePreview('')
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingExhibition(null)
    setImageFile(null)
    setImagePreview('')
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    let imageUrl = editingExhibition?.image_url || null
    
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile, 'exhibitions')
      if (uploadedUrl) {
        if (editingExhibition?.image_url) {
          await deleteImage(editingExhibition.image_url)
        }
        imageUrl = uploadedUrl
      }
    }

    const startDate = formData.get('start_date') as string
    const exhibitionData = {
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      start_date: startDate,
      end_date: formData.get('end_date') as string || null,
      description: formData.get('description') as string || null,
      image_url: imageUrl,
      is_upcoming: isUpcoming(startDate),
      updated_at: new Date().toISOString(),
    }

    if (editingExhibition) {
      await supabase
        .from('exhibitions')
        .update(exhibitionData)
        .eq('id', editingExhibition.id)
    } else {
      await supabase
        .from('exhibitions')
        .insert([{ ...exhibitionData, created_at: new Date().toISOString() }])
    }

    await fetchExhibitions()
    closeModal()
    setIsSubmitting(false)
  }

  async function handleDelete(exhibition: Exhibition) {
    if (!confirm(`Supprimer "${exhibition.title}" ?`)) return

    if (exhibition.image_url) {
      await deleteImage(exhibition.image_url)
    }

    await supabase.from('exhibitions').delete().eq('id', exhibition.id)
    await fetchExhibitions()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-3xl mb-2">Expositions</h1>
          <p className="text-[#888] font-light">Gérez vos événements et expositions</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus size={18} className="mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Exhibitions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : exhibitions.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#2a2a2a]">
          <p className="text-[#888] mb-6">Aucune exposition pour le moment.</p>
          <Button onClick={() => openModal()}>Ajouter votre première exposition</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {exhibitions.map((exhibition) => {
            const upcoming = isUpcoming(exhibition.start_date)
            return (
              <div 
                key={exhibition.id} 
                className={`group bg-[#111] border p-6 flex flex-col md:flex-row gap-6 transition-colors duration-300 ${
                  upcoming ? 'border-[#c9a86c]/30' : 'border-[#1a1a1a]'
                }`}
              >
                {exhibition.image_url && (
                  <div className="relative w-full md:w-32 h-32 overflow-hidden flex-shrink-0">
                    <Image
                      src={exhibition.image_url}
                      alt={exhibition.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-serif text-xl truncate">{exhibition.title}</h3>
                    {upcoming && (
                      <span className="shrink-0 px-2 py-1 bg-[#c9a86c]/20 text-[#c9a86c] text-xs uppercase tracking-wider">
                        À venir
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-[#888] mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#c9a86c]" />
                      {exhibition.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-[#c9a86c]" />
                      {formatDateRange(exhibition.start_date, exhibition.end_date)}
                    </span>
                  </div>

                  {exhibition.description && (
                    <p className="text-[#555] text-sm line-clamp-2">
                      {exhibition.description}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col gap-2 justify-end shrink-0">
                  <button
                    onClick={() => openModal(exhibition)}
                    className="p-2 text-[#888] hover:text-[#c9a86c] transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(exhibition)}
                    className="p-2 text-[#888] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/90">
          <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#1a1a1a] sticky top-0 bg-[#111]">
              <h2 className="font-serif text-2xl">
                {editingExhibition ? 'Modifier' : 'Nouvelle exposition'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:text-[#c9a86c] transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <Input
                id="title"
                name="title"
                label="Titre"
                defaultValue={editingExhibition?.title}
                required
              />

              <Input
                id="location"
                name="location"
                label="Lieu"
                placeholder="Galerie XYZ, Paris"
                defaultValue={editingExhibition?.location}
                required
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  label="Date de début"
                  defaultValue={editingExhibition?.start_date?.split('T')[0]}
                  required
                />
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  label="Date de fin (optionnel)"
                  defaultValue={editingExhibition?.end_date?.split('T')[0] || ''}
                />
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-[#888] mb-3">
                  Image (optionnel)
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-24 h-24 overflow-hidden border border-[#2a2a2a]">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 text-sm text-[#888]"
                  />
                </div>
              </div>

              <Textarea
                id="description"
                name="description"
                label="Description"
                defaultValue={editingExhibition?.description || ''}
              />

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  {editingExhibition ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
