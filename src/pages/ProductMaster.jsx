import React, { useMemo, useState } from 'react'
import { Search, Filter, Plus, FileSpreadsheet, Printer, ChevronRight, Package, CheckCircle2, MinusCircle, AlertTriangle, Shield } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card, StatCard } from '../components/common/Card'
import { Input, Select } from '../components/common/Form'
import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import Badge, { statusTone } from '../components/common/Badge'
import { products, productSummary } from '../data/mockData'
import { formatINR, formatNumber } from '../utils/format'
import { useApp } from '../context/AppContext'

export default function ProductMaster() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('सभी श्रेणी')
  const [status, setStatus] = useState('सभी स्थिति')

  const categories = useMemo(() => ['सभी श्रेणी', ...new Set(products.map((p) => p.category))], [])

  const filtered = products.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.hsn.includes(query)
    const matchesCategory = category === 'सभी श्रेणी' || p.category === category
    const matchesStatus = status === 'सभी स्थिति' || p.status === status
    return matchesQuery && matchesCategory && matchesStatus
  })

  const columns = [
    { key: 'sl', label: 'SL No.', render: (_, i) => i + 1 },
    { key: 'name', label: 'प्रोडक्ट नाम' },
    { key: 'hsn', label: 'HSN कोड' },
    { key: 'category', label: 'श्रेणी' },
    { key: 'unit', label: 'Unit' },
    { key: 'saleRate', label: 'बिक्री रेट (₹)', align: 'right', render: (r) => formatINR(r.saleRate) },
    { key: 'purchaseRate', label: 'खरीद रेट (₹)', align: 'right', render: (r) => formatINR(r.purchaseRate) },
    { key: 'stock', label: 'स्टॉक मात्रा', align: 'right', render: (r) => formatNumber(r.stock) },
    { key: 'stockValue', label: 'स्टॉक वैल्यू (₹)', align: 'right', render: (r) => formatINR(r.stockValue) },
    { key: 'status', label: 'स्थिति', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ]

  return (
    <Layout title="प्रोडक्ट मास्टर" subtitle="सभी प्रोडक्ट की जानकारी यहाँ प्रबंधित करें">
      <PageHeader
        code="SCR-006"
        title="प्रोडक्ट मास्टर"
        subtitle="सभी प्रोडक्ट की जानकारी यहाँ प्रवंधित करें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">एक्सपोर्ट (Excel)</Button>
            <Button variant="outline" icon={Printer} size="sm">प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm" onClick={() => pushToast('नया प्रोडक्ट जोड़ने का फॉर्म खुलेगा', 'info')}>नया प्रोडक्ट जोड़ें</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <StatCard icon={Package} tone="blue" label="कुल प्रोडक्ट" value={productSummary.total} />
        <StatCard icon={CheckCircle2} tone="green" label="सक्रिय प्रोडक्ट" value={productSummary.active} />
        <StatCard icon={MinusCircle} tone="red" label="निष्क्रिय प्रोडक्ट" value={productSummary.inactive} />
        <StatCard icon={AlertTriangle} tone="orange" label="कम स्टॉक वाले प्रोडक्ट" value={productSummary.lowStock} />
        <StatCard icon={Shield} tone="purple" label="कुल स्टॉक वैल्यू (₹)" value={formatINR(productSummary.totalStockValue)} className="col-span-2 lg:col-span-1" />
      </div>

      <Card className="p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Input icon={Search} placeholder="प्रोडक्ट नाम / HSN कोड से खोजें" value={query} onChange={(e) => setQuery(e.target.value)} className="sm:max-w-xs" />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:max-w-[180px]">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </Select>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:max-w-[160px]">
            <option>सभी स्थिति</option>
            <option>सक्रिय</option>
            <option>कम स्टॉक</option>
            <option>निष्क्रिय</option>
          </Select>
          <Button variant="outline" icon={Filter} size="sm">फिल्टर</Button>
        </div>
      </Card>

      {/* Desktop table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          rows={filtered}
          onEdit={() => pushToast('प्रोडक्ट संपादन फॉर्म खुलेगा', 'info')}
          onDelete={() => pushToast('प्रोडक्ट हटाया गया', 'warn')}
          footer={`कुल रिकॉर्ड: ${filtered.length}`}
        />
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2.5">
        {filtered.map((p) => (
          <Card key={p.id} className="p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">HSN: {p.hsn} | Unit: {p.unit}</p>
              </div>
              <Badge tone={statusTone(p.status)}>{p.status}</Badge>
            </div>
            <div className="flex items-center justify-between mt-2.5 text-sm">
              <span className="text-slate-500">स्टॉक: <span className="font-semibold text-slate-700">{formatNumber(p.stock)}</span></span>
              <span className="text-slate-500">रेट (₹): <span className="font-semibold text-slate-700">{formatINR(p.saleRate)}</span></span>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 space-y-1">
        <p>ⓘ नोट:</p>
        <p>• स्टॉक मात्रा ऑटो अपडेट होती है (खरीद, बिक्री, रिटर्न के अनुसार)।</p>
        <p>• निष्क्रिय प्रोडक्ट बिक्री/खरीद में दिखाई नहीं देंगे।</p>
        <p>• प्रोडक्ट हटाने पर पुराना डेटा सुरक्षित रहेगा।</p>
      </div>
    </Layout>
  )
}
