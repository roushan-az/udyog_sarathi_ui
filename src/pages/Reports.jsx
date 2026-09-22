import React from 'react'
import { FileSpreadsheet, FileDown, CalendarDays } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import Button from '../components/common/Button'
import { reportsSummary, reportCards, salesVsPurchase, expenseCategoryBreakup, netProfitTrend, quickViewSummary } from '../data/mockData'
import { formatINR } from '../utils/format'
import { useApp } from '../context/AppContext'

const SUMMARY_CARDS = [
  { key: 'totalSales', label: 'कुल बिक्री (₹)', delta: 'sales', tone: 'green' },
  { key: 'totalPurchase', label: 'कुल खरीद (₹)', delta: 'purchase', tone: 'blue' },
  { key: 'totalProfit', label: 'कुल लाभ (₹)', delta: 'profit', tone: 'green' },
  { key: 'totalPayment', label: 'कुल भुगतान (₹)', delta: 'payment', tone: 'red' },
  { key: 'totalExpense', label: 'कुल खर्च (₹)', delta: 'expense', tone: 'purple' },
  { key: 'netProfit', label: 'शुद्ध लाभ (₹)', delta: 'netProfit', tone: 'sky' },
]

const CARD_COLORS = {
  blue: 'bg-blue-50 text-navy-700 border-blue-100',
  orange: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  sky: 'bg-sky-50 text-sky-700 border-sky-100',
  slate: 'bg-slate-50 text-slate-700 border-slate-100',
}

export default function Reports() {
  const { pushToast } = useApp()

  return (
    <Layout title="रिपोर्ट्स" subtitle="अपने व्यवसाय की हर जानकारी रिपोर्ट्स के रूप में देखें">
      <PageHeader
        code="SCR-013"
        title="रिपोर्ट्स (Reports)"
        subtitle="अपने व्यवसाय की हर जानकारी रिपोर्ट्स के रूप में देखें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">Export करें</Button>
            <Button variant="outline" icon={FileDown} size="sm">PDF बनाएं</Button>
            <Button variant="outline" icon={CalendarDays} size="sm">01/05/2025 - 17/05/2025</Button>
          </>
        }
      />

      <Card className="p-4 mb-5">
        <h3 className="font-bold text-slate-800 mb-3 text-sm">रिपोर्ट्स सारांश (इस अवधि का सारांश)</h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {SUMMARY_CARDS.map((c) => (
            <div key={c.key} className={`rounded-xl border p-3.5 ${CARD_COLORS[c.tone]}`}>
              <p className="text-xs opacity-80">{c.label}</p>
              <p className="text-lg font-bold mt-0.5">{formatINR(reportsSummary[c.key])}</p>
              <p className="text-xs mt-0.5 opacity-80">पिछली अवधि से +{reportsSummary.deltas[c.delta]}% ↑</p>
            </div>
          ))}
        </div>
      </Card>

      <h3 className="font-bold text-slate-800 mb-3">रिपोर्ट्स चुनें</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {reportCards.map((r) => (
          <Card key={r.key} className={`p-4 border ${CARD_COLORS[r.color]}`}>
            <p className="font-bold text-sm">{r.title}</p>
            <p className="text-xs opacity-80 mt-1 mb-3">{r.desc}</p>
            <button onClick={() => pushToast(`${r.title} खोली जा रही है`, 'info')} className="text-xs font-semibold flex items-center gap-1 focus-ring">देखें →</button>
          </Card>
        ))}
      </div>

      <h3 className="font-bold text-slate-800 mb-3">त्वरित झलक (Quick View)</h3>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="p-4 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-700 mb-2">बिक्री बनाम खरीद (₹)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesVsPurchase} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <RTooltip formatter={(v) => formatINR(v)} />
                <Line type="monotone" dataKey="sales" name="बिक्री" stroke="#1e7e34" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="purchase" name="खरीद" stroke="#1a3a8f" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-700 mb-2">खर्च का विभाजन</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseCategoryBreakup} dataKey="value" nameKey="name" innerRadius={38} outerRadius={60} paddingAngle={2}>
                  {expenseCategoryBreakup.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <RTooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs font-semibold text-slate-600 mt-1">कुल खर्च {formatINR(reportsSummary.totalExpense)}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm font-semibold text-slate-700 mb-2">शुद्ध लाभ (₹)</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netProfitTrend}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <RTooltip formatter={(v) => formatINR(v)} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {netProfitTrend.map((d) => <Cell key={d.label} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4 mt-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">मुख्य सारांश</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
          <SummaryItem label="कुल बिक्री बिल" value={quickViewSummary.salesBills} />
          <SummaryItem label="कुल खरीद बिल" value={quickViewSummary.purchaseBills} />
          <SummaryItem label="कुल ग्राहक" value={quickViewSummary.customers} />
          <SummaryItem label="कुल सप्लायर" value={quickViewSummary.suppliers} />
          <SummaryItem label="कुल प्रोडक्ट्स" value={quickViewSummary.products} />
        </div>
      </Card>

      <p className="text-xs text-slate-400 mt-4">ⓘ नोट: सभी रिपोर्ट्स आपके द्वारा दर्ज किए गए बिल, प्राप्ति, भुगतान, खर्च और स्टॉक के आधार पर तैयार की जाती हैं।</p>
    </Layout>
  )
}

function SummaryItem({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 sm:border-0 pb-1.5 sm:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  )
}
