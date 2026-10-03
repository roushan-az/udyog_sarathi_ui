import React, { useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, CalendarDays, Landmark, Wallet,
  ChevronDown, Check, FileText, ArrowLeftRight, Lightbulb, Headset, Phone,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* ---------- Design tokens (same as SalesBill / Expense / Receipt / Payment) ---------- */
const C = {
  green: '#14612e',
  greenBorder: '#2f8f4e',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e9ecf0',
  required: '#dc2626',
  field: '#d9dde3',
}
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)' // same side padding as SalesBill mobile

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
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const acctIcon = (v) => (v === ACCOUNTS[0] ? Wallet : Landmark)

/* ---------- one shared form state for the desktop and mobile views ---------- */
function useTransferForm() {
  const { pushToast } = useApp()
  const [mode, setMode] = useState(TRANSFER_TYPES[0])
  const [date, setDate] = useState('2025-05-17')
  const [from, setFrom] = useState(ACCOUNTS[0])
  const [to, setTo] = useState(ACCOUNTS[1])
  const [amount, setAmount] = useState('25000')
  const [editingAmount, setEditingAmount] = useState(false)
  const [refNo, setRefNo] = useState('CD20250517001')
  const [remarks, setRemarks] = useState('नकद राशि SBI बैंक में जमा किया।')
  const [file, setFile] = useState(null)

  const same = from === to
  const amountDisplay = editingAmount
    ? String(amount)
    : Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const words = numberToWordsINR(Number(amount) || 0)

  const onFile = (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (f.size > 10 * 1024 * 1024) return pushToast('10 MB से बड़ी फ़ाइल जोड़ी नहीं गई', 'warn')
    setFile(f)
  }
  const save = () => {
    if (same) return pushToast('From और To एक जैसा नहीं हो सकता', 'warn')
    if (!(Number(amount) > 0)) return pushToast('सही राशि दर्ज करें', 'warn')
    pushToast('स्थानांतरण सफलतापूर्वक सहेजा गया')
  }
  const draft = () => pushToast('ड्राफ्ट सेव हो गया')
  const cancel = () => {
    setMode(TRANSFER_TYPES[0]); setDate(todayISO()); setFrom(ACCOUNTS[0]); setTo(ACCOUNTS[1])
    setAmount(''); setRefNo(''); setRemarks(''); setFile(null)
  }

  return {
    mode, setMode, date, setDate, from, setFrom, to, setTo, amount, setAmount, setEditingAmount,
    amountDisplay, words, refNo, setRefNo, remarks, setRemarks, file, onFile, same, save, draft, cancel,
    today: () => setDate(todayISO()),
  }
}

/* =====================================================================
   PAGE
   Desktop (lg+): Layout sidebar/header + PageHeader (same as SalesBill)
   Mobile (<lg):  fixed shell -> MobileHeader / scrolling body / sticky
                  actions / Layout's bottom nav (same as SalesBillMobile)
   ===================================================================== */
export default function CashBankTransfer() {
  const { pushToast } = useApp()
  const f = useTransferForm()

  return (
    <Layout title="Cash & Bank Transfer" subtitle="नकद / बैंक स्थानांतरण">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
        <PageHeader
          code="SCR-011"
          title="नकद / बैंक स्थानांतरण (Cash & Bank Transfer)"
          subtitle="कैश और बैंक खातों के बीच पैसे को स्थानांतरित करें"
          actions={
            <>
              <Button variant="outline" icon={FileSpreadsheet} size="sm" onClick={() => pushToast('Excel तैयार किया जा रहा है', 'info')}>Excel में निर्यात करें</Button>
              <Button variant="outline" icon={Printer} size="sm" onClick={() => pushToast('प्रिंट तैयार किया जा रहा है', 'info')}>PDF प्रिंट करें</Button>
              <Button variant="primary" icon={Plus} size="sm" onClick={f.cancel}>नया स्थानांतरण करें</Button>
            </>
          }
        />
        <DesktopBody f={f} />
        <p className="text-center text-xs font-semibold text-green-800 mt-3">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </div>

      {/* ===================== MOBILE (< lg) ===================== */}
      <CashBankTransferMobile f={f} />
    </Layout>
  )
}

/* =====================================================================
   DESKTOP BODY
   ===================================================================== */
function DesktopBody({ f }) {
  const { same } = f
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] gap-5">
      {/* ---------------- LEFT: form (single outer card) ---------------- */}
      <div className="rounded-2xl bg-white p-5 space-y-5 self-start" style={{ border: `1px solid ${C.border}` }}>
        {/* 1 + 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-x-9 gap-y-5">
          <div>
            <Label n="1." text="दिनांक" required />
            <div className="flex items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.label }} />
                <input type="date" value={f.date} onChange={(e) => f.setDate(e.target.value)} aria-label="दिनांक"
                  className="w-full h-11 rounded-lg border bg-white pl-10 pr-3 text-[13px] font-semibold outline-none focus:border-green-600"
                  style={{ borderColor: C.field, color: C.label }} />
              </div>
              <button type="button" onClick={f.today}
                className="h-11 rounded-lg border bg-white px-4 text-[12.5px] font-semibold whitespace-nowrap"
                style={{ borderColor: C.field, color: C.label }}>
                आज की तारीख
              </button>
            </div>
          </div>
          <div>
            <Label n="2." text="From (कहाँ से)" required />
            <SelectBox icon={acctIcon(f.from)} value={f.from} onChange={f.setFrom} options={ACCOUNTS} />
          </div>
        </div>

        {/* 3 + notice */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-x-9 gap-y-5 items-end">
          <div>
            <Label n="3." text="To (कहाँ तक)" required />
            <SelectBox icon={acctIcon(f.to)} value={f.to} onChange={f.setTo} options={ACCOUNTS} />
          </div>
          <Notice same={same} className="h-11 text-[12px]" />
        </div>

        {/* 4 + 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-9 gap-y-5">
          <div>
            <Label n="4." text="राशि (₹)" required />
            <div className="flex items-center h-11 rounded-lg px-3 bg-white focus-within:border-green-600" style={{ border: `1px solid ${C.field}` }}>
              <span className="text-[16px] font-semibold mr-3" style={{ color: C.text }}>₹</span>
              <input type="text" inputMode="decimal" value={f.amountDisplay} aria-label="राशि"
                onFocus={() => f.setEditingAmount(true)} onBlur={() => f.setEditingAmount(false)}
                onChange={(e) => f.setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="w-full min-w-0 bg-transparent outline-none text-[13px] font-semibold" style={{ color: C.label }} />
            </div>
            <Hint>अंकों में: {f.words}</Hint>
          </div>
          <div>
            <Label n="5." text="स्थानांतरण का प्रकार" required />
            <SelectBox icon={ArrowLeftRight} value={f.mode} onChange={f.setMode} options={TRANSFER_TYPES} />
          </div>
        </div>

        {/* 6 | 7 + 8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-9 gap-y-5">
          <div>
            <Label n="6." text="माध्यम" />
            <ModeList name="mode-d" value={f.mode} onChange={f.setMode} rowClass="h-[42px] px-3.5 gap-3 text-[13px]" />
          </div>

          <div className="space-y-5">
            <div>
              <Label n="7." text="संदर्भ संख्या (Reference No.)" />
              <input value={f.refNo} onChange={(e) => f.setRefNo(e.target.value)} aria-label="संदर्भ संख्या"
                className="w-full h-11 rounded-lg border bg-white px-3 text-[13px] font-semibold outline-none focus:border-green-600"
                style={{ borderColor: C.field, color: C.label }} />
              <p className="text-[11.5px] font-semibold mt-1.5" style={{ color: '#4a6fa5' }}>उदाहरण: CD20250517001 / TRF123456</p>
            </div>
            <div>
              <Label n="8." text="विवरण (Remarks)" />
              <div className="relative">
                <textarea rows={4} maxLength={150} value={f.remarks} onChange={(e) => f.setRemarks(e.target.value)} aria-label="विवरण"
                  className="w-full h-[136px] resize-none rounded-lg border bg-white px-3 py-2.5 pb-7 text-[13px] outline-none focus:border-green-600"
                  style={{ borderColor: C.field, color: C.muted }} />
                <span className="absolute right-3 bottom-2 text-[12px]" style={{ color: C.muted }}>{f.remarks.length}/150</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9 */}
        <div>
          <Label n="9." text="बिल /स्लिप अपलोड करें (वैकल्पिक)" />
          <UploadBox file={f.file} onFile={f.onFile} className="h-[88px] gap-2 px-3" titleCls="text-[12.5px]" subCls="text-[12px]" iconSize={18} />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-[1fr_1.6fr] sm:grid-cols-[1fr_1.5fr_1.4fr] gap-4 pt-1">
          <button type="button" onClick={f.cancel} className="h-[52px] rounded-lg border bg-white text-[13px] font-semibold" style={{ borderColor: C.field, color: C.label }}>
            रद्द करें
          </button>
          <button type="button" onClick={f.draft} className="hidden sm:inline-flex h-[52px] rounded-lg border bg-white text-[13px] font-semibold items-center justify-center gap-2" style={{ borderColor: C.field, color: C.label }}>
            <FileText size={18} /> Draft के रूप में सुरक्षित करें
          </button>
          <button type="button" onClick={f.save} className="h-[52px] rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2" style={{ background: C.green }}>
            <FileText size={18} /> स्थानांतरण सहेजें
          </button>
        </div>
      </div>

      {/* ---------------- RIGHT: info cards ---------------- */}
      <div className="space-y-3.5">
        <InfoCards />
      </div>
    </div>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg)
   Same shell as SalesBillMobile: MobileHeader on top, scrolling body,
   sticky action bar, then Layout's bottom nav. All sizes are clamp()-based
   so spacing, fonts and boxes scale with the screen width.
   ===================================================================== */
const boxH = cl(40, 11.5, 50)
const inputStyle = { color: C.label, fontSize: cl(12, 3.6, 15), fontWeight: 600 }
const iconBox = { width: cl(18, 5.2, 24), height: cl(18, 5.2, 24) }
const gap = cl(8, 3, 16)

function MLabel({ n, text, required, children, hint }) {
  return (
    <div className="min-w-0">
      <span className="block font-bold mb-1.5" style={{ color: C.label, fontSize: cl(12, 3.6, 15) }}>
        {n} {text}{required && <span style={{ color: C.required }}> *</span>}
      </span>
      {children}
      {hint}
    </div>
  )
}

function MBox({ children }) {
  return (
    <div className="relative flex items-center w-full rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field, height: boxH }}>
      {children}
    </div>
  )
}

function MSelect({ icon: Icon, value, onChange, options, label }) {
  return (
    <MBox>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconBox, color: C.green }} />
      <span className="truncate font-semibold pointer-events-none" style={{ ...inputStyle, paddingLeft: cl(40, 12, 52), paddingRight: 36 }}>{value}</span>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: cl(16, 4.6, 20), height: cl(16, 4.6, 20), color: C.text }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </MBox>
  )
}

function CashBankTransferMobile({ f }) {
  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>SCR-011</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>नकद / बैंक स्थानांतरण</h1>
          <p className="font-bold leading-tight mt-0.5" style={{ color: C.label, fontSize: cl(15, 4.6, 22) }}>(Cash &amp; Bank Transfer)</p>
          <p className="font-medium mt-1.5 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>कैश और बैंक खातों के बीच पैसे को स्थानांतरित करें</p>
        </div>

        {/* ---- form ---- */}
        <div className="mt-4 flex flex-col" style={{ gap: cl(12, 3.8, 20) }}>
          <MLabel n="1." text="दिनांक" required>
            <div className="flex items-center" style={{ gap }}>
              <div className="flex-1 min-w-0">
                <MBox>
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconBox, color: C.label }} />
                  <span className="font-semibold pointer-events-none" style={{ ...inputStyle, paddingLeft: cl(40, 12, 52) }}>{showDate(f.date)}</span>
                  <input type="date" value={f.date} aria-label="दिनांक" onChange={(e) => f.setDate(e.target.value)}
                    onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </MBox>
              </div>
              <button type="button" onClick={f.today}
                className="shrink-0 rounded-lg border bg-white font-semibold whitespace-nowrap active:bg-slate-50 focus-ring"
                style={{ borderColor: C.field, color: C.label, height: boxH, paddingInline: cl(10, 4, 20), fontSize: cl(11, 3.3, 14) }}>
                आज की तारीख
              </button>
            </div>
          </MLabel>

          <MLabel n="2." text="From (कहाँ से)" required>
            <MSelect icon={acctIcon(f.from)} value={f.from} onChange={f.setFrom} options={ACCOUNTS} label="From" />
          </MLabel>

          <div className="flex flex-col" style={{ gap: cl(8, 2.6, 12) }}>
            <MLabel n="3." text="To (कहाँ तक)" required>
              <MSelect icon={acctIcon(f.to)} value={f.to} onChange={f.setTo} options={ACCOUNTS} label="To" />
            </MLabel>
            <Notice same={f.same} style={{ minHeight: cl(36, 10.5, 46), fontSize: cl(11, 3.3, 13.5) }} />
          </div>

          <MLabel n="4." text="राशि (₹)" required
            hint={<p className="mt-1.5" style={{ color: C.muted, fontSize: cl(10, 3, 12.5) }}>अंकों में: {f.words}</p>}>
            <MBox>
              <span className="font-semibold pl-3 mr-3" style={{ color: C.text, fontSize: cl(15, 4.6, 19) }}>₹</span>
              <input type="text" inputMode="decimal" value={f.amountDisplay} aria-label="राशि"
                onFocus={() => f.setEditingAmount(true)} onBlur={() => f.setEditingAmount(false)}
                onChange={(e) => f.setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="flex-1 min-w-0 h-full bg-transparent pr-3 outline-none" style={inputStyle} />
            </MBox>
          </MLabel>

          <MLabel n="5." text="स्थानांतरण का प्रकार" required>
            <MSelect icon={ArrowLeftRight} value={f.mode} onChange={f.setMode} options={TRANSFER_TYPES} label="स्थानांतरण का प्रकार" />
          </MLabel>

          <MLabel n="6." text="माध्यम">
            <ModeList name="mode-m" value={f.mode} onChange={f.setMode}
              rowClass="px-3 gap-3" rowStyle={{ minHeight: cl(38, 10.8, 46), fontSize: cl(11.5, 3.4, 14) }} />
          </MLabel>

          <MLabel n="7." text="संदर्भ संख्या (Reference No.)"
            hint={<p className="mt-1.5 font-semibold" style={{ color: '#4a6fa5', fontSize: cl(10, 3, 12.5) }}>उदाहरण: CD20250517001 / TRF123456</p>}>
            <MBox>
              <input value={f.refNo} onChange={(e) => f.setRefNo(e.target.value)} aria-label="संदर्भ संख्या"
                className="flex-1 min-w-0 h-full bg-transparent px-3 outline-none" style={inputStyle} />
            </MBox>
          </MLabel>

          <MLabel n="8." text="विवरण (Remarks)">
            <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
              <textarea rows={3} maxLength={150} value={f.remarks} onChange={(e) => f.setRemarks(e.target.value)} aria-label="विवरण"
                className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-6 outline-none"
                style={{ color: C.muted, fontSize: cl(12, 3.6, 15), minHeight: cl(84, 25, 110) }} />
              <span className="absolute right-3 bottom-1.5" style={{ color: C.muted, fontSize: cl(10, 3, 12.5) }}>{f.remarks.length}/150</span>
            </div>
          </MLabel>

          <MLabel n="9." text="बिल /स्लिप अपलोड करें (वैकल्पिक)">
            <UploadBox file={f.file} onFile={f.onFile} className="gap-1.5 px-3"
              style={{ minHeight: cl(76, 22, 100) }} titleCls="" subCls=""
              titleStyle={{ fontSize: cl(11.5, 3.5, 14.5) }} subStyle={{ fontSize: cl(10.5, 3.2, 13) }} iconSize={18} />
          </MLabel>
        </div>

        {/* ---- info cards (stack under the form on phones; 2-up on tablets) ---- */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 items-start" style={{ gap: cl(10, 3, 16) }}>
          <div className="sm:col-span-2 rounded-xl border bg-[#f0faf3] text-center font-bold" style={{ borderColor: '#cfe8d6', color: C.green, padding: cl(12, 3.6, 18), fontSize: cl(14, 4.3, 19) }}>
            नकद / बैंक स्थानांतरण के नियम
          </div>
          <InfoCards />
        </div>

        <p className="text-center font-semibold mt-4" style={{ color: C.green, fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav (same bar as SalesBill) ---- */}
      <div className="shrink-0 grid grid-cols-[1fr_1.6fr] border-t bg-white py-2.5" style={{ borderColor: C.border, gap: cl(10, 3.5, 18), paddingInline: PAD }}>
        <button type="button" onClick={f.cancel} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label, height: boxH, fontSize: cl(13, 3.9, 16) }}>
          रद्द करें
        </button>
        <button type="button" onClick={f.save} className="rounded-lg font-semibold text-white active:opacity-90 focus-ring inline-flex items-center justify-center gap-2" style={{ background: C.green, height: boxH, fontSize: cl(13, 3.9, 16) }}>
          <FileText style={{ width: cl(16, 4.6, 20), height: cl(16, 4.6, 20) }} /> स्थानांतरण सहेजें
        </button>
      </div>
    </div>
  )
}

/* ====================== shared helpers ====================== */

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

function Notice({ same, className = '', style }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-md px-3.5 font-medium ${className}`}
      style={{
        ...(same
          ? { background: '#fef2f2', border: '1px solid #fecaca', color: C.required }
          : { background: '#eef7f0', border: '1px solid #d7ebdc', color: C.green }),
        ...style,
      }}
      role={same ? 'alert' : undefined}
    >
      <span className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: same ? C.required : C.green }}>i</span>
      From और To एक जैसा नहीं हो सकता।
    </div>
  )
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

/* radio list used by both views (name differs so the two never clash) */
function ModeList({ name, value, onChange, rowClass, rowStyle }) {
  return (
    <div className="rounded-lg bg-white overflow-hidden" style={{ border: `1px solid ${C.field}` }}>
      {TRANSFER_TYPES.map((t, i) => (
        <label key={t} className={`flex items-center cursor-pointer font-semibold ${rowClass}`}
          style={{ color: C.text, borderTop: i ? `1px solid ${C.border}` : 'none', ...rowStyle }}>
          <input type="radio" name={name} className="sr-only" checked={value === t} onChange={() => onChange(t)} />
          {value === t ? (
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
              <Check size={13} strokeWidth={3} />
            </span>
          ) : (
            <span className="w-5 h-5 rounded-full border shrink-0" style={{ borderColor: C.label }} />
          )}
          <span className="min-w-0">{t}</span>
        </label>
      ))}
    </div>
  )
}

function UploadBox({ file, onFile, className = '', style, titleCls, subCls, titleStyle, subStyle, iconSize = 18 }) {
  return (
    <label className={`flex flex-col items-center justify-center rounded-lg cursor-pointer text-center focus-within:ring-2 focus-within:ring-green-600/40 ${className}`}
      style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#fcfefc', ...style }}>
      <span className={`flex items-center gap-2 font-bold ${titleCls}`} style={{ color: C.green, ...titleStyle }}>
        <Paperclip size={iconSize} className="shrink-0" /> फोटो / PDF / Document अपलोड करें
      </span>
      <span className={`font-bold max-w-full truncate ${subCls}`} style={{ color: C.label, ...subStyle }}>
        {file ? file.name : 'अधिकतम साइज़: 10 MB'}
      </span>
      <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
    </label>
  )
}

/* ---------- right-hand information cards ---------- */
function InfoCards() {
  return (
    <>
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
    </>
  )
}

function InfoCard({ bg, border, children }) {
  return <div className="rounded-xl p-4 min-w-0" style={{ background: bg, border: `1px solid ${border}` }}>{children}</div>
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