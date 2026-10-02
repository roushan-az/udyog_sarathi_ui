import React, { useMemo, useState } from 'react'
import {
  Search, Filter, Plus, FileSpreadsheet, Printer, ChevronRight, ChevronLeft, ChevronDown,
  Users, UserCheck, Truck, Ban, Wallet, RefreshCw, Info, Pencil, Trash2,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { parties, partySummary } from '../data/mockData'
import noteImg from '../assets/party-note-illustration.png'
import { useApp } from '../context/AppContext'

/* ---------- helpers ---------- */
const fmt2 = (n) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pad2 = (n) => String(n).padStart(2, '0')

const NAVY = 'text-[#1b2a5c]'
const GREEN = 'text-[#0b7a3e]'

const pill = 'inline-block rounded-md border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap'
const typeStyle = {
  'ग्राहक': 'bg-green-50 text-green-700 border-green-300',
  'सप्लायर': 'bg-purple-50 text-purple-700 border-purple-300',
}
const ledgerStyle = {
  'वकाया': 'bg-green-50 text-green-700 border-green-300',
  'देय': 'bg-red-50 text-red-600 border-red-300',
}
const statusStyle = {
  'सक्रिय': 'bg-green-50 text-green-700 border-green-300',
  'निष्क्रिय': 'bg-slate-100 text-slate-600 border-slate-300',
}

/* ---------- building blocks ---------- */
function SummaryCard({ label, value, icon, bg, border, labelColor }) {
  return (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-3.5 flex items-center justify-between shadow-sm`}>
      <div className="min-w-0">
        <p className={`text-xs font-bold ${labelColor} leading-tight`}>{label}</p>
        <p className={`mt-2 text-xl font-bold ${NAVY} leading-none whitespace-nowrap`}>{value}</p>
      </div>
      <div className="shrink-0 ml-2">{icon}</div>
    </div>
  )
}

function FilterSelect({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={`w-full h-10 appearance-none rounded-lg border border-slate-300 bg-white pl-3.5 pr-9 text-sm font-semibold ${NAVY} focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
      >
        {children}
      </select>
      <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${NAVY}`} />
    </div>
  )
}

const OutlineBtn = ({ icon: Icon, iconClass = NAVY, children, ...rest }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm font-bold ${NAVY} hover:bg-slate-50 whitespace-nowrap`}
    {...rest}
  >
    <Icon size={18} className={iconClass} />
    {children}
  </button>
)

/* ---------- page ---------- */
export default function PartyMaster() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('सभी प्रकार')
  const [status, setStatus] = useState('सभी स्थिति')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = parties.filter((p) => {
    const q = query.toLowerCase()
    const matchesQuery = !query || p.name.toLowerCase().includes(q) || (p.mobile || '').includes(query) || (p.gstin || '').toLowerCase().includes(q)
    const matchesType = type === 'सभी प्रकार' || p.type === type
    const matchesStatus = status === 'सभी स्थिति' || p.status === status
    return matchesQuery && matchesType && matchesStatus
  })

  const isFiltered = query || type !== 'सभी प्रकार' || status !== 'सभी स्थिति'
  const totalRecords = isFiltered ? filtered.length : Math.max(partySummary.total, filtered.length)
  const from = totalRecords === 0 ? 0 : (page - 1) * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage, totalRecords)
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const lastPage = Math.max(1, Math.ceil(totalRecords / rowsPerPage))

  const resetFilters = () => {
    setQuery('')
    setType('सभी प्रकार')
    setStatus('सभी स्थिति')
    setPage(1)
  }

  const headers = [
    'SL No.', 'पार्टी नाम', 'प्रकार', 'मोबाइल नंबर', 'स्थान', 'GSTIN',
    'खाता प्रकार', 'कुल वकाया / देय (₹)', 'स्थिति', 'कार्यवाही',
  ]
  const cell = 'px-3 py-3 text-center text-[13px] font-semibold border-r border-slate-200 last:border-r-0'

  return (
    <Layout title="पार्टी मास्टर" subtitle="सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
      <PageHeader
        code="SCR-007"
        title="पार्टी मास्टर"
        subtitle="सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें"
        actions={
          <>
            <OutlineBtn icon={FileSpreadsheet} iconClass="text-green-700">एक्सपोर्ट (Excel)</OutlineBtn>
            <OutlineBtn icon={Printer}>प्रिंट करें</OutlineBtn>
            <button
              type="button"
              onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0b7a3e] hover:bg-[#096a35] text-white text-sm font-bold whitespace-nowrap"
            >
              <Plus size={18} />
              नई पार्टी जोड़ें
            </button>
          </>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
        <SummaryCard
          label="कुल पार्टी" value={partySummary.total}
          bg="bg-gradient-to-br from-white to-blue-50" border="border-blue-100" labelColor="text-blue-700"
          icon={<Users size={26} strokeWidth={1.8} className="text-blue-600" />}
        />
        <SummaryCard
          label="ग्राहक" value={partySummary.customers}
          bg="bg-gradient-to-br from-white to-green-50" border="border-green-100" labelColor="text-green-700"
          icon={<UserCheck size={26} strokeWidth={1.8} className="text-green-700" />}
        />
        <SummaryCard
          label="सप्लायर" value={partySummary.suppliers}
          bg="bg-gradient-to-br from-white to-purple-50" border="border-purple-100" labelColor="text-purple-700"
          icon={<Truck size={26} strokeWidth={1.8} className="text-purple-600" />}
        />
        <SummaryCard
          label="निष्क्रिय पार्टी" value={pad2(partySummary.inactive)}
          bg="bg-gradient-to-br from-white to-orange-50" border="border-orange-100" labelColor="text-orange-600"
          icon={<Ban size={26} strokeWidth={1.8} className="text-orange-500" />}
        />
        <SummaryCard
          label="कुल वकाया (ग्राहक)" value={`₹ ${fmt2(partySummary.totalReceivable)}`}
          bg="bg-gradient-to-br from-white to-sky-50" border="border-sky-100" labelColor="text-[#1b2a5c]"
          icon={<Wallet size={26} strokeWidth={1.8} className="text-blue-600" />}
        />
        <SummaryCard
          label="कुल देय (सप्लायर)" value={`₹ ${fmt2(partySummary.totalPayable)}`}
          bg="bg-gradient-to-br from-white to-purple-50" border="border-purple-100" labelColor="text-[#1b2a5c]"
          icon={<Wallet size={26} strokeWidth={1.8} className="text-purple-600" />}
        />
      </div>

      {/* Filter bar */}
      <Card className="p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
          <div className="relative flex-1 min-w-0">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="पार्टी नाम, मोबाइल, GSTIN से खोजें"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <FilterSelect value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} className="sm:w-[200px]">
            <option>सभी प्रकार</option>
            <option>ग्राहक</option>
            <option>सप्लायर</option>
          </FilterSelect>
          <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="sm:w-[180px]">
            <option>सभी स्थिति</option>
            <option>सक्रिय</option>
            <option>निष्क्रिय</option>
          </FilterSelect>
          <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-slate-300 bg-white text-sm font-bold ${NAVY} hover:bg-slate-50`}
          >
            <Filter size={17} />
            फिल्टर
          </button>
          <button
            type="button"
            onClick={resetFilters}
            title="रीसेट"
            className={`inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white ${NAVY} hover:bg-slate-50 sm:ml-auto`}
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </Card>

      {/* Desktop table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {headers.map((h) => (
                  <th key={h} className={`px-3 py-3 text-center text-[13px] font-bold ${NAVY} border-r border-slate-200 last:border-r-0 whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p, i) => (
                <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50/60">
                  <td className={`${cell} ${NAVY}`}>{(page - 1) * rowsPerPage + i + 1}</td>
                  <td className={`${cell} ${NAVY} font-bold`}>{p.name}</td>
                  <td className={cell}>
                    <span className={`${pill} ${typeStyle[p.type] || typeStyle['ग्राहक']}`}>{p.type}</span>
                  </td>
                  <td className={`${cell} ${NAVY}`}>{p.mobile}</td>
                  <td className={`${cell} ${NAVY}`}>{p.place}</td>
                  <td className={`${cell} ${NAVY}`}>{p.gstin || '–'}</td>
                  <td className={cell}>
                    <span className={`${pill} ${ledgerStyle[p.ledger] || ledgerStyle['वकाया']}`}>{p.ledger}</span>
                  </td>
                  <td className={`${cell} font-bold ${p.ledger === 'देय' ? 'text-red-600' : NAVY}`}>{fmt2(p.balance)}</td>
                  <td className={cell}>
                    <span className={`${pill} ${statusStyle[p.status] || statusStyle['सक्रिय']}`}>{p.status}</span>
                  </td>
                  <td className={cell}>
                    <div className="flex items-center justify-center gap-3">
                      <button type="button" aria-label="संपादित करें" onClick={() => pushToast('पार्टी संपादन फॉर्म खुलेगा', 'info')} className="text-blue-700 hover:text-blue-900">
                        <Pencil size={16} />
                      </button>
                      <button type="button" aria-label="हटाएँ" onClick={() => pushToast('पार्टी हटाई गई', 'warn')} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className="py-10 text-center text-sm text-slate-400">कोई रिकॉर्ड नहीं मिला</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className={`text-[13px] font-bold ${NAVY}`}>कुल रिकॉर्ड: {totalRecords}</p>
          <div className="flex items-center gap-4">
            <span className={`text-[13px] font-semibold ${NAVY}`}>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1) }}
                className={`h-9 w-[72px] appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-7 text-sm font-semibold ${NAVY} focus:outline-none`}
              >
                {[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}
              </select>
              <ChevronDown size={15} className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${NAVY}`} />
            </div>
            <span className={`text-[13px] font-semibold ${NAVY}`}>{from}-{to} of {totalRecords}</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((n) => n - 1)} className={`${NAVY} disabled:opacity-30`} aria-label="पिछला">
                <ChevronLeft size={18} />
              </button>
              <button type="button" disabled={page >= lastPage} onClick={() => setPage((n) => n + 1)} className={`${NAVY} disabled:opacity-30`} aria-label="अगला">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mt-5 rounded-xl bg-green-50/70 border border-green-200 px-5 py-4 flex items-center justify-between gap-4">
        <div className={`text-[13px] ${NAVY}`}>
          <p className={`flex items-center gap-2 font-bold mb-2 ${GREEN}`}>
            <Info size={18} />
            नोट:
          </p>
          <ul className="list-disc pl-9 space-y-1.5 font-medium">
            <li>पार्टी प्रकार: ग्राहक = जिनको आप सामान बेचते हैं। सप्लायर = जिनसे आप सामान खरीदते हैं।</li>
            <li>वकाया: ग्राहक से प्राप्त करना है। देय: सप्लायर को भुगतान करना है।</li>
            <li>निष्क्रिय पार्टी का उपयोग नहीं किया जा रहा है।</li>
          </ul>
        </div>
        <img src={noteImg} alt="" className="h-24 w-auto shrink-0 hidden sm:block select-none" />
      </div>
      </div>

      {/* ===================== MOBILE (prototype: SCR-007) ===================== */}
      <PartyMasterMobile />
    </Layout>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg) — prototype SCR-007
   Same shell as SalesReturn: MobileHeader on top, scrolling body,
   Layout's bottom nav below. Sizes are clamp()-based so it scales.
   ===================================================================== */
const C = { green: '#14612e', label: '#1e3a8a', text: '#1f2937', muted: '#6b7280', border: '#e9ecf0', field: '#d9dde3' }
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`

const TABS = [
  { label: 'सभी पार्टी', value: 'all' },
  { label: 'ग्राहक', value: 'ग्राहक' },
  { label: 'सप्लायर', value: 'सप्लायर' },
]
const STATUS_OPTIONS = ['सभी स्थिति', 'सक्रिय', 'निष्क्रिय']

const avatarStyle = {
  'ग्राहक': { background: '#d9f2e1', color: '#14612e' },
  'सप्लायर': { background: '#ece4fb', color: '#5b21b6' },
}
const mobilePill = {
  'ग्राहक': { background: '#f0fbf3', color: '#15803d', borderColor: '#86d39f' },
  'सप्लायर': { background: '#f5f0ff', color: '#6d28d9', borderColor: '#c4b0f0' },
}

const initials = (name = '') => {
  const w = name.trim().split(/\s+/).filter(Boolean)
  return (w.length > 1 ? w[0][0] + w[1][0] : name.slice(0, 2)).toUpperCase()
}

function MobileStat({ label, value, icon: Icon, bg, border, labelColor, iconColor }) {
  return (
    <div className="rounded-xl border flex items-center justify-between shadow-sm" style={{ background: bg, borderColor: border, padding: `${cl(10, 3.2, 16)} ${cl(12, 3.8, 18)}` }}>
      <div className="min-w-0">
        <p className="font-bold leading-tight" style={{ color: labelColor, fontSize: cl(11, 3.4, 14) }}>{label}</p>
        <p className="mt-2 font-bold leading-none" style={{ color: C.label, fontSize: cl(20, 6.4, 28) }}>{value}</p>
      </div>
      <Icon className="shrink-0 ml-2" strokeWidth={1.9} style={{ color: iconColor, width: cl(22, 7, 32), height: cl(22, 7, 32) }} />
    </div>
  )
}

function PartyMasterMobile() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const [status, setStatus] = useState('सभी स्थिति')
  const [filterOpen, setFilterOpen] = useState(false)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return parties.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.mobile || '').includes(query.trim()) || (p.gstin || '').toLowerCase().includes(q)
      const matchesTab = tab === 'all' || p.type === tab
      const matchesStatus = status === 'सभी स्थिति' || p.status === status
      return matchesQuery && matchesTab && matchesStatus
    })
  }, [query, tab, status])

  const filterActive = status !== 'सभी स्थिति'
  const addParty = () => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overscroll-contain px-[clamp(12px,4vw,28px)] pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ---- title ---- */}
        <div className="text-center">
          <h1 className="font-bold leading-tight" style={{ color: C.label, fontSize: cl(17, 5.4, 26) }}>पार्टी मास्टर (SCR-007)</h1>
          <p className="font-semibold leading-tight mt-1" style={{ color: C.text, fontSize: cl(10.5, 3.2, 14) }}>सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें</p>
        </div>

        {/* ---- summary cards ---- */}
        <div className="grid grid-cols-2 mt-4" style={{ gap: cl(10, 3.4, 18) }}>
          <MobileStat label="कुल पार्टी" value={partySummary.total} icon={Users} bg="#eef4ff" border="#cfdcf7" labelColor="#1d4ed8" iconColor="#2563eb" />
          <MobileStat label="ग्राहक" value={partySummary.customers} icon={UserCheck} bg="#effaf2" border="#c6e8d0" labelColor="#15803d" iconColor="#15803d" />
          <MobileStat label="सप्लायर" value={partySummary.suppliers} icon={Truck} bg="#f6f1ff" border="#dccff5" labelColor="#6d28d9" iconColor="#7c3aed" />
          <MobileStat label="निष्क्रिय पार्टी" value={pad2(partySummary.inactive)} icon={Ban} bg="#fff6ec" border="#f7d9b8" labelColor="#ea580c" iconColor="#f97316" />
        </div>

        {/* ---- search + filter ---- */}
        <div className="mt-4 flex items-center" style={{ gap: cl(8, 3, 14) }}>
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted, width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="पार्टी नाम, मोबाइल, GSTIN से खोजें"
              aria-label="पार्टी खोजें"
              className="w-full rounded-lg border bg-white pl-9 pr-3 outline-none placeholder:text-slate-400 focus:border-green-600"
              style={{ borderColor: C.field, height: cl(40, 11.5, 50), color: C.text, fontSize: cl(11.5, 3.5, 15) }}
            />
          </div>
          <button
            type="button"
            aria-label="फिल्टर"
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((v) => !v)}
            className="relative shrink-0 rounded-lg border flex items-center justify-center focus-ring active:bg-slate-50"
            style={{ borderColor: filterOpen || filterActive ? C.green : C.field, background: filterOpen ? '#f0fbf3' : '#fff', color: C.label, width: cl(40, 11.5, 50), height: cl(40, 11.5, 50) }}
          >
            <Filter style={{ width: cl(16, 4.8, 22), height: cl(16, 4.8, 22) }} />
            {filterActive && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: C.green }} />}
          </button>
        </div>

        {/* status filter (opens from the filter button) */}
        {filterOpen && (
          <div className="mt-2.5 rounded-lg border bg-slate-50 p-2.5" style={{ borderColor: C.field }}>
            <p className="font-semibold mb-1.5" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>स्थिति</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className="rounded-full border px-3 py-1 font-semibold focus-ring"
                  style={{
                    fontSize: cl(11, 3.3, 14),
                    background: status === s ? C.green : '#fff',
                    color: status === s ? '#fff' : C.text,
                    borderColor: status === s ? C.green : C.field,
                  }}
                >{s}</button>
              ))}
              {filterActive && (
                <button type="button" onClick={() => setStatus('सभी स्थिति')} className="ml-auto inline-flex items-center gap-1 px-2 py-1 font-semibold focus-ring rounded" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>
                  <RefreshCw size={13} /> रीसेट
                </button>
              )}
            </div>
          </div>
        )}

        {/* ---- tabs ---- */}
        <div className="mt-3 grid grid-cols-3 rounded-lg overflow-hidden border" style={{ borderColor: C.field }} role="tablist">
          {TABS.map((t, i) => {
            const active = tab === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.value)}
                className={`font-semibold focus-ring ${i > 0 ? 'border-l' : ''}`}
                style={{ height: cl(38, 11, 48), fontSize: cl(12, 3.6, 15), borderColor: C.field, background: active ? C.green : '#fff', color: active ? '#fff' : C.text }}
              >{t.label}</button>
            )
          })}
        </div>

        {/* ---- party cards ---- */}
        <div className="mt-3 space-y-2.5">
          {list.map((p) => {
            const type = p.type in avatarStyle ? p.type : 'ग्राहक'
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pushToast(`${p.name} की जानकारी खुलेगी`, 'info')}
                className="w-full text-left rounded-xl border bg-white shadow-sm flex items-center active:bg-slate-50 focus-ring"
                style={{ borderColor: C.border, padding: cl(10, 3.4, 16), gap: cl(10, 3.4, 16) }}
              >
                <span className="shrink-0 rounded-full flex items-center justify-center font-bold" style={{ ...avatarStyle[type], width: cl(42, 12.5, 56), height: cl(42, 12.5, 56), fontSize: cl(14, 4.4, 19) }}>
                  {initials(p.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-bold truncate" style={{ color: C.label, fontSize: cl(13, 4, 17) }}>{p.name}</span>
                    <span className="shrink-0 rounded border px-2 py-px font-semibold" style={{ ...mobilePill[type], fontSize: cl(9.5, 2.9, 12) }}>{p.type}</span>
                  </span>
                  <span className="block font-medium" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }}>{p.mobile}</span>
                  <span className="block truncate" style={{ color: C.text, fontSize: cl(11.5, 3.5, 14.5) }}>{p.place}</span>
                  <span className="block truncate" style={{ color: C.muted, fontSize: cl(9.5, 2.9, 12) }}>
                    {p.gstin ? `GSTIN: ${p.gstin}` : '–'}
                  </span>
                </span>
                <ChevronRight className="shrink-0" style={{ color: C.label, width: cl(18, 5.4, 24), height: cl(18, 5.4, 24) }} />
              </button>
            )
          })}
          {list.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">कोई रिकॉर्ड नहीं मिला</p>
          )}
        </div>
      </main>

      {/* ---- sticky action, sits right above the bottom nav ---- */}
      <div className="shrink-0 border-t bg-white px-[clamp(12px,4vw,28px)] py-2.5" style={{ borderColor: C.border }}>
        <button
          type="button"
          onClick={addParty}
          className="w-full rounded-lg font-semibold text-white inline-flex items-center justify-center gap-2 active:opacity-90 focus-ring"
          style={{ background: C.green, height: cl(42, 12, 52), fontSize: cl(13, 3.9, 16) }}
        >
          <Plus size={18} /> नई पार्टी जोड़ें
        </button>
      </div>
    </div>
  )
}