import React, { useState } from 'react'
import {
  Search, Filter, Plus, FileSpreadsheet, Printer, ChevronRight, ChevronLeft, ChevronDown,
  Users, UserCheck, Truck, Ban, Wallet, RefreshCw, Info, Pencil, Trash2,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { parties, partySummary } from '../data/mockData'
import noteImg from '../assets/party-note-illustration.png'
import { useApp } from '../context/AppContext'

/* ---------- helpers ---------- */
const fmt2 = (n) =>
  Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const pad2 = (n) => String(n).padStart(2, '0')

const NAVY = 'text-[#1b2a5c]'
const GREEN = 'text-[#0b7a3e]'

const pill = 'inline-block rounded-md border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap'
const typeStyle = {
  'ग्राहक': 'bg-green-50 text-green-700 border-green-300',
  'सप्लायर': 'bg-purple-50 text-purple-700 border-purple-300',
}
const ledgerStyle = {
  'वकाया': 'bg-green-50 text-green-700 border-green-300',
  'देय': 'bg-red-50 text-red-600 border-red-300',
}
const statusStyle = {
  'सक्रिय': 'bg-green-50 text-green-700 border-green-300',
  'निष्क्रिय': 'bg-slate-100 text-slate-600 border-slate-300',
}

/* ---------- building blocks ---------- */
function SummaryCard({ label, value, icon, bg, border, labelColor }) {
  return (
    <div className={`rounded-xl border ${border} ${bg} px-4 py-3.5 flex items-center justify-between shadow-sm`}>
      <div className="min-w-0">
        <p className={`text-xs font-bold ${labelColor} leading-tight`}>{label}</p>
        <p className={`mt-2 text-xl font-bold ${NAVY} leading-none whitespace-nowrap`}>{value}</p>
      </div>
      <div className="shrink-0 ml-2">{icon}</div>
    </div>
  )
}

function FilterSelect({ value, onChange, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={`w-full h-10 appearance-none rounded-lg border border-slate-300 bg-white pl-3.5 pr-9 text-sm font-semibold ${NAVY} focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
      >
        {children}
      </select>
      <ChevronDown size={16} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${NAVY}`} />
    </div>
  )
}

const OutlineBtn = ({ icon: Icon, iconClass = NAVY, children, ...rest }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm font-bold ${NAVY} hover:bg-slate-50 whitespace-nowrap`}
    {...rest}
  >
    <Icon size={18} className={iconClass} />
    {children}
  </button>
)

/* ---------- page ---------- */
export default function PartyMaster() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('सभी प्रकार')
  const [status, setStatus] = useState('सभी स्थिति')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = parties.filter((p) => {
    const q = query.toLowerCase()
    const matchesQuery = !query || p.name.toLowerCase().includes(q) || (p.mobile || '').includes(query) || (p.gstin || '').toLowerCase().includes(q)
    const matchesType = type === 'सभी प्रकार' || p.type === type
    const matchesStatus = status === 'सभी स्थिति' || p.status === status
    return matchesQuery && matchesType && matchesStatus
  })

  const isFiltered = query || type !== 'सभी प्रकार' || status !== 'सभी स्थिति'
  const totalRecords = isFiltered ? filtered.length : Math.max(partySummary.total, filtered.length)
  const from = totalRecords === 0 ? 0 : (page - 1) * rowsPerPage + 1
  const to = Math.min(page * rowsPerPage, totalRecords)
  const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)
  const lastPage = Math.max(1, Math.ceil(totalRecords / rowsPerPage))

  const resetFilters = () => {
    setQuery('')
    setType('सभी प्रकार')
    setStatus('सभी स्थिति')
    setPage(1)
  }

  const headers = [
    'SL No.', 'पार्टी नाम', 'प्रकार', 'मोबाइल नंबर', 'स्थान', 'GSTIN',
    'खाता प्रकार', 'कुल वकाया / देय (₹)', 'स्थिति', 'कार्यवाही',
  ]
  const cell = 'px-3 py-3 text-center text-[13px] font-semibold border-r border-slate-200 last:border-r-0'

  return (
    <Layout title="पार्टी मास्टर" subtitle="सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें">
      <PageHeader
        code="SCR-007"
        title="पार्टी मास्टर"
        subtitle="सभी ग्राहकों और सप्लायर की जानकारी यहाँ प्रवंधित करें"
        actions={
          <>
            <OutlineBtn icon={FileSpreadsheet} iconClass="text-green-700">एक्सपोर्ट (Excel)</OutlineBtn>
            <OutlineBtn icon={Printer}>प्रिंट करें</OutlineBtn>
            <button
              type="button"
              onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0b7a3e] hover:bg-[#096a35] text-white text-sm font-bold whitespace-nowrap"
            >
              <Plus size={18} />
              नई पार्टी जोड़ें
            </button>
          </>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5">
        <SummaryCard
          label="कुल पार्टी" value={partySummary.total}
          bg="bg-gradient-to-br from-white to-blue-50" border="border-blue-100" labelColor="text-blue-700"
          icon={<Users size={26} strokeWidth={1.8} className="text-blue-600" />}
        />
        <SummaryCard
          label="ग्राहक" value={partySummary.customers}
          bg="bg-gradient-to-br from-white to-green-50" border="border-green-100" labelColor="text-green-700"
          icon={<UserCheck size={26} strokeWidth={1.8} className="text-green-700" />}
        />
        <SummaryCard
          label="सप्लायर" value={partySummary.suppliers}
          bg="bg-gradient-to-br from-white to-purple-50" border="border-purple-100" labelColor="text-purple-700"
          icon={<Truck size={26} strokeWidth={1.8} className="text-purple-600" />}
        />
        <SummaryCard
          label="निष्क्रिय पार्टी" value={pad2(partySummary.inactive)}
          bg="bg-gradient-to-br from-white to-orange-50" border="border-orange-100" labelColor="text-orange-600"
          icon={<Ban size={26} strokeWidth={1.8} className="text-orange-500" />}
        />
        <SummaryCard
          label="कुल वकाया (ग्राहक)" value={`₹ ${fmt2(partySummary.totalReceivable)}`}
          bg="bg-gradient-to-br from-white to-sky-50" border="border-sky-100" labelColor="text-[#1b2a5c]"
          icon={<Wallet size={26} strokeWidth={1.8} className="text-blue-600" />}
        />
        <SummaryCard
          label="कुल देय (सप्लायर)" value={`₹ ${fmt2(partySummary.totalPayable)}`}
          bg="bg-gradient-to-br from-white to-purple-50" border="border-purple-100" labelColor="text-[#1b2a5c]"
          icon={<Wallet size={26} strokeWidth={1.8} className="text-purple-600" />}
        />
      </div>

      {/* Filter bar */}
      <Card className="p-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
          <div className="relative flex-1 min-w-0">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="पार्टी नाम, मोबाइल, GSTIN से खोजें"
              className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <FilterSelect value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} className="sm:w-[200px]">
            <option>सभी प्रकार</option>
            <option>ग्राहक</option>
            <option>सप्लायर</option>
          </FilterSelect>
          <FilterSelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="sm:w-[180px]">
            <option>सभी स्थिति</option>
            <option>सक्रिय</option>
            <option>निष्क्रिय</option>
          </FilterSelect>
          <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-slate-300 bg-white text-sm font-bold ${NAVY} hover:bg-slate-50`}
          >
            <Filter size={17} />
            फिल्टर
          </button>
          <button
            type="button"
            onClick={resetFilters}
            title="रीसेट"
            className={`inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-300 bg-white ${NAVY} hover:bg-slate-50 sm:ml-auto`}
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </Card>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {headers.map((h) => (
                  <th key={h} className={`px-3 py-3 text-center text-[13px] font-bold ${NAVY} border-r border-slate-200 last:border-r-0 whitespace-nowrap`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p, i) => (
                <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50/60">
                  <td className={`${cell} ${NAVY}`}>{(page - 1) * rowsPerPage + i + 1}</td>
                  <td className={`${cell} ${NAVY} font-bold`}>{p.name}</td>
                  <td className={cell}>
                    <span className={`${pill} ${typeStyle[p.type] || typeStyle['ग्राहक']}`}>{p.type}</span>
                  </td>
                  <td className={`${cell} ${NAVY}`}>{p.mobile}</td>
                  <td className={`${cell} ${NAVY}`}>{p.place}</td>
                  <td className={`${cell} ${NAVY}`}>{p.gstin || '–'}</td>
                  <td className={cell}>
                    <span className={`${pill} ${ledgerStyle[p.ledger] || ledgerStyle['वकाया']}`}>{p.ledger}</span>
                  </td>
                  <td className={`${cell} font-bold ${p.ledger === 'देय' ? 'text-red-600' : NAVY}`}>{fmt2(p.balance)}</td>
                  <td className={cell}>
                    <span className={`${pill} ${statusStyle[p.status] || statusStyle['सक्रिय']}`}>{p.status}</span>
                  </td>
                  <td className={cell}>
                    <div className="flex items-center justify-center gap-3">
                      <button type="button" aria-label="संपादित करें" onClick={() => pushToast('पार्टी संपादन फॉर्म खुलेगा', 'info')} className="text-blue-700 hover:text-blue-900">
                        <Pencil size={16} />
                      </button>
                      <button type="button" aria-label="हटाएँ" onClick={() => pushToast('पार्टी हटाई गई', 'warn')} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={headers.length} className="py-10 text-center text-sm text-slate-400">कोई रिकॉर्ड नहीं मिला</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <p className={`text-[13px] font-bold ${NAVY}`}>कुल रिकॉर्ड: {totalRecords}</p>
          <div className="flex items-center gap-4">
            <span className={`text-[13px] font-semibold ${NAVY}`}>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1) }}
                className={`h-9 w-[72px] appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-7 text-sm font-semibold ${NAVY} focus:outline-none`}
              >
                {[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}
              </select>
              <ChevronDown size={15} className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${NAVY}`} />
            </div>
            <span className={`text-[13px] font-semibold ${NAVY}`}>{from}-{to} of {totalRecords}</span>
            <div className="flex items-center gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((n) => n - 1)} className={`${NAVY} disabled:opacity-30`} aria-label="पिछला">
                <ChevronLeft size={18} />
              </button>
              <button type="button" disabled={page >= lastPage} onClick={() => setPage((n) => n + 1)} className={`${NAVY} disabled:opacity-30`} aria-label="अगला">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-2.5">
        {filtered.map((p) => (
          <Card key={p.id} className="p-3.5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-slate-100 text-[#1b2a5c] font-bold flex items-center justify-center shrink-0">
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`font-bold ${NAVY} truncate`}>{p.name}</p>
                  <span className={`${pill} ${typeStyle[p.type] || typeStyle['ग्राहक']}`}>{p.type}</span>
                </div>
                <p className="text-xs text-slate-400">{p.mobile} • {p.place}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 shrink-0" />
            </div>
          </Card>
        ))}
        <button
          type="button"
          onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-[#0b7a3e] text-white text-sm font-bold"
        >
          <Plus size={18} />
          नई पार्टी जोड़ें
        </button>
      </div>

      {/* Note */}
      <div className="mt-5 rounded-xl bg-green-50/70 border border-green-200 px-5 py-4 flex items-center justify-between gap-4">
        <div className={`text-[13px] ${NAVY}`}>
          <p className={`flex items-center gap-2 font-bold mb-2 ${GREEN}`}>
            <Info size={18} />
            नोट:
          </p>
          <ul className="list-disc pl-9 space-y-1.5 font-medium">
            <li>पार्टी प्रकार: ग्राहक = जिनको आप सामान बेचते हैं। सप्लायर = जिनसे आप सामान खरीदते हैं।</li>
            <li>वकाया: ग्राहक से प्राप्त करना है। देय: सप्लायर को भुगतान करना है।</li>
            <li>निष्क्रिय पार्टी का उपयोग नहीं किया जा रहा है।</li>
          </ul>
        </div>
        <img src={noteImg} alt="" className="h-24 w-auto shrink-0 hidden sm:block select-none" />
      </div>
    </Layout>
  )
}
