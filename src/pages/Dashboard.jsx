import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, ShoppingCart, Wallet, TrendingUp, ChevronRight, ShieldCheck,
  Download, Upload, FileBarChart, AlertCircle, Clock,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Layout from '../components/layout/Layout'
import { Card, StatCard } from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { dashboardStats, todayActivity, monthSummary, salesVsPurchase, reminders } from '../data/mockData'
import { formatINR } from '../utils/format'

const quickActions = [
  { label: 'बिक्री करें', icon: ShoppingBag, to: '/sales-bill' },
  { label: 'खरीद करें', icon: ShoppingCart, to: '/purchase-bill' },
  { label: 'खर्च जोड़ें', icon: Wallet, to: '/expense' },
  { label: 'रसीद प्राप्त करें', icon: Download, to: '/receipt' },
  { label: 'भुगतान करें', icon: Upload, to: '/payment' },
  { label: 'रिपोर्ट देखें', icon: FileBarChart, to: '/reports' },
]

const ACTIVITY_BADGE_TONE = { blue: 'blue', green: 'green', orange: 'orange', purple: 'purple', sky: 'blue' }

export default function Dashboard() {
  const { company } = useApp()

  return (
    <Layout title="Home Screen" subtitle="मुख्य डैशबोर्ड">
      {/* License card: shown here only on mobile (desktop shows it in the sidebar, per SCR-003) */}
      <Card className="lg:hidden p-4 mb-5 flex items-center justify-between gap-3 bg-emerald-50 border-emerald-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-brandGreen-700" size={22} />
          <div>
            <p className="text-sm font-semibold text-brandGreen-700">License वैध है</p>
            <p className="text-xs text-slate-500">वैधता दिनांक: {company.licenseExpiry}</p>
          </div>
        </div>
        <Button variant="primary" size="sm">नवीनीकरण करें</Button>
      </Card>

      <div className="mb-5">
        <p className="text-lg font-bold text-slate-800">स्वागत है, {company.ownerName}!</p>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={12} /> अंतिम अपडेट: आज, 03:00 PM</p>
      </div>

      {/* Row: 4 today stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard icon={ShoppingBag} tone="green" label="कुल बिक्री (आज)" value={formatINR(dashboardStats.todaySales.amount)} sub={`${dashboardStats.todaySales.count} बिल`} />
        <StatCard icon={ShoppingCart} tone="blue" label="कुल खरीद (आज)" value={formatINR(dashboardStats.todayPurchase.amount)} sub={`${dashboardStats.todayPurchase.count} बिल`} />
        <StatCard icon={Wallet} tone="orange" label="कुल खर्च (आज)" value={formatINR(dashboardStats.todayExpense.amount)} sub={`${dashboardStats.todayExpense.count} खर्च`} />
        <StatCard icon={TrendingUp} tone="purple" label="कुल लाभ (अनुमानित)" value={formatINR(dashboardStats.todayProfit.amount)} sub={dashboardStats.todayProfit.label} />
      </div>

      {/* Row: activity table (2/3) + quick actions (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800">आज की गतिविधि</h3>
            <Link to="/reports" className="text-xs font-semibold text-navy-600 flex items-center">सभी देखें <ChevronRight size={14} /></Link>
          </div>
          <div className="scroll-x">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="text-left font-medium py-2 pr-2">प्रकार</th>
                  <th className="text-left font-medium py-2 pr-2">विवरण</th>
                  <th className="text-left font-medium py-2 pr-2">क्रमांक</th>
                  <th className="text-right font-medium py-2 pr-2">राशि</th>
                  <th className="text-right font-medium py-2">समय</th>
                </tr>
              </thead>
              <tbody>
                {todayActivity.map((a) => (
                  <tr key={a.ref} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-2"><Badge tone={ACTIVITY_BADGE_TONE[a.color] || 'slate'}>{a.type}</Badge></td>
                    <td className="py-2.5 pr-2 text-slate-600">{a.desc}</td>
                    <td className="py-2.5 pr-2 text-slate-500">{a.ref}</td>
                    <td className="py-2.5 pr-2 text-right font-semibold text-slate-800">{formatINR(a.amount)}</td>
                    <td className="py-2.5 text-right text-slate-400">{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-slate-800 mb-3">त्वरित कार्य (Quick Actions)</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.to} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors focus-ring">
                <span className="w-9 h-9 shrink-0 rounded-lg bg-white shadow-sm flex items-center justify-center text-navy-600">
                  <a.icon size={17} />
                </span>
                <span className="text-xs font-medium text-slate-600 leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Row: month summary | sales-vs-purchase bar chart | reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-4">
          <h3 className="font-bold text-slate-800 mb-3">माह का सारांश (वर्तमान माह)</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-slate-500">कुल बिक्री</span><span className="font-semibold text-slate-800">{formatINR(monthSummary.totalSales)}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">कुल खरीद</span><span className="font-semibold text-slate-800">{formatINR(monthSummary.totalPurchase)}</span></li>
            <li className="flex justify-between"><span className="text-slate-500">कुल खर्च</span><span className="font-semibold text-slate-800">{formatINR(monthSummary.totalExpense)}</span></li>
            <li className="flex justify-between border-t border-slate-100 pt-2"><span className="text-brandGreen-700 font-medium">कुल लाभ (अनुमानित)</span><span className="font-bold text-brandGreen-700">{formatINR(monthSummary.totalProfit)}</span></li>
          </ul>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-slate-800 mb-3">बिक्री बनाम खरीद (ग्राफ)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesVsPurchase} margin={{ left: -20, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip formatter={(v) => formatINR(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sales" name="बिक्री" fill="#1e7e34" radius={[3, 3, 0, 0]} />
                <Bar dataKey="purchase" name="खरीद" fill="#1a3a8f" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-bold text-slate-800 mb-3">महत्वपूर्ण रिमाइंडर</h3>
          <ul className="space-y-3">
            {reminders.map((r) => (
              <li key={r.text} className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className={r.tone === 'warn' ? 'text-amber-500 mt-0.5 shrink-0' : 'text-navy-500 mt-0.5 shrink-0'} />
                  <div>
                    <p className="text-sm text-slate-700">{r.text}</p>
                    <p className="text-xs text-slate-400">{r.sub}</p>
                  </div>
                </div>
                <Link to="/reports" className="text-xs font-semibold text-navy-600 shrink-0">देखें ›</Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Layout>
  )
}
