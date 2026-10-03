import React, { useMemo, useState } from 'react'
import {
  Search, RefreshCcw, SlidersHorizontal, FileSpreadsheet, Printer, Settings, Filter, Download, Clock,
  ChevronDown, ChevronRight, MoreHorizontal, Package, Boxes, IndianRupee, AlertTriangle,
  XCircle, BarChart3, Info, ChevronLeft, ChevronsLeft, ChevronsRight, ArrowUpDown,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { stockSummary, stockQuickStats, stockCategoryValue } from '../data/mockData'
import { formatINR, formatNumber } from '../utils/format'

/* ---------- Design tokens ---------- */
const C = {
  green: '#14612e',
  greenSoft: '#eef7f0',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e9ecf0',
  field: '#d9dde3',
}

const TABS = ['सभी उत्पाद', 'लो स्टॉक', 'आउट ऑफ स्टॉक', 'स्टॉक मूवमेंट']

const STAT_TONES = {
  blue: { bg: '#f3f7ff', border: '#d6e2fb', circle: '#3b82f6' },
  green: { bg: '#f1faf3', border: '#cfe8d6', circle: '#4caf50' },
  purple: { bg: '#f7f3ff', border: '#e0d5f7', circle: '#7c3aed', label: '#6d28d9' },
  orange: { bg: '#fffaf0', border: '#fde3bd', circle: '#f59e0b' },
  red: { bg: '#fff4f4', border: '#fbd0d0', circle: '#ef4444', label: '#dc2626' },
  sky: { bg: '#f1fbff', border: '#cdeefb', circle: '#06b6d4' },
}

const STATUS = {
  'लो स्टॉक': { strip: '#f59e0b', qty: '#f59e0b', bg: '#fff7ed', border: '#fcd9a6', text: '#ea580c' },
  'आउट ऑफ स्टॉक': { strip: '#ef4444', qty: '#dc2626', bg: '#fef2f2', border: '#fbc4c4', text: '#dc2626' },
}
const OK = { strip: '#15803d', qty: '#16a34a', bg: '#f0fdf4', border: '#bbe3c6', text: '#15803d' }
const st = (s) => STATUS[s] || OK
const statusLabel = (s) => (STATUS[s] ? s : 'उपलब्ध')

/* Desktop table columns. `optional` ones can be toggled from "कॉलम सेटिंग". */
const COLUMNS = [
  { key: 'name', label: 'उत्पाद का नाम\n(कोड / श्रेणी)', align: 'left' },
  { key: 'opening', label: 'ओपनिंग स्टॉक\n(Qty)' },
  { key: 'purchase', label: 'खरीद (Qty)\n(इस माह)' },
  { key: 'sale', label: 'बिक्री (Qty)\n(इस माह)' },
  { key: 'returns', label: 'रिटर्न (Qty)\n(इस माह)', optional: true, title: 'रिटर्न' },
  { key: 'transfer', label: 'ट्रांसफर (Qty)\n(±)', optional: true, title: 'ट्रांसफर' },
  { key: 'available', label: 'उपलब्ध स्टॉक\n(Qty)' },
  { key: 'value', label: 'स्टॉक मूल्य\n(₹)', optional: true, title: 'स्टॉक मूल्य' },
  { key: 'status', label: 'स्थिति', optional: true, title: 'स्थिति' },
  { key: 'action', label: 'कार्यवाही' },
]

/* Mobile list grid: name | opening | purchase | sale | available | chevron */
const M_COLS = 'minmax(0,1.9fr) repeat(3,minmax(0,1fr)) minmax(0,1.3fr) 16px'

const noScrollbar = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

export default function StockSummary() {
  const { pushToast } = useApp()
  const [tab, setTab] = useState('सभी उत्पाद')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('सभी')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showCols, setShowCols] = useState(false)
  const [hiddenCols, setHiddenCols] = useState({})
  const [openRow, setOpenRow] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  const categories = useMemo(() => ['सभी', ...Array.from(new Set(stockSummary.map((s) => s.category)))], [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = stockSummary.filter((s) => {
      if (tab === 'लो स्टॉक' && s.status !== 'लो स्टॉक') return false
      if (tab === 'आउट ऑफ स्टॉक' && s.status !== 'आउट ऑफ स्टॉक') return false
      if (tab === 'स्टॉक मूवमेंट' && !(s.purchase > 0 || s.sale > 0)) return false
      if (category !== 'सभी' && s.category !== category) return false
      if (!q) return true
      return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
    })
    if (tab === 'स्टॉक मूवमेंट') list.sort((a, b) => b.purchase + b.sale - (a.purchase + a.sale))
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'hi'))
    else if (sortBy === 'low') list.sort((a, b) => a.available - b.available)
    else if (sortBy === 'high') list.sort((a, b) => b.available - a.available)
    return list
  }, [tab, query, category, sortBy])

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const curPage = Math.min(page, totalPages)
  const pageRows = rows.slice((curPage - 1) * pageSize, curPage * pageSize)

  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    return [1, 2, 3, 4, 5, '…', totalPages]
  })()

  const stats = [
    { icon: Package, tone: 'blue', label: 'कुल उत्पाद', value: stockQuickStats.totalProducts, sub: 'सभी उत्पाद' },
    { icon: Boxes, tone: 'green', label: 'कुल उपलब्ध स्टॉक', value: formatNumber(stockQuickStats.totalAvailable), sub: 'कुल मात्रा (Qty)' },
    { icon: IndianRupee, tone: 'purple', label: 'कुल स्टॉक मूल्य', value: formatINR(stockQuickStats.totalValue), sub: 'कीमत (₹)' },
    { icon: AlertTriangle, tone: 'orange', label: 'लो स्टॉक', value: stockQuickStats.lowStock, sub: 'ध्यान देने योग्य' },
    { icon: XCircle, tone: 'red', label: 'आउट ऑफ स्टॉक', value: stockQuickStats.outOfStock, sub: 'स्टॉक उपलब्ध नहीं' },
    { icon: BarChart3, tone: 'sky', label: 'आज की बिक्री (Qty)', value: stockQuickStats.todaySaleQty, sub: 'आज बेची गई मात्रा' },
  ]

  const visibleCols = COLUMNS.filter((c) => !hiddenCols[c.key])
  const top5 = [...stockSummary].sort((a, b) => b.available - a.available).slice(0, 5)
  const catTotal = stockCategoryValue.reduce((a, c) => a + c.value, 0)

  const resetAll = () => { setQuery(''); setTab('सभी उत्पाद'); setCategory('सभी'); setPage(1) }
  const pickTab = (t) => { setTab(t); setPage(1); setOpenRow(null) }

  /* Excel-compatible CSV export of the currently filtered list */
  const exportExcel = () => {
    const head = ['कोड', 'उत्पाद', 'श्रेणी', 'ओपनिंग', 'खरीद', 'बिक्री', 'रिटर्न', 'ट्रांसफर', 'उपलब्ध', 'मूल्य (₹)', 'स्थिति']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const body = rows.map((r) => [r.code, r.name, r.category, r.opening, r.purchase, r.sale, r.returns, r.transfer, r.available, r.value, statusLabel(r.status)])
    const csv = '\uFEFF' + [head, ...body].map((l) => l.map(esc).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'stock-summary.csv'
    a.click()
    URL.revokeObjectURL(url)
    pushToast('स्टॉक सारांश एक्सपोर्ट हो गया')
  }

  const showMovement = () => {
    pickTab('स्टॉक मूवमेंट')
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- shared blocks (used by both the mobile and desktop screens) ---------- */

  const filtersEl = (
    <div className="flex flex-wrap lg:flex-nowrap items-center lg:items-end gap-2.5 lg:gap-3 lg:rounded-xl lg:bg-white lg:p-3 lg:border" style={{ borderColor: C.border }}>
      <div className="relative flex-1 min-w-0 lg:max-w-[330px]">
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          placeholder="उत्पाद का नाम / कोड खोजें"
          className="w-full h-11 lg:h-12 rounded-lg border bg-white pl-4 pr-11 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
          style={{ borderColor: C.field, color: C.text }}
        />
        <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
      </div>

      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
        className="lg:hidden shrink-0 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg border bg-white text-[13px] font-semibold"
        style={{ borderColor: showFilters ? C.green : C.field, color: C.label }}
      >
        फिल्टर <Filter size={18} />
      </button>

      <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex basis-full lg:basis-auto flex-col sm:flex-row lg:items-end gap-2.5 lg:gap-3`}>
        <FilterSelect label="श्रेणी (Category)" value={category} onChange={(v) => { setCategory(v); setPage(1) }} options={categories} />
        <FilterSelect label="ब्रांड / यूनिट" options={['सभी']} />
        <OutlineBtn icon={RefreshCcw} iconColor={C.label} tall onClick={resetAll}>रीसेट करें</OutlineBtn>
      </div>
    </div>
  )

  const statsEl = (
    <div className="grid grid-cols-2 min-[360px]:grid-cols-3 gap-2 sm:gap-3">
      {stats.map((s) => <StatBox key={s.label} {...s} tone={STAT_TONES[s.tone]} />)}
    </div>
  )

  const tabsEl = (mobile) => (
    <div className="relative flex items-center justify-between gap-2">
      <div role="tablist" className={`flex-1 min-w-0 flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto ${noScrollbar}`}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => pickTab(t)}
            className={`px-3 sm:px-4 h-9 text-[12px] sm:text-[13px] font-semibold whitespace-nowrap shrink-0 ${mobile ? 'rounded-full' : 'rounded-md'}`}
            style={tab === t ? { background: C.green, color: '#fff' } : { color: C.label }}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setShowCols((v) => !v)}
        aria-label={mobile ? 'क्रमबद्ध करें' : 'कॉलम सेटिंग'}
        className={`shrink-0 inline-flex items-center justify-center gap-2 text-[12.5px] font-semibold ${mobile ? 'h-9 w-9' : 'h-12 px-4 rounded-lg border bg-white'}`}
        style={{ borderColor: C.field, color: C.label }}
      >
        {mobile ? <SlidersHorizontal size={20} /> : <><Settings size={19} />कॉलम सेटिंग</>}
      </button>

      {showCols && (
        <div className="absolute right-0 top-full mt-1 z-20 w-56 rounded-lg bg-white p-3 shadow-lg" style={{ border: `1px solid ${C.border}` }}>
          {mobile ? (
            <>
              <p className="text-[12px] font-bold mb-2 flex items-center gap-1.5" style={{ color: C.text }}><ArrowUpDown size={13} />क्रमबद्ध करें</p>
              {[['default', 'डिफ़ॉल्ट'], ['name', 'नाम (अ → ज्ञ)'], ['low', 'उपलब्ध स्टॉक: कम → ज़्यादा'], ['high', 'उपलब्ध स्टॉक: ज़्यादा → कम']].map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 py-1.5 text-[12.5px] cursor-pointer" style={{ color: C.text }}>
                  <input type="radio" name="stock-sort" checked={sortBy === k} onChange={() => { setSortBy(k); setPage(1); setShowCols(false) }} className="accent-green-700" />
                  {l}
                </label>
              ))}
            </>
          ) : (
            <>
              <p className="text-[12px] font-bold mb-2" style={{ color: C.text }}>दिखाने वाले कॉलम</p>
              {COLUMNS.filter((c) => c.optional).map((c) => (
                <label key={c.key} className="flex items-center gap-2 py-1 text-[12.5px] cursor-pointer" style={{ color: C.text }}>
                  <input type="checkbox" checked={!hiddenCols[c.key]} onChange={() => setHiddenCols((p) => ({ ...p, [c.key]: !p[c.key] }))} className="accent-green-700" />
                  {c.title}
                </label>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )

  const formulaEl = (
    <div
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-[clamp(11px,3vw,12.5px)] lg:text-[12px] font-medium leading-snug"
      style={{ background: C.greenSoft, border: '1px solid #d7ebdc', color: C.green }}
    >
      <span className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}><Info size={11} /></span>
      <span className="lg:hidden">स्टॉक की गणना: ओपनिंग स्टॉक + खरीद - बिक्री - रिटर्न</span>
      <span className="hidden lg:inline">स्टॉक की गणना: ओपनिंग स्टॉक + खरीद + ट्रांसफर इन + रिटर्न - बिक्री - ट्रांसफर आउट - रिटर्न</span>
    </div>
  )

  const pagerEl = (className) => (
    <div className={`${className} flex-wrap items-center justify-between gap-3`}>
      <p className="text-[12.5px] font-medium" style={{ color: C.text }}>कुल रिकॉर्ड: {rows.length}</p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[12px]" style={{ color: C.text }}>प्रति पेज</span>
        <div className="relative">
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
            className="appearance-none h-9 rounded-md border bg-white pl-3 pr-8 text-[12.5px] font-semibold outline-none"
            style={{ borderColor: C.field, color: C.text }}>
            {[10, 20, 50, 100].map((n) => <option key={n}>{n}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
        </div>
        <div className="flex items-center gap-1.5">
          <PageBtn onClick={() => setPage(1)} aria="पहला पेज"><ChevronsLeft size={14} /></PageBtn>
          <PageBtn onClick={() => setPage(Math.max(1, curPage - 1))} aria="पिछला पेज"><ChevronLeft size={14} /></PageBtn>
          {pageNumbers.map((n, i) => n === '…'
            ? <span key={`e${i}`} className="px-1 text-[12px]" style={{ color: C.muted }}>…</span>
            : <PageBtn key={n} active={n === curPage} onClick={() => setPage(n)}>{n}</PageBtn>)}
          <PageBtn onClick={() => setPage(Math.min(totalPages, curPage + 1))} aria="अगला पेज"><ChevronRight size={14} /></PageBtn>
          <PageBtn onClick={() => setPage(totalPages)} aria="आखिरी पेज"><ChevronsRight size={14} /></PageBtn>
        </div>
      </div>
    </div>
  )

  return (
    <Layout title="स्टॉक सारांश" subtitle="आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें">
      {/* ===================== DESKTOP ===================== */}
      <div className="hidden lg:block">
        <PageHeader
          code="SCR-012"
          title="स्टॉक सारांश (Stock Summary)"
          subtitle="आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें"
          actions={
            <>
              <Button variant="outline" icon={FileSpreadsheet} size="sm" onClick={exportExcel}>Excel में निर्यात करें</Button>
              <Button variant="outline" icon={Printer} size="sm" onClick={() => window.print()}>प्रिंट करें</Button>
            </>
          }
        />

        <div className="grid grid-cols-[minmax(0,1fr)_268px] gap-4">
          {/* LEFT */}
          <div className="min-w-0 space-y-4">
            {filtersEl}
            {statsEl}
            {tabsEl(false)}

            <div className="rounded-lg bg-white overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px] border-collapse">
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {visibleCols.map((c) => (
                        <th key={c.key} className={`px-3 py-3 font-semibold whitespace-pre-line leading-snug ${c.align === 'left' ? 'text-left pl-4' : 'text-center'}`} style={{ color: C.text }}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length === 0 && (
                      <tr><td colSpan={visibleCols.length} className="text-center py-8 text-[13px]" style={{ color: C.muted }}>कोई उत्पाद नहीं मिला</td></tr>
                    )}
                    {pageRows.map((r) => {
                      const t = st(r.status)
                      return (
                        <tr key={r.code} style={{ borderTop: `1px solid ${C.border}` }}>
                          {visibleCols.map((c) => {
                            switch (c.key) {
                              case 'name':
                                return (
                                  <td key={c.key} className="pl-4 pr-3 h-[54px]" style={{ borderLeft: `3px solid ${t.strip}` }}>
                                    <p className="text-[13px] font-semibold" style={{ color: C.text }}>{r.name}</p>
                                    <p className="text-[11px]" style={{ color: C.muted }}>{r.code} | {r.category}</p>
                                  </td>
                                )
                              case 'opening': return <Num key={c.key} color={C.text}>{formatNumber(r.opening)}</Num>
                              case 'purchase': return <Num key={c.key} color="#16a34a">{formatNumber(r.purchase)}</Num>
                              case 'sale': return <Num key={c.key} color="#dc2626">{formatNumber(r.sale)}</Num>
                              case 'returns': return <Num key={c.key} color="#dc2626">{formatNumber(r.returns)}</Num>
                              case 'transfer': return <Num key={c.key} color={C.text}>{r.transfer > 0 ? `+${r.transfer}` : r.transfer}</Num>
                              case 'available': return <Num key={c.key} color={t.qty} bold>{formatNumber(r.available)}</Num>
                              case 'value': return <Num key={c.key} color={C.text}>{formatINR(r.value)}</Num>
                              case 'status':
                                return (
                                  <td key={c.key} className="px-2 text-center">
                                    <span className="inline-block rounded-md px-3 py-1 text-[12px] font-medium whitespace-nowrap"
                                      style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}>
                                      {r.status}
                                    </span>
                                  </td>
                                )
                              default:
                                return (
                                  <td key={c.key} className="px-2 text-center">
                                    <button type="button" aria-label="और विकल्प" style={{ color: C.text }}><MoreHorizontal size={18} /></button>
                                  </td>
                                )
                            }
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {formulaEl}
            {pagerEl('flex')}
          </div>

          {/* RIGHT */}
          <div className="space-y-3.5">
            <Panel title="स्टॉक सारांश (त्वरित नजर)">
              <div className="space-y-2.5 text-[12.5px]">
                {[
                  ['कुल उत्पाद', stockQuickStats.totalProducts],
                  ['कुल उपलब्ध स्टॉक', formatNumber(stockQuickStats.totalAvailable)],
                  ['कुल स्टॉक मूल्य', formatINR(stockQuickStats.totalValue)],
                  ['लो स्टॉक वाले उत्पाद', stockQuickStats.lowStock],
                  ['आउट ऑफ स्टॉक', stockQuickStats.outOfStock],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between" style={{ color: C.text }}>
                    <span>{l}</span><span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="टॉप 5 अधिक स्टॉक वाले उत्पाद">
              <ol className="space-y-3 text-[12.5px]">
                {top5.map((s, i) => (
                  <li key={s.code} className="flex justify-between gap-2" style={{ color: C.text }}>
                    <span>{i + 1}. {s.name}</span>
                    <span className="font-semibold">{formatNumber(s.available)}</span>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="स्टॉक मूल्य (श्रेणी अनुसार)">
              <div className="flex items-center gap-2">
                <div className="w-[104px] h-[104px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stockCategoryValue} dataKey="value" nameKey="name" innerRadius={30} outerRadius={50} paddingAngle={1} stroke="none">
                        {stockCategoryValue.map((c) => <Cell key={c.name} fill={c.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => formatINR(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="flex-1 min-w-0 space-y-2.5 text-[11.5px]">
                  {stockCategoryValue.map((c) => (
                    <li key={c.name} className="flex items-center gap-2" style={{ color: C.text }}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-medium whitespace-nowrap">{formatINR(c.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between mt-3 text-[12.5px] font-bold" style={{ color: C.text }}>
                <span>कुल</span><span>{formatINR(catTotal)}</span>
              </div>
            </Panel>

            <div className="rounded-xl bg-white p-4" style={{ border: `1px solid ${C.border}` }}>
              <h3 className="text-[13.5px] font-bold mb-3" style={{ color: C.text }}>महत्वपूर्ण नोट</h3>
              <ul className="list-disc pl-4 space-y-2 text-[11.5px]" style={{ color: C.text }}>
                <li>लो स्टॉक वाले उत्पादों का समय पर ऑर्डर दें।</li>
                <li>आउट ऑफ स्टॉक उत्पादों की उपलब्धता जाँचें।</li>
                <li>स्टॉक मूवमेंट टैब में विस्तृत जानकारी देखें।</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-semibold text-green-800 mt-3">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </div>

      {/* ===================== MOBILE (SCR-012 prototype) ===================== */}
      {/* Full-bleed phone screen: fixed MobileHeader + scrolling body, sits above Layout's bottom nav */}
      <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
        <MobileHeader />

        <main className="flex-1 overflow-y-auto px-[clamp(12px,4vw,28px)] pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Title block */}
          <div className="flex flex-col items-center text-center mb-[clamp(12px,3.5vw,20px)]">
            <span className="inline-flex items-center rounded-md px-[clamp(14px,4vw,20px)] py-[clamp(4px,1.2vw,7px)] text-[clamp(12px,3.4vw,15px)] font-bold text-white leading-none" style={{ background: C.green }}>
              SCR-012
            </span>
            <h1 className="mt-[clamp(8px,2.4vw,14px)] text-[clamp(18px,5.4vw,28px)] font-bold leading-tight" style={{ color: C.label }}>
              स्टॉक सारांश (Stock Summary)
            </h1>
            <p className="mt-1.5 text-[clamp(11.5px,3.3vw,15px)] font-semibold leading-snug" style={{ color: C.label }}>
              आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें
            </p>
          </div>

          <div className="space-y-[clamp(10px,3vw,16px)]">
            {filtersEl}
            {statsEl}
            {tabsEl(true)}

            {/* Product list */}
            <div>
              <div
                className="grid items-center rounded-lg px-3 py-2.5 gap-x-1 text-center leading-tight"
                style={{ gridTemplateColumns: M_COLS, background: C.greenSoft, border: `1px solid ${C.border}`, color: C.text }}
              >
                <div className="text-left">
                  <p className="text-[clamp(10.5px,3vw,13px)] font-semibold">उत्पाद नाम</p>
                  <p className="text-[clamp(9.5px,2.7vw,12px)] mt-1">कोड / श्रेणी</p>
                </div>
                <div><p className="text-[clamp(10.5px,3vw,13px)] font-semibold">ओपनिंग स्टॉक</p><p className="text-[clamp(9.5px,2.7vw,12px)] mt-1" style={{ color: C.muted }}>(Qty)</p></div>
                <div><p className="text-[clamp(10.5px,3vw,13px)] font-semibold">खरीद (Qty)</p><p className="text-[clamp(9.5px,2.7vw,12px)] mt-1" style={{ color: C.muted }}>(इस माह)</p></div>
                <div><p className="text-[clamp(10.5px,3vw,13px)] font-semibold">बिक्री (Qty)</p><p className="text-[clamp(9.5px,2.7vw,12px)] mt-1" style={{ color: C.muted }}>(इस माह)</p></div>
                <div className="col-span-2 text-right">
                  <p className="text-[clamp(10.5px,3vw,13px)] font-semibold">उपलब्ध स्टॉक</p>
                  <p className="text-[clamp(9.5px,2.7vw,12px)] mt-1" style={{ color: C.muted }}>(Qty)</p>
                </div>
              </div>

              <div className="mt-2.5 space-y-2.5">
                {pageRows.length === 0 && (
                  <p className="text-center py-8 text-[13px]" style={{ color: C.muted }}>कोई उत्पाद नहीं मिला</p>
                )}
                {pageRows.map((r) => {
                  const t = st(r.status)
                  const open = openRow === r.code
                  return (
                    <div key={r.code} className="rounded-lg bg-white overflow-hidden" style={{ border: `1px solid ${C.border}`, borderLeft: `4px solid ${t.strip}` }}>
                      <button
                        type="button"
                        onClick={() => setOpenRow(open ? null : r.code)}
                        aria-expanded={open}
                        className="w-full grid items-center gap-x-1 pl-3 pr-2 py-3 text-left"
                        style={{ gridTemplateColumns: M_COLS }}
                      >
                        <div className="min-w-0 pr-1">
                          <p className="text-[clamp(12px,3.4vw,14.5px)] font-bold leading-snug break-words" style={{ color: C.text }}>{r.name}</p>
                          <p className="text-[clamp(10px,2.8vw,12px)] mt-1 truncate" style={{ color: C.label, opacity: 0.75 }}>{r.code} | {r.category}</p>
                        </div>
                        <MNum color={C.label}>{formatNumber(r.opening)}</MNum>
                        <MNum color="#16a34a">{formatNumber(r.purchase)}</MNum>
                        <MNum color="#dc2626">{formatNumber(r.sale)}</MNum>
                        <div className="text-center leading-tight">
                          <p className="text-[clamp(13px,3.9vw,17px)] font-bold" style={{ color: t.qty }}>{formatNumber(r.available)}</p>
                          <p className="text-[clamp(9.5px,2.7vw,12px)] font-medium mt-1" style={{ color: t.text }}>{statusLabel(r.status)}</p>
                        </div>
                        <ChevronRight size={16} className={`transition-transform ${open ? 'rotate-90' : ''}`} style={{ color: C.text }} />
                      </button>
                      {open && (
                        <div className="grid grid-cols-3 gap-2 px-3 py-2.5 text-center text-[11.5px]" style={{ background: '#f8fafc', borderTop: `1px solid ${C.border}` }}>
                          <div><p style={{ color: C.muted }}>रिटर्न (Qty)</p><p className="font-semibold mt-0.5" style={{ color: '#dc2626' }}>{formatNumber(r.returns)}</p></div>
                          <div><p style={{ color: C.muted }}>ट्रांसफर (±)</p><p className="font-semibold mt-0.5" style={{ color: C.text }}>{r.transfer > 0 ? `+${r.transfer}` : r.transfer}</p></div>
                          <div><p style={{ color: C.muted }}>स्टॉक मूल्य</p><p className="font-semibold mt-0.5" style={{ color: C.text }}>{formatINR(r.value)}</p></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {formulaEl}
            {totalPages > 1 && pagerEl('flex')}

            <div className="grid grid-cols-3 gap-2.5">
              <MobileAction icon={Download} onClick={exportExcel}>Excel में निर्यात करें</MobileAction>
              <MobileAction icon={Printer} onClick={() => window.print()}>प्रिंट करें</MobileAction>
              <MobileAction icon={Clock} onClick={showMovement}>स्टॉक मूवमेंट देखें</MobileAction>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

/* ====================== helpers ====================== */

function OutlineBtn({ icon: Icon, iconColor, tall, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 text-[12.5px] font-semibold whitespace-nowrap ${tall ? 'h-11 lg:h-12' : 'h-11'}`}
      style={{ borderColor: C.field, color: C.label }}>
      <Icon size={19} style={{ color: iconColor }} />
      {children}
    </button>
  )
}

function MobileAction({ icon: Icon, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center justify-center gap-1.5 min-h-[48px] px-2 py-2 rounded-lg border bg-white text-[clamp(10px,2.9vw,12.5px)] font-semibold leading-tight text-left"
      style={{ borderColor: C.field, color: C.label }}>
      <Icon className="shrink-0 w-[clamp(16px,4.6vw,20px)] h-[clamp(16px,4.6vw,20px)]" />
      <span className="min-w-0">{children}</span>
    </button>
  )
}

function FilterSelect({ label, value = 'सभी', onChange, options }) {
  return (
    <div className="rounded-lg px-2.5 pt-1.5 pb-2 w-full sm:flex-1 lg:flex-none lg:w-[190px] bg-white" style={{ border: `1px solid ${C.border}` }}>
      <p className="text-[12px] font-semibold mb-1" style={{ color: C.text }}>{label}</p>
      <div className="relative">
        <select value={value} onChange={(e) => onChange?.(e.target.value)}
          className="w-full h-9 appearance-none rounded-md border bg-white pl-3 pr-8 text-[12.5px] font-semibold outline-none"
          style={{ borderColor: C.field, color: C.text }}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
      </div>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, sub, tone }) {
  return (
    <div className="rounded-xl px-2 py-2.5 sm:px-3 sm:py-3 min-w-0" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
      <div className="flex items-start gap-[clamp(4px,1.4vw,10px)]">
        <span
          className="rounded-full flex items-center justify-center text-white shrink-0 w-[clamp(22px,5.8vw,44px)] h-[clamp(22px,5.8vw,44px)]"
          style={{ background: tone.circle }}
        >
          <Icon className="w-[52%] h-[52%]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[clamp(9.5px,2.7vw,12px)] font-semibold leading-tight" style={{ color: tone.label || C.text }}>{label}</p>
          <p className="text-[clamp(11px,3.05vw,21px)] font-bold leading-tight mt-0.5 whitespace-nowrap tracking-tight" style={{ color: C.text }}>{value}</p>
          <p className="text-[clamp(9.5px,2.6vw,11.5px)] leading-tight mt-1.5" style={{ color: C.muted }}>{sub}</p>
        </div>
      </div>
    </div>
  )
}

function Num({ children, color, bold }) {
  return (
    <td className="px-2 text-center text-[13px]" style={{ color, fontWeight: bold ? 700 : 600 }}>{children}</td>
  )
}

function MNum({ children, color }) {
  return (
    <p className="text-center text-[clamp(12px,3.4vw,14.5px)] font-semibold" style={{ color }}>{children}</p>
  )
}

function PageBtn({ children, active, onClick, aria }) {
  return (
    <button type="button" onClick={onClick} aria-label={aria}
      className="min-w-[30px] h-[30px] px-1.5 rounded-md border text-[12px] font-semibold inline-flex items-center justify-center"
      style={active
        ? { background: C.green, borderColor: C.green, color: '#fff' }
        : { background: '#fff', borderColor: C.field, color: C.text }}>
      {children}
    </button>
  )
}

function Panel({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-4" style={{ border: `1px solid ${C.border}` }}>
      <h3 className="text-[13.5px] font-semibold mb-3.5" style={{ color: C.green }}>{title}</h3>
      {children}
    </div>
  )
}