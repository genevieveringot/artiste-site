'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import { supabase, uploadImage, deleteImage } from '@/lib/supabase'
import { Painting, CATEGORIES } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { formatPrice, formatDimensions, getCategoryLabel } from '@/lib/utils'

export default function AdminPaintingsPage() {
  const searchParams = useSearchParams()
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(searchParams.get('action') === 'new')
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    fetchPaintings()
  }, [])

  async function fetchPaintings() {
    const { data, error } = await supabase
      .from('paintings')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPaintings(data)
    }
    setIsLoading(false)
  }

  function openModal(painting?: Painting) {
    if (painting) {
      setEditingPainting(painting)
      setImagePreview(painting.image_url)
    } else {
      setEditingPainting(null)
      setImagePreview('')
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingPainting(null)
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
    
    let imageUrl = editingPainting?.image_url || ''
    
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile, 'paintings')
      if (uploadedUrl) {
        if (editingPainting?.image_url) {
          await deleteImage(editingPainting.image_url)
        }
        imageUrl = uploadedUrl
      }
    }

    const paintingData = {
      title: formData.get('title') as string,
      image_url: imageUrl,
      price: formData.get('price') ? Number(formData.get('price')) : null,
      width: Number(formData.get('width')),
      height: Number(formData.get('height')),
      category: formData.get('category') as string,
      available: formData.get('available') === 'true',
      description: formData.get('description') as string || null,
      updated_at: new Date().toISOString(),
    }

    if (editingPainting) {
      await supabase
        .from('paintings')
        .update(paintingData)
        .eq('id', editingPainting.id)
    } else {
      await supabase
        .from('paintings')
        .insert([{ ...paintingData, created_at: new Date().toISOString() }])
    }

    await fetchPaintings()
    closeModal()
    setIsSubmitting(false)
  }

  async function handleDelete(painting: Painting) {
    if (!confirm(`Supprimer "${painting.title}" ?`)) return

    if (painting.image_url) {
      await deleteImage(painting.image_url)
    }

    await supabase.from('paintings').delete().eq('id', painting.id)
    await fetchPaintings()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-3xl mb-2">Tableaux</h1>
          <p className="text-[#888] font-light">Gérez votre collection d'œuvres</p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus size={18} className="mr-2" />
          Ajouter
        </Button>
      </div>

      {/* Paintings Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-[#c9a86c] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : paintings.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#2a2a2a]">
          <p className="text-[#888] mb-6">Aucun tableau pour le moment.</p>
          <Button onClick={() => openModal()}>Ajouter votre premier tableau</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paintings.map((painting) => (
            <div key={painting.id} className="group bg-[#111] border border-[#1a1a1a] overflow-hidden">
              <div className="relative aspect-[3/4]">
                <Image
                  src={painting.image_url}
                  alt={painting.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {!painting.available && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-500/90 text-xs uppercase tracking-wider">
                    Vendu
                  </div>
                )}
                <div className="absolute inset-0 bg-[#0a0a0a]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => openModal(painting)}
                    className="w-10 h-10 bg-[#c9a86c] flex items-center justify-center hover:bg-[#d4b87d] transition-colors"
                  >
                    <Edit2 size={16} className="text-[#0a0a0a]" />
                  </button>
                  <button
                    onClick={() => handleDelete(painting)}
                    className="w-10 h-10 bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-[#888] text-xs uppercase tracking-wider mb-1">
                  {getCategoryLabel(painting.category)}
                </p>
                <h3 className="font-serif text-lg truncate">{painting.title}</h3>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-[#555]">{formatDimensions(painting.width, painting.height)}</span>
                  <span className="text-[#c9a86c]">{formatPrice(painting.price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/90">
          <div className="bg-[#111] border border-[#1a1a1a] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#1a1a1a] sticky top-0 bg-[#111]">
              <h2 className="font-serif text-2xl">
                {editingPainting ? 'Modifier' : 'Nouveau tableau'}
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
                defaultValue={editingPainting?.title}
                required
              />

              <div>
                <label className="block text-sm uppercase tracking-wider text-[#888] mb-3">
                  Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative w-24 h-32 overflow-hidden border border-[#2a2a2a]">
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
                    required={!editingPainting}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="width"
                  name="width"
                  type="number"
                  label="Largeur (cm)"
                  defaultValue={editingPainting?.width}
                  required
                />
                <Input
                  id="height"
                  name="height"
                  type="number"
                  label="Hauteur (cm)"
                  defaultValue={editingPainting?.height}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  label="Prix (€)"
                  placeholder="Laisser vide = Sur demande"
                  defaultValue={editingPainting?.price || ''}
                />
                <Select
                  id="category"
                  name="category"
                  label="Catégorie"
                  options={CATEGORIES}
                  defaultValue={editingPainting?.category || 'abstract'}
                />
              </div>

              <Select
                id="available"
                name="available"
                label="Disponibilité"
                options={[
                  { value: 'true', label: 'Disponible' },
                  { value: 'false', label: 'Vendu' },
                ]}
                defaultValue={editingPainting?.available?.toString() || 'true'}
              />

              <Textarea
                id="description"
                name="description"
                label="Description"
                defaultValue={editingPainting?.description || ''}
              />

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Annuler
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  {editingPainting ? 'Enregistrer' : 'Créer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
