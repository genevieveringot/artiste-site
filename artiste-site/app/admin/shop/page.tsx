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
  { value: 'processing', label: '📦 Préparation', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'shipped', label: '🚚 Expédiée', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { value: 'delivered', label: '✅ Livrée', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'cancelled', label: '❌ Annulée', color: 'bg-red-100 text-red-800 border-red-300' },
]

const TABS = [
  { id: 'orders', label: '📦 Commandes' },
  { id: 'stats', label: '📊 Statistiques' },
  { id: 'settings', label: '⚙️ Paramètres' },
]

export default function ShopAdmin() {
  const [activeTab, setActiveTab] = useState('orders')
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
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.total_amount), 0),
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-light">🛒 Boutique</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[var(--border)] pb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--accent)] text-black'
                : 'bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] p-4">
              <p className="text-xs text-[var(--text-muted)]">Total commandes</p>
              <p className="text-3xl font-light">{stats.total}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4">
              <p className="text-xs text-yellow-400">En attente</p>
              <p className="text-3xl font-light text-yellow-400">{stats.pending}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 p-4">
              <p className="text-xs text-blue-400">Payées</p>
              <p className="text-3xl font-light text-blue-400">{stats.paid}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 p-4">
              <p className="text-xs text-purple-400">Expédiées</p>
              <p className="text-3xl font-light text-purple-400">{stats.shipped}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 p-4">
              <p className="text-xs text-green-400">Livrées</p>
              <p className="text-3xl font-light text-green-400">{stats.delivered}</p>
            </div>
            <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-4">
              <p className="text-xs text-[var(--accent)]">Chiffre d'affaires</p>
              <p className="text-3xl font-light text-[var(--accent)]">{stats.revenue.toFixed(0)} €</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6">
          <h2 className="text-xl font-light mb-6">Paramètres de la boutique</h2>
          <div className="space-y-4 text-[var(--text-muted)]">
            <p>🚧 Paramètres à venir :</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Frais de livraison</li>
              <li>Modes de paiement</li>
              <li>Emails automatiques</li>
              <li>Politique de retour</li>
            </ul>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-[var(--surface)] border border-[var(--border)]'
              }`}
            >
              Toutes ({orders.length})
            </button>
            {STATUS_OPTIONS.map(status => {
              const count = orders.filter(o => o.status === status.value).length
              if (count === 0) return null
              return (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                  className={`px-3 py-1.5 text-xs whitespace-nowrap ${
                    filterStatus === status.value
                      ? 'bg-[var(--accent)] text-black'
                      : 'bg-[var(--surface)] border border-[var(--border)]'
                  }`}
                >
                  {status.label.split(' ')[0]} {count}
                </button>
              )
            })}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-16 text-[var(--text-muted)]">Chargement...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-muted)]">
              <p className="text-4xl mb-4">📦</p>
              <p>Aucune commande</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className={`bg-[var(--surface)] border border-[var(--border)] p-4 cursor-pointer hover:border-[var(--accent)]/50 transition-colors ${
                    selectedOrder?.id === order.id ? 'border-[var(--accent)]' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs border ${getStatusInfo(order.status).color}`}>
                          {getStatusInfo(order.status).label}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">#{order.id.slice(0, 8)}</span>
                      </div>
                      <p className="font-medium truncate">{order.customer_name || order.customer_email}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')} • {order.items.length} article(s)
                      </p>
                    </div>
                    <p className="text-xl font-light text-[var(--accent)]">
                      {Number(order.total_amount).toFixed(0)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--surface)] border border-[var(--border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto my-auto">
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-4 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Commande #{selectedOrder.id.slice(0, 8)}</h2>
                <p className="text-xs text-[var(--text-muted)]">
                  {new Date(selectedOrder.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl text-[var(--text-muted)] hover:text-white">×</button>
            </div>

            <div className="p-4 space-y-4">
              {/* Status */}
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-2">Statut</label>
                <div className="flex flex-wrap gap-1">
                  {STATUS_OPTIONS.map(status => (
                    <button
                      key={status.value}
                      onClick={() => updateOrder(selectedOrder.id, { status: status.value })}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        selectedOrder.status === status.value ? status.color : 'border-[var(--border)] hover:border-[var(--accent)]'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-xs text-[var(--text-muted)]">Client</label>
                  <p>{selectedOrder.customer_name || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)]">Email</label>
                  <p className="truncate">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)]">Téléphone</label>
                  <p>{selectedOrder.customer_phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)]">Adresse</label>
                  <p className="whitespace-pre-line text-xs">{selectedOrder.customer_address || '-'}</p>
                </div>
              </div>

              {/* Tracking */}
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Numéro de suivi</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedOrder.tracking_number || ''}
                    onChange={(e) => setSelectedOrder({ ...selectedOrder, tracking_number: e.target.value })}
                    placeholder="Ex: 1Z999AA10123456784"
                    className="flex-1 px-3 py-2 text-sm bg-[var(--background)] border border-[var(--border)] focus:border-[var(--accent)] focus:outline-none"
                  />
                  <button
                    onClick={() => updateOrder(selectedOrder.id, { tracking_number: selectedOrder.tracking_number })}
                    disabled={saving}
                    className="px-3 py-2 bg-[var(--accent)] text-black text-sm hover:bg-[var(--accent-hover)]"
                  >
                    💾
                  </button>
                </div>
              </div>

              {/* Items */}
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-2">Articles</label>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[var(--background)] p-2">
                      {item.image_url && (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-[var(--text-muted)]">{item.quantity} × {item.price.toFixed(0)} €</p>
                      </div>
                      <p className="text-sm text-[var(--accent)]">{(item.quantity * item.price).toFixed(0)} €</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--border)]">
                  <span>Total</span>
                  <span className="text-xl font-medium text-[var(--accent)]">{Number(selectedOrder.total_amount).toFixed(0)} €</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="px-3 py-2 bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                >
                  🗑️ Supprimer
                </button>
                <button
                  onClick={() => window.open(`mailto:${selectedOrder.customer_email}?subject=Commande%20%23${selectedOrder.id.slice(0, 8)}`)}
                  className="px-3 py-2 bg-[var(--background)] border border-[var(--border)] text-xs hover:border-[var(--accent)]"
                >
                  ✉️ Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
