import React, { useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, CalendarDays, Landmark, Wallet,
  ChevronDown, Check, FileText, ArrowLeftRight, Lightbulb, Headset, Phone,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* ---------- Design tokens (same as Expense / Receipt / Payment) ---------- */
const C = {
  green: '#14612e',
  greenSoft: '#eef7f0',
  greenBorder: '#2f8f4e',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e9ecf0',
  required: '#dc2626',
  field: '#d9dde3',
}

const TRANSFER_TYPES = [
  'Cash Deposit (नकद जमा)',
  'Cash Withdrawal (नकद निकासी)',
  'Bank Transfer (बैंक ट्रांसफर)',
  'Cheque Deposit (चेक जमा)',
  'Cheque Withdrawal (चेक निकासी)',
]
const ACCOUNTS = ['नकद (Cash)', 'SBI Current A/c - 12345678901']

const todayISO = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export default function CashBankTransfer() {
  const { pushToast } = useApp()
  const [mode, setMode] = useState(TRANSFER_TYPES[0])
  const [date, setDate] = useState('2025-05-17')
  const [from, setFrom] = useState(ACCOUNTS[0])
  const [to, setTo] = useState(ACCOUNTS[1])
  const [remarks, setRemarks] = useState('नकद राशि SBI बैंक में जमा किया।')
  const [amount, setAmount] = useState(25000)
  const [editingAmount, setEditingAmount] = useState(false)

  const same = from === to
  const amountDisplay = editingAmount
    ? String(amount)
    : Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const acctIcon = (v) => (v === ACCOUNTS[0] ? Wallet : Landmark)

  return (
    <Layout title="Cash & Bank Transfer" subtitle="नकद / बैंक स्थानांतरण">
      {/* ---------------- Page header ---------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex items-center rounded-lg px-3.5 py-2 text-[13px] font-bold text-white leading-none" style={{ background: C.green }}>
            SCR-011
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: C.text }}>नकद / बैंक स्थानांतरण (Cash &amp; Bank Transfer)</h1>
            <p className="text-[13px] font-medium mt-0.5" style={{ color: C.text }}>कैश और बैंक खातों के बीच पैसे को स्थानांतरित करें</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HeaderBtn icon={FileSpreadsheet} iconColor="#16a34a">Excel में निर्यात करें</HeaderBtn>
          <HeaderBtn icon={Printer} iconColor="#2563eb">PDF प्रिंट करें</HeaderBtn>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-5 h-11 text-[13px] font-semibold text-white" style={{ background: C.green }}>
            <Plus size={18} /> नया स्थानांतरण करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] gap-5">
        {/* ---------------- LEFT: form (single outer card) ---------------- */}
        <div className="rounded-2xl bg-white p-5 space-y-5 self-start" style={{ border: `1px solid ${C.border}` }}>
          {/* 1 + 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-x-9 gap-y-5">
            <div>
              <Label n="1." text="दिनांक" required />
              <div className="flex items-center gap-3">
                <div className="relative flex-1 min-w-0">
                  <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.label }} />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 rounded-lg border bg-white pl-10 pr-3 text-[13px] font-semibold outline-none focus:border-green-600"
                    style={{ borderColor: C.field, color: C.label }} />
                </div>
                <button type="button" onClick={() => setDate(todayISO())}
                  className="h-11 rounded-lg border bg-white px-4 text-[12.5px] font-semibold whitespace-nowrap"
                  style={{ borderColor: C.field, color: C.label }}>
                  आज की तारीख
                </button>
              </div>
            </div>
            <div>
              <Label n="2." text="From (कहाँ से)" required />
              <SelectBox icon={acctIcon(from)} value={from} onChange={setFrom} options={ACCOUNTS} />
            </div>
          </div>

          {/* 3 + notice */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-x-9 gap-y-5 items-end">
            <div>
              <Label n="3." text="To (कहाँ तक)" required />
              <SelectBox icon={acctIcon(to)} value={to} onChange={setTo} options={ACCOUNTS} />
            </div>
            <div
              className="flex items-center gap-2.5 rounded-md px-3.5 h-11 text-[12px] font-medium"
              style={same
                ? { background: '#fef2f2', border: '1px solid #fecaca', color: C.required }
                : { background: '#eef7f0', border: '1px solid #d7ebdc', color: C.green }}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ background: same ? C.required : C.green }}>i</span>
              From और To एक जैसा नहीं हो सकता।
            </div>
          </div>

          {/* 4 + 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-9 gap-y-5">
            <div>
              <Label n="4." text="राशि (₹)" required />
              <div className="flex items-center h-11 rounded-lg px-3 bg-white" style={{ border: `1px solid ${C.field}` }}>
                <span className="text-[16px] font-semibold mr-3" style={{ color: C.text }}>₹</span>
                <input type="text" inputMode="decimal" value={amountDisplay}
                  onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full min-w-0 bg-transparent outline-none text-[13px] font-semibold" style={{ color: C.label }} />
              </div>
              <Hint>अंकों में: {numberToWordsINR(Number(amount) || 0)}</Hint>
            </div>
            <div>
              <Label n="5." text="स्थानांतरण का प्रकार" required />
              <SelectBox icon={ArrowLeftRight} value={mode} onChange={setMode} options={TRANSFER_TYPES} />
            </div>
          </div>

          {/* 6 | 7 + 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-9 gap-y-5">
            <div>
              <Label n="6." text="माध्यम" />
              <div className="rounded-lg bg-white overflow-hidden" style={{ border: `1px solid ${C.field}` }}>
                {TRANSFER_TYPES.map((t, i) => (
                  <label key={t} className="flex items-center gap-3 h-[42px] px-3.5 cursor-pointer text-[13px] font-semibold"
                    style={{ color: C.text, borderTop: i ? `1px solid ${C.border}` : 'none' }}>
                    <input type="radio" name="mode" className="hidden" checked={mode === t} onChange={() => setMode(t)} />
                    {mode === t ? (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border shrink-0" style={{ borderColor: C.label }} />
                    )}
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label n="7." text="संदर्भ संख्या (Reference No.)" />
                <input defaultValue="CD20250517001"
                  className="w-full h-11 rounded-lg border bg-white px-3 text-[13px] font-semibold outline-none focus:border-green-600"
                  style={{ borderColor: C.field, color: C.label }} />
                <p className="text-[11.5px] font-semibold mt-1.5" style={{ color: '#4a6fa5' }}>उदाहरण: CD20250517001 / TRF123456</p>
              </div>
              <div>
                <Label n="8." text="विवरण (Remarks)" />
                <div className="relative">
                  <textarea rows={4} maxLength={150} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                    className="w-full h-[136px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600"
                    style={{ borderColor: C.field, color: C.muted }} />
                  <span className="absolute right-3 bottom-2 text-[12px]" style={{ color: C.muted }}>{remarks.length}/150</span>
                </div>
              </div>
            </div>
          </div>

          {/* 9 */}
          <div>
            <Label n="9." text="बिल /स्लिप अपलोड करें (वैकल्पिक)" />
            <label className="flex flex-col items-center justify-center gap-2 h-[88px] rounded-lg cursor-pointer text-center px-3"
              style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#fcfefc' }}>
              <span className="flex items-center gap-2 text-[12.5px] font-bold" style={{ color: C.green }}>
                <Paperclip size={18} /> फोटो / PDF / Document अपलोड करें
              </span>
              <span className="text-[12px] font-bold" style={{ color: C.label }}>अधिकतम साइज़: 10 MB</span>
              <input type="file" className="hidden" />
            </label>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-[1fr_1.6fr] sm:grid-cols-[1fr_1.5fr_1.4fr] gap-4 pt-1">
            <button type="button" className="h-[52px] rounded-lg border bg-white text-[13px] font-semibold" style={{ borderColor: C.field, color: C.label }}>
              रद्द करें
            </button>
            <button type="button" className="hidden sm:inline-flex h-[52px] rounded-lg border bg-white text-[13px] font-semibold items-center justify-center gap-2" style={{ borderColor: C.field, color: C.label }}>
              <FileText size={18} /> Draft के रूप में सुरक्षित करें
            </button>
            <button type="button" onClick={() => pushToast('स्थानांतरण सफलतापूर्वक सहेजा गया')}
              className="h-[52px] rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2" style={{ background: C.green }}>
              <FileText size={18} /> स्थानांतरण सहेजें
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT: info cards ---------------- */}
        <div className="space-y-3.5">
          <InfoCard bg="#f0faf3" border="#cfe8d6">
            <CardTitle color="#15803d" icon={<Dot bg="#15803d"><Check size={13} strokeWidth={3} /></Dot>}>यह क्या है?</CardTitle>
            <p className="text-[12.5px] leading-relaxed" style={{ color: C.text }}>यह पैसा कहीं से कहीं भेजने का लेन-देन है।</p>
            <p className="text-[12.5px] leading-relaxed mt-1" style={{ color: C.text }}>इसमें और कोई आय आवक नहीं है, न लाभ न हानि।</p>
          </InfoCard>

          <InfoCard bg="#f3f6ff" border="#d6e0f7">
            <CardTitle color="#1d4ed8" icon={<FileText size={19} style={{ color: '#2563eb' }} />}>उदाहरण</CardTitle>
            <Bullets items={[
              'नकद को बैंक में जमा करना',
              'बैंक से नकद निकालना',
              'एक बैंक खाते से दूसरे बैंक खाते में भेजना',
              'करंट अकाउंट से सेविंग अकाउंट में भेजना',
            ]} />
          </InfoCard>

          <InfoCard bg="#f8f4ff" border="#e0d5f7">
            <CardTitle color="#6d28d9" icon={<Dot bg="#7c3aed"><span className="text-[12px] font-bold">?</span></Dot>}>ध्यान दें</CardTitle>
            <Bullets items={[
              'From और To एक जैसा नहीं हो सकता।',
              'यह लेन-देन आपके Cash Balance और Bank Balance को अपडेट करेगा।',
              'P&L पर कोई प्रभाव नहीं पड़ेगा।',
            ]} />
          </InfoCard>

          <InfoCard bg="#fffbeb" border="#fde9b0">
            <CardTitle color="#c2410c" icon={<Lightbulb size={19} style={{ color: '#d97706' }} />}>कैसे काम करता है?</CardTitle>
            <Flow title="Cash → Bank" desc="नकद से बैंक में जमा" rows={[['Cash घटेगा', '(-)'], ['Bank बढ़ेगा', '(+)']]} />
            <Flow title="Bank → Cash" desc="बैंक से नकद निकासी" rows={[['Cash बढ़ेगा', '(+)'], ['Bank घटेगा', '(-)']]} />
            <Flow title="Bank → Bank" desc="एक बैंक से दूसरे में भेजना" rows={[['पहले Bank से घटेगा', '(-)'], ['दूसरे Bank में बढ़ेगा', '(+)']]} />
          </InfoCard>

          <InfoCard bg="#fff5f5" border="#fbd0d0">
            <CardTitle color="#dc2626" icon={<Headset size={19} style={{ color: '#dc2626' }} />}>सहायता चाहिए?</CardTitle>
            <p className="text-[12.5px] mb-2" style={{ color: C.text }}>कोई समस्या हो तो हमसे संपर्क करें।</p>
            <a href="tel:18001234567" className="inline-flex items-center gap-2 text-[14px] font-bold" style={{ color: '#dc2626' }}>
              <Phone size={17} /> 1800-123-4567
            </a>
          </InfoCard>
        </div>
      </div>
    </Layout>
  )
}

/* ====================== helpers ====================== */

function Label({ n, text, required }) {
  return (
    <div className="mb-2">
      <span className="text-[14px] font-bold" style={{ color: C.label }}>
        {n} {text}{required && <span style={{ color: C.required }}> *</span>}
      </span>
    </div>
  )
}

function Hint({ children }) {
  return <p className="text-[12px] mt-2" style={{ color: C.muted }}>{children}</p>
}

function SelectBox({ icon: Icon, options, value, onChange }) {
  return (
    <div className="relative">
      <div className="flex items-center h-11 rounded-lg border bg-white pl-12 pr-10" style={{ borderColor: C.field }}>
        <p className="text-[13px] font-semibold truncate" style={{ color: C.label }}>{value}</p>
      </div>
      <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.green }} />
      <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label={value}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function HeaderBtn({ icon: Icon, iconColor, children }) {
  return (
    <button type="button" className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 h-11 text-[12.5px] font-semibold" style={{ borderColor: C.field, color: C.label }}>
      <Icon size={20} style={{ color: iconColor }} />
      {children}
    </button>
  )
}

function InfoCard({ bg, border, children }) {
  return <div className="rounded-xl p-4" style={{ background: bg, border: `1px solid ${border}` }}>{children}</div>
}

function CardTitle({ icon, color, children }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      {icon}
      <p className="text-[14px] font-semibold" style={{ color }}>{children}</p>
    </div>
  )
}

function Dot({ bg, children }) {
  return (
    <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white shrink-0" style={{ background: bg }}>
      {children}
    </span>
  )
}

function Bullets({ items }) {
  return (
    <ul className="list-disc pl-6 space-y-2 text-[12.5px]" style={{ color: C.text }}>
      {items.map((t) => <li key={t}>{t}</li>)}
    </ul>
  )
}

function Flow({ title, desc, rows }) {
  return (
    <div className="mb-2.5 last:mb-0">
      <p className="text-[12.5px] font-semibold mb-1" style={{ color: '#2563eb' }}>• {title}</p>
      <p className="text-[12.5px] pl-3 mb-0.5" style={{ color: C.text }}>{desc}</p>
      {rows.map(([t, s]) => (
        <div key={t} className="flex items-center justify-between pl-3 pr-8 text-[12.5px]" style={{ color: C.text }}>
          <span>{t}</span>
          <span className="font-semibold">{s}</span>
        </div>
      ))}
    </div>
  )
}