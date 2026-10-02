import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, ShoppingCart, Wallet, TrendingUp, ChevronRight, Clock,
  Download, UserCheck, BarChart3, FileText, Banknote, FileWarning, ShieldCheck, Timer, ReceiptText,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/layout/Layout'
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
  )
}