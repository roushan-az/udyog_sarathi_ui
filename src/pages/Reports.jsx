import React, { useState } from 'react'
import {
  FileSpreadsheet, FileText, CalendarDays, ChevronDown, Search, ArrowRight, ArrowUp,
  ShoppingCart, ShoppingBag, IndianRupee, Coins, TrendingUp, Package, AlertTriangle,
  Banknote, Landmark, ArrowDownToLine, ArrowUpToLine, Wallet, PieChart as PieIcon,
  BarChart3, Users, Box, Award, MoreHorizontal, Store, Settings, Info,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, LabelList,
} from 'recharts'
import Layout from '../components/layout/Layout'
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

export default function Reports() {
  const { pushToast } = useApp()
  const [q, setQ] = useState('')
  const reports = REPORTS.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()))

  return (
    <Layout title="रिपोर्ट्स" subtitle="अपने व्यवसाय की हर जानकारी रिपोर्ट्स के रूप में देखें">
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