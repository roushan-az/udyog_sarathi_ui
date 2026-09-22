import React, { useState } from 'react'
import { Search, RefreshCcw, SlidersHorizontal, FileSpreadsheet, Printer } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card, StatCard } from '../components/common/Card'
import { Input, Select } from '../components/common/Form'
import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import Badge, { statusTone } from '../components/common/Badge'
import { stockSummary, stockQuickStats, stockCategoryValue } from '../data/mockData'
import { formatINR, formatNumber } from '../utils/format'
import { Boxes, PackageCheck, IndianRupee, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'

const TABS = ['सभी उत्पाद', 'लो स्टॉक', 'आउट ऑफ स्टॉक', 'स्टॉक मूवमेंट']

export default function StockSummary() {
  const [tab, setTab] = useState('सभी उत्पाद')
  const [query, setQuery] = useState('')

  const rows = stockSummary.filter((s) => {
    if (tab === 'लो स्टॉक' && s.status !== 'लो स्टॉक') return false
    if (tab === 'आउट ऑफ स्टॉक' && s.status !== 'आउट ऑफ स्टॉक') return false
    if (!query) return true
    return s.name.toLowerCase().includes(query.toLowerCase()) || s.code.toLowerCase().includes(query.toLowerCase())
  })

  const columns = [
    { key: 'name', label: 'उत्पाद का नाम (कोड / श्रेणी)', render: (r) => (
      <div>
        <p className="font-medium text-slate-700">{r.name}</p>
        <p className="text-xs text-slate-400">{r.code} | {r.category}</p>
      </div>
    ) },
    { key: 'opening', label: 'ओपनिंग स्टॉक (Qty)', align: 'right', render: (r) => formatNumber(r.opening) },
    { key: 'purchase', label: 'खरीद (Qty) (इस माह)', align: 'right', render: (r) => formatNumber(r.purchase) },
    { key: 'sale', label: 'बिक्री (Qty) (इस माह)', align: 'right', render: (r) => formatNumber(r.sale) },
    { key: 'returns', label: 'रिटर्न (Qty)', align: 'right', render: (r) => formatNumber(r.returns) },
    { key: 'transfer', label: 'ट्रांसफर (±)', align: 'right', render: (r) => (r.transfer > 0 ? `+${r.transfer}` : r.transfer) },
    { key: 'available', label: 'उपलब्ध स्टॉक (Qty)', align: 'right', render: (r) => <span className="font-semibold">{formatNumber(r.available)}</span> },
    { key: 'value', label: 'स्टॉक मूल्य (₹)', align: 'right', render: (r) => formatINR(r.value) },
    { key: 'status', label: 'स्थिति', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ]

  return (
    <Layout title="स्टॉक सारांश" subtitle="आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें">
      <PageHeader
        code="SCR-012"
        title="स्टॉक सारांश (Stock Summary)"
        subtitle="आपके व्यवसाय के सभी उत्पादों का स्टॉक विवरण देखें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm">प्रिंट करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
        <StatCard icon={Boxes} tone="blue" label="कुल उत्पाद" value={stockQuickStats.totalProducts} sub="सभी उत्पाद" />
        <StatCard icon={PackageCheck} tone="green" label="कुल उपलब्ध स्टॉक" value={formatNumber(stockQuickStats.totalAvailable)} sub="कुल मात्रा (Qty)" />
        <StatCard icon={IndianRupee} tone="purple" label="कुल स्टॉक मूल्य" value={formatINR(stockQuickStats.totalValue)} sub="कीमत (₹)" />
        <StatCard icon={AlertTriangle} tone="orange" label="लो स्टॉक" value={stockQuickStats.lowStock} sub="ध्यान देने योग्य" />
        <StatCard icon={XCircle} tone="red" label="आउट ऑफ स्टॉक" value={stockQuickStats.outOfStock} sub="स्टॉक उपलब्ध नहीं" />
        <StatCard icon={TrendingUp} tone="sky" label="आज की बिक्री (Qty)" value={stockQuickStats.todaySaleQty} sub="आज बेची गई मात्रा" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Input icon={Search} placeholder="उत्पाद का नाम / कोड खोजें" value={query} onChange={(e) => setQuery(e.target.value)} className="sm:max-w-xs" />
              <Select defaultValue="सभी" className="sm:max-w-[160px]"><option>सभी</option></Select>
              <Select defaultValue="सभी" className="sm:max-w-[160px]"><option>सभी</option></Select>
              <Button variant="outline" icon={SlidersHorizontal} size="sm">और फिल्टर</Button>
              <Button variant="outline" icon={RefreshCcw} size="sm">रीसेट करें</Button>
            </div>
          </Card>

          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg w-fit overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3.5 py-1.5 rounded-md text-sm font-medium whitespace-nowrap focus-ring ${tab === t ? 'bg-brandGreen-600 text-white' : 'text-slate-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="hidden md:block">
            <DataTable columns={columns} rows={rows} footer={`कुल रिकॉर्ड: ${rows.length}`} />
          </div>
          <div className="md:hidden space-y-2.5">
            {rows.map((r) => (
              <Card key={r.code} className="p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.code} | {r.category}</p>
                  </div>
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-slate-500">उपलब्ध: <span className="font-semibold text-slate-700">{formatNumber(r.available)}</span></span>
                  <span className="text-slate-500">मूल्य: <span className="font-semibold text-slate-700">{formatINR(r.value)}</span></span>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-xs text-slate-400">ⓘ स्टॉक की गणना: ओपनिंग स्टॉक + खरीद + ट्रांसफर इन + रिटर्न - बिक्री - ट्रांसफर आउट - रिटर्न</p>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">टॉप 5 अधिक स्टॉक वाले उत्पाद</h3>
            <ol className="space-y-2 text-sm">
              {[...stockSummary].sort((a, b) => b.available - a.available).slice(0, 5).map((s, i) => (
                <li key={s.code} className="flex justify-between">
                  <span className="text-slate-600">{i + 1}. {s.name}</span>
                  <span className="font-semibold text-slate-800">{formatNumber(s.available)}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">स्टॉक मूल्य (श्रेणी अनुसार)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockCategoryValue} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {stockCategoryValue.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatINR(v)} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-2">कुल: {formatINR(stockCategoryValue.reduce((a, c) => a + c.value, 0))}</p>
          </Card>

          <Card className="p-4 bg-emerald-50 border-emerald-200">
            <h3 className="font-bold text-sm text-emerald-800 mb-1.5">महत्वपूर्ण नोट</h3>
            <ul className="text-xs text-emerald-700 space-y-1">
              <li>• लो स्टॉक वाले उत्पादों का समय पर ऑर्डर दें।</li>
              <li>• आउट ऑफ स्टॉक उत्पादों की उपलब्धता जाँचें।</li>
              <li>• स्टॉक मूवमेंट टैब में विस्तृत जानकारी देखें।</li>
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
