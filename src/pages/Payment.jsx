import React, { useEffect, useRef, useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, CalendarDays, UserPlus, Banknote, Landmark, Info,
  ChevronDown, Check, FileText, ArrowRight, Lightbulb, HandCoins, CreditCard, BadgeCheck, Save, X,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* =====================================================================
   SCR-010  भुगतान दर्ज करें (Payment Entry)
   • one shared form state (usePaymentForm) feeds BOTH layouts
   • < 1024px  -> mobile layout  (MobileHeader + title block + bottom nav)
   • >= 1024px -> desktop layout (PageHeader + form card + rules column)
   ===================================================================== */

/* ---------- design tokens ---------- */
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
  red: '#dc2626',
}
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)'
const TINT = { background: '#f7faff', borderColor: '#c9d8f2' }

const THEMES = {
  blue: { bg: '#f2f7ff', border: '#c7dbf7', num: '#3b6ef5', title: '#1d4ed8' },
  purple: { bg: '#f7f3ff', border: '#d9cdf5', num: '#7c3aed', title: '#6d28d9' },
  orange: { bg: '#fff6f0', border: '#f8d5c2', num: '#f97316', title: '#c2410c' },
  green: { bg: '#f0faf3', border: '#bfe0c8', num: '#15803d', title: '#15803d' },
}

/* ---------- data ---------- */
const RULES = [
  { n: 1, key: 'supplier', color: 'blue', title: 'Supplier Payment (आपूर्तिकर्ता को भुगतान)', typeLabel: 'Payment to Supplier (आपूर्तिकर्ता को भुगतान)', desc: 'व्यवसाय द्वारा सामान/सेवा के बदले में सप्लायर को भुगतान।', effects: ['संबंधित party का बकाया कम होगा।', 'Bank/Cash Ledger कम होगा।'] },
  { n: 2, key: 'refund', color: 'purple', title: 'Customer Refund (ग्राहक को वापसी)', typeLabel: 'Customer Refund (ग्राहक को वापसी)', desc: 'ग्राहक को अधिक भुगतान या रिफंड देने पर।', effects: ['संबंधित customer का बकाया कम होगा।', 'Bank/Cash Ledger कम होगा।'] },
  { n: 3, key: 'salary', color: 'orange', title: 'Salary Payment (वेतन भुगतान)', typeLabel: 'Salary Payment (वेतन भुगतान)', desc: 'कर्मचारियों के वेतन के भुगतान के लिए।', effects: ['P&L में Salary Expense घटेगा।', 'Bank/Cash Ledger कम होगा।'] },
  { n: 4, key: 'other', color: 'green', title: 'Other Payment (अन्य भुगतान)', typeLabel: 'Other Payment (अन्य भुगतान)', desc: 'किराया, विद्युत बिल, फोन बिल, लोन EMI, टैक्स आदि के लिए।', effects: ['संबंधित Expense खाता घटेगा।', 'Bank/Cash Ledger कम होगा।'] },
]
const TYPE_LABELS = RULES.map((r) => r.typeLabel)
const ruleOfLabel = (label) => RULES.find((r) => r.typeLabel === label) || RULES[0]

const NOTES = [
  'यदि आप Cash चुनते हैं, तो Cash Balance से पैसा घटेगा।',
  'यदि आप Bank चुनते हैं, तो चुने गए बैंक खाते का Balance घटेगा।',
  'यह स्क्रीन पैसा "बाहर जाने" के लिए है।',
]

// sample master data (replace with API data)
const PARTIES = {
  supplier: [
    { name: 'मनोज ट्रेडर्स (MT0008)', balance: 48250, creditEnd: '25/05/2025', bills: [
      { no: 'Bill No. 145', date: '05/05/2025', total: 48250, due: 48250 },
      { no: 'Bill No. 152', date: '12/05/2025', total: 18000, due: 9000 },
    ] },
    { name: 'मनीष ट्रेडर्स (MT0012)', balance: 22400, creditEnd: '30/05/2025', bills: [
      { no: 'Bill No. 160', date: '08/05/2025', total: 22400, due: 22400 },
    ] },
    { name: 'रवि ट्रेडर्स (MT0003)', balance: 0, creditEnd: '', bills: [] },
  ],
  refund: [
    { name: 'शिव ट्रेडर्स (CU0011)', balance: 1892, creditEnd: '', bills: [{ no: 'INV-1689', date: '17/05/2025', total: 1892, due: 1892 }] },
    { name: 'अमित स्टोर (CU0021)', balance: 0, creditEnd: '', bills: [] },
  ],
  salary: [
    { name: 'रमेश कुमार (EMP01)', balance: 18000, creditEnd: '', bills: [] },
    { name: 'सुनीता देवी (EMP02)', balance: 15000, creditEnd: '', bills: [] },
  ],
  other: [
    { name: 'मकान मालिक', balance: 0, creditEnd: '', bills: [] },
    { name: 'बिजली विभाग', balance: 0, creditEnd: '', bills: [] },
    { name: 'टैक्स विभाग (GST)', balance: 0, creditEnd: '', bills: [] },
  ],
}
const NEEDS_BILL = { supplier: true, refund: true, salary: false, other: false }
const BANKS = [
  { name: 'SBI Current A/c - 12345678901', balance: 125780 },
  { name: 'HDFC Savings A/c - 50100234567', balance: 64500 },
]
const CASH_BALANCE = 85000
const MODES = ['NEFT', 'RTGS', 'UPI', 'चेक', 'IMPS']
const ADVANCE = 'ADV'

const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const rs = (v) => `₹ ${money(v)}`
const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')

/* ---------- shared form state (desktop + mobile read the same values) ---------- */
function usePaymentForm() {
  const { pushToast } = useApp()
  const first = PARTIES.supplier[0]
  const [typeLabel, setTypeLabel] = useState(TYPE_LABELS[0])
  const [date, setDate] = useState('2025-05-17')
  const [partyName, setPartyName] = useState(first.name)
  const [billNo, setBillNo] = useState(first.bills[0].no)
  const [source, setSource] = useState('bank')
  const [bankName, setBankName] = useState(BANKS[0].name)
  const [mode, setMode] = useState(MODES[0])
  const [amount, setAmount] = useState(String(first.bills[0].due))
  const [editingAmount, setEditingAmount] = useState(false)
  const [reference, setReference] = useState('NEFT1234567890')
  const [remarks, setRemarks] = useState('Invoice No. 145 के भुगतान हेतु')
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})

  const rule = ruleOfLabel(typeLabel)
  const parties = PARTIES[rule.key]
  const party = parties.find((p) => p.name === partyName) || parties[0]
  const bill = party.bills.find((b) => b.no === billNo)
  const bank = BANKS.find((b) => b.name === bankName) || BANKS[0]
  const needsBill = NEEDS_BILL[rule.key]
  const amountNum = parseFloat(amount) || 0
  const amountDisplay = editingAmount ? amount : amountNum ? money(amountNum) : ''
  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))

  // numbering follows what is visible (bank-only fields are skipped for cash)
  const order = ['type', 'date', 'party', 'bill', 'source', ...(source === 'bank' ? ['bank', 'mode'] : []), 'amount', 'ref', 'remarks', 'file']
  const nOf = (k) => order.indexOf(k) + 1

  const pickParty = (p, keepBill) => {
    setPartyName(p.name)
    const b = keepBill ? null : p.bills[0]
    setBillNo(b ? b.no : p.bills.length ? ADVANCE : '')
    setAmount(b ? String(b.due) : p.balance ? String(p.balance) : '')
    clearErr('party'); clearErr('bill'); clearErr('amount')
  }
  const setType = (label) => {
    setTypeLabel(label)
    pickParty(PARTIES[ruleOfLabel(label).key][0])
  }
  const setParty = (name) => pickParty(parties.find((p) => p.name === name) || parties[0])
  const setBill = (no) => {
    setBillNo(no)
    const b = party.bills.find((x) => x.no === no)
    if (b) setAmount(String(b.due))
    clearErr('bill'); clearErr('amount')
  }

  const onFile = (e) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    if (picked.size > 10 * 1024 * 1024) {
      e.target.value = ''
      return pushToast('फ़ाइल का साइज़ 10 MB से ज़्यादा नहीं होना चाहिए', 'warn')
    }
    setFile(picked)
  }

  const validate = () => {
    const errs = {}
    if (!date) errs.date = 'भुगतान की तिथि चुनें'
    if (!partyName) errs.party = 'चुनें कि भुगतान किसे किया'
    if (needsBill && party.bills.length && !billNo) errs.bill = 'बिल चुनें या एडवांस भुगतान चुनें'
    if (source === 'bank' && !bankName) errs.bank = 'बैंक खाता चुनें'
    if (source === 'bank' && !mode) errs.mode = 'भुगतान का तरीका चुनें'
    if (amountNum <= 0) errs.amount = 'भुगतान राशि दर्ज करें'
    else if (bill && amountNum > bill.due) errs.amount = `राशि चुने गए बिल के बकाया (${rs(bill.due)}) से ज़्यादा नहीं हो सकती`
    else if (source === 'bank' && amountNum > bank.balance) errs.amount = `चुने गए बैंक खाते में पर्याप्त शेष नहीं है (उपलब्ध ${rs(bank.balance)})`
    else if (source === 'cash' && amountNum > CASH_BALANCE) errs.amount = `Cash Balance कम है (उपलब्ध ${rs(CASH_BALANCE)})`
    setErrors(errs)
    const key = ['date', 'party', 'bill', 'bank', 'mode', 'amount'].find((k) => errs[k])
    if (key) {
      requestAnimationFrame(() => document.getElementById(`pm-${key}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
      pushToast(errs[key], 'warn')
      return false
    }
    return true
  }
  const save = () => { if (validate()) pushToast('भुगतान सफलतापूर्वक सेव हो गया') }
  const saveDraft = () => pushToast('ड्राफ्ट सेव हो गया')
  const reset = () => {
    setTypeLabel(TYPE_LABELS[0]); setDate(todayIso())
    const p = PARTIES.supplier[0]
    setPartyName(p.name); setBillNo(p.bills[0].no); setAmount('')
    setSource('bank'); setBankName(BANKS[0].name); setMode(MODES[0])
    setReference(''); setRemarks(''); setFile(null); setErrors({})
    pushToast('नया भुगतान दर्ज करें', 'info')
  }

  return {
    pushToast, typeLabel, setType, rule, date, setDate, parties, party, setParty, bill, billNo, setBill, needsBill,
    source, setSource, bank, bankName, setBankName, mode, setMode, amount, setAmount, amountNum, amountDisplay, setEditingAmount,
    reference, setReference, remarks, setRemarks, file, setFile, onFile, errors, clearErr, nOf, save, saveDraft, reset,
  }
}

/* true from 1024px (Tailwind `lg`) upwards */
function useIsDesktop() {
  const query = '(min-width: 1024px)'
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [match, setMatch] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatch(e.matches)
    setMatch(mq.matches)
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange)
    return () => (mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange))
  }, [])
  return match
}

export default function Payment() {
  const form = usePaymentForm()
  const isDesktop = useIsDesktop()
  return (
    <Layout title="Payment" subtitle="भुगतान दर्ज करें">
      {isDesktop ? <PaymentDesktop f={form} /> : <PaymentMobile f={form} />}
    </Layout>
  )
}

/* ---------- shared bits ---------- */
function RuleCard({ n, title, color, desc, effects, active }) {
  const t = THEMES[color]
  const [en, hi] = title.split(/ (?=\()/)
  return (
    <div className="rounded-xl p-3.5 transition" style={{ background: t.bg, border: `1px solid ${active ? t.num : t.border}`, boxShadow: active ? `0 0 0 1px ${t.num}` : 'none' }}>
      <div className="flex items-center gap-2.5 mb-1.5">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ background: t.num }}>{n}</span>
        <p style={{ color: t.title }}>
          <span className="text-[14.5px] font-semibold">{en}</span>
          {hi && <span className="text-[12px] font-medium"> {hi}</span>}
        </p>
      </div>
      <p className="text-[12.5px] mb-2" style={{ color: C.text }}>{desc}</p>
      <p className="text-[12px] font-bold mb-1" style={{ color: t.title }}>सिस्टम प्रभाव:</p>
      <ul className="space-y-1">
        {effects.map((e) => (
          <li key={e} className="flex items-start gap-1.5 text-[12.5px]" style={{ color: C.text }}>
            <ArrowRight size={14} className="mt-[3px] shrink-0" style={{ color: t.num }} />
            <span>{e}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NoteCard() {
  return (
    <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde9b0' }}>
      <div className="flex items-center gap-2 mb-1.5">
        <Lightbulb size={17} style={{ color: '#d97706' }} />
        <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>ध्यान दें</p>
      </div>
      <ul className="list-disc pl-5 space-y-1 text-[12.5px] font-medium leading-relaxed" style={{ color: C.text }}>
        {NOTES.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  )
}

/* box that shows a title + a small second line, with a transparent native <select> on top */
function TwoLineSelect({ icon: Icon, title, sub, value, onChange, options, label, error, h, titleFs, subFs, iconStyle }) {
  return (
    <div className="relative flex items-center w-full rounded-lg border focus-within:border-green-600" style={{ ...TINT, borderColor: error ? C.required : TINT.borderColor, height: h }}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconStyle, color: C.label }} />
      <div className="pl-11 pr-9 min-w-0 leading-tight pointer-events-none">
        <p className="font-semibold truncate" style={{ color: C.label, fontSize: titleFs }}>{title}</p>
        {sub && <p className="truncate mt-0.5" style={{ color: C.muted, fontSize: subFs }}>{sub}</p>}
      </div>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconStyle, color: C.label }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
    </div>
  )
}
const billOptions = (party, needsBill) => [
  ...party.bills.map((b) => [b.no, `${b.no} – दिनांक ${b.date} (बकाया ${rs(b.due)})`]),
  ...(party.bills.length ? [[ADVANCE, 'एडवांस भुगतान (बिना बिल)']] : [['', needsBill ? 'इस पार्टी का कोई बकाया बिल नहीं' : 'लागू नहीं (बिना बिल)']]),
]
const billTitle = (bill, billNo, party, needsBill) => (bill ? `${bill.no} – दिनांक ${bill.date}` : billNo === ADVANCE ? 'एडवांस भुगतान (बिना बिल)' : party.bills.length ? 'बिल चुनें' : needsBill ? 'कोई बकाया बिल नहीं' : 'लागू नहीं (बिना बिल)')

/* =====================================================================
   DESKTOP (lg and up)
   ===================================================================== */
function DSection({ children, id, className = '' }) {
  return <section id={id} className={`rounded-xl bg-white p-3.5 ${className}`} style={{ border: `1px solid ${C.border}`, scrollMarginTop: 90 }}>{children}</section>
}
function DLabel({ n, text, required, info, onInfo }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <h2 className="text-[14px] font-bold" style={{ color: C.label }}>{n}. {text}{required && <span style={{ color: C.required }}> *</span>}</h2>
      {info && <button type="button" aria-label="जानकारी" onClick={onInfo} className="focus-ring rounded-full" style={{ color: C.label }}><Info size={14} /></button>}
    </div>
  )
}
const DErr = ({ children }) => (children ? <p role="alert" className="mt-1.5 text-[12px] font-semibold" style={{ color: C.required }}>{children}</p> : null)
const DHint = ({ children }) => <p className="text-[12px] mt-2" style={{ color: C.muted }}>{children}</p>

function DSelect({ icon: Icon, value, onChange, options, label, error }) {
  return (
    <div className="relative">
      <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.green }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}
        className="w-full h-11 appearance-none rounded-lg border pl-11 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
        style={{ ...TINT, borderColor: error ? C.required : TINT.borderColor, color: C.label }}>
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
      <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
    </div>
  )
}

function DSource({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="flex items-center gap-3 rounded-lg px-3.5 h-[52px] text-[13px] font-semibold text-left focus-ring"
      style={{ border: `1px solid ${active ? C.greenBorder : C.field}`, background: active ? C.greenSoft : '#fff', color: active ? C.green : C.label }}>
      <Icon size={22} />
      <span className="flex-1">{label}</span>
      {active
        ? <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: C.green }}><Check size={13} strokeWidth={3} /></span>
        : <span className="w-5 h-5 rounded-full border" style={{ borderColor: '#cbd5e1' }} />}
    </button>
  )
}

const D_ICON = { width: 20, height: 20 }

function PaymentDesktop({ f }) {
  const {
    pushToast, typeLabel, setType, date, setDate, parties, party, setParty, bill, billNo, setBill, needsBill,
    source, setSource, bank, bankName, setBankName, mode, setMode, amount, setAmount, amountNum, amountDisplay, setEditingAmount,
    reference, setReference, remarks, setRemarks, file, setFile, onFile, errors, clearErr, nOf, save, saveDraft, reset,
  } = f

  return (
    <div>
      <PageHeader
        code="SCR-010"
        title="भुगतान दर्ज करें (Payment Entry)"
        subtitle="व्यवसाय द्वारा किसी को किए गए भुगतान की जानकारी भरें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm" onClick={() => pushToast('Excel तैयार किया जा रहा है', 'info')}>Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm" onClick={() => pushToast('PDF तैयार किया जा रहा है', 'info')}>PDF प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm" onClick={reset}>नया भुगतान दर्ज करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-5 items-start">
        {/* ================= LEFT: form ================= */}
        <div className="rounded-2xl bg-white p-3.5 space-y-2.5" style={{ border: `1px solid ${C.border}` }}>
          {/* 1 + 2 */}
          <div className="grid grid-cols-[1.45fr_1fr] gap-2.5">
            <DSection>
              <DLabel n={nOf('type')} text="भुगतान का प्रकार चुनें" required info onInfo={() => document.getElementById('pm-rules')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
              <p className="text-[12px] font-semibold mb-2" style={{ color: C.text }}>भुगतान का प्रकार</p>
              <DSelect icon={HandCoins} value={typeLabel} onChange={setType} options={TYPE_LABELS.map((t) => [t, t])} label="भुगतान का प्रकार" />
              <DHint>आप जिनको भुगतान कर रहे हैं, उनका चयन करें।</DHint>
            </DSection>
            <DSection id="pm-date">
              <DLabel n={nOf('date')} text="भुगतान दिनांक" required />
              <div className="relative h-11 rounded-lg border bg-white flex items-center focus-within:border-green-600" style={{ borderColor: errors.date ? C.required : C.field }}>
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.label }} />
                <span className="pl-11 text-[13px] font-semibold" style={{ color: C.label }}>{showDate(date)}</span>
                <input type="date" aria-label="भुगतान दिनांक" value={date} onChange={(e) => { setDate(e.target.value); clearErr('date') }}
                  onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <DErr>{errors.date}</DErr>
            </DSection>
          </div>

          {/* 3 + balance */}
          <div className="grid grid-cols-[1.45fr_1fr] gap-2.5">
            <DSection id="pm-party">
              <DLabel n={nOf('party')} text="किसको भुगतान किया" required />
              <DSelect icon={UserPlus} value={party.name} onChange={setParty} options={parties.map((p) => [p.name, p.name])} label="किसको भुगतान किया" error={errors.party} />
              <DErr>{errors.party}</DErr>
            </DSection>
            <div>
              <div className="rounded-lg bg-white px-3.5 py-2.5" style={{ border: `1px solid ${C.field}` }}>
                <p className="text-[12.5px] font-semibold mb-1" style={{ color: C.text }}>कुल बकाया शेष</p>
                <p className="text-[16px] font-bold" style={{ color: party.balance ? C.red : C.green }}>{rs(party.balance)}</p>
              </div>
              {party.creditEnd && <p className="text-[11.5px] mt-1.5 px-1" style={{ color: C.muted }}>क्रेडिट अवधि समाप्ति: {party.creditEnd}</p>}
            </div>
          </div>

          {/* 4 + 5 */}
          <div className="grid grid-cols-2 gap-2.5">
            <DSection id="pm-bill">
              <DLabel n={nOf('bill')} text="किस बिल के लिए भुगतान" required />
              <TwoLineSelect icon={FileText} h={64} titleFs={13} subFs={11.5} iconStyle={D_ICON} label="किस बिल के लिए भुगतान" error={errors.bill}
                title={billTitle(bill, billNo, party, needsBill)}
                sub={bill ? `कुल राशि: ${rs(bill.total)}  |  बकाया: ${rs(bill.due)}` : undefined}
                value={billNo} onChange={setBill} options={billOptions(party, needsBill)} />
              <DErr>{errors.bill}</DErr>
            </DSection>
            <DSection>
              <DLabel n={nOf('source')} text="भुगतान का माध्यम (Source of Fund)" required info onInfo={() => pushToast('Cash पर Cash Balance, Bank पर बैंक खाते का Balance घटेगा', 'info')} />
              <div className="grid grid-cols-2 gap-2.5">
                <DSource icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
                <DSource icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              </div>
              {source === 'cash' && <DHint>उपलब्ध Cash Balance: {rs(CASH_BALANCE)}</DHint>}
            </DSection>
          </div>

          {/* 6 + 7 (bank only) */}
          {source === 'bank' && (
            <div className="grid grid-cols-2 gap-2.5">
              <DSection id="pm-bank">
                <DLabel n={nOf('bank')} text="बैंक खाता" required />
                <TwoLineSelect icon={Landmark} h={56} titleFs={13} subFs={11.5} iconStyle={D_ICON} label="बैंक खाता" error={errors.bank}
                  title={bank.name} sub={`उपलब्ध शेष: ${rs(bank.balance)}`}
                  value={bankName} onChange={setBankName} options={BANKS.map((b) => [b.name, b.name])} />
                <DErr>{errors.bank}</DErr>
              </DSection>
              <DSection id="pm-mode">
                <DLabel n={nOf('mode')} text="भुगतान का तरीका (Mode of Payment)" required />
                <DSelect icon={CreditCard} value={mode} onChange={setMode} options={MODES.map((m) => [m, m])} label="भुगतान का तरीका" error={errors.mode} />
                <DErr>{errors.mode}</DErr>
              </DSection>
            </div>
          )}

          {/* 8 + 9 */}
          <div className="grid grid-cols-2 gap-2.5">
            <DSection id="pm-amount">
              <DLabel n={nOf('amount')} text="भुगतान राशि (₹)" required />
              <div className="flex items-center h-11 rounded-lg px-3 focus-within:border-green-600" style={{ background: '#eef6f0', border: `1px solid ${errors.amount ? C.required : '#dcebe0'}` }}>
                <span className="text-[18px] font-semibold mr-4" style={{ color: C.text }}>₹</span>
                <input inputMode="decimal" aria-label="भुगतान राशि" value={amountDisplay} placeholder="0.00"
                  onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
                  onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); clearErr('amount') }}
                  className="w-full min-w-0 bg-transparent outline-none text-[14px] font-semibold placeholder:text-slate-400" style={{ color: C.text }} />
              </div>
              {errors.amount ? <DErr>{errors.amount}</DErr> : <DHint>अंकों में: {numberToWordsINR(amountNum)}</DHint>}
            </DSection>
            <DSection>
              <DLabel n={nOf('ref')} text="संदर्भ संख्या (Reference No.)" />
              <input value={reference} onChange={(e) => setReference(e.target.value)} aria-label="संदर्भ संख्या" placeholder="UTR / चेक नंबर"
                className="w-full h-11 rounded-lg border bg-white px-3 text-[13px] font-semibold outline-none focus:border-green-600 placeholder:text-slate-300" style={{ borderColor: C.field, color: C.label }} />
              <DHint>वैकल्पिक</DHint>
            </DSection>
          </div>

          {/* 10 */}
          <DSection>
            <DLabel n={nOf('remarks')} text="विवरण (Remarks)" />
            <div className="relative">
              <textarea rows={3} maxLength={150} value={remarks} onChange={(e) => setRemarks(e.target.value)} aria-label="विवरण"
                className="w-full h-[88px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600" style={{ borderColor: C.field, color: C.muted }} />
              <span className="absolute right-3 bottom-2 text-[12px]" style={{ color: C.muted }}>{remarks.length}/150</span>
            </div>
          </DSection>

          {/* 11 */}
          <DSection>
            <DLabel n={nOf('file')} text="बिल / रसीद अपलोड करें (वैकल्पिक)" />
            <label className="flex flex-col items-center justify-center gap-1 h-[84px] rounded-lg cursor-pointer text-center px-3 focus-within:ring-2 focus-within:ring-green-600/40" style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8' }}>
              <span className="flex items-center gap-2 text-[13px] font-bold" style={{ color: C.label }}><Paperclip size={17} /> {file ? 'फ़ाइल बदलें' : 'फोटो / PDF अपलोड करें'}</span>
              {file ? <span className="max-w-full truncate text-[12px] font-medium" style={{ color: C.text }}>{file.name}</span> : <span className="text-[12px] font-bold" style={{ color: C.label }}>अधिकतम साइज़: 10 MB</span>}
              <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
            </label>
            {file && <button type="button" onClick={() => setFile(null)} className="mt-1.5 text-[12px] font-semibold text-red-600 focus-ring rounded">फ़ाइल हटाएं</button>}
          </DSection>

          {/* actions */}
          <div className="grid grid-cols-[1fr_1.45fr_1.4fr] gap-3 pt-0.5">
            <button type="button" onClick={() => window.history.back()} className="h-11 rounded-lg border bg-white text-[13px] font-semibold hover:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label }}>रद्द करें</button>
            <button type="button" onClick={saveDraft} className="h-11 rounded-lg border bg-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label }}>
              <FileText size={17} /> Draft के रूप में सुरक्षित करें
            </button>
            <button type="button" onClick={save} className="h-11 rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2 hover:opacity-95 focus-ring" style={{ background: C.green }}>
              <Save size={17} /> भुगतान सेव करें
            </button>
          </div>
        </div>

        {/* ================= RIGHT: rules ================= */}
        <aside id="pm-rules" className="space-y-2.5 min-w-0" style={{ scrollMarginTop: 90 }}>
          <h3 className="text-[17px] font-bold mb-3 mt-1" style={{ color: C.green }}>भुगतान के प्रकार और उनके नियम</h3>
          {RULES.map((r) => <RuleCard key={r.key} {...r} active={r.typeLabel === typeLabel} />)}
          <NoteCard />
        </aside>
      </div>

      <p className="text-center text-xs font-semibold text-green-800 mt-4">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
    </div>
  )
}

/* =====================================================================
   MOBILE (below lg) — prototype SCR-010
   ===================================================================== */
const boxH = cl(42, 12.5, 54)
const mInput = { color: C.text, fontSize: cl(12.5, 3.8, 16) }
const mIcon = { width: cl(17, 5, 22), height: cl(17, 5, 22) }

function MLabel({ n, text, required, info, onInfo }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <h2 className="font-bold" style={{ color: C.label, fontSize: cl(13, 3.9, 17) }}>{n}. {text}{required && <span style={{ color: C.required }}> *</span>}</h2>
      {info && <button type="button" aria-label="जानकारी" onClick={onInfo} className="focus-ring rounded-full" style={{ color: C.label }}><Info style={{ width: cl(14, 4.2, 18), height: cl(14, 4.2, 18) }} /></button>}
    </div>
  )
}
function MBox({ children, style, error }) {
  return (
    <div className="relative flex items-center w-full rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: error ? C.required : C.field, height: boxH, ...style }}>{children}</div>
  )
}
function MSelect({ icon: Icon, value, onChange, options, label, error }) {
  return (
    <MBox error={error} style={{ ...TINT, borderColor: error ? C.required : TINT.borderColor }}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...mIcon, color: C.label }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="appearance-none w-full h-full bg-transparent pl-11 pr-9 font-semibold outline-none rounded-lg" style={{ ...mInput, color: C.label }}>
        {options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...mIcon, color: C.label }} />
    </MBox>
  )
}
const MHint = ({ children }) => <p className="mt-1.5" style={{ color: C.label, opacity: 0.75, fontSize: cl(10, 3, 13) }}>{children}</p>
const MErr = ({ children }) => (children ? <p role="alert" className="mt-1.5 font-semibold" style={{ color: C.required, fontSize: cl(10, 3, 13) }}>{children}</p> : null)

function MSource({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="flex items-center gap-2 rounded-lg border px-3 text-left font-semibold focus-ring"
      style={{ height: boxH, fontSize: cl(12, 3.6, 15), borderColor: active ? C.greenBorder : C.field, background: active ? C.greenSoft : '#fff', color: active ? C.green : C.label }}>
      <Icon className="shrink-0" style={mIcon} />
      <span className="flex-1 truncate">{label}</span>
      {active
        ? <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}><Check size={13} strokeWidth={3} /></span>
        : <span className="w-5 h-5 rounded-full border shrink-0" style={{ borderColor: '#cbd5e1' }} />}
    </button>
  )
}

function PaymentMobile({ f }) {
  const {
    pushToast, typeLabel, setType, date, setDate, parties, party, setParty, bill, billNo, setBill, needsBill,
    source, setSource, bank, bankName, setBankName, mode, setMode, amount, setAmount, amountNum, amountDisplay, setEditingAmount,
    reference, setReference, remarks, setRemarks, file, setFile, onFile, errors, clearErr, nOf, save,
  } = f
  const [rulesOpen, setRulesOpen] = useState(false)
  const sheetRef = useRef(null)
  useEffect(() => { if (rulesOpen) sheetRef.current?.focus() }, [rulesOpen])
  const twoLine = { h: cl(52, 15.5, 66), titleFs: cl(12, 3.6, 15), subFs: cl(9.5, 2.9, 12.5), iconStyle: mIcon }

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center mb-3">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>SCR-010</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>भुगतान दर्ज करें (Payment Entry)</h1>
          <p className="font-medium mt-1 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>व्यवसाय द्वारा किसी को किए गए भुगतान की जानकारी भरें</p>
        </div>

        {/* ---- type ---- */}
        <section className="mb-4">
          <MLabel n={nOf('type')} text="भुगतान का प्रकार चुनें" required info onInfo={() => setRulesOpen(true)} />
          <p className="font-semibold mb-1.5" style={{ color: C.label, fontSize: cl(10.5, 3.2, 14) }}>भुगतान का प्रकार</p>
          <MSelect icon={HandCoins} value={typeLabel} onChange={setType} options={TYPE_LABELS.map((t) => [t, t])} label="भुगतान का प्रकार" />
          <MHint>आप जिनको भुगतान कर रहे हैं, उनका चयन करें।</MHint>
        </section>

        {/* ---- date ---- */}
        <section id="pm-date" className="mb-4">
          <MLabel n={nOf('date')} text="भुगतान दिनांक" required />
          <MBox error={errors.date}>
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...mIcon, color: C.label }} />
            <span className="pl-11 pr-2 font-semibold" style={{ ...mInput, color: C.label }}>{showDate(date)}</span>
            <input type="date" aria-label="भुगतान दिनांक" value={date} onChange={(e) => { setDate(e.target.value); clearErr('date') }}
              onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          </MBox>
          <MErr>{errors.date}</MErr>
        </section>

        {/* ---- party + outstanding ---- */}
        <section id="pm-party" className="mb-4">
          <MLabel n={nOf('party')} text="किसको भुगतान किया" required />
          <MBox error={errors.party} style={{ ...TINT, borderColor: errors.party ? C.required : TINT.borderColor }}>
            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...mIcon, color: C.label }} />
            <select value={party.name} onChange={(e) => setParty(e.target.value)} aria-label="किसको भुगतान किया" className="appearance-none w-full h-full bg-transparent pl-11 pr-12 font-semibold outline-none rounded-lg" style={{ ...mInput, color: C.label }}>
              {parties.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
            <button type="button" aria-label="नई पार्टी जोड़ें" onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')} className="absolute right-0 h-full px-3 flex items-center rounded-r-lg focus-ring" style={{ color: C.label }}>
              <Plus style={mIcon} />
            </button>
          </MBox>
          <MErr>{errors.party}</MErr>
          <div className="mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 font-semibold" style={{ background: C.greenSoft, borderColor: '#bfe0c8', color: C.green, fontSize: cl(10.5, 3.2, 14) }}>
            <BadgeCheck className="shrink-0" style={{ width: 15, height: 15 }} />
            बकाया शेष: {rs(party.balance)}{party.creditEnd && <span className="font-medium text-slate-500"> &nbsp;|&nbsp; क्रेडिट अवधि: {party.creditEnd}</span>}
          </div>
        </section>

        {/* ---- bill ---- */}
        <section id="pm-bill" className="mb-4">
          <MLabel n={nOf('bill')} text="किस बिल के लिए भुगतान" required />
          <TwoLineSelect {...twoLine} icon={FileText} label="किस बिल के लिए भुगतान" error={errors.bill}
            title={billTitle(bill, billNo, party, needsBill)}
            sub={bill ? `कुल राशि: ${rs(bill.total)}  |  बकाया: ${rs(bill.due)}` : undefined}
            value={billNo} onChange={setBill} options={billOptions(party, needsBill)} />
          <MErr>{errors.bill}</MErr>
        </section>

        {/* ---- source of fund ---- */}
        <section className="mb-4">
          <MLabel n={nOf('source')} text="भुगतान का माध्यम (Source of Fund)" required info onInfo={() => pushToast('Cash पर Cash Balance, Bank पर बैंक खाते का Balance घटेगा', 'info')} />
          <div className="grid grid-cols-2" style={{ gap: cl(10, 3.4, 18) }}>
            <MSource icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
            <MSource icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
          </div>
          {source === 'cash' && <MHint>उपलब्ध Cash Balance: {rs(CASH_BALANCE)}</MHint>}
        </section>

        {/* ---- bank account + mode (bank only) ---- */}
        {source === 'bank' && (
          <>
            <section id="pm-bank" className="mb-4">
              <MLabel n={nOf('bank')} text="बैंक खाता" required />
              <TwoLineSelect {...twoLine} icon={Landmark} label="बैंक खाता" error={errors.bank}
                title={bank.name} sub={`उपलब्ध शेष: ${rs(bank.balance)}`}
                value={bankName} onChange={setBankName} options={BANKS.map((b) => [b.name, b.name])} />
              <MErr>{errors.bank}</MErr>
            </section>
            <section id="pm-mode" className="mb-4">
              <MLabel n={nOf('mode')} text="भुगतान का तरीका (Mode of Payment)" required />
              <MSelect icon={CreditCard} value={mode} onChange={setMode} options={MODES.map((m) => [m, m])} label="भुगतान का तरीका" error={errors.mode} />
              <MErr>{errors.mode}</MErr>
            </section>
          </>
        )}

        {/* ---- amount ---- */}
        <section id="pm-amount" className="mb-4">
          <MLabel n={nOf('amount')} text="भुगतान राशि (₹)" required />
          <MBox error={errors.amount} style={{ background: '#eef6f0', borderColor: errors.amount ? C.required : '#dcebe0' }}>
            <span className="pl-3 pr-2 font-semibold" style={{ color: C.text, fontSize: cl(16, 5, 22) }}>₹</span>
            <input inputMode="decimal" aria-label="भुगतान राशि" value={amountDisplay} placeholder="0.00"
              onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
              onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); clearErr('amount') }}
              className="flex-1 min-w-0 h-full bg-transparent pr-3 font-semibold outline-none placeholder:text-slate-400" style={mInput} />
          </MBox>
          {errors.amount ? <MErr>{errors.amount}</MErr> : <MHint>अंकों में: {numberToWordsINR(amountNum)}</MHint>}
        </section>

        {/* ---- reference ---- */}
        <section className="mb-4">
          <MLabel n={nOf('ref')} text="संदर्भ संख्या (Reference No.)" />
          <MBox>
            <input value={reference} onChange={(e) => setReference(e.target.value)} aria-label="संदर्भ संख्या" placeholder="UTR / चेक नंबर"
              className="flex-1 min-w-0 h-full bg-transparent px-3 font-semibold outline-none placeholder:text-slate-300" style={{ ...mInput, color: C.label }} />
          </MBox>
          <MHint>वैकल्पिक</MHint>
        </section>

        {/* ---- remarks ---- */}
        <section className="mb-4">
          <MLabel n={nOf('remarks')} text="विवरण (Remarks)" />
          <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
            <textarea rows={4} maxLength={150} value={remarks} onChange={(e) => setRemarks(e.target.value)} aria-label="विवरण"
              className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-6 outline-none placeholder:text-slate-400" style={{ ...mInput, color: C.muted }} />
            <span className="absolute right-3 bottom-1.5" style={{ color: C.muted, fontSize: cl(10, 3, 13) }}>{remarks.length}/150</span>
          </div>
        </section>

        {/* ---- upload ---- */}
        <section className="mb-1">
          <MLabel n={nOf('file')} text="बिल /रसीद अपलोड करें (वैकल्पिक)" />
          <label className="flex flex-col items-center justify-center gap-1 rounded-lg text-center cursor-pointer active:bg-green-50 focus-within:ring-2 focus-within:ring-green-600/40" style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8', padding: cl(14, 4.5, 22) }}>
            <span className="flex items-center gap-2 font-bold" style={{ color: C.label, fontSize: cl(12, 3.6, 15) }}><Paperclip style={mIcon} />{file ? 'फ़ाइल बदलें' : 'फोटो / PDF अपलोड करें'}</span>
            {file ? <span className="max-w-full truncate font-medium" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>{file.name}</span> : <span className="font-bold" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>अधिकतम साइज़: 10 MB</span>}
            <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
          </label>
          {file && <button type="button" onClick={() => setFile(null)} className="mt-1.5 font-semibold text-red-600 focus-ring rounded" style={{ fontSize: cl(11, 3.3, 14) }}>फ़ाइल हटाएं</button>}
        </section>

        <p className="mt-4 text-center font-semibold" style={{ color: '#166534', fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav ---- */}
      <div className="shrink-0 grid grid-cols-[1fr_1.6fr] border-t bg-white py-2.5" style={{ borderColor: C.border, gap: cl(10, 3.5, 18), paddingInline: PAD }}>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>रद्द करें</button>
        <button type="button" onClick={save} className="rounded-lg font-semibold text-white inline-flex items-center justify-center gap-2 active:opacity-90 focus-ring" style={{ background: C.green, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>
          <Save size={17} /> भुगतान सेव करें
        </button>
      </div>

      {/* ---- rules bottom sheet (opened by the (i) icon on the first section) ---- */}
      {rulesOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="भुगतान के प्रकार और उनके नियम">
          <button type="button" aria-label="बंद करें" onClick={() => setRulesOpen(false)} className="absolute inset-0 bg-black/40" />
          <div ref={sheetRef} tabIndex={-1} className="relative max-h-[85%] flex flex-col rounded-t-2xl bg-white outline-none">
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b" style={{ borderColor: C.border }}>
              <h3 className="font-bold" style={{ color: C.green, fontSize: cl(15, 4.4, 20) }}>भुगतान के प्रकार और उनके नियम</h3>
              <button type="button" aria-label="बंद करें" onClick={() => setRulesOpen(false)} className="p-1.5 rounded-full active:bg-slate-100 focus-ring" style={{ color: C.text }}><X size={20} /></button>
            </div>
            <div className="overflow-y-auto px-4 py-3 space-y-2.5">
              {RULES.map((r) => <RuleCard key={r.key} {...r} active={r.typeLabel === typeLabel} />)}
              <NoteCard />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}