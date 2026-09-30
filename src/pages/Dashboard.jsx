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

/* ---------- static config (matches prototype) ---------- */

const statCards = [
  { icon: ShoppingBag, bg: 'bg-green-600', label: 'कुल बिक्री (आज)', data: dashboardStats.todaySales, sub: (d) => `${d.count} बिल` },
  { icon: ShoppingCart, bg: 'bg-blue-600', label: 'कुल खरीद (आज)', data: dashboardStats.todayPurchase, sub: (d) => `${d.count} बिल` },
  { icon: Wallet, bg: 'bg-orange-500', label: 'कुल खर्च (आज)', data: dashboardStats.todayExpense, sub: (d) => `${d.count} खर्च` },
  { icon: TrendingUp, bg: 'bg-green-600', label: 'कुल लाभ (अनुमानित)', data: dashboardStats.todayProfit, sub: (d) => d.label },
]

const quickActions = [
  { label: 'बिक्री करें', icon: ShoppingBag, color: 'text-green-700', to: '/sales-bill' },
  { label: 'खरीद करें', icon: ShoppingCart, color: 'text-blue-600', to: '/purchase-bill' },
  { label: 'खर्च जोड़ें', icon: Wallet, color: 'text-orange-500', to: '/expense' },
  { label: 'रसीद प्राप्त करें', icon: Download, color: 'text-green-700', to: '/receipt' },
  { label: 'भुगतान करें', icon: UserCheck, color: 'text-indigo-600', to: '/payment' },
  { label: 'रिपोर्ट देखें', icon: BarChart3, color: 'text-blue-600', to: '/reports' },
]

const TYPE_STYLE = {
  blue: { icon: FileText, cls: 'text-green-700' },
  green: { icon: ShoppingCart, cls: 'text-blue-600' },
  orange: { icon: Wallet, cls: 'text-orange-500' },
  purple: { icon: ReceiptText, cls: 'text-green-700' },
  sky: { icon: Banknote, cls: 'text-indigo-600' },
}

const monthRows = [
  { label: 'कुल बिक्री', value: monthSummary.totalSales, icon: ShoppingBag, cls: 'text-green-700', valCls: 'text-slate-800' },
  { label: 'कुल खरीद', value: monthSummary.totalPurchase, icon: ShoppingCart, cls: 'text-blue-600', valCls: 'text-blue-600' },
  { label: 'कुल खर्च', value: monthSummary.totalExpense, icon: Wallet, cls: 'text-orange-500', valCls: 'text-orange-500' },
  { label: 'कुल लाभ (अनुमानित)', value: monthSummary.totalProfit, icon: TrendingUp, cls: 'text-green-700', valCls: 'text-green-700' },
]

const reminderRows = [
  { icon: FileWarning, title: '3 बिल भुगतान शेष हैं', sub: 'कुल राशि: ₹ 15,750' },
  { icon: FileWarning, title: '2 खरीद बिल भुगतान शेष हैं', sub: 'कुल राशि: ₹ 22,300' },
  { icon: ShieldCheck, title: 'License 17 मई 2025 तक वैध है', sub: 'समय पर नवीनीकरण करें' },
]

const cardCls = 'bg-white rounded-xl border border-slate-200 shadow-sm'

export default function Dashboard() {
  const { company } = useApp()

  return (
   <Layout
    title={
      <div>
        <h1 className="text-xl font-bold text-slate-800 leading-tight">
          स्वागत है, {company.ownerName}!
        </h1>
        <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
          अंतिम अपडेट : आज, 03:00 PM <Clock size={13} className="text-green-600" />
        </p>
      </div>
    }
    subtitle=""
  >

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {statCards.map((s) => (
          <div key={s.label} className={`${cardCls} px-4 py-3`}>
            <div className="flex items-center gap-3">
              <span className={`w-12 h-12 shrink-0 rounded-full ${s.bg} text-white flex items-center justify-center`}>
                <s.icon size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-700">{s.label}</p>
                <p className="text-xl font-bold text-slate-800 leading-snug">{formatINR(s.data.amount)}</p>
                <p className="text-xs font-medium text-slate-700">{s.sub(s.data)}</p>
              </div>
            </div>
            <Link to="/reports" className="mt-2 text-xs font-semibold text-navy-600 inline-flex items-center">
              विवरण देखें <ChevronRight size={13} />
            </Link>
          </div>
        ))}
      </div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        <div className={`${cardCls} lg:col-span-2 p-3`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 text-sm">आज की गतिविधि</h3>
            <Link to="/reports" className="text-xs font-semibold text-navy-600 flex items-center">सभी देखें <ChevronRight size={13} /></Link>
          </div>
          <div className="scroll-x">
            <table className="w-full min-w-[480px] text-xs border border-slate-200 border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-800">
                  {['प्रकार', 'विवरण', 'क्रमांक', 'राशि', 'समय'].map((h) => (
                    <th key={h} className="text-center font-semibold py-1 px-2 border border-slate-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayActivity.map((a) => {
                  const t = TYPE_STYLE[a.color] || TYPE_STYLE.blue
                  return (
                    <tr key={a.ref} className="text-slate-700">
                      <td className="py-1 px-2 border border-slate-200">
                        <span className={`flex items-center gap-1.5 font-medium ${t.cls}`}><t.icon size={14} />{a.type}</span>
                      </td>
                      <td className="py-1 px-2 border border-slate-200">{a.desc}</td>
                      <td className="py-1 px-2 border border-slate-200 text-center">{a.ref}</td>
                      <td className="py-1 px-2 border border-slate-200 text-center">{formatINR(a.amount)}</td>
                      <td className="py-1 px-2 border border-slate-200 text-center">{a.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${cardCls} p-3`}>
          <h3 className="font-bold text-slate-800 text-sm mb-2">त्वरित कार्य (Quick Actions)</h3>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors focus-ring"
              >
                <a.icon size={24} className={a.color} />
                <span className="text-[11px] font-medium text-slate-700 text-center leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Month summary | chart | reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className={`${cardCls} p-3`}>
          <h3 className="font-bold text-slate-800 text-sm mb-2">
            माह का सारांश <span className="font-normal text-xs">(वर्तमान माह)</span>
          </h3>
          <ul className="rounded-lg bg-slate-50 divide-y divide-slate-200 text-xs">
            {monthRows.map((r) => (
              <li key={r.label} className="flex items-center justify-between px-3 py-2">
                <span className="flex items-center gap-2 text-slate-700"><r.icon size={14} className={r.cls} />{r.label}</span>
                <span className={`font-semibold text-sm ${r.valCls}`}>{formatINR(r.value)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${cardCls} p-3`}>
          <h3 className="font-bold text-slate-800 text-sm mb-1">बिक्री बनाम खरीद <span className="font-normal text-xs">(ग्राफ)</span></h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVsPurchase} margin={{ left: -10, right: 4, top: 4 }} barGap={2}>
                <CartesianGrid strokeDasharray="0" stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#334155' }} axisLine={false} tickLine={false} tickFormatter={(v) => (v === 0 ? '0' : `${v / 1000}K`)} />
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend verticalAlign="top" align="right" iconType="square" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="sales" name="बिक्री" fill="#16a34a" />
                <Bar dataKey="purchase" name="खरीद" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${cardCls} p-3`}>
          <h3 className="font-bold text-slate-800 text-sm mb-2">महत्वपूर्ण रिमाइंडर</h3>
          <ul className="border border-slate-200 rounded-lg divide-y divide-slate-200 text-xs">
            {reminderRows.map((r) => (
              <li key={r.title} className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="flex items-center gap-2">
                  <r.icon size={16} className="text-slate-500 shrink-0" />
                  <div>
                    <p className="text-slate-800 font-medium">{r.title}</p>
                    <p className="text-slate-600">{r.sub}</p>
                  </div>
                </div>
                <Link to="/reports" className="font-semibold text-navy-600 shrink-0 flex items-center">देखें <ChevronRight size={13} /></Link>
              </li>
            ))}
            <li className="flex items-center gap-2 px-3 py-2 text-slate-700">
              <Timer size={16} className="text-slate-500 shrink-0" />
              कुल अवधि : लगभग 6 सेकंड (लोडिंग के बाद)
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}