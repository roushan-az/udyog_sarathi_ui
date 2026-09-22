import React, { useState } from 'react'
import { Search, Filter, Plus, FileSpreadsheet, Printer, ChevronRight, Users2, UserCheck, Truck, Ban } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card, StatCard } from '../components/common/Card'
import { Input, Select } from '../components/common/Form'
import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import Badge, { statusTone } from '../components/common/Badge'
import { parties, partySummary } from '../data/mockData'
import { formatINR } from '../utils/format'
import { useApp } from '../context/AppContext'

export default function PartyMaster() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('सभी पार्टी')

  const filtered = parties.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.mobile.includes(query) || p.gstin.includes(query)
    const matchesTab = tab === 'सभी पार्टी' || (tab === 'ग्राहक' && p.type === 'ग्राहक') || (tab === 'सप्लायर' && p.type === 'सप्लायर')
    return matchesQuery && matchesTab
  })

  const columns = [
    { key: 'sl', label: 'SL No.', render: (_, i) => i + 1 },
    { key: 'name', label: 'पार्टी नाम' },
    { key: 'type', label: 'प्रकार', render: (r) => <Badge tone={r.type === 'ग्राहक' ? 'blue' : 'purple'}>{r.type}</Badge> },
    { key: 'mobile', label: 'मोबाइल नंबर' },
    { key: 'place', label: 'स्थान' },
    { key: 'gstin', label: 'GSTIN' },
    { key: 'ledger', label: 'खाता प्रकार', render: (r) => <Badge tone={statusTone(r.ledger)}>{r.ledger}</Badge> },
    { key: 'balance', label: 'कुल वकाया / देय (₹)', align: 'right', render: (r) => formatINR(r.balance) },
    { key: 'status', label: 'स्थिति', render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
  ]

  return (
    <Layout title="पार्टी मास्टर" subtitle="सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें">
      <PageHeader
        code="SCR-007"
        title="पार्टी मास्टर"
        subtitle="सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">एक्सपोर्ट (Excel)</Button>
            <Button variant="outline" icon={Printer} size="sm">प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm" onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')}>नई पार्टी जोड़ें</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
        <StatCard icon={Users2} tone="blue" label="कुल पार्टी" value={partySummary.total} />
        <StatCard icon={UserCheck} tone="green" label="ग्राहक" value={partySummary.customers} />
        <StatCard icon={Truck} tone="purple" label="सप्लायर" value={partySummary.suppliers} />
        <StatCard icon={Ban} tone="orange" label="निष्क्रिय पार्टी" value={partySummary.inactive} />
        <StatCard tone="green" label="कुल वकाया (ग्राहक)" value={formatINR(partySummary.totalReceivable)} className="col-span-2 lg:col-span-1" />
        <StatCard tone="red" label="कुल देय (सप्लायर)" value={formatINR(partySummary.totalPayable)} className="col-span-2 lg:col-span-1" />
      </div>

      <Card className="p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-lg">
            {['सभी पार्टी', 'ग्राहक', 'सप्लायर'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md text-sm font-medium focus-ring ${tab === t ? 'bg-brandGreen-600 text-white' : 'text-slate-600'}`}>
                {t}
              </button>
            ))}
          </div>
          <Input icon={Search} placeholder="पार्टी नाम, मोबाइल, GSTIN से खोजें" value={query} onChange={(e) => setQuery(e.target.value)} className="sm:max-w-xs" />
          <Select className="sm:max-w-[160px]" defaultValue="सभी स्थिति"><option>सभी स्थिति</option><option>सक्रिय</option><option>निष्क्रिय</option></Select>
          <Button variant="outline" icon={Filter} size="sm">फिल्टर</Button>
        </div>
      </Card>

      <div className="hidden md:block">
        <DataTable
          columns={columns}
          rows={filtered}
          onEdit={() => pushToast('पार्टी संपादन फॉर्म खुलेगा', 'info')}
          onDelete={() => pushToast('पार्टी हटाई गई', 'warn')}
          footer={`कुल रिकॉर्ड: ${filtered.length}`}
        />
      </div>

      <div className="md:hidden space-y-2.5">
        {filtered.map((p) => (
          <Card key={p.id} className="p-3.5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-navy-100 text-navy-700 font-bold flex items-center justify-center shrink-0">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                  <Badge tone={p.type === 'ग्राहक' ? 'blue' : 'purple'}>{p.type}</Badge>
                </div>
                <p className="text-xs text-slate-400">{p.mobile} • {p.place}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
            </div>
          </Card>
        ))}
        <Button variant="primary" className="w-full mt-2" icon={Plus} onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')}>नई पार्टी जोड़ें</Button>
      </div>

      <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 space-y-1">
        <p>ⓘ नोट:</p>
        <p>• पार्टी प्रकार: ग्राहक = जिनको आप सामान बेचते हैं। सप्लायर = जिनसे आप सामान खरीदते हैं।</p>
        <p>• वकाया: ग्राहक से प्राप्त करना है। देय: सप्लायर को भुगतान करना है।</p>
        <p>• निष्क्रिय पार्टी का उपयोग नहीं किया जा रहा है।</p>
      </div>
    </Layout>
  )
}
