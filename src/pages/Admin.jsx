import { useEffect, useRef, useState, useCallback } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils'

const ADMIN_TOKEN = 'senbitik-admin-2024'

function adminFetch(path, opts = {}) {
  return fetch(path, {
    ...opts,
    headers: { 'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json', ...opts.headers },
    body: opts.body != null ? JSON.stringify(opts.body) : undefined,
  })
}

const STATUS_CONFIG = {
  en_attente:   { label: 'En attente',   dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700 border border-amber-200' },
  confirmee:    { label: 'Confirmée',    dot: 'bg-blue-400',   badge: 'bg-blue-100 text-blue-700 border border-blue-200' },
  en_livraison: { label: 'En livraison', dot: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700 border border-orange-200' },
  livree:       { label: 'Livrée',       dot: 'bg-emerald-400',badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  annulee:      { label: 'Annulée',      dot: 'bg-red-400',    badge: 'bg-red-100 text-red-700 border border-red-200' },
}

// Priorité d'affichage : les commandes qui nécessitent une action en premier
const STATUS_PRIORITY = {
  en_attente:   1,
  confirmee:    2,
  en_livraison: 3,
  livree:       4,
  annulee:      5,
}

function sortByPriority(orders) {
  return [...orders].sort((a, b) => {
    const pa = STATUS_PRIORITY[a.status] ?? 9
    const pb = STATUS_PRIORITY[b.status] ?? 9
    if (pa !== pb) return pa - pb
    // À statut égal : plus récente d'abord
    return new Date(b.created_at) - new Date(a.created_at)
  })
}
const PAYMENT_LABELS = { wave:'Wave', cash:'Paiement à la livraison' }
const CATEGORIES = ['artisanat','alimentation','textile','cosmetiques','decoration','sante']
const CAT_LABELS  = { artisanat:'Artisanat', alimentation:'Alimentation', textile:'Textile', cosmetiques:'Cosmétiques', decoration:'Décoration', sante:'Santé' }
const PRODUCERS   = ['anonyme','atelier-toure','ferme-ndiaye','tissage-diop','naturelle-sow','maison-fall']
const PRODUCER_NAMES = { 'anonyme':'Anonyme', 'atelier-toure':'Atelier Touré','ferme-ndiaye':'Ferme Bio Ndiaye','tissage-diop':'Tissage Diop','naturelle-sow':'Naturelle by Sow','maison-fall':'Maison Fall' }

function slugify(str) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

const EMPTY_PRODUCT = {
  name_fr:'', name_en:'', slug:'', category:'artisanat', producer:'anonyme',
  price:'', original_price:'', wholesale_price:'', description_fr:'', description_en:'',
  features_fr:[], features_en:[], images:[], dimensions:'', weight:'', stock:'', tags:[],
  badge_fr:'', badge_en:'', featured:false, is_new:false, active:true, region_fr:'', region_en:'',
}

// ─── Sidebar ─────────────────────────────────────────────────
const NAV_ITEMS = [
  { key:'dashboard', icon:'📊', label:'Tableau de bord' },
  { key:'orders',    icon:'📦', label:'Commandes' },
  { key:'products',  icon:'🛍️', label:'Produits' },
]

function Sidebar({ tab, setTab, user, onLogout }) {
  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-slate-900 flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center font-bold text-white text-sm">N</div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Senbitik</p>
            <p className="text-slate-400 text-xs">Administration</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
              tab === item.key
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Voir la boutique */}
      <div className="px-4 pb-3">
        <Link
          to="/boutique"
          onClick={() => sessionStorage.setItem('senbitik-admin-preview', '1')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-all border border-orange-500/20"
        >
          🛒 Voir la boutique
        </Link>
      </div>

      {/* User + déconnexion */}
      <div className="px-4 py-4 border-t border-slate-700/60">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm">
            {user?.firstName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-slate-500 text-xs">Administrateur</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all"
        >
          <span>🚪</span> Se déconnecter
        </button>
      </div>
    </aside>
  )
}

// ─── Header ──────────────────────────────────────────────────
function Header({ tab }) {
  const titles = { dashboard: 'Tableau de bord', orders: 'Commandes', products: 'Produits' }
  const subtitles = {
    dashboard: 'Vue d\'ensemble de votre activité',
    orders: 'Suivez et gérez toutes vos commandes',
    products: 'Gérez votre catalogue de produits',
  }
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-800">{titles[tab]}</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5 hidden sm:block">{subtitles[tab]}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
        <span className="hidden sm:inline">Système en ligne</span>
      </div>
    </header>
  )
}

// ─── Dashboard ───────────────────────────────────────────────
function DashboardTab({ onNavigate }) {
  const [stats, setStats]       = useState(null)
  const [orders, setOrders]     = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      adminFetch('/api/admin/stats').then(r => r.json()),
      adminFetch('/api/admin/orders').then(r => r.json()),
      adminFetch('/api/admin/products').then(r => r.json()),
    ]).then(([s, o, p]) => {
      setStats(s); setOrders(o.slice(0, 5)); setProducts(p.slice(0, 5))
    }).catch(() => toast.error('Erreur chargement'))
      .finally(() => setLoading(false))
  }, [])

  const fmtDate = iso => new Date(iso).toLocaleDateString('fr-SN', { day:'2-digit', month:'short' })

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const statCards = [
    { label: 'Total commandes',   value: stats?.total ?? 0,             icon: '📦', color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Chiffre d\'affaires', value: formatPrice(stats?.revenue ?? 0), icon: '💰', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'En attente',        value: stats?.pending ?? 0,           icon: '⏳', color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Livrées',           value: stats?.delivered ?? 0,         icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'En livraison',      value: stats?.delivering ?? 0,        icon: '🚚', color: 'text-orange-600',  bg: 'bg-orange-50' },
    { label: 'Annulées',          value: stats?.cancelled ?? 0,         icon: '❌', color: 'text-red-600',     bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dernières commandes */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Dernières commandes</h2>
            <button onClick={() => onNavigate('orders')} className="text-xs text-orange-500 hover:underline font-medium">Voir tout →</button>
          </div>
          <div className="divide-y divide-slate-100">
            {orders.length === 0
              ? <p className="text-center text-slate-400 py-8 text-sm">Aucune commande</p>
              : orders.map(o => (
                <div key={o.order_id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{o.customer_first_name} {o.customer_last_name}</p>
                    <p className="text-xs text-slate-400">{o.order_id} · {fmtDate(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">{formatPrice(o.total)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[o.status]?.badge}`}>
                      {STATUS_CONFIG[o.status]?.label}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Derniers produits */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Produits récents</h2>
            <button onClick={() => onNavigate('products')} className="text-xs text-orange-500 hover:underline font-medium">Voir tout →</button>
          </div>
          <div className="divide-y divide-slate-100">
            {products.map(p => (
              <div key={p.dbId} className="px-6 py-3 flex items-center gap-3">
                <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{p.name?.fr}</p>
                  <p className="text-xs text-slate-400">{CAT_LABELS[p.category]} · stock: {p.stock}</p>
                </div>
                <p className="text-sm font-bold text-slate-700 flex-shrink-0">{formatPrice(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Orders Tab ───────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders]   = useState([])
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // orderId à supprimer

  const load = async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (filterStatus !== 'all') p.set('status', filterStatus)
      if (search) p.set('search', search)
      const [r1, r2] = await Promise.all([
        adminFetch(`/api/admin/orders?${p}`),
        adminFetch('/api/admin/stats'),
      ])
      setOrders(sortByPriority(await r1.json())); setStats(await r2.json())
    } catch { toast.error('Backend indisponible') }
    setLoading(false)
  }

  useEffect(() => { load() }, [filterStatus])

  const openDetail = async (orderId) => {
    setDetailLoading(true); setSelected(null)
    try { const r = await adminFetch(`/api/admin/orders/${orderId}`); setSelected(await r.json()) }
    catch { toast.error('Erreur chargement') }
    setDetailLoading(false)
  }

  const updateStatus = async (orderId, status) => {
    await adminFetch(`/api/admin/orders/${orderId}/status`, { method:'PATCH', body:{ status } })
    toast.success('Statut mis à jour')
    setOrders(prev => sortByPriority(prev.map(o => o.order_id === orderId ? { ...o, status } : o)))
    if (selected?.order_id === orderId) setSelected(s => ({ ...s, status }))
  }

  const deleteOrder = async (orderId) => {
    try {
      await adminFetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' })
      toast.success(`Commande ${orderId} supprimée`)
      setOrders(prev => prev.filter(o => o.order_id !== orderId))
      if (selected?.order_id === orderId) setSelected(null)
    } catch {
      toast.error('Erreur lors de la suppression')
    }
    setConfirmDelete(null)
  }

  const fmtDate = iso => new Date(iso).toLocaleDateString('fr-SN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })

  const statusFilters = [
    {key:'all',label:'Toutes'},
    {key:'en_attente',label:'En attente'},
    {key:'confirmee',label:'Confirmées'},
    {key:'en_livraison',label:'En livraison'},
    {key:'livree',label:'Livrées'},
    {key:'annulee',label:'Annulées'},
  ]

  return (
    <div className="flex gap-6 h-full">
      {/* Liste */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Stats rapides */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label:'Total', value:stats.total, color:'text-slate-800' },
              { label:'Chiffre d\'affaires', value:formatPrice(stats.revenue||0), color:'text-emerald-600' },
              { label:'En attente', value:stats.pending, color:'text-amber-600' },
              { label:'Livrées', value:stats.delivered, color:'text-emerald-600' },
            ].map((s,i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Barre outils */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <form onSubmit={e=>{e.preventDefault();load()}} className="flex gap-2">
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="N° commande, nom, téléphone…"
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
              Rechercher
            </button>
          </form>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(f => (
              <button key={f.key} onClick={()=>setFilterStatus(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus===f.key ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
          {loading
            ? <div className="p-8 text-center"><div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
            : orders.length === 0
              ? <div className="p-12 text-center text-slate-400"><p className="text-4xl mb-2">📦</p><p className="text-sm">Aucune commande</p></div>
              : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['N° Commande','Client','Ville','Montant','Statut ↑ priorité','Date',''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(o => (
                      <tr key={o.order_id} className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.order_id===o.order_id?'bg-orange-50':''}`}
                        onClick={()=>openDetail(o.order_id)}>
                        <td className="px-4 py-3 font-mono text-xs font-bold text-orange-600">{o.order_id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{o.customer_first_name} {o.customer_last_name}</p>
                          <p className="text-slate-400 text-xs">{o.customer_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{o.city}</td>
                        <td className="px-4 py-3 font-bold text-slate-800">{formatPrice(o.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[o.status]?.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[o.status]?.dot}`}/>
                            {STATUS_CONFIG[o.status]?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">{fmtDate(o.created_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-orange-400 text-xs font-medium">Voir →</span>
                            <button
                              onClick={e => { e.stopPropagation(); setConfirmDelete(o.order_id) }}
                              className="p-1 text-slate-300 hover:text-red-500 transition-colors rounded"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          }
        </div>
      </div>

      {/* Modal confirmation suppression commande */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Supprimer cette commande ?</h3>
              <p className="text-slate-500 text-sm mb-6">
                La commande <span className="font-mono font-bold text-slate-700">{confirmDelete}</span> sera définitivement supprimée.
                <br /><span className="text-red-500 font-medium">Cette action est irréversible.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => deleteOrder(confirmDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panneau détail */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-xl border border-slate-200 sticky top-6">
          {detailLoading
            ? <div className="p-8 text-center"><div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
            : selected ? (
              <div>
                {/* Header détail */}
                <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs font-bold text-orange-500">{selected.order_id}</p>
                    <h3 className="font-bold text-slate-800 mt-0.5">{selected.customer_first_name} {selected.customer_last_name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${STATUS_CONFIG[selected.status]?.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[selected.status]?.dot}`}/>
                      {STATUS_CONFIG[selected.status]?.label}
                    </span>
                  </div>
                  <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Infos client */}
                  <div className="space-y-2">
                    {[
                      ['📞 Téléphone', <a href={`tel:${selected.customer_phone}`} className="text-orange-500 hover:underline">{selected.customer_phone}</a>],
                      ['📍 Ville', selected.city],
                      selected.quartier ? ['🏘️ Quartier', selected.quartier] : null,
                      ['💳 Paiement', PAYMENT_LABELS[selected.payment_method]||selected.payment_method],
                      ['📅 Date', fmtDate(selected.created_at)],
                    ].filter(Boolean).map(([k,v],i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-slate-400 w-28 flex-shrink-0">{k}</span>
                        <span className="text-slate-700 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Articles */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Articles commandés</p>
                    <div className="space-y-2">
                      {(selected.items||[]).map(item => (
                        <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                          {item.product_image && <img src={item.product_image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0"/>}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-800 truncate">{item.product_name}</p>
                            <p className="text-xs text-slate-400">×{item.quantity} · {formatPrice(item.price)}/u</p>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{formatPrice(item.price*item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totaux */}
                  <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Sous-total</span><span>{formatPrice(selected.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Livraison</span><span>{selected.shipping===0?'Gratuite':formatPrice(selected.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-base pt-1 border-t border-slate-100">
                      <span>Total</span><span className="text-orange-600">{formatPrice(selected.total)}</span>
                    </div>
                  </div>

                  {/* Changer statut */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Changer le statut</p>
                    <select value={selected.status} onChange={e=>updateStatus(selected.order_id,e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer bg-white">
                      <option value="en_attente">⏳ En attente</option>
                      <option value="confirmee">✅ Confirmée</option>
                      <option value="en_livraison">🚚 En livraison</option>
                      <option value="livree">📬 Livrée</option>
                      <option value="annulee">❌ Annulée</option>
                    </select>
                  </div>

                  {/* WhatsApp */}
                  <a href={`https://wa.me/${selected.customer_phone?.replace(/\s+/g,'').replace('+','')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors">
                    💬 Contacter sur WhatsApp
                  </a>

                  {/* Supprimer */}
                  <button
                    onClick={() => setConfirmDelete(selected.order_id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold transition-colors border border-red-200"
                  >
                    🗑️ Supprimer la commande
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <p className="text-4xl mb-3">👆</p>
                <p className="text-sm">Cliquez sur une commande<br/>pour voir le détail</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

// ─── Image Uploader ───────────────────────────────────────────
function ImageUploader({ images, onChange }) {
  const inputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadFiles = async (files) => {
    if (!files?.length) return
    setUploading(true)
    const newUrls = []
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('image', file)
        const r = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'x-admin-token': ADMIN_TOKEN },
          body: fd,
        })
        if (!r.ok) { const e = await r.json(); toast.error(e.error); continue }
        const { url } = await r.json()
        newUrls.push(url)
      } catch { toast.error('Erreur upload') }
    }
    if (newUrls.length) onChange([...images, ...newUrls])
    setUploading(false)
  }

  const removeImage = async (url, idx) => {
    // Supprimer du serveur si c'est une image locale (/uploads/...)
    if (url.startsWith('/uploads/')) {
      const filename = url.split('/').pop()
      await fetch(`/api/admin/upload/${filename}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': ADMIN_TOKEN },
      }).catch(() => {})
    }
    onChange(images.filter((_, i) => i !== idx))
  }

  const addUrl = () => {
    const url = prompt('Coller une URL d\'image :')
    if (url?.trim()) onChange([...images, url.trim()])
  }

  return (
    <div className="space-y-3">
      {/* Zone de drop */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files) }}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragOver ? 'border-orange-400 bg-orange-50' : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={e => uploadFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Envoi en cours…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">📸</div>
            <p className="text-sm font-semibold text-slate-700">Cliquer ou glisser-déposer</p>
            <p className="text-xs text-slate-400">JPG, PNG, WEBP · max 5 Mo · plusieurs fichiers acceptés</p>
          </div>
        )}
      </div>

      {/* Aperçu des images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-100">
              <img src={url} alt={`Image ${i+1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => removeImage(url, i)}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-sm hover:bg-red-600"
                  title="Supprimer"
                >✕</button>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => { const a=[...images]; [a[i-1],a[i]]=[a[i],a[i-1]]; onChange(a) }}
                    className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm hover:bg-slate-800"
                    title="Déplacer à gauche"
                  >←</button>
                )}
              </div>
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bouton URL externe */}
      <button
        type="button"
        onClick={addUrl}
        className="w-full py-2 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-50 transition-colors"
      >
        🔗 Ajouter une URL externe (Unsplash, etc.)
      </button>
    </div>
  )
}

// ─── Product Form ─────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => initial ? {
    ...initial,
    price: initial.price || '',
    original_price: initial.originalPrice || '',
    wholesale_price: initial.wholesalePrice || '',
    stock: initial.stock ?? '',
    name_fr: initial.name?.fr || '',
    name_en: initial.name?.en || '',
    description_fr: initial.description?.fr || '',
    description_en: initial.description?.en || '',
    features_fr: initial.features?.fr || [],
    features_en: initial.features?.en || [],
    images: initial.images || [],
    tags: initial.tags || [],
    badge_fr: initial.badge?.fr || '',
    badge_en: initial.badge?.en || '',
    region_fr: initial.region?.fr || '',
    region_en: initial.region?.en || '',
    active: initial.active !== false,
  } : { ...EMPTY_PRODUCT })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const autoSlug = () => { if (form.name_fr) set('slug', slugify(form.name_fr)) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name_fr || !form.price || !form.category) {
      toast.error('Nom FR, prix et catégorie sont obligatoires'); return
    }
    setSaving(true)
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null,
        wholesale_price: form.wholesale_price ? Number(form.wholesale_price) : null,
        stock: Number(form.stock) || 0,
        slug: form.slug || slugify(form.name_fr),
        features_fr: typeof form.features_fr === 'string' ? form.features_fr.split('\n').filter(Boolean) : form.features_fr,
        features_en: typeof form.features_en === 'string' ? form.features_en.split('\n').filter(Boolean) : form.features_en,
        images: Array.isArray(form.images) ? form.images : (typeof form.images === 'string' ? form.images.split('\n').filter(Boolean) : []),
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t=>t.trim()).filter(Boolean) : form.tags,
        badge_fr: form.badge_fr || null,
        badge_en: form.badge_en || null,
      })
    } finally { setSaving(false) }
  }

  const inp = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-800'
  const lbl = 'block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={lbl}>Nom français *</label>
          <input value={form.name_fr} onChange={e=>set('name_fr',e.target.value)} onBlur={autoSlug} required className={inp} placeholder="Nom en français" /></div>
        <div><label className={lbl}>Nom anglais</label>
          <input value={form.name_en} onChange={e=>set('name_en',e.target.value)} className={inp} placeholder="Name in English" /></div>
      </div>

      <div><label className={lbl}>Slug (URL)</label>
        <div className="flex gap-2">
          <input value={form.slug} onChange={e=>set('slug',e.target.value)} className={inp} placeholder="mon-produit" />
          <button type="button" onClick={autoSlug} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 whitespace-nowrap font-medium">Auto</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={lbl}>Catégorie *</label>
          <select value={form.category} onChange={e=>set('category',e.target.value)} className={inp+' cursor-pointer'}>
            {CATEGORIES.map(c=><option key={c} value={c}>{CAT_LABELS[c]}</option>)}
          </select></div>
        <div><label className={lbl}>Producteur</label>
          <select value={form.producer} onChange={e=>set('producer',e.target.value)} className={inp+' cursor-pointer'}>
            {PRODUCERS.map(p=><option key={p} value={p}>{PRODUCER_NAMES[p]}</option>)}
          </select></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={lbl}>Prix unitaire FCFA *</label>
          <input type="number" value={form.price} onChange={e=>set('price',e.target.value)} required className={inp} placeholder="15000" min="0" /></div>
        <div><label className={lbl}>Prix barré</label>
          <input type="number" value={form.original_price} onChange={e=>set('original_price',e.target.value)} className={inp} placeholder="20000" min="0" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lbl}>Prix grossiste <span className="normal-case text-emerald-500">(à partir de 10)</span></label>
          <input type="number" value={form.wholesale_price} onChange={e=>set('wholesale_price',e.target.value)} className={inp} placeholder="Laisser vide si aucun" min="0" />
        </div>
        <div><label className={lbl}>Stock</label>
          <input type="number" value={form.stock} onChange={e=>set('stock',e.target.value)} className={inp} placeholder="10" min="0" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={lbl}>Description FR</label>
          <textarea value={form.description_fr} onChange={e=>set('description_fr',e.target.value)} rows={3} className={inp+' resize-none'} /></div>
        <div><label className={lbl}>Description EN</label>
          <textarea value={form.description_en} onChange={e=>set('description_en',e.target.value)} rows={3} className={inp+' resize-none'} /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={lbl}>Caractéristiques FR (1/ligne)</label>
          <textarea value={Array.isArray(form.features_fr)?form.features_fr.join('\n'):form.features_fr} onChange={e=>set('features_fr',e.target.value)} rows={3} className={inp+' resize-none'} placeholder="Bio certifié&#10;Sans additifs" /></div>
        <div><label className={lbl}>Caractéristiques EN (1/ligne)</label>
          <textarea value={Array.isArray(form.features_en)?form.features_en.join('\n'):form.features_en} onChange={e=>set('features_en',e.target.value)} rows={3} className={inp+' resize-none'} placeholder="Certified organic&#10;No additives" /></div>
      </div>

      <div>
        <label className={lbl}>Images du produit</label>
        <ImageUploader
          images={Array.isArray(form.images) ? form.images : form.images ? form.images.split('\n').filter(Boolean) : []}
          onChange={imgs => set('images', imgs)}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div><label className={lbl}>Poids</label><input value={form.weight} onChange={e=>set('weight',e.target.value)} className={inp} placeholder="200g" /></div>
        <div><label className={lbl}>Dimensions</label><input value={form.dimensions} onChange={e=>set('dimensions',e.target.value)} className={inp} placeholder="40×50cm" /></div>
        <div><label className={lbl}>Région</label><input value={form.region_fr} onChange={e=>{set('region_fr',e.target.value);set('region_en',e.target.value)}} className={inp} placeholder="Dakar" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><label className={lbl}>Badge</label><input value={form.badge_fr} onChange={e=>{set('badge_fr',e.target.value);set('badge_en',e.target.value)}} className={inp} placeholder="Bio, Nouveau… (laisser vide)" /></div>
        <div><label className={lbl}>Tags (virgule)</label>
          <input value={Array.isArray(form.tags)?form.tags.join(', '):form.tags} onChange={e=>set('tags',e.target.value)} className={inp} placeholder="karité, bio, casamance" /></div>
      </div>

      <div className="flex gap-6 pt-1">
        {[{key:'featured',label:'⭐ En vedette'},{key:'is_new',label:'🆕 Nouveau'},{key:'active',label:'✅ Actif (visible)'}].map(({key,label}) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form[key]} onChange={e=>set(key,e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-slate-700 text-sm font-medium">{label}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-lg border-2 border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">Annuler</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
          {saving ? 'Enregistrement…' : initial ? '💾 Mettre à jour' : '➕ Créer'}
        </button>
      </div>
    </form>
  )
}

// ─── Products Tab ─────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [panel, setPanel]       = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams()
      if (catFilter !== 'all') p.set('category', catFilter)
      if (search) p.set('search', search)
      const r = await adminFetch(`/api/admin/products?${p}`)
      setProducts(await r.json())
    } catch { toast.error('Impossible de charger les produits') }
    setLoading(false)
  }

  useEffect(() => { load() }, [catFilter])

  const handleSave = async (data) => {
    const isEdit = panel && panel !== 'add'
    try {
      const r = isEdit
        ? await adminFetch(`/api/admin/products/${panel.dbId}`, { method:'PUT', body:data })
        : await adminFetch('/api/admin/products', { method:'POST', body:data })
      if (!r.ok) { const e = await r.json(); throw new Error(e.error) }
      toast.success(isEdit ? 'Produit mis à jour ✓' : 'Produit créé ✓')
      setPanel(null); load()
    } catch(err) { toast.error(err.message || 'Erreur serveur') }
  }

  const handleDelete = async (p) => {
    try {
      await adminFetch(`/api/admin/products/${p.dbId}`, { method:'DELETE' })
      toast.success(`"${p.name?.fr}" supprimé`)
      setDeleteConfirm(null)
      setProducts(prev => prev.filter(x => x.dbId !== p.dbId))
    } catch { toast.error('Erreur suppression') }
  }

  const handleToggle = async (p, field) => {
    try {
      const r = await adminFetch(`/api/admin/products/${p.dbId}/toggle`, { method:'PATCH', body:{ field } })
      const data = await r.json()
      setProducts(prev => prev.map(x => x.dbId===p.dbId ? { ...x, [field==='is_new'?'isNew':field]: data[field] } : x))
    } catch { toast.error('Erreur') }
  }

  const CAT_COLORS = {
    artisanat:'bg-yellow-100 text-yellow-700', alimentation:'bg-green-100 text-green-700',
    textile:'bg-blue-100 text-blue-700', cosmetiques:'bg-pink-100 text-pink-700',
    decoration:'bg-purple-100 text-purple-700', sante:'bg-teal-100 text-teal-700',
  }

  return (
    <div className="flex gap-6">
      {/* Liste */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex gap-3 mb-3">
            <form onSubmit={e=>{e.preventDefault();load()}} className="flex gap-2 flex-1">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un produit…"
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button type="submit" className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">🔍</button>
            </form>
            <button onClick={()=>setPanel('add')} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
              + Nouveau produit
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{key:'all',label:'Tous'},...CATEGORIES.map(c=>({key:c,label:CAT_LABELS[c]}))].map(f => (
              <button key={f.key} onClick={()=>setCatFilter(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${catFilter===f.key?'bg-orange-500 text-white':'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau produits */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden overflow-x-auto">
          {loading
            ? <div className="p-8 text-center"><div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
            : products.length===0
              ? <div className="p-12 text-center text-slate-400"><p className="text-4xl mb-2">🛍️</p><p className="text-sm">Aucun produit</p></div>
              : (
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      {['Produit','Catégorie','Prix','Stock','Statut','Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.dbId} className={`hover:bg-slate-50 transition-colors ${!p.active?'opacity-50':''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-slate-800">{p.name?.fr}</p>
                              <p className="text-slate-400 text-xs">{PRODUCER_NAMES[p.producer]||p.producer}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${CAT_COLORS[p.category]||'bg-slate-100 text-slate-600'}`}>
                            {CAT_LABELS[p.category]||p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">{formatPrice(p.price)}</p>
                          {p.originalPrice && <p className="text-slate-400 text-xs line-through">{formatPrice(p.originalPrice)}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-sm ${p.stock<=3?'text-red-500':p.stock<=10?'text-amber-600':'text-emerald-600'}`}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={()=>handleToggle(p,'featured')} title="En vedette"
                              className={`w-7 h-7 rounded text-sm transition-colors ${p.featured?'bg-yellow-100 text-yellow-600':'bg-slate-100 text-slate-400 hover:text-yellow-500'}`}>⭐</button>
                            <button onClick={()=>handleToggle(p,'is_new')} title="Nouveau"
                              className={`w-7 h-7 rounded text-xs font-bold transition-colors ${p.isNew?'bg-green-100 text-green-600':'bg-slate-100 text-slate-400 hover:text-green-500'}`}>N</button>
                            <button onClick={()=>handleToggle(p,'active')} title={p.active?'Masquer':'Activer'}
                              className={`w-7 h-7 rounded text-sm transition-colors ${p.active?'bg-emerald-100 text-emerald-600':'bg-red-100 text-red-400'}`}>{p.active?'👁':'🚫'}</button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={()=>setPanel(p)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors">
                              ✏️ Modifier
                            </button>
                            <button onClick={()=>setDeleteConfirm(p)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
          }
          {products.length > 0 && (
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400">
              {products.length} produit(s)
            </div>
          )}
        </div>
      </div>

      {/* Formulaire ajout/modification */}
      {panel && (
        <div className="w-[420px] flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 sticky top-6 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">
                {panel==='add' ? '➕ Nouveau produit' : `✏️ Modifier — ${panel.name?.fr}`}
              </h3>
              <button onClick={()=>setPanel(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5">
              <ProductForm initial={panel==='add'?null:panel} onSave={handleSave} onCancel={()=>setPanel(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={()=>setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl mx-auto mb-4">🗑️</div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Supprimer ce produit ?</h3>
              <p className="text-slate-500 text-sm mb-6">
                <b className="text-slate-700">"{deleteConfirm.name?.fr}"</b> sera définitivement supprimé.
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button onClick={()=>setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50">
                  Annuler
                </button>
                <button onClick={()=>handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Admin ───────────────────────────────────────────────
export default function Admin() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')

  if (!user || user.role !== 'admin') return <Navigate to="/connexion" replace />

  // Quitter le mode prévisualisation en arrivant sur /admin
  sessionStorage.removeItem('senbitik-admin-preview')

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      {/* Sidebar desktop */}
      <Sidebar tab={tab} setTab={setTab} user={user} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header tab={tab} />

        <main className="flex-1 p-3 sm:p-6 overflow-auto pb-20 lg:pb-6">
          {tab === 'dashboard' && <DashboardTab onNavigate={setTab} />}
          {tab === 'orders'    && <OrdersTab />}
          {tab === 'products'  && <ProductsTab />}
        </main>
      </div>

      {/* ── Navigation mobile (bottom tab bar) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-700 flex">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              tab === item.key ? 'text-orange-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="text-[10px] leading-none">{item.label}</span>
          </button>
        ))}
        <Link
          to="/boutique"
          onClick={() => sessionStorage.setItem('senbitik-admin-preview', '1')}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <span className="text-lg leading-none">🛒</span>
          <span className="text-[10px] leading-none">Boutique</span>
        </Link>
      </nav>
    </div>
  )
}
