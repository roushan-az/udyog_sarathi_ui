import React, { useMemo, useState } from 'react'
import {
  Search, Filter, Plus, FileSpreadsheet, Printer, ChevronRight, ChevronLeft, ChevronDown,
  Package, Check, Minus, AlertTriangle, Shield, IndianRupee, RefreshCw, Info, Pencil, Trash2,
  SlidersHorizontal, Landmark, ShieldCheck, X,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { products, productSummary } from '../data/mockData'
import noteImg from '../assets/product-note-illustration.png'
import { useApp } from '../context/AppContext'

/* ---------- helpers ---------- */
// Prototype shows every amount / quantity with 2 decimals in Indian grouping: 1,250.00 / 47,120.00
const fmt2 = (n) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pad2 = (n) => String(n).padStart(2, '0') // 06, 08

const NAVY = 'text-[#1b2a5c]'

const statusStyle = {
  'सक्रिय': 'bg-green-50 text-green-700 border-green-300',
  'कम स्टॉक': 'bg-orange-50 text-orange-600 border-orange-300',
  'निष्क्रिय': 'bg-red-50 text-red-600 border-red-300',
}

/* ---------- small building blocks ---------- */
function SummaryCard({ label, value, icon, bg, border, labelColor }) {
  return (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-3.5 flex items-center justify-between shadow-sm`}>
      <div className="min-w-0">
        <p className={`text-xs font-bold ${labelColor} leading-tight`}>{label}</p>
        <p className={`mt-2 text-2xl font-bold ${NAVY} leading-none`}>{value}</p>
      </div>
      <div className="shrink-0 ml-2">{icon}</div>
    </div>
  )
}

const SolidCircle = ({ color, children }) => (
  <span className={`flex items-center justify-center w-7 h-7 rounded-full ${color}`}>{children}</span>
)

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

/* ---------- mobile-only pieces (phone / small tablet, < lg) ---------- */
const MSummary = ({ label, value, icon, bg, border, labelColor, onClick, active }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left rounded-xl border ${border} ${bg} px-3 py-3 flex items-center justify-between gap-2 shadow-sm min-w-0 transition active:scale-[0.98] focus-ring ${active ? 'ring-2 ring-brandGreen-600/40' : ''}`}
  >
    <div className="min-w-0">
      <p className={`text-[11px] sm:text-xs font-semibold ${labelColor} leading-tight`}>{label}</p>
      <p className={`mt-1.5 text-xl sm:text-2xl font-bold ${NAVY} leading-none truncate`}>{value}</p>
    </div>
    <div className="shrink-0">{icon}</div>
  </button>
)

const M_SELECT =
  'w-full h-11 appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-9 text-sm font-semibold text-[#1b2a5c] focus:outline-none focus:border-brandGreen-500 focus:ring-1 focus:ring-brandGreen-500'

const PAGE_STEP = 10

/* ---------- page ---------- */
export default function ProductMaster() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('सभी श्रेणी')
  const [status, setStatus] = useState('सभी स्थिति')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [visible, setVisible] = useState(PAGE_STEP)

  const categories = useMemo(() => ['सभी श्रेणी', ...new Set(products.map((p) => p.category))], [])

  const filtered = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.hsn.includes(query)
    const matchesCategory = category === 'सभी श्रेणी' || p.category === category
    const matchesStatus = status === 'सभी स्थिति' || p.status === status
    return matchesQuery && matchesCategory && matchesStatus
  })

  const isFiltered = query || category !== 'सभी श्रेणी' || status !== 'सभी स्थिति'
  const totalRecords = isFiltered ? filtered.length : Math.max(productSummary.total, filtered.length)
  const from = totalRecords === 0 ? 0 : (page - 1) * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage, totalRecords)
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const lastPage = Math.max(1, Math.ceil(totalRecords / rowsPerPage))

  const resetFilters = () => {
    setQuery('')
    setCategory('सभी श्रेणी')
    setStatus('सभी स्थिति')
    setPage(1)
    setVisible(PAGE_STEP)
  }

  // mobile: tapping a summary card quick-filters the list
  const quickStatus = (s) => {
    setStatus((cur) => (cur === s ? 'सभी स्थिति' : s))
    setVisible(PAGE_STEP)
  }
  const activeFilterCount = (category !== 'सभी श्रेणी' ? 1 : 0) + (status !== 'सभी स्थिति' ? 1 : 0)
  const mobileRows = filtered.slice(0, visible)

  const headers = [
    ['SL No.', 'w-16'], ['प्रोडक्ट नाम', ''], ['HSN कोड', ''], ['श्रेणी', ''], ['Unit', ''],
    ['बिक्री रेट (₹)', ''], ['खरीद रेट (₹)', ''], ['स्टॉक मात्रा', ''], ['स्टॉक वैल्यू (₹)', ''],
    ['स्थिति', ''], ['एक्शन', ''],
  ]

  const cell = 'px-3 py-3 text-center text-[13px] font-semibold border-r border-slate-200 last:border-r-0'

  return (
    <Layout title="प्रोडक्ट मास्टर" subtitle="सभी प्रोडक्ट की जानकारी यहाँ प्रवंधित करें">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
      <PageHeader
        code="SCR-006"
        title="प्रोडक्ट मास्टर"
        subtitle="सभी प्रोडक्ट की जानकारी यहाँ प्रवंधित करें"
        actions={
          <>
            <button
              type="button"
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm font-bold ${NAVY} hover:bg-slate-50 whitespace-nowrap`}
            >
              <FileSpreadsheet size={18} className="text-green-700" />
              एक्सपोर्ट (Excel)
            </button>
            <button
              type="button"
              className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm font-bold ${NAVY} hover:bg-slate-50 whitespace-nowrap`}
            >
              <Printer size={18} className={NAVY} />
              प्रिंट करें
            </button>
            <button
              type="button"
              onClick={() => pushToast('नया प्रोडक्ट जोड़ने का फॉर्म खुलेगा', 'info')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0b7a3e] hover:bg-[#096a35] text-white text-sm font-bold whitespace-nowrap"
            >
              <Plus size={18} />
              नया प्रोडक्ट जोड़ें
            </button>
          </>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <SummaryCard
          label="कुल प्रोडक्ट"
          value={productSummary.total}
          bg="bg-gradient-to-br from-white to-blue-50"
          border="border-blue-100"
          labelColor="text-[#1b2a5c]"
          icon={<Package size={34} strokeWidth={1.8} className="text-blue-600 fill-blue-100" />}
        />
        <SummaryCard
          label="सक्रिय प्रोडक्ट"
          value={productSummary.active}
          bg="bg-gradient-to-br from-white to-green-50"
          border="border-green-100"
          labelColor="text-green-700"
          icon={<SolidCircle color="bg-green-600"><Check size={18} strokeWidth={3} className="text-white" /></SolidCircle>}
        />
        <SummaryCard
          label="निष्क्रिय प्रोडक्ट"
          value={pad2(productSummary.inactive)}
          bg="bg-gradient-to-br from-white to-red-50"
          border="border-red-100"
          labelColor="text-red-600"
          icon={<SolidCircle color="bg-red-600"><Minus size={18} strokeWidth={3} className="text-white" /></SolidCircle>}
        />
        <SummaryCard
          label="कम स्टॉक वाले प्रोडक्ट"
          value={pad2(productSummary.lowStock)}
          bg="bg-gradient-to-br from-white to-orange-50"
          border="border-orange-100"
          labelColor="text-orange-600"
          icon={<AlertTriangle size={32} strokeWidth={2} className="text-white fill-orange-500" />}
        />
        <SummaryCard
          label="कुल स्टॉक वैल्यू (₹)"
          value={fmt2(productSummary.totalStockValue)}
          bg="bg-gradient-to-br from-white to-purple-50"
          border="border-purple-100"
          labelColor="text-purple-700"
          icon={
            <span className="relative flex items-center justify-center">
              <Shield size={34} strokeWidth={1.8} className="text-purple-600 fill-purple-100" />
              <IndianRupee size={14} strokeWidth={2.5} className="absolute text-purple-600" />
            </span>
          }
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
              placeholder="प्रोडक्ट नाम / HSN कोड से खोजें"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <FilterSelect value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} className="sm:w-[210px]">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </FilterSelect>
          <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="sm:w-[190px]">
            <option>सभी स्थिति</option>
            <option>सक्रिय</option>
            <option>कम स्टॉक</option>
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
                {headers.map(([h, w]) => (
                  <th key={h} className={`px-3 py-3 text-center text-[13px] font-bold ${NAVY} border-r border-slate-200 last:border-r-0 whitespace-nowrap ${w}`}>
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
                  <td className={`${cell} ${NAVY}`}>{p.hsn}</td>
                  <td className={`${cell} ${NAVY} font-bold`}>{p.category}</td>
                  <td className={`${cell} ${NAVY}`}>{p.unit}</td>
                  <td className={`${cell} ${NAVY}`}>{fmt2(p.saleRate)}</td>
                  <td className={`${cell} ${NAVY}`}>{fmt2(p.purchaseRate)}</td>
                  <td className={`${cell} ${NAVY}`}>{fmt2(p.stock)}</td>
                  <td className={`${cell} ${NAVY}`}>{fmt2(p.stockValue)}</td>
                  <td className={cell}>
                    <span className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${statusStyle[p.status] || statusStyle['सक्रिय']}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className={cell}>
                    <div className="flex items-center justify-center gap-3">
                      <button type="button" aria-label="संपादित करें" onClick={() => pushToast('प्रोडक्ट संपादन फॉर्म खुलेगा', 'info')} className="text-blue-700 hover:text-blue-900">
                        <Pencil size={16} />
                      </button>
                      <button type="button" aria-label="हटाएँ" onClick={() => pushToast('प्रोडक्ट हटाया गया', 'warn')} className="text-red-600 hover:text-red-800">
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
      <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 flex items-center justify-between gap-4">
        <div className={`text-[13px] ${NAVY}`}>
          <p className="flex items-center gap-2 font-bold mb-2">
            <Info size={18} />
            नोट:
          </p>
          <ul className="list-disc pl-9 space-y-1.5 font-medium">
            <li>स्टॉक मात्रा ऑटो अपडेट होती है (खरीद, बिक्री, रिटर्न के अनुसार)।</li>
            <li>निष्क्रिय प्रोडक्ट बिक्री/खरीद में दिखाई नहीं देंगे।</li>
            <li>प्रोडक्ट हटाने पर पुराना डेटा सुरक्षित रहेगा।</li>
          </ul>
        </div>
        <img src={noteImg} alt="" className="h-24 w-auto shrink-0 hidden sm:block select-none" />
      </div>
      </div>

      {/* ===================== MOBILE (prototype: SCR-006) ===================== */}
      <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
        <MobileHeader />

        <main className="flex-1 overflow-y-auto overscroll-contain px-[clamp(12px,4vw,28px)] pt-1 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* title */}
          <div className="text-center mb-3">
            <h1 className={`text-[17px] sm:text-xl font-bold ${NAVY} leading-tight`}>प्रोडक्ट मास्टर (SCR-006)</h1>
            <p className={`text-xs sm:text-sm font-semibold ${NAVY} mt-0.5`}>सभी प्रोडक्ट की जानकारी यहाँ प्रवंधित करें</p>
          </div>

          {/* add product */}
          <button
            type="button"
            onClick={() => pushToast('नया प्रोडक्ट जोड़ने का फॉर्म खुलेगा', 'info')}
            className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-brandGreen-700 hover:bg-brandGreen-800 active:scale-[0.99] transition text-white text-sm font-bold focus-ring"
          >
            <Plus size={18} />
            नया प्रोडक्ट जोड़ें
          </button>

          {/* search + filter */}
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_STEP) }}
                placeholder="प्रोडक्ट नाम / HSN कोड से खोजें"
                aria-label="प्रोडक्ट खोजें"
                className="w-full h-11 rounded-lg border border-slate-300 bg-white pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brandGreen-500 focus:ring-1 focus:ring-brandGreen-500"
              />
              {query && (
                <button type="button" aria-label="खोज साफ़ करें" onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="button"
              aria-label="फिल्टर"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((v) => !v)}
              className={`relative shrink-0 h-11 w-11 inline-flex items-center justify-center rounded-lg border bg-white focus-ring ${showFilters ? 'border-brandGreen-600' : 'border-slate-300'} ${NAVY}`}
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brandGreen-700 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* filter panel */}
          {showFilters && (
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <select value={category} onChange={(e) => { setCategory(e.target.value); setVisible(PAGE_STEP) }} className={M_SELECT} aria-label="श्रेणी">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${NAVY}`} />
              </div>
              <div className="relative">
                <select value={status} onChange={(e) => { setStatus(e.target.value); setVisible(PAGE_STEP) }} className={M_SELECT} aria-label="स्थिति">
                  <option>सभी स्थिति</option>
                  <option>सक्रिय</option>
                  <option>कम स्टॉक</option>
                  <option>निष्क्रिय</option>
                </select>
                <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${NAVY}`} />
              </div>
              <button type="button" onClick={resetFilters} className={`sm:col-span-2 h-10 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold ${NAVY} focus-ring`}>
                <RefreshCw size={15} /> रीसेट करें
              </button>
            </div>
          )}

          {/* summary cards (tap to quick-filter) */}
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:gap-3">
            <MSummary
              label="कुल प्रोडक्ट"
              value={productSummary.total}
              bg="bg-gradient-to-br from-white to-blue-50"
              border="border-blue-100"
              labelColor="text-blue-700"
              onClick={resetFilters}
              icon={<Package size={28} strokeWidth={1.8} className="text-blue-600 fill-blue-100" />}
            />
            <MSummary
              label="सक्रिय प्रोडक्ट"
              value={productSummary.active}
              bg="bg-gradient-to-br from-white to-green-50"
              border="border-green-100"
              labelColor="text-green-700"
              active={status === 'सक्रिय'}
              onClick={() => quickStatus('सक्रिय')}
              icon={<ShieldCheck size={28} strokeWidth={1.8} className="text-green-600" />}
            />
            <MSummary
              label="कुल स्टॉक वैल्यू (₹)"
              value={fmt2(productSummary.totalStockValue)}
              bg="bg-gradient-to-br from-white to-purple-50"
              border="border-purple-100"
              labelColor="text-purple-700"
              icon={<Landmark size={28} strokeWidth={1.8} className="text-purple-600" />}
            />
            <MSummary
              label="कम स्टॉक वाले प्रोडक्ट"
              value={pad2(productSummary.lowStock)}
              bg="bg-gradient-to-br from-white to-orange-50"
              border="border-orange-100"
              labelColor="text-orange-600"
              active={status === 'कम स्टॉक'}
              onClick={() => quickStatus('कम स्टॉक')}
              icon={<AlertTriangle size={26} strokeWidth={2} className="text-white fill-orange-500" />}
            />
          </div>

          {/* product list */}
          <div className="mt-4 flex items-baseline justify-between">
            <h2 className={`text-sm font-bold ${NAVY}`}>प्रोडक्ट सूची</h2>
            {isFiltered && <span className="text-[11px] font-semibold text-slate-500">{filtered.length} परिणाम</span>}
          </div>

          <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {mobileRows.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => pushToast('प्रोडक्ट विवरण खुलेगा', 'info')}
                  className="w-full text-left rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm active:bg-slate-50 transition focus-ring"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-[15px] font-bold ${NAVY} truncate`}>{i + 1}. {p.name}</p>
                    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${statusStyle[p.status] || statusStyle['सक्रिय']}`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-600">HSN: {p.hsn} &nbsp;|&nbsp; Unit: {p.unit}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-600 font-semibold">स्टॉक: <span className={`font-bold ${NAVY}`}>{fmt2(p.stock)}</span></span>
                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                      रेट (₹): <span className={`font-bold ${NAVY}`}>{fmt2(p.saleRate)}</span>
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">कोई रिकॉर्ड नहीं मिला</p>
          )}

          {filtered.length > visible && (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_STEP)}
              className={`mt-3 w-full h-11 rounded-lg border border-slate-300 bg-white text-sm font-semibold ${NAVY} focus-ring`}
            >
              और देखें ({filtered.length - visible})
            </button>
          )}
        </main>
      </div>
    </Layout>
  )
}