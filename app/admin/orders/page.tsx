'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface CartItem {
  id: string
  title: string
  image_url: string
  price: number
  quantity: number
}

interface Order {
  id: string
  user_id: string | null
  customer_email: string
  customer_name: string | null
  customer_phone: string | null
  customer_address: string | null
  items: CartItem[]
  total_amount: number
  status: string
  payment_method: string | null
  payment_id: string | null
  tracking_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

const STATUS_OPTIONS = [
  { value: 'pending', label: '⏳ En attente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'paid', label: '💳 Payée', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'processing', label: '📦 En préparation', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'shipped', label: '🚚 Expédiée', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { value: 'delivered', label: '✅ Livrée', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'cancelled', label: '❌ Annulée', color: 'bg-red-100 text-red-800 border-red-300' },
]

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [saving, setSaving] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setOrders(data)
    if (error) console.error('Error fetching orders:', error)
    setLoading(false)
  }

  async function updateOrder(id: string, updates: Partial<Order>) {
    setSaving(true)
    const { error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, ...updates } : o))
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, ...updates })
      }
    }
    setSaving(false)
  }

  async function deleteOrder(id: string) {
    if (!confirm('Supprimer cette commande définitivement ?')) return
    
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (!error) {
      setOrders(orders.filter(o => o.id !== id))
      setSelectedOrder(null)
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus)

  const getStatusInfo = (status: string) => 
    STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    revenue: orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.total_amount), 0),
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--accent)]">Chargement...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-light">📦 Commandes</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-4">
          <p className="text-xs text-[var(--text-muted)]">Total</p>
          <p className="text-2xl font-light">{stats.total}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4">
          <p className="text-xs text-yellow-400">En attente</p>
          <p className="text-2xl font-light text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 p-4">
          <p className="text-xs text-blue-400">Payées</p>
          <p className="text-2xl font-light text-blue-400">{stats.paid}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 p-4">
          <p className="text-xs text-purple-400">Expédiées</p>
          <p className="text-2xl font-light text-purple-400">{stats.shipped}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 p-4">
          <p className="text-xs text-green-400">Chiffre d'affaires</p>
          <p className="text-2xl font-light text-green-400">{stats.revenue.toFixed(2)} €</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 text-sm whitespace-nowrap ${
            filterStatus === 'all'
              ? 'bg-[var(--accent)] text-black'
              : 'bg-[var(--surface)] border border-[var(--border)]'
          }`}
        >
          Toutes ({orders.length})
        </button>
        {STATUS_OPTIONS.map(status => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className={`px-4 py-2 text-sm whitespace-nowrap ${
              filterStatus === status.value
                ? 'bg-[var(--accent)] text-black'
                : 'bg-[var(--surface)] border border-[var(--border)]'
            }`}
          >
            {status.label.split(' ')[0]} {orders.filter(o => o.status === status.value).length}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">📦</p>
          <p>Aucune commande</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-[var(--surface)] border border-[var(--border)] p-4 md:p-6 cursor-pointer hover:border-[var(--accent)]/50 transition-colors ${
                selectedOrder?.id === order.id ? 'border-[var(--accent)]' : ''
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs border ${getStatusInfo(order.status).color}`}>
                      {getStatusInfo(order.status).label}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      #{order.id.slice(0, 8)}
                    </span>
                  </div>
                  <p className="font-medium">{order.customer_name || order.customer_email}</p>
                  <p className="text-sm text-[var(--text-muted)]">{order.customer_email}</p>
                  {order.customer_phone && (
                    <p className="text-sm text-[var(--text-muted)]">📞 {order.customer_phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light text-[var(--accent)]">
                    {Number(order.total_amount).toFixed(2)} €
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[var(--background)] px-3 py-2 text-sm whitespace-nowrap">
                    {item.image_url && (
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                      </div>
                    )}
                    <span>{item.title}</span>
                    <span className="text-[var(--text-muted)]">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              {order.tracking_number && (
                <p className="text-sm text-[var(--text-muted)] mt-2">
                  🚚 Suivi: {order.tracking_number}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-4 md:p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-medium">Commande #{selectedOrder.id.slice(0, 8)}</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-2xl text-[var(--text-muted)] hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Statut</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status.value}
                      onClick={() => updateOrder(selectedOrder.id, { status: status.value })}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedOrder.status === status.value
                          ? status.color
                          : 'border-[var(--border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Client</label>
                  <p className="font-medium">{selectedOrder.customer_name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Email</label>
                  <p>{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Téléphone</label>
                  <p>{selectedOrder.customer_phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Adresse</label>
                  <p className="whitespace-pre-line">{selectedOrder.customer_address || '-'}</p>
                </div>
              </div>

              {/* Tracking */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Numéro de suivi</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedOrder.tracking_number || ''}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, tracking_number: e.target.value })}
                    placeholder="Ex: 1Z999AA10123456784"
                    className="flex-1 px-4 py-2 bg-[var(--background)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    onClick={() => updateOrder(selectedOrder.id, { tracking_number: selectedOrder.tracking_number })}
                    disabled={saving}
                    className="px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] disabled:opacity-50"
                  >
                    💾
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Notes internes</label>
                <textarea
                  value={selectedOrder.notes || ''}
                  onChange={(e) => setSelectedOrder({ ...selectedOrder, notes: e.target.value })}
                  placeholder="Notes pour cette commande..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none resize-none"
                />
                <button
                  onClick={() => updateOrder(selectedOrder.id, { notes: selectedOrder.notes })}
                  disabled={saving}
                  className="mt-2 px-4 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)] disabled:opacity-50"
                >
                  Sauvegarder les notes
                </button>
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Articles</label>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[var(--background)] p-3">
                      {item.image_url && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-[var(--text-muted)]">
                          {item.quantity} × {item.price.toFixed(2)} €
                        </p>
                      </div>
                      <p className="font-medium text-[var(--accent)]">
                        {(item.quantity * item.price).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border)]">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl font-medium text-[var(--accent)]">
                    {Number(selectedOrder.total_amount).toFixed(2)} €
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
                >
                  🗑️ Supprimer
                </button>
                <button
                  onClick={() => {
                    const subject = `Commande #${selectedOrder.id.slice(0, 8)}`
                    window.open(`mailto:${selectedOrder.customer_email}?subject=${encodeURIComponent(subject)}`)
                  }}
                  className="px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-sm hover:border-[var(--accent)]"
                >
                  ✉️ Envoyer un email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
