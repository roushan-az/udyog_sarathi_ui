import React, { useState } from 'react'
import {
  Search, RefreshCcw, SlidersHorizontal, FileSpreadsheet, Printer, Settings,
  ChevronDown, MoreHorizontal, Package, Boxes, IndianRupee, AlertTriangle,
  XCircle, BarChart3, Info, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import Layout from '../components/layout/Layout'
import { stockSummary, stockQuickStats, stockCategoryValue } from '../data/mockData'
import { formatINR, formatNumber } from '../utils/format'

/* ---------- Design tokens (same family as Expense / Receipt / Payment / Transfer) ---------- */
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

export default function StockSummary() {
  const [tab, setTab] = useState('सभी उत्पाद')
  const [query, setQuery] = useState('')
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(1)

  const rows = stockSummary.filter((s) => {
    if (tab === 'लो स्टॉक' && s.status !== 'लो स्टॉक') return false
    if (tab === 'आउट ऑफ स्टॉक' && s.status !== 'आउट ऑफ स्टॉक') return false
    if (!query) return true
    return s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())
  })
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

  const headers = [
    ['उत्पाद का नाम\n(कोड / श्रेणी)', 'left'],
    ['ओपनिंग स्टॉक\n(Qty)'],
    ['खरीद (Qty)\n(इस माह)'],
    ['बिक्री (Qty)\n(इस माह)'],
    ['रिटर्न (Qty)\n(इस माह)'],
    ['ट्रांसफर (Qty)\n(±)'],
    ['उपलब्ध स्टॉक\n(Qty)'],
    ['स्टॉक मूल्य\n(₹)'],
    ['स्थिति'],
    ['कार्यवाही'],
  ]

  const top5 = [...stockSummary].sort((a, b) => b.available - a.available).slice(0, 5)
  const catTotal = stockCategoryValue.reduce((a, c) => a + c.value, 0)

  return (
    <Layout title="स्टॉक सारांश" subtitle="आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें">
      {/* ---------------- Page header ---------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex items-center rounded-lg px-3.5 py-2 text-[13px] font-bold text-white leading-none" style={{ background: C.green }}>
            SCR-012
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: C.text }}>स्टॉक सारांश (Stock Summary)</h1>
            <p className="text-[13px] font-medium mt-0.5" style={{ color: C.muted }}>आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <OutlineBtn icon={FileSpreadsheet} iconColor="#16a34a">Excel में निर्यात करें</OutlineBtn>
          <OutlineBtn icon={Printer} iconColor="#2563eb">प्रिंट करें</OutlineBtn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_268px] gap-4">
        {/* ================= LEFT ================= */}
        <div className="min-w-0 space-y-4">
          {/* Filters */}
          <div className="rounded-xl bg-white p-3 flex flex-col lg:flex-row lg:items-end gap-3" style={{ border: `1px solid ${C.border}` }}>
            <div className="relative flex-1 min-w-0 lg:max-w-[330px]">
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                placeholder="उत्पाद का नाम / कोड खोजें"
                className="w-full h-12 rounded-lg border bg-white pl-4 pr-11 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                style={{ borderColor: C.field, color: C.text }}
              />
              <Search size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
            </div>
            <FilterSelect label="श्रेणी (Category)" />
            <FilterSelect label="ब्रांड / यूनिट" />
            <OutlineBtn icon={SlidersHorizontal} iconColor={C.label} iconRight tall>और फिल्टर</OutlineBtn>
            <OutlineBtn icon={RefreshCcw} iconColor={C.label} tall onClick={() => { setQuery(''); setTab('सभी उत्पाद'); setPage(1) }}>रीसेट करें</OutlineBtn>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {stats.map((s) => <StatBox key={s.label} {...s} tone={STAT_TONES[s.tone]} />)}
          </div>

          {/* Tabs + column settings */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {TABS.map((t) => (
                <button key={t} type="button" onClick={() => { setTab(t); setPage(1) }}
                  className="px-4 h-9 rounded-md text-[13px] font-semibold whitespace-nowrap"
                  style={tab === t ? { background: C.green, color: '#fff' } : { color: C.text }}>
                  {t}
                </button>
              ))}
            </div>
            <OutlineBtn icon={Settings} iconColor={C.label} tall>कॉलम सेटिंग</OutlineBtn>
          </div>

          {/* Table (desktop) */}
          <div className="hidden md:block rounded-lg bg-white overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px] border-collapse">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {headers.map(([h, align]) => (
                      <th key={h} className={`px-3 py-3 font-semibold whitespace-pre-line leading-snug ${align === 'left' ? 'text-left pl-4' : 'text-center'}`} style={{ color: C.text }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => {
                    const t = st(r.status)
                    return (
                      <tr key={r.code} style={{ borderTop: `1px solid ${C.border}` }}>
                        <td className="pl-4 pr-3 h-[54px]" style={{ borderLeft: `3px solid ${t.strip}` }}>
                          <p className="text-[13px] font-semibold" style={{ color: C.text }}>{r.name}</p>
                          <p className="text-[11px]" style={{ color: C.muted }}>{r.code} | {r.category}</p>
                        </td>
                        <Num color={C.text}>{formatNumber(r.opening)}</Num>
                        <Num color="#16a34a">{formatNumber(r.purchase)}</Num>
                        <Num color="#dc2626">{formatNumber(r.sale)}</Num>
                        <Num color="#dc2626">{formatNumber(r.returns)}</Num>
                        <Num color={C.text}>{r.transfer > 0 ? `+${r.transfer}` : r.transfer}</Num>
                        <Num color={t.qty} bold>{formatNumber(r.available)}</Num>
                        <Num color={C.text}>{formatINR(r.value)}</Num>
                        <td className="px-2 text-center">
                          <span className="inline-block rounded-md px-3 py-1 text-[12px] font-medium whitespace-nowrap"
                            style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-2 text-center">
                          <button type="button" aria-label="और विकल्प" style={{ color: C.text }}><MoreHorizontal size={18} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards (mobile) */}
          <div className="md:hidden space-y-2.5">
            {pageRows.map((r) => {
              const t = st(r.status)
              return (
                <div key={r.code} className="rounded-xl bg-white p-3.5" style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${t.strip}` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold" style={{ color: C.text }}>{r.name}</p>
                      <p className="text-[11px]" style={{ color: C.muted }}>{r.code} | {r.category}</p>
                    </div>
                    <span className="rounded-md px-2.5 py-0.5 text-[12px] font-medium" style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.text }}>{r.status}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-[12.5px]" style={{ color: C.muted }}>
                    <span>उपलब्ध: <b style={{ color: t.qty }}>{formatNumber(r.available)}</b></span>
                    <span>मूल्य: <b style={{ color: C.text }}>{formatINR(r.value)}</b></span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Formula note */}
          <div className="flex items-center gap-2 rounded-md px-3 h-9 text-[12px] font-medium"
            style={{ background: '#eef7f0', border: '1px solid #d7ebdc', color: C.green }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}><Info size={11} /></span>
            स्टॉक की गणना: ओपनिंग स्टॉक + खरीद + ट्रांसफर इन + रिटर्न - बिक्री - ट्रांसफर आउट - रिटर्न
          </div>

          {/* Footer: total + pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12.5px] font-medium" style={{ color: C.text }}>कुल रिकॉर्ड: {rows.length}</p>
            <div className="flex items-center gap-3">
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
        </div>

        {/* ================= RIGHT ================= */}
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
                <li key={s.code} className="flex justify-between" style={{ color: C.text }}>
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
    </Layout>
  )
}

/* ====================== helpers ====================== */

function OutlineBtn({ icon: Icon, iconColor, iconRight, tall, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 text-[12.5px] font-semibold whitespace-nowrap ${tall ? 'h-12' : 'h-11'}`}
      style={{ borderColor: C.field, color: C.label }}>
      {!iconRight && <Icon size={19} style={{ color: iconColor }} />}
      {children}
      {iconRight && <Icon size={18} style={{ color: iconColor }} />}
    </button>
  )
}

function FilterSelect({ label }) {
  return (
    <div className="rounded-lg px-2.5 pt-1.5 pb-2 lg:w-[190px]" style={{ border: `1px solid ${C.border}` }}>
      <p className="text-[12px] font-semibold mb-1" style={{ color: C.text }}>{label}</p>
      <div className="relative">
        <select defaultValue="सभी"
          className="w-full h-9 appearance-none rounded-md border bg-white pl-3 pr-8 text-[12.5px] font-semibold outline-none"
          style={{ borderColor: C.field, color: C.text }}>
          <option>सभी</option>
        </select>
        <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
      </div>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, sub, tone }) {
  return (
    <div className="rounded-xl px-3 py-3" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
      <div className="flex items-center gap-2.5">
        <span className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: tone.circle }}>
          <Icon size={21} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold leading-tight" style={{ color: tone.label || C.text }}>{label}</p>
          <p className="text-[21px] font-bold leading-tight mt-0.5 whitespace-nowrap" style={{ color: C.text }}>{value}</p>
        </div>
      </div>
      <p className="text-[11.5px] text-center mt-2" style={{ color: C.muted }}>{sub}</p>
    </div>
  )
}

function Num({ children, color, bold }) {
  return (
    <td className="px-2 text-center text-[13px]" style={{ color, fontWeight: bold ? 700 : 600 }}>{children}</td>
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