import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, ShoppingCart, Wallet, TrendingUp, ChevronRight, Clock,
  Download, UserCheck, BarChart3, FileText, Banknote, FileWarning, ShieldCheck, Timer, ReceiptText,
  Menu, Bell, Home, Users, X, Settings,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/layout/Layout'
import Logo from '../components/common/Logo'
import { useApp } from '../context/AppContext'
import { dashboardStats, todayActivity, monthSummary, salesVsPurchase } from '../data/mockData'
import { formatINR } from '../utils/format'

/* ---------- Design tokens (same family as the other SCR pages) ---------- */
const C = {
  green: '#14612e',
  greenInk: '#15803d',
  blue: '#2563eb',
  link: '#1d4ed8',
  orange: '#f59e0b',
  indigo: '#4f46e5',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e8ed',
}

/* ---------- static config (matches prototype) ---------- */

const statCards = [
  { icon: ShoppingBag, bg: '#16a34a', label: 'कुल बिक्री (आज)', data: dashboardStats.todaySales, sub: (d) => `${d.count} बिल` },
  { icon: ShoppingCart, bg: '#2563eb', label: 'कुल खरीद (आज)', data: dashboardStats.todayPurchase, sub: (d) => `${d.count} बिल` },
  { icon: Wallet, bg: '#f59e0b', label: 'कुल खर्च (आज)', data: dashboardStats.todayExpense, sub: (d) => `${d.count} खर्च` },
  { icon: TrendingUp, bg: '#16a34a', label: 'कुल लाभ (अनुमानित)', data: dashboardStats.todayProfit, sub: (d) => d.label },
]

const quickActions = [
  { label: 'बिक्री करें', icon: ShoppingBag, color: C.greenInk, to: '/sales-bill' },
  { label: 'खरीद करें', icon: ShoppingCart, color: C.blue, to: '/purchase-bill' },
  { label: 'खर्च जोड़ें', icon: Wallet, color: C.orange, to: '/expense' },
  { label: 'रसीद प्राप्त करें', icon: Download, color: C.greenInk, to: '/receipt' },
  { label: 'भुगतान करें', icon: UserCheck, color: C.indigo, to: '/payment' },
  { label: 'रिपोर्ट देखें', icon: BarChart3, color: C.blue, to: '/reports' },
]

const TYPE_STYLE = {
  blue: { icon: FileText, color: C.greenInk },
  green: { icon: ShoppingCart, color: C.blue },
  orange: { icon: Wallet, color: C.orange },
  purple: { icon: ReceiptText, color: C.greenInk },
  sky: { icon: Banknote, color: C.indigo },
}

const monthRows = [
  { label: 'कुल बिक्री', value: monthSummary.totalSales, icon: ShoppingBag, color: C.greenInk, valColor: C.text },
  { label: 'कुल खरीद', value: monthSummary.totalPurchase, icon: ShoppingCart, color: C.blue, valColor: C.blue },
  { label: 'कुल खर्च', value: monthSummary.totalExpense, icon: Wallet, color: C.orange, valColor: C.orange },
  { label: 'कुल लाभ (अनुमानित)', value: monthSummary.totalProfit, icon: TrendingUp, color: C.greenInk, valColor: C.greenInk },
]

const reminderRows = [
  { icon: FileWarning, title: '3 बिल भुगतान शेष हैं', sub: 'कुल राशि: ₹ 15,750' },
  { icon: FileWarning, title: '2 खरीद बिल भुगतान शेष हैं', sub: 'कुल राशि: ₹ 22,300' },
  { icon: ShieldCheck, title: 'License 17 मई 2025 तक वैध है', sub: 'समय पर नवीनीकरण करें' },
]

const card = 'bg-white rounded-xl'
const cardStyle = { border: `1px solid ${C.border}`, boxShadow: '0 1px 2px rgba(16,24,40,0.04)' }

export default function Dashboard() {
  const { company } = useApp()

  return (
    <>
    {/* ===== MOBILE (portrait) — prototype phone screen ===== */}
    <MobileDashboard company={company} />

    {/* ===== DESKTOP — unchanged ===== */}
    <div className="hidden lg:block">
    <Layout
      title={
        <div>
          <h1 className="text-[26px] font-bold leading-tight" style={{ color: C.label }}>
            स्वागत है, {company.ownerName}!
          </h1>
          <p className="text-[13.5px] font-medium flex items-center gap-2 mt-1.5" style={{ color: C.text }}>
            अंतिम अपडेट : आज, 03:00 PM <Clock size={15} style={{ color: C.greenInk }} />
          </p>
        </div>
      }
      subtitle=""
    >
      {/* ---------------- Stat cards ---------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7 mb-5 lg:mb-7">
        {statCards.map((s) => (
          <div key={s.label} className={`${card} px-5 lg:px-6 py-5 lg:py-6`} style={cardStyle}>
            <div className="flex items-center gap-4">
              <span className="w-14 h-14 shrink-0 rounded-full text-white flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={26} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-medium leading-snug" style={{ color: C.text }}>{s.label}</p>
                <p className="text-[24px] font-bold leading-snug whitespace-nowrap" style={{ color: C.text }}>{formatINR(s.data.amount)}</p>
                <p className="text-[14px] font-medium leading-snug" style={{ color: C.text }}>{s.sub(s.data)}</p>
              </div>
            </div>
            <Link to="/reports" className="mt-5 text-[13px] font-semibold inline-flex items-center" style={{ color: C.link }}>
              विवरण देखें <ChevronRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      {/* ---------------- Activity + Quick actions ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.375fr)_minmax(0,1fr)] gap-5 lg:gap-7 mb-5 lg:mb-[18px]">
        <div className={`${card} px-5 pt-4 pb-5`} style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-bold" style={{ color: C.label }}>आज की गतिविधि</h3>
            <Link to="/reports" className="text-[13px] font-semibold flex items-center" style={{ color: C.link }}>
              सभी देखें <ChevronRight size={14} />
            </Link>
          </div>
          <div className="scroll-x">
            <table className="w-full min-w-[480px] text-[12.5px] border-collapse" style={{ border: `1px solid ${C.border}` }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: C.text }}>
                  {['प्रकार', 'विवरण', 'क्रमांक', 'राशि', 'समय'].map((h) => (
                    <th key={h} className="text-center font-semibold h-9 px-3" style={{ border: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayActivity.map((a) => {
                  const t = TYPE_STYLE[a.color] || TYPE_STYLE.blue
                  return (
                    <tr key={a.ref} style={{ color: C.text }}>
                      <td className="h-[43px] px-3" style={{ border: `1px solid ${C.border}` }}>
                        <span className="flex items-center gap-2 font-medium" style={{ color: t.color }}><t.icon size={15} />{a.type}</span>
                      </td>
                      <td className="px-3" style={{ border: `1px solid ${C.border}` }}>{a.desc}</td>
                      <td className="px-3 text-center" style={{ border: `1px solid ${C.border}` }}>{a.ref}</td>
                      <td className="px-3 text-center" style={{ border: `1px solid ${C.border}` }}>{formatINR(a.amount)}</td>
                      <td className="px-3 text-center" style={{ border: `1px solid ${C.border}` }}>{a.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${card} px-5 pt-4 pb-5`} style={cardStyle}>
          <h3 className="text-[15px] font-bold mb-3.5" style={{ color: C.label }}>त्वरित कार्य (Quick Actions)</h3>
          <div className="grid grid-cols-3 gap-3.5">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex flex-col items-center justify-center gap-2.5 h-[94px] px-1 rounded-lg bg-white hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                style={{ border: `1px solid ${C.border}`, boxShadow: '0 1px 2px rgba(16,24,40,0.05)' }}
              >
                <a.icon size={28} style={{ color: a.color }} />
                <span className="text-[12.5px] font-medium text-center leading-tight" style={{ color: C.text }}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Month summary | chart | reminders ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-[301fr_376fr_499fr] gap-5 lg:gap-[18px]">
        <div className={`${card} px-4 pt-4 pb-5`} style={cardStyle}>
          <h3 className="text-[15px] font-bold mb-3" style={{ color: C.label }}>
            माह का सारांश <span className="font-normal text-[12.5px]" style={{ color: C.text }}>(वर्तमान माह)</span>
          </h3>
          <ul className="rounded-lg text-[12.5px]" style={{ background: '#f8fafc' }}>
            {monthRows.map((r, i) => (
              <li key={r.label} className="flex items-center justify-between px-3 h-11"
                style={i ? { borderTop: `1px solid ${C.border}` } : undefined}>
                <span className="flex items-center gap-2" style={{ color: C.text }}><r.icon size={15} style={{ color: r.color }} />{r.label}</span>
                <span className="font-bold text-[14px]" style={{ color: r.valColor }}>{formatINR(r.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${card} px-4 pt-4 pb-3`} style={cardStyle}>
          <h3 className="text-[15px] font-bold mb-1" style={{ color: C.label }}>
            बिक्री बनाम खरीद <span className="font-normal text-[12.5px]" style={{ color: C.text }}>(ग्राफ)</span>
          </h3>
          <div className="h-[176px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVsPurchase} margin={{ left: -6, right: 4, top: 4 }} barGap={2}>
                <CartesianGrid strokeDasharray="0" stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: C.text }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.text }} axisLine={false} tickLine={false} tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)} />
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend verticalAlign="top" align="right" iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, paddingBottom: 4 }} />
                <Bar dataKey="sales" name="बिक्री" fill="#16a34a" />
                <Bar dataKey="purchase" name="खरीद" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${card} px-4 pt-4 pb-5`} style={cardStyle}>
          <h3 className="text-[15px] font-bold mb-3" style={{ color: C.label }}>महत्वपूर्ण रिमाइंडर</h3>
          <ul className="rounded-lg text-[12.5px]" style={{ border: `1px solid ${C.border}` }}>
            {reminderRows.map((r, i) => (
              <li key={r.title} className="flex items-center justify-between gap-2 px-3 py-2"
                style={i ? { borderTop: `1px solid ${C.border}` } : undefined}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <r.icon size={17} className="shrink-0" style={{ color: C.muted }} />
                  <div className="min-w-0">
                    <p className="font-medium" style={{ color: C.text }}>{r.title}</p>
                    <p style={{ color: C.text }}>{r.sub}</p>
                  </div>
                </div>
                <Link to="/reports" className="font-semibold shrink-0 flex items-center" style={{ color: C.greenInk }}>
                  देखें <ChevronRight size={14} />
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2.5 px-3 h-10" style={{ borderTop: `1px solid ${C.border}`, color: C.text }}>
              <Timer size={17} className="shrink-0" style={{ color: C.muted }} />
              कुल अवधि : लगभग 6 सेकंड (लोडिंग के बाद)
            </li>
          </ul>
        </div>
      </div>
    </Layout>
    </div>
    </>
  )
}

/* =====================================================================
   MOBILE DASHBOARD (phone, < lg) — duplicate of the prototype screen.
   Header + bottom nav are fixed; everything else scrolls inside.
   ===================================================================== */
const M_GREEN = '#0b7a3e'

const mStats = [
  { icon: ShoppingBag, color: '#16a34a', tint: '#dcfce7', label: 'कुल बिक्री', data: dashboardStats.todaySales, sub: (d) => `${d.count} बिल` },
  { icon: ShoppingCart, color: '#2563eb', tint: '#dbeafe', label: 'कुल खरीद', data: dashboardStats.todayPurchase, sub: (d) => `${d.count} बिल` },
  { icon: ReceiptText, color: '#f59e0b', tint: '#ffedd5', label: 'कुल खर्च', data: dashboardStats.todayExpense, sub: (d) => `${d.count} खर्च` },
  { icon: TrendingUp, color: '#16a34a', tint: '#dcfce7', label: 'कुल लाभ (अनुमानित)', data: dashboardStats.todayProfit, sub: () => 'इस माह' },
]

const mQuick = [
  { label: 'बिक्री करें', icon: ShoppingBag, color: '#16a34a', solid: true, to: '/sales-bill' },
  { label: 'खरीद करें', icon: ShoppingCart, color: '#2563eb', solid: true, to: '/purchase-bill' },
  { label: 'खर्च जोड़ें', icon: FileText, color: '#f59e0b', solid: true, to: '/expense' },
  { label: 'रसीद प्राप्त करें', icon: FileText, color: '#16a34a', solid: true, to: '/receipt' },
  { label: 'भुगतान करें', icon: UserCheck, color: C.indigo, to: '/payment' },
  { label: 'रिपोर्ट देखें', icon: BarChart3, color: '#2563eb', to: '/reports' },
]

const mNav = [
  { label: 'होम', icon: Home, to: '/dashboard', active: true },
  { label: 'बिक्री', icon: Users, to: '/sales-bill' },
  { label: 'खरीद', icon: ShoppingCart, to: '/purchase-bill' },
  { label: 'रिपोर्ट्स', icon: BarChart3, to: '/reports' },
  { label: 'सेटिंग्स', icon: Settings, to: '/settings' },
]

const hideScrollbar = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

function MobileDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="lg:hidden fixed inset-0 z-50 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      {/* ---------- Header ---------- */}
      <header className="shrink-0 grid grid-cols-[40px_1fr_40px] items-center px-[clamp(12px,4vw,28px)] pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 bg-white">
        <button type="button" aria-label="Menu" onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-start" style={{ color: C.label }}>
          <Menu size={26} />
        </button>
        <div className="flex flex-col items-center min-w-0">
          <div className="h-[34px] flex items-center [&_img]:h-full [&_img]:w-auto [&_img]:max-w-none [&_svg]:h-full [&_svg]:w-auto">
            <Logo size="md" />
          </div>
          <p className="mt-0.5 text-[clamp(10px,3vw,13px)] font-bold leading-none whitespace-nowrap" style={{ color: C.label }}>आपके व्यापार का सच्चा साथी</p>
        </div>
        <button type="button" aria-label="Notifications" className="relative w-10 h-10 flex items-center justify-end" style={{ color: C.label }}>
          <Bell size={25} />
          <span className="absolute top-0.5 right-[-4px] min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
        </button>
      </header>

      {/* ---------- Scrolling body ---------- */}
      <main className={`flex-1 overflow-y-auto px-[clamp(12px,4vw,28px)] pt-2 pb-5 ${hideScrollbar}`}>
        {/* License banner */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-3" style={{ background: '#edf6ee', border: '1px solid #cfe3d2' }}>
          <ShieldCheck size={42} fill="#15803d" stroke="#ffffff" strokeWidth={1.8} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[clamp(14px,4vw,17px)] font-bold leading-snug" style={{ color: M_GREEN }}>License वैध है</p>
            <p className="text-[12px] font-medium leading-snug mt-0.5" style={{ color: C.text }}>वैधता दिनांक : 17 मई 2025</p>
          </div>
          <button type="button" className="shrink-0 h-9 px-3 rounded-lg bg-white text-[12px] font-bold inline-flex items-center gap-0.5" style={{ border: `1px solid ${M_GREEN}`, color: M_GREEN }}>
            नवीनीकरण करें <ChevronRight size={14} />
          </button>
        </div>

        {/* Today's summary */}
        <div className="flex items-baseline justify-between mt-5 mb-2.5">
          <h3 className="text-[14.5px] font-bold" style={{ color: C.label }}>
            आज का सारांश <span className="font-medium text-[12px]">(संक्षेप में)</span>
          </h3>
          <span className="text-[10.5px] font-medium" style={{ color: C.muted }}>अंतिम अपडेट : आज, 03:00 PM</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {mStats.map((s) => (
            <div key={s.label} className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-xl bg-white px-3 py-3" style={cardStyle}>
              <span className="w-[clamp(36px,10.5vw,48px)] h-[clamp(36px,10.5vw,48px)] shrink-0 rounded-xl flex items-center justify-center" style={{ background: s.tint, color: s.color }}>
                <s.icon size={24} />
              </span>
              <div className="min-w-[84px] flex-1">
                <p className="text-[clamp(11px,3vw,13px)] font-semibold leading-tight" style={{ color: C.text }}>{s.label}</p>
                <p className="text-[clamp(17px,5vw,22px)] font-bold leading-snug whitespace-nowrap" style={{ color: C.text }}>{formatINR(s.data.amount)}</p>
                <p className="text-[11px] font-medium leading-tight" style={{ color: C.muted }}>{s.sub(s.data)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Today's activity */}
        <div className="flex items-center justify-between mt-5 mb-2.5">
          <h3 className="text-[14.5px] font-bold" style={{ color: C.label }}>आज की गतिविधि</h3>
          <Link to="/reports" className="text-[12px] font-semibold flex items-center" style={{ color: M_GREEN }}>
            सभी देखें <ChevronRight size={14} />
          </Link>
        </div>
        <ul className="rounded-xl bg-white" style={cardStyle}>
          {todayActivity.slice(0, 3).map((a, i) => {
            const t = TYPE_STYLE[a.color] || TYPE_STYLE.blue
            return (
              <li key={a.ref} className="flex items-center gap-2 px-3 py-3 text-[clamp(10.5px,3vw,13px)]" style={{ color: C.text, ...(i ? { borderTop: `1px solid ${C.border}` } : {}) }}>
                <t.icon size={16} className="shrink-0" style={{ color: t.color }} />
                <span className="flex-1 min-w-0 font-medium leading-tight">{a.desc}</span>
                <span className="w-[clamp(56px,17vw,96px)] shrink-0 text-center">{a.ref}</span>
                <span className="w-[clamp(50px,15vw,84px)] shrink-0 text-right font-bold">{formatINR(a.amount)}</span>
                <span className="w-[clamp(44px,13vw,76px)] shrink-0 text-right text-[clamp(9.5px,2.6vw,12px)]" style={{ color: C.muted }}>{a.time}</span>
              </li>
            )
          })}
        </ul>

        {/* Quick actions */}
        <h3 className="text-[14.5px] font-bold mt-5 mb-2.5" style={{ color: C.label }}>त्वरित कार्य (Quick Actions)</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {mQuick.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex flex-col items-center justify-center gap-2 h-[clamp(76px,22vw,100px)] px-1 rounded-xl"
              style={{ background: '#fff', border: `1px solid ${C.border}`, boxShadow: '0 2px 6px rgba(16,24,40,0.08)' }}
            >
              <a.icon size={30} style={{ color: a.color }} {...(a.solid ? { fill: a.color, stroke: '#fff', strokeWidth: 1.7 } : {})} />
              <span className="text-[clamp(10px,2.8vw,13px)] font-medium text-center leading-tight" style={{ color: C.text }}>{a.label}</span>
            </Link>
          ))}
        </div>

        {/* ---- below the fold: slide down to see ---- */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white px-4 pt-4 pb-4" style={cardStyle}>
          <h3 className="text-[14.5px] font-bold mb-3" style={{ color: C.label }}>
            माह का सारांश <span className="font-normal text-[12px]" style={{ color: C.text }}>(वर्तमान माह)</span>
          </h3>
          <ul className="rounded-lg text-[12.5px]" style={{ background: '#f8fafc' }}>
            {monthRows.map((r, i) => (
              <li key={r.label} className="flex items-center justify-between px-3 h-11" style={i ? { borderTop: `1px solid ${C.border}` } : undefined}>
                <span className="flex items-center gap-2" style={{ color: C.text }}><r.icon size={15} style={{ color: r.color }} />{r.label}</span>
                <span className="font-bold text-[14px]" style={{ color: r.valColor }}>{formatINR(r.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white px-3 pt-4 pb-3" style={cardStyle}>
          <h3 className="text-[14.5px] font-bold mb-1 px-1" style={{ color: C.label }}>
            बिक्री बनाम खरीद <span className="font-normal text-[12px]" style={{ color: C.text }}>(ग्राफ)</span>
          </h3>
          <div className="h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVsPurchase} margin={{ left: -10, right: 4, top: 4 }} barGap={2}>
                <CartesianGrid strokeDasharray="0" stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10.5, fill: C.text }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10.5, fill: C.text }} axisLine={false} tickLine={false} tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)} />
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend verticalAlign="top" align="right" iconType="square" iconSize={10} wrapperStyle={{ fontSize: 11.5, paddingBottom: 4 }} />
                <Bar dataKey="sales" name="बिक्री" fill="#16a34a" />
                <Bar dataKey="purchase" name="खरीद" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        </div>

        <div className="rounded-xl bg-white px-4 pt-4 pb-4 mt-4" style={cardStyle}>
          <h3 className="text-[14.5px] font-bold mb-3" style={{ color: C.label }}>महत्वपूर्ण रिमाइंडर</h3>
          <ul className="rounded-lg text-[12.5px]" style={{ border: `1px solid ${C.border}` }}>
            {reminderRows.map((r, i) => (
              <li key={r.title} className="flex items-center justify-between gap-2 px-3 py-2.5" style={i ? { borderTop: `1px solid ${C.border}` } : undefined}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <r.icon size={17} className="shrink-0" style={{ color: C.muted }} />
                  <div className="min-w-0">
                    <p className="font-medium leading-snug" style={{ color: C.text }}>{r.title}</p>
                    <p className="leading-snug" style={{ color: C.muted }}>{r.sub}</p>
                  </div>
                </div>
                <Link to="/reports" className="font-semibold shrink-0 flex items-center" style={{ color: M_GREEN }}>
                  देखें <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* ---------- Bottom navigation ---------- */}
      <nav className="shrink-0 grid grid-cols-5 bg-white pb-[max(0.25rem,env(safe-area-inset-bottom))]" style={{ borderTop: `1px solid ${C.border}`, boxShadow: '0 -2px 8px rgba(16,24,40,0.05)' }}>
        {mNav.map((n) => (
          <Link key={n.label} to={n.to} className="flex flex-col items-center justify-center gap-1 pt-2 pb-1" style={{ color: n.active ? M_GREEN : C.label }}>
            <n.icon size={24} fill={n.active ? 'currentColor' : 'none'} />
            <span className="text-[11px] font-semibold leading-none">{n.label}</span>
          </Link>
        ))}
      </nav>

      {/* ---------- Menu drawer ---------- */}
      {menuOpen && (
        <div className="absolute inset-0 z-50 flex">
          <div className="w-[78%] max-w-[300px] h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <Logo size="md" />
              <button type="button" aria-label="Close" onClick={() => setMenuOpen(false)} style={{ color: C.label }}><X size={24} /></button>
            </div>
            <ul className={`flex-1 overflow-y-auto py-2 ${hideScrollbar}`}>
              {[{ label: 'होम', icon: Home, to: '/dashboard' }, ...mQuick].map((m) => (
                <li key={m.label}>
                  <Link to={m.to} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-5 h-12 text-[14px] font-medium" style={{ color: C.text }}>
                    <m.icon size={20} style={{ color: C.label }} />{m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" aria-label="Close menu" className="flex-1 bg-black/40" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </div>
  )
}