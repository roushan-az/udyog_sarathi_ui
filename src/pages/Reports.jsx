import React, { useState } from 'react'
import {
  FileSpreadsheet, FileText, CalendarDays, ChevronDown, Search, ArrowRight, ArrowUp,
  ShoppingCart, ShoppingBag, IndianRupee, Coins, TrendingUp, Package, AlertTriangle,
  Banknote, Landmark, ArrowDownToLine, ArrowUpToLine, Wallet, PieChart as PieIcon,
  BarChart3, Users, Box, Award, MoreHorizontal, Store, Settings, Info,
  ArrowDown, ChevronRight, SlidersHorizontal, X,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LabelList,
} from 'recharts'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import { reportsSummary, salesVsPurchase, expenseCategoryBreakup, netProfitTrend, quickViewSummary } from '../data/mockData'
import { useApp } from '../context/AppContext'

/* ---------- Design tokens (same family as the other SCR pages) ---------- */
const C = {
  green: '#14612e',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e9ecf0',
  field: '#d9dde3',
}

const inr = (v) => Number(v || 0).toLocaleString('en-IN')
const lakh = (v) => (v === 0 ? '0' : `${Math.round(v / 100000)}L`)

/* tone => card colours */
const TONES = {
  green: { bg: '#f2faf4', border: '#cfe8d6', icon: '#16a34a', circle: '#e3f3e8', title: '#15803d' },
  blue: { bg: '#f3f7ff', border: '#d6e2fb', icon: '#2563eb', circle: '#e1ebfd', title: '#1d4ed8' },
  orange: { bg: '#fff8f0', border: '#fde3bd', icon: '#ea580c', circle: '#ffecd6', title: '#c2410c' },
  red: { bg: '#fff4f4', border: '#fbd0d0', icon: '#dc2626', circle: '#fde0e0', title: '#dc2626' },
  purple: { bg: '#f8f4ff', border: '#e0d5f7', icon: '#7c3aed', circle: '#ece3fc', title: '#6d28d9' },
  gray: { bg: '#f8fafc', border: '#e2e8f0', icon: '#334155', circle: '#e8edf3', title: '#1f2937' },
}

const SUMMARY_CARDS = [
  { key: 'totalSales', label: 'कुल बिक्री (₹)', delta: 'sales', tone: 'green', icon: ShoppingCart },
  { key: 'totalPurchase', label: 'कुल खरीद (₹)', delta: 'purchase', tone: 'blue', icon: ShoppingBag },
  { key: 'totalProfit', label: 'कुल लाभ (₹)', delta: 'profit', tone: 'orange', icon: IndianRupee },
  { key: 'totalPayment', label: 'कुल भुगतान (₹)', delta: 'payment', tone: 'red', icon: IndianRupee },
  { key: 'totalExpense', label: 'कुल खर्च (₹)', delta: 'expense', tone: 'purple', icon: Coins },
  { key: 'netProfit', label: 'शुद्ध लाभ (₹)', delta: 'netProfit', tone: 'green', icon: TrendingUp },
]

const REPORTS = [
  { key: 'sales', title: 'बिक्री रिपोर्ट', desc: 'सभी बिक्री बिल की पूरी जानकारी', tone: 'green', icon: ShoppingCart },
  { key: 'purchase', title: 'खरीद रिपोर्ट', desc: 'सभी खरीद बिल की पूरी जानकारी', tone: 'blue', icon: ShoppingBag },
  { key: 'stock', title: 'स्टॉक रिपोर्ट', desc: 'स्टॉक स्थिति एवं मूल्य की जानकारी', tone: 'orange', icon: Package },
  { key: 'lowstock', title: 'लो स्टॉक रिपोर्ट', desc: 'कम स्टॉक वाले प्रोडक्ट्स की सूची', tone: 'red', icon: AlertTriangle },
  { key: 'cash', title: 'नकद बही (Cash Book)', desc: 'सभी नकद लेन-देन की जानकारी', tone: 'green', icon: Banknote },
  { key: 'bank', title: 'बैंक बही (Bank Book)', desc: 'सभी बैंक लेन-देन की जानकारी', tone: 'blue', icon: Landmark },
  { key: 'receipt', title: 'प्राप्ति रिपोर्ट', desc: 'सभी प्राप्ति (Receipts) की जानकारी', tone: 'blue', icon: ArrowDownToLine },
  { key: 'payment', title: 'भुगतान रिपोर्ट', desc: 'सभी भुगतान (Payments) की जानकारी', tone: 'purple', icon: ArrowUpToLine },
  { key: 'expense', title: 'खर्च रिपोर्ट', desc: 'सभी खर्चों की पूरी जानकारी', tone: 'orange', icon: Wallet },
  { key: 'pnl', title: 'व्यवसाय लाभ (P&L)', desc: 'लाभ एवं हानि की पूरी रिपोर्ट', tone: 'green', icon: PieIcon },
  { key: 'balance', title: 'बैलेंस शीट', desc: 'व्यवसाय की वित्तीय स्थिति की पूरी रिपोर्ट', tone: 'blue', icon: FileText },
  { key: 'trend', title: 'ट्रेंड रिपोर्ट', desc: 'मासिक बिक्री, खरीद, खर्च का ट्रेंड देखें', tone: 'purple', icon: BarChart3 },
  { key: 'party', title: 'पार्टी रिपोर्ट', desc: 'ग्राहक और सप्लायर का लेन-देन विवरण', tone: 'orange', icon: Users },
  { key: 'product', title: 'प्रोडक्ट रिपोर्ट', desc: 'प्रोडक्ट अनुसार बिक्री, खरीद और स्टॉक', tone: 'green', icon: Box },
  { key: 'top', title: 'टॉप रिपोर्ट', desc: 'टॉप ग्राहक, टॉप प्रोडक्ट, टॉप खर्च आदि', tone: 'red', icon: Award },
  { key: 'other', title: 'अन्य रिपोर्ट्स', desc: 'अन्य उपयोगी रिपोर्ट्स देखें', tone: 'gray', icon: MoreHorizontal },
]

/* ---------- mobile-only config (phone / small tablet, < lg) ---------- */
// every size is clamp()-based so the layout scales smoothly with the screen width
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const GAP = cl(6, 2, 12)

const M_SUMMARY = [
  { key: 'totalSales', label: 'कुल बिक्री', delta: 'sales', tone: 'green', icon: ShoppingCart },
  { key: 'totalPurchase', label: 'कुल खरीद', delta: 'purchase', tone: 'blue', icon: ShoppingBag },
  { key: 'totalProfit', label: 'कुल लाभ', delta: 'profit', tone: 'orange', icon: IndianRupee },
  { key: 'totalPayment', label: 'कुल भुगतान', delta: 'payment', tone: 'red', icon: IndianRupee, down: true },
  { key: 'totalExpense', label: 'कुल खर्च', delta: 'expense', tone: 'purple', icon: Coins },
]

// tone / description tweaks to match the mobile prototype
const M_OVERRIDE = {
  receipt: { tone: 'purple' },
  stock: { desc: 'स्टॉक स्थिति और मूल्य की जानकारी' },
}
const M_VISIBLE_REPORTS = 15

const PRESETS = [
  { label: 'आज', days: 0 },
  { label: 'पिछले 7 दिन', days: 6 },
  { label: 'पिछले 30 दिन', days: 29 },
  { label: 'इस माह', month: true },
]
const toIso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '—')

export default function Reports() {
  const { pushToast } = useApp()
  const [q, setQ] = useState('')
  const reports = REPORTS.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()))

  // mobile state
  const [from, setFrom] = useState('2025-05-01')
  const [to, setTo] = useState('2025-05-17')
  const [panel, setPanel] = useState(null) // 'date' | 'filter' | null
  const [showAll, setShowAll] = useState(false)
  const togglePanel = (name) => setPanel((p) => (p === name ? null : name))
  const mReports = reports
    .map((r) => ({ ...r, ...(M_OVERRIDE[r.key] || {}) }))
    .filter((r) => showAll || q || r.key !== 'other')
  const applyPreset = (p) => {
    const end = new Date()
    const start = new Date()
    if (p.month) start.setDate(1)
    else start.setDate(end.getDate() - p.days)
    setFrom(toIso(start))
    setTo(toIso(end))
  }
  const applyDates = () => {
    if (from && to && from > to) return pushToast('शुरुआती तिथि अंतिम तिथि से पहले होनी चाहिए', 'warn')
    setPanel(null)
    pushToast(`अवधि: ${showDate(from)} - ${showDate(to)}`, 'info')
  }
  const lineTicks = (() => {
    const n = salesVsPurchase.length
    if (!n) return []
    return [...new Set([0, Math.floor((n - 1) / 2), n - 1])].map((i) => salesVsPurchase[i].date)
  })()

  return (
    <Layout title="रिपोर्ट्स" subtitle="अपने व्यवसाय की हर जानकारी रिपोर्ट्स के रूप में देखें">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
      {/* ---------------- Page header ---------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex items-center rounded-lg px-3.5 py-2 text-[13px] font-bold text-white leading-none" style={{ background: C.green }}>
            SCR-013
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: C.text }}>रिपोर्ट्स (Reports)</h1>
            <p className="text-[13px] font-medium mt-0.5" style={{ color: C.muted }}>अपने व्यवसाय की हर जानकारी रिपोर्ट्स के रूप में देखें</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HeaderBtn icon={FileSpreadsheet} iconColor="#16a34a">Export करें</HeaderBtn>
          <HeaderBtn icon={FileText} iconColor="#dc2626">PDF बनाएं</HeaderBtn>
          <button type="button" className="inline-flex items-center gap-3 rounded-lg border bg-white px-4 h-12 text-left" style={{ borderColor: C.field }}>
            <CalendarDays size={20} style={{ color: C.label }} />
            <span>
              <span className="block text-[12px] font-semibold leading-tight" style={{ color: C.text }}>तिथि चुनें</span>
              <span className="block text-[12.5px] font-semibold leading-tight" style={{ color: C.text }}>01/05/2025 - 17/05/2025</span>
            </span>
            <ChevronDown size={16} className="ml-2" style={{ color: C.text }} />
          </button>
        </div>
      </div>

      {/* ---------------- Summary ---------------- */}
      <SectionHeading title="रिपोर्ट्स सारांश" sub="(इस अवधि का सारांश)" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {SUMMARY_CARDS.map((c) => {
          const t = TONES[c.tone]
          const Icon = c.icon
          return (
            <div key={c.key} className="rounded-xl px-3.5 py-3.5" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: t.circle }}>
                  <Icon size={22} style={{ color: t.icon }} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight" style={{ color: t.title }}>{c.label}</p>
                  <p className="text-[21px] font-bold leading-tight mt-1 whitespace-nowrap" style={{ color: C.text }}>{inr(reportsSummary[c.key])}</p>
                </div>
              </div>
              <p className="flex items-center justify-center gap-1.5 text-[11.5px] mt-3 whitespace-nowrap" style={{ color: C.text }}>
                पिछली अवधि से <b style={{ color: '#15803d' }}>+{reportsSummary.deltas[c.delta]}%</b>
                <ArrowUp size={14} style={{ color: '#15803d' }} />
              </p>
            </div>
          )
        })}
      </div>

      {/* ---------------- Choose report ---------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <SectionHeading title="रिपोर्ट्स चुनें" noMargin />
        <div className="relative w-full sm:w-[260px]">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="रिपोर्ट खोजें..."
            className="w-full h-11 rounded-lg border bg-white pl-4 pr-10 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
            style={{ borderColor: C.field, color: C.text }}
          />
          <Search size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {reports.map((r) => {
          const t = TONES[r.tone]
          const Icon = r.icon
          return (
            <div key={r.key} className="rounded-xl p-3.5 flex flex-col" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: t.circle }}>
                  <Icon size={22} style={{ color: t.icon }} />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold leading-tight" style={{ color: t.title }}>{r.title}</p>
                  <p className="text-[11.5px] leading-snug mt-1" style={{ color: C.text }}>{r.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => pushToast(`${r.title} खोली जा रही है`, 'info')}
                className="mt-2.5 ml-auto mr-auto inline-flex items-center justify-center gap-1.5 h-7 w-[88px] rounded-md bg-white text-[12px] font-semibold"
                style={{ border: `1px solid ${t.border}`, color: t.title }}
              >
                देखें <ArrowRight size={13} />
              </button>
            </div>
          )
        })}
      </div>

      {/* ---------------- Quick view ---------------- */}
      <SectionHeading title="त्वरित झलक" sub="(Quick View)" subLarge />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Sales vs purchase */}
        <ChartCard title="बिक्री बनाम खरीद (₹)">
          <div className="flex items-center gap-4 text-[11px] mb-1" style={{ color: C.text }}>
            <span className="flex items-center gap-1.5"><LegendLine color="#15803d" /> बिक्री</span>
            <span className="flex items-center gap-1.5"><LegendLine color="#2563eb" /> खरीद</span>
          </div>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesVsPurchase} margin={{ top: 4, right: 6, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="0" stroke="#f1f3f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.text }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis tick={{ fontSize: 10, fill: C.text }} tickLine={false} axisLine={false} tickFormatter={lakh} />
                <RTooltip formatter={(v) => `₹ ${inr(v)}`} />
                <Line type="monotone" dataKey="sales" name="बिक्री" stroke="#15803d" strokeWidth={1.8} dot={{ r: 2, fill: '#15803d', stroke: 'none' }} />
                <Line type="monotone" dataKey="purchase" name="खरीद" stroke="#2563eb" strokeWidth={1.8} dot={{ r: 2, fill: '#2563eb', stroke: 'none' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Expense split */}
        <ChartCard title="खर्च का विभाजन">
          <div className="flex items-center gap-3 h-[128px]">
            <div className="w-[118px] h-[118px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expenseCategoryBreakup} dataKey="value" nameKey="name" innerRadius={34} outerRadius={56} paddingAngle={0} stroke="none">
                    {expenseCategoryBreakup.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <RTooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 min-w-0 space-y-2.5 text-[11px]">
              {expenseCategoryBreakup.map((c) => (
                <li key={c.name} className="flex items-center gap-2" style={{ color: C.text }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="font-medium">{c.value}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-2.5 pt-2 text-center text-[13px] font-semibold" style={{ borderTop: `1px solid ${C.border}`, color: C.text }}>
            कुल खर्च <span className="ml-1.5 font-bold">₹ {inr(reportsSummary.totalExpense)}</span>
          </div>
        </ChartCard>

        {/* Net profit */}
        <ChartCard title="शुद्ध लाभ (₹)">
          <div className="h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netProfitTrend} margin={{ top: 16, right: 8, left: -14, bottom: 0 }}>
                <CartesianGrid stroke="#f1f3f6" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: C.text }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                <YAxis tick={{ fontSize: 10, fill: C.text }} tickLine={false} axisLine={false} tickFormatter={lakh} />
                <RTooltip formatter={(v) => `₹ ${inr(v)}`} />
                <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={36}>
                  {netProfitTrend.map((d) => <Cell key={d.label} fill={d.color} />)}
                  <LabelList dataKey="value" position="top" formatter={inr} style={{ fontSize: 10, fill: C.text, fontWeight: 500 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Main summary */}
        <ChartCard title="मुख्य सारांश">
          <ul className="space-y-3 text-[12.5px] pt-1">
            {[
              [CalendarDays, 'कुल बिक्री बिल', quickViewSummary.salesBills],
              [ShoppingBag, 'कुल खरीद बिल', quickViewSummary.purchaseBills],
              [Users, 'कुल ग्राहक', quickViewSummary.customers],
              [Store, 'कुल सप्लायर', quickViewSummary.suppliers],
              [Settings, 'कुल प्रोडक्ट्स', quickViewSummary.products],
            ].map(([Icon, l, v]) => (
              <li key={l} className="flex items-center gap-3" style={{ color: C.text }}>
                <Icon size={16} style={{ color: C.label }} />
                <span className="flex-1">{l}</span>
                <span className="font-bold pr-4">{v}</span>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      {/* ---------------- Note ---------------- */}
      <div className="flex items-center gap-2.5 rounded-lg px-4 h-11 mt-4 text-[12.5px] font-medium"
        style={{ background: '#eef7f0', border: '1px solid #d7ebdc', color: C.text }}>
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}><Info size={13} /></span>
        <span><b style={{ color: C.green }}>नोट:</b> सभी रिपोर्ट्स आपके द्वारा दर्ज किए गए बिल, प्राप्ति, भुगतान, खर्च और स्टॉक के आधार पर तैयार की जाती हैं।</span>
      </div>
      </div>

      {/* ===================== MOBILE (prototype: SCR-013) ===================== */}
      <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
        <MobileHeader />

        <main className="flex-1 overflow-y-auto overscroll-contain px-[clamp(12px,4vw,28px)] pt-1 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* ---- title block ---- */}
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>
              SCR-013
            </span>
            <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>रिपोर्ट्स (Reports)</h1>
            <p className="font-medium mt-1" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>अपने व्यवसाय की हर जानकारी रिपोर्ट्स के रूप में देखें</p>
          </div>

          {/* ---- date range + filter ---- */}
          <div className="mt-4 flex items-stretch justify-between" style={{ gap: GAP }}>
            <button
              type="button"
              onClick={() => togglePanel('date')}
              aria-expanded={panel === 'date'}
              className="min-w-0 inline-flex items-center rounded-lg border bg-white px-3 active:bg-slate-50 focus-ring"
              style={{ borderColor: panel === 'date' ? C.green : C.field, height: cl(40, 11.5, 52), gap: cl(6, 2, 10) }}
            >
              <CalendarDays style={{ color: C.label, width: cl(15, 4.6, 20), height: cl(15, 4.6, 20) }} className="shrink-0" />
              <span className="font-semibold truncate" style={{ color: C.text, fontSize: cl(11, 3.4, 15) }}>{showDate(from)} - {showDate(to)}</span>
              <ChevronDown size={16} className={`shrink-0 transition-transform ${panel === 'date' ? 'rotate-180' : ''}`} style={{ color: C.text }} />
            </button>
            <button
              type="button"
              onClick={() => togglePanel('filter')}
              aria-expanded={panel === 'filter'}
              className="shrink-0 inline-flex items-center justify-center rounded-lg border bg-white px-3 active:bg-slate-50 focus-ring"
              style={{ borderColor: panel === 'filter' || q ? C.green : C.field, height: cl(40, 11.5, 52), gap: cl(6, 2, 10), color: C.label }}
            >
              <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 15) }}>फिल्टर</span>
              <SlidersHorizontal style={{ width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }} />
            </button>
          </div>

          {/* date panel */}
          {panel === 'date' && (
            <div className="mt-2 rounded-xl border bg-slate-50 p-3" style={{ borderColor: C.border }}>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESETS.map((p) => (
                  <button key={p.label} type="button" onClick={() => applyPreset(p)} className="h-8 px-3 rounded-full border bg-white text-[12px] font-semibold focus-ring" style={{ borderColor: C.field, color: C.label }}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold mb-1" style={{ color: C.muted }}>से</span>
                  <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className="w-full h-10 rounded-lg border bg-white px-2 text-[13px] outline-none focus:border-green-600" style={{ borderColor: C.field, color: C.text }} />
                </label>
                <label className="block min-w-0">
                  <span className="block text-[11px] font-semibold mb-1" style={{ color: C.muted }}>तक</span>
                  <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className="w-full h-10 rounded-lg border bg-white px-2 text-[13px] outline-none focus:border-green-600" style={{ borderColor: C.field, color: C.text }} />
                </label>
              </div>
              <button type="button" onClick={applyDates} className="mt-3 w-full h-10 rounded-lg text-white text-[13px] font-semibold focus-ring" style={{ background: C.green }}>लागू करें</button>
            </div>
          )}

          {/* filter panel (search reports) */}
          {panel === 'filter' && (
            <div className="mt-2 rounded-xl border bg-slate-50 p-3" style={{ borderColor: C.border }}>
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="रिपोर्ट खोजें..."
                  aria-label="रिपोर्ट खोजें"
                  className="w-full h-10 rounded-lg border bg-white pl-3.5 pr-16 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                  style={{ borderColor: C.field, color: C.text }}
                />
                {q && (
                  <button type="button" aria-label="साफ़ करें" onClick={() => setQ('')} className="absolute right-9 top-1/2 -translate-y-1/2 p-1" style={{ color: C.muted }}>
                    <X size={15} />
                  </button>
                )}
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
              </div>
            </div>
          )}

          {/* ---- summary cards (5 across) ---- */}
          <div className="mt-4 grid grid-cols-5" style={{ gap: cl(4, 1.5, 10) }}>
            {M_SUMMARY.map((c) => {
              const t = TONES[c.tone]
              const Icon = c.icon
              const ic = cl(11, 3.4, 20)
              return (
                <div key={c.key} className="min-w-0 rounded-lg flex flex-col justify-between" style={{ background: t.bg, border: `1px solid ${t.border}`, padding: cl(4, 1.5, 12), minHeight: cl(72, 22, 120) }}>
                  <div className="flex items-center min-w-0" style={{ gap: cl(2, 0.8, 6) }}>
                    <span className="rounded-full flex items-center justify-center shrink-0" style={{ background: t.circle, width: cl(18, 6, 36), height: cl(18, 6, 36) }}>
                      <span className="relative inline-flex">
                        <Icon style={{ color: t.icon, width: ic, height: ic }} />
                        {c.down && <ArrowDown strokeWidth={3} className="absolute" style={{ color: t.icon, width: cl(6, 1.8, 10), height: cl(6, 1.8, 10), right: '-22%', bottom: '-12%' }} />}
                      </span>
                    </span>
                    <span className="font-semibold leading-tight min-w-0" style={{ color: t.title, fontSize: cl(7.5, 2.15, 13) }}>{c.label}</span>
                  </div>
                  <p className="font-bold whitespace-nowrap" style={{ color: C.text, fontSize: cl(8.5, 2.5, 16), marginTop: cl(4, 1.2, 8) }}>
                    ₹&thinsp;{inr(reportsSummary[c.key])}
                  </p>
                  <p className="flex items-center justify-center whitespace-nowrap font-medium" style={{ color: C.text, fontSize: cl(7.5, 2.2, 13), gap: 2, marginTop: cl(4, 1.2, 8) }}>
                    +{reportsSummary.deltas[c.delta]}%
                    <ArrowUp style={{ color: '#15803d', width: cl(8, 2.4, 14), height: cl(8, 2.4, 14) }} />
                  </p>
                </div>
              )
            })}
          </div>

          {/* ---- choose report ---- */}
          <div className="mt-5 mb-2.5 flex items-center justify-between gap-2">
            <h2 className="font-bold" style={{ color: C.label, fontSize: cl(16, 5, 22) }}>रिपोर्ट्स चुने</h2>
            <button type="button" onClick={() => setShowAll((v) => !v)} className="inline-flex items-center font-semibold focus-ring rounded" style={{ color: '#1d4ed8', fontSize: cl(11, 3.3, 15) }}>
              {showAll ? 'कम देखें' : 'सभी रिपोर्ट्स देखें'}
              <ChevronRight style={{ width: cl(14, 4, 18), height: cl(14, 4, 18) }} className={showAll ? 'rotate-90' : ''} />
            </button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4" style={{ gap: GAP }}>
            {mReports.map((r) => {
              const t = TONES[r.tone]
              const Icon = r.icon
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => pushToast(`${r.title} खोली जा रही है`, 'info')}
                  className="relative min-w-0 text-left rounded-xl flex items-start active:scale-[0.98] transition focus-ring"
                  style={{ background: t.bg, border: `1px solid ${t.border}`, padding: cl(6, 2.2, 14), gap: cl(4, 1.4, 10), minHeight: cl(66, 20, 110) }}
                >
                  <span className="rounded-full flex items-center justify-center shrink-0" style={{ background: t.circle, width: cl(24, 7.4, 44), height: cl(24, 7.4, 44) }}>
                    <Icon style={{ color: t.icon, width: cl(13, 4, 22), height: cl(13, 4, 22) }} />
                  </span>
                  <span className="min-w-0 flex-1 pb-3">
                    <span className="block font-bold leading-tight" style={{ color: t.title, fontSize: cl(9.5, 2.75, 15) }}>{r.title}</span>
                    <span className="block leading-snug" style={{ color: C.text, fontSize: cl(8, 2.3, 12.5), marginTop: cl(2, 0.8, 5) }}>{r.desc}</span>
                  </span>
                  <ChevronRight className="absolute" style={{ color: C.text, width: cl(12, 3.6, 18), height: cl(12, 3.6, 18), right: cl(5, 1.6, 12), bottom: cl(6, 2, 12) }} />
                </button>
              )
            })}
          </div>
          {mReports.length === 0 && <p className="py-8 text-center text-sm text-slate-400">कोई रिपोर्ट नहीं मिली</p>}

          {/* ---- quick view ---- */}
          <div className="mt-5 mb-2.5 flex items-center justify-between gap-2">
            <h2 className="font-bold" style={{ color: C.label, fontSize: cl(15, 4.6, 21) }}>त्वरित झलक <span className="font-bold">(Quick View)</span></h2>
            <button type="button" onClick={() => pushToast('सभी ग्राफ़ जल्द उपलब्ध होंगे', 'info')} className="inline-flex items-center font-semibold focus-ring rounded" style={{ color: '#1d4ed8', fontSize: cl(11, 3.3, 15) }}>
              और देखें
              <ChevronRight style={{ width: cl(14, 4, 18), height: cl(14, 4, 18) }} />
            </button>
          </div>

          <div className="grid grid-cols-4" style={{ gap: cl(4, 1.5, 10) }}>
            {/* sales vs purchase */}
            <MChartCard title="बिक्री बनाम खरीद">
              <div className="flex items-center flex-wrap" style={{ gap: cl(3, 1, 8), fontSize: cl(6, 1.8, 11), color: C.text }}>
                <span className="inline-flex items-center gap-0.5"><span className="inline-block h-[2px] w-2.5" style={{ background: '#15803d' }} />बिक्री</span>
                <span className="inline-flex items-center gap-0.5"><span className="inline-block h-[2px] w-2.5" style={{ background: '#2563eb' }} />खरीद</span>
              </div>
              <div style={{ height: cl(78, 22, 150) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesVsPurchase} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                    <CartesianGrid stroke="#f1f3f6" vertical={false} />
                    <XAxis dataKey="date" ticks={lineTicks} tick={{ fontSize: 6.5, fill: C.text }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} interval={0} padding={{ left: 4, right: 4 }} />
                    <YAxis width={20} tick={{ fontSize: 6.5, fill: C.text }} tickLine={false} axisLine={false} tickFormatter={lakh} tickCount={4} />
                    <RTooltip formatter={(v) => `₹ ${inr(v)}`} contentStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="sales" name="बिक्री" stroke="#15803d" strokeWidth={1.4} dot={{ r: 1.2, fill: '#15803d', stroke: 'none' }} />
                    <Line type="monotone" dataKey="purchase" name="खरीद" stroke="#2563eb" strokeWidth={1.4} dot={{ r: 1.2, fill: '#2563eb', stroke: 'none' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </MChartCard>

            {/* expense split */}
            <MChartCard title="खर्च का विभाजन">
              <div className="flex items-center" style={{ gap: cl(2, 0.8, 8) }}>
                <div className="shrink-0" style={{ width: cl(30, 9.4, 70), height: cl(30, 9.4, 70) }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseCategoryBreakup} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="100%" paddingAngle={0} stroke="none">
                        {expenseCategoryBreakup.map((c) => <Cell key={c.name} fill={c.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="flex-1 min-w-0" style={{ fontSize: cl(5.5, 1.6, 10), display: 'grid', rowGap: cl(2, 0.9, 7) }}>
                  {expenseCategoryBreakup.map((c) => (
                    <li key={c.name} className="flex items-center min-w-0" style={{ color: C.text, gap: 2 }}>
                      <span className="rounded-full shrink-0" style={{ background: c.color, width: cl(3, 1, 7), height: cl(3, 1, 7) }} />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="font-medium">{c.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto text-center font-semibold leading-tight" style={{ borderTop: `1px solid ${C.border}`, color: C.text, fontSize: cl(7.5, 2.1, 13), paddingTop: cl(3, 1, 8) }}>
                कुल खर्च
                <span className="block font-bold">₹ {inr(reportsSummary.totalExpense)}</span>
              </div>
            </MChartCard>

            {/* net profit */}
            <MChartCard title="शुद्ध लाभ (₹)">
              <div style={{ height: cl(96, 28, 180) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={netProfitTrend} margin={{ top: 14, right: 2, left: -8, bottom: 0 }} barCategoryGap="10%">
                    <CartesianGrid stroke="#f1f3f6" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 5.5, fill: C.text }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} interval={0} />
                    <YAxis width={20} tick={{ fontSize: 6.5, fill: C.text }} tickLine={false} axisLine={false} tickFormatter={lakh} tickCount={4} />
                    <RTooltip formatter={(v) => `₹ ${inr(v)}`} contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="value" radius={[1, 1, 0, 0]}>
                      {netProfitTrend.map((d) => <Cell key={d.label} fill={d.color} />)}
                      <LabelList dataKey="value" position="top" formatter={inr} style={{ fontSize: 5.5, fill: C.text, fontWeight: 500 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </MChartCard>

            {/* main summary */}
            <MChartCard title="मुख्य सारांश">
              <ul className="flex flex-col justify-between flex-1" style={{ fontSize: cl(6.5, 1.9, 12), paddingTop: cl(2, 0.8, 6), rowGap: cl(4, 1.4, 10) }}>
                {[
                  [CalendarDays, 'कुल बिक्री बिल', quickViewSummary.salesBills],
                  [ShoppingBag, 'कुल खरीद बिल', quickViewSummary.purchaseBills],
                  [Users, 'कुल ग्राहक', quickViewSummary.customers],
                  [Store, 'कुल सप्लायर', quickViewSummary.suppliers],
                  [Settings, 'कुल प्रोडक्ट्स', quickViewSummary.products],
                ].map(([Icon, l, v]) => (
                  <li key={l} className="flex items-center min-w-0" style={{ color: C.text, gap: cl(2, 0.7, 6) }}>
                    <Icon className="shrink-0" style={{ color: C.label, width: cl(8, 2.4, 15), height: cl(8, 2.4, 15) }} />
                    <span className="flex-1 leading-tight">{l}</span>
                    <span className="font-bold">{v}</span>
                  </li>
                ))}
              </ul>
            </MChartCard>
          </div>

          {/* ---- note ---- */}
          <div className="mt-4 flex items-center rounded-lg px-3 py-2.5" style={{ background: '#eef7f0', border: '1px solid #d7ebdc', color: C.text, gap: cl(6, 2, 10), fontSize: cl(9, 2.7, 14) }}>
            <span className="rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green, width: cl(16, 5, 22), height: cl(16, 5, 22) }}>
              <Info style={{ width: '65%', height: '65%' }} />
            </span>
            <span className="leading-snug"><b style={{ color: C.green }}>नोट:</b> सभी रिपोर्ट्स आपके द्वारा दर्ज किए गए बिल, प्राप्ति, भुगतान, खर्च और स्टॉक के आधार पर तैयार की जाती हैं।</span>
          </div>
        </main>
      </div>
    </Layout>
  )
}

/* ====================== helpers ====================== */

function SectionHeading({ title, sub, subLarge, noMargin }) {
  return (
    <h2 className={noMargin ? '' : 'mb-3'} style={{ color: C.label }}>
      <span className="text-[19px] font-bold">{title}</span>
      {sub && <span className={`${subLarge ? 'text-[17px] font-bold' : 'text-[12.5px] font-medium'} ml-1.5`} style={{ color: subLarge ? C.label : C.muted }}>{sub}</span>}
    </h2>
  )
}

function HeaderBtn({ icon: Icon, iconColor, children }) {
  return (
    <button type="button" className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 h-12 text-[12.5px] font-semibold" style={{ borderColor: C.field, color: C.label }}>
      <Icon size={20} style={{ color: iconColor }} />
      {children}
    </button>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-3.5" style={{ border: `1px solid ${C.border}` }}>
      <p className="text-[13px] font-semibold mb-2" style={{ color: C.text }}>{title}</p>
      {children}
    </div>
  )
}

function LegendLine({ color }) {
  return (
    <span className="inline-flex items-center">
      <span className="w-5 h-[2px]" style={{ background: color }} />
      <span className="w-1.5 h-1.5 rounded-full -ml-3.5" style={{ background: color }} />
    </span>
  )
}
function MChartCard({ title, children }) {
  return (
    <div className="min-w-0 rounded-lg bg-white flex flex-col" style={{ border: `1px solid ${C.border}`, padding: cl(4, 1.5, 12) }}>
      <p className="font-semibold leading-tight" style={{ color: C.text, fontSize: cl(7.5, 2.1, 13), marginBottom: cl(3, 1, 8) }}>{title}</p>
      {children}
    </div>
  )
}