'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface Painting {
  id: string
  title: string
  image_url: string
  price: number | null
  width: number
  height: number
  category: string
  available: boolean
  description: string | null
}

const defaultCategories = ['PAYSAGES', 'MARINES', 'PORTRAITS', 'FLEURS', 'AUTRE']

export default function PaintingsAdmin() {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [categories, setCategories] = useState<string[]>(defaultCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPainting, setEditingPainting] = useState<Painting | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    price: '',
    width: '',
    height: '',
    category: 'paysage',
    available: true,
    description: ''
  })
  
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    fetchPaintings()
    if (searchParams.get('new') === 'true') {
      openNewModal()
    }
  }, [searchParams])

  async function fetchPaintings() {
    const [paintingsRes, categoriesRes] = await Promise.all([
      supabase.from('paintings').select('*').order('created_at', { ascending: false }),
      supabase.from('page_sections').select('custom_data').eq('page_name', 'galerie').eq('section_key', 'gallery').single()
    ])
    if (paintingsRes.data) setPaintings(paintingsRes.data)
    const customCats = categoriesRes.data?.custom_data?.categories
    if (customCats && Array.isArray(customCats) && customCats.length > 0) {
      setCategories(customCats)
    }
  }

  function openNewModal() {
    setEditingPainting(null)
    setFormData({
      title: '',
      image_url: '',
      price: '',
      width: '',
      height: '',
      category: categories[0] || 'PAYSAGES',
      available: true,
      description: ''
    })
    setIsModalOpen(true)
  }

  function openEditModal(painting: Painting) {
    setEditingPainting(painting)
    setFormData({
      title: painting.title,
      image_url: painting.image_url,
      price: painting.price?.toString() || '',
      width: painting.width.toString(),
      height: painting.height.toString(),
      category: painting.category,
      available: painting.available,
      description: painting.description || ''
    })
    setIsModalOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`

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
      image_url: formData.image_url,
      price: formData.price ? parseFloat(formData.price) : null,
      width: parseInt(formData.width),
      height: parseInt(formData.height),
      category: formData.category,
      available: formData.available,
      description: formData.description || null
    }

    if (editingPainting) {
      await supabase.from('paintings').update(data).eq('id', editingPainting.id)
    } else {
      await supabase.from('paintings').insert(data)
    }

    setIsModalOpen(false)
    fetchPaintings()
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce tableau ?')) return
    await supabase.from('paintings').delete().eq('id', id)
    fetchPaintings()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light">Tableaux</h1>
        <button
          onClick={openNewModal}
          className="px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] transition-colors"
        >
          + Nouveau tableau
        </button>
      </div>

      {paintings.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <p className="mb-4">Aucun tableau pour le moment</p>
          <button onClick={openNewModal} className="text-[var(--accent)] hover:underline">
            Ajouter votre premier tableau
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paintings.map((painting) => (
            <div key={painting.id} className="bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
              <div className="relative aspect-[4/3]">
                {painting.image_url ? (
                  <Image src={painting.image_url} alt={painting.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-[var(--surface-light)] flex items-center justify-center text-[var(--text-muted)]">
                    Pas d'image
                  </div>
                )}
                {!painting.available && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs">
                    Vendu
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">{painting.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mb-2">
                  {painting.width} × {painting.height} cm
                </p>
                {painting.price && (
                  <p className="text-[var(--accent)] mb-4">{painting.price} €</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(painting)}
                    className="flex-1 py-2 border border-[var(--border)] text-sm hover:border-[var(--accent)] transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(painting.id)}
                    className="px-4 py-2 border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
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
                {editingPainting ? 'Modifier le tableau' : 'Nouveau tableau'}
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
                />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Largeur (cm) *</label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-2">Hauteur (cm) *</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white border border-[var(--border)] text-[#13130d] focus:border-[var(--accent)] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="available" className="text-sm">Disponible à la vente</label>
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
                  {editingPainting ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
