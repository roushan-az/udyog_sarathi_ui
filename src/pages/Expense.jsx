import React, { useEffect, useRef, useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, CalendarDays, UserPlus, Banknote, Landmark, Info,
  ChevronDown, Check, FileText, ArrowRight, Lightbulb, HandCoins, List, BadgeCheck, Save, X,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* =====================================================================
   SCR-008  खर्च दर्ज करें (Expense Entry)
   • one shared form state (useExpenseForm) feeds BOTH layouts
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
}
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)'

const THEMES = {
  blue: { bg: '#f2f7ff', border: '#c7dbf7', num: '#2563eb', title: '#1d4ed8' },
  purple: { bg: '#f7f3ff', border: '#d9cdf5', num: '#7c3aed', title: '#6d28d9' },
  orange: { bg: '#fff6f0', border: '#f8d5c2', num: '#f97316', title: '#c2410c' },
}

/* ---------- data ---------- */
const RULES = [
  {
    n: 1, key: 'op', color: 'blue', title: 'Operational Expense (व्यावसायिक खर्च)',
    desc: 'जो खर्च आपके व्यवसाय के दैनिक संचालन में होता है।',
    examples: ['किराया, बिजली, वेतन', 'इंटरनेट, फोन, पेट्रोल', 'स्टेशनरी, मरम्मत, आदि', 'अन्य दैनिक खर्च'],
    effects: ['यह खर्च सीधे P&L (लाभ-हानि) खाते में चलेगा।'],
    hint: 'यह खर्च आपके व्यवसाय के दैनिक संचालन से संबंधित है।',
    categories: ['किराया (Rent)', 'बिजली (Electricity)', 'वेतन (Salary)', 'इंटरनेट / फोन', 'पेट्रोल / ईंधन', 'स्टेशनरी', 'मरम्मत (Repair)', 'अन्य दैनिक खर्च'],
  },
  {
    n: 2, key: 'cap', color: 'purple', title: 'Capital Expenditure (पूंजीगत खर्च)',
    desc: 'जो लंबे समय तक उपयोग होने वाली संपत्ति खरीदने पर किया गया खर्च है।',
    examples: ['मशीन, कंप्यूटर', 'फर्नीचर, AC / वाहन', 'ऑफिस सेटअप', 'अन्य स्थायी सामान'],
    effects: ['यह खर्च Assets (संपत्ति) में जाएगा।', 'आगे चलकर इस पर अवमूल्यन (Depreciation) लागू होगा (Version 2.0 से)।'],
    hint: 'यह खर्च लंबे समय तक उपयोग होने वाली संपत्ति की खरीद से संबंधित है।',
    categories: ['मशीन', 'कंप्यूटर', 'फर्नीचर', 'AC / वाहन', 'ऑफिस सेटअप', 'अन्य स्थायी सामान'],
  },
  {
    n: 3, key: 'per', color: 'orange', title: 'Personal Expense (व्यक्तिगत खर्च / व्यवसाय से निकासी)',
    desc: 'यह खर्च घर या निजी उपयोग के लिए व्यवसाय से निकाला गया पैसा है।',
    examples: ['घर का राशन', 'बच्चों की फीस', 'परिवार का खर्च', 'व्यक्तिगत यात्रा', 'चिकित्सा खर्च'],
    effects: ['यह खर्च Withdrawal Ledger (निकासी खाता) में जाएगा।', 'यह P&L में नहीं जाएगा।', 'यह Asset में भी नहीं जाएगा।'],
    hint: 'यह खर्च घर या निजी उपयोग के लिए व्यवसाय से निकाली गई राशि है।',
    categories: ['घर का राशन', 'बच्चों की फीस', 'परिवार का खर्च', 'व्यक्तिगत यात्रा', 'चिकित्सा खर्च', 'अन्य व्यक्तिगत'],
  },
]
const TYPE_TITLES = RULES.map((r) => r.title)
const ruleOf = (title) => RULES.find((r) => r.title === title) || RULES[0]
const BANKS = ['SBI Current A/c - 12345678901']
const NOTE_TEXT = 'Owner Fund Addition (मालिक द्वारा पैसा लगाना) Receipt (SCR-009) में दर्ज किया जाएगा क्योंकि वह पैसा व्यवसाय में आता है, न कि जाता है।'

const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ---------- shared form state (desktop + mobile read the same values) ---------- */
function useExpenseForm() {
  const { pushToast } = useApp()
  const [type, setTypeRaw] = useState(TYPE_TITLES[0])
  const [date, setDate] = useState('2025-05-17')
  const [category, setCategory] = useState(RULES[0].categories[0])
  const [details, setDetails] = useState('')
  const [payee, setPayee] = useState('मकान मालिक')
  const [source, setSource] = useState('cash')
  const [bankAcc, setBankAcc] = useState(BANKS[0])
  const [amount, setAmount] = useState('12500')
  const [editingAmount, setEditingAmount] = useState(false)
  const [file, setFile] = useState(null)
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState({})

  const rule = ruleOf(type)
  const amountNum = parseFloat(amount) || 0
  const amountDisplay = editingAmount ? amount : amountNum ? money(amountNum) : ''
  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))

  // changing the type changes the list of categories
  const setType = (t) => {
    setTypeRaw(t)
    setCategory(ruleOf(t).categories[0])
    clearErr('category')
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
    if (!date) errs.date = 'खर्च की तिथि चुनें'
    if (!category) errs.category = 'खर्च की श्रेणी चुनें'
    if (!details.trim()) errs.details = 'खर्च का विवरण लिखें'
    if (!payee.trim()) errs.payee = 'यह बताएं कि भुगतान किसे किया'
    if (amountNum <= 0) errs.amount = 'कुल राशि दर्ज करें'
    setErrors(errs)
    const key = ['date', 'category', 'details', 'payee', 'amount'].find((k) => errs[k])
    if (key) {
      requestAnimationFrame(() => document.getElementById(`ex-${key}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
      pushToast(errs[key], 'warn')
      return false
    }
    return true
  }
  const save = () => { if (validate()) pushToast('खर्च सफलतापूर्वक सेव हो गया') }
  const saveDraft = () => pushToast('ड्राफ्ट सेव हो गया')
  const reset = () => {
    setTypeRaw(TYPE_TITLES[0]); setCategory(RULES[0].categories[0]); setDate(todayIso())
    setDetails(''); setPayee(''); setSource('cash'); setBankAcc(BANKS[0]); setAmount('')
    setFile(null); setNote(''); setErrors({})
    pushToast('नया खर्च दर्ज करें', 'info')
  }

  return {
    pushToast, type, setType, rule, date, setDate, category, setCategory, details, setDetails, payee, setPayee,
    source, setSource, bankAcc, setBankAcc, amount, setAmount, amountNum, amountDisplay, setEditingAmount,
    file, setFile, onFile, note, setNote, errors, clearErr, save, saveDraft, reset,
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

export default function Expense() {
  const form = useExpenseForm()
  const isDesktop = useIsDesktop()
  return (
    <Layout title="Expense" subtitle="खर्च दर्ज करें">
      {isDesktop ? <ExpenseDesktop f={form} /> : <ExpenseMobile f={form} />}
    </Layout>
  )
}

/* =====================================================================
   DESKTOP (lg and up)
   ===================================================================== */
function DSection({ children, id, className = '' }) {
  return <section id={id} className={`rounded-xl bg-white p-3.5 ${className}`} style={{ border: `1px solid ${C.border}`, scrollMarginTop: 90 }}>{children}</section>
}

function DLabel({ n, text, required, info, onInfo }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <h2 className="text-[14px] font-bold" style={{ color: C.label }}>
        {n}. {text}{required && <span style={{ color: C.required }}> *</span>}
      </h2>
      {info && (
        <button type="button" aria-label="जानकारी" onClick={onInfo} className="focus-ring rounded-full" style={{ color: C.label }}><Info size={14} /></button>
      )}
    </div>
  )
}

const DErr = ({ children }) => (children ? <p role="alert" className="mt-1.5 text-[12px] font-semibold" style={{ color: C.required }}>{children}</p> : null)
const DHint = ({ children }) => <p className="text-[12px] mt-2" style={{ color: C.muted }}>{children}</p>

function DSelect({ icon: Icon, value, onChange, options, label, tinted, error }) {
  return (
    <div className="relative">
      <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.green }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full h-11 appearance-none rounded-lg border pl-11 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
        style={{ borderColor: error ? C.required : tinted ? '#c9d8f2' : C.field, background: tinted ? '#f7faff' : '#fff', color: C.label }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
    </div>
  )
}

function DSource({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center gap-3 rounded-lg px-3.5 h-[52px] text-[13px] font-semibold text-left focus-ring"
      style={{ border: `1px solid ${active ? C.greenBorder : C.field}`, background: active ? C.greenSoft : '#fff', color: active ? C.green : C.label }}
    >
      <Icon size={22} />
      <span className="flex-1">{label}</span>
      {active && (
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: C.green }}><Check size={13} strokeWidth={3} /></span>
      )}
    </button>
  )
}

function RuleCard({ n, title, color, desc, examples, effects, active, compact }) {
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
      <p className="text-[12px] font-bold mb-1" style={{ color: t.title }}>उदाहरण:</p>
      <ul className={`text-[12.5px] list-disc pl-5 space-y-0.5 mb-2 ${compact ? '' : 'xl:columns-2'}`} style={{ color: C.text }}>
        {examples.map((e) => <li key={e} className="break-inside-avoid">{e}</li>)}
      </ul>
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

const D_FIELD = 'w-full h-11 rounded-lg border bg-white text-[13px] font-semibold outline-none focus:border-green-600 placeholder:text-slate-400'

function ExpenseDesktop({ f }) {
  const {
    pushToast, type, setType, rule, date, setDate, category, setCategory, details, setDetails, payee, setPayee,
    source, setSource, bankAcc, setBankAcc, amount, setAmount, amountNum, amountDisplay, setEditingAmount,
    file, setFile, onFile, note, setNote, errors, clearErr, save, saveDraft, reset,
  } = f

  return (
    <div>
      <PageHeader
        code="SCR-008"
        title="खर्च दर्ज करें (Expense Entry)"
        subtitle="खर्च का विवरण और जानकारी भरें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm" onClick={() => pushToast('Excel तैयार किया जा रहा है', 'info')}>Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm" onClick={() => pushToast('PDF तैयार किया जा रहा है', 'info')}>PDF प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm" onClick={reset}>नया खर्च दर्ज करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-5 items-start">
        {/* ================= LEFT: form ================= */}
        <div className="rounded-2xl bg-white p-3.5 space-y-2.5" style={{ border: `1px solid ${C.border}` }}>
          {/* 1 */}
          <DSection>
            <DLabel n="1" text="खर्च का प्रकार चुनें" required info onInfo={() => document.getElementById('ex-rules')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
            <p className="text-[12px] font-semibold mb-2" style={{ color: C.text }}>खर्च का प्रकार</p>
            <DSelect icon={HandCoins} value={type} onChange={setType} options={TYPE_TITLES} label="खर्च का प्रकार" tinted />
            <DHint>{rule.hint}</DHint>
          </DSection>

          {/* 2 + 3 */}
          <div className="grid grid-cols-2 gap-2.5">
            <DSection id="ex-date">
              <DLabel n="2" text="खर्च दिनांक" required />
              <div className="relative h-11 rounded-lg border bg-white flex items-center focus-within:border-green-600" style={{ borderColor: errors.date ? C.required : C.field }}>
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.label }} />
                <span className="pl-11 text-[13px] font-semibold" style={{ color: C.label }}>{showDate(date)}</span>
                <input type="date" aria-label="खर्च दिनांक" value={date} onChange={(e) => { setDate(e.target.value); clearErr('date') }}
                  onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              <DErr>{errors.date}</DErr>
            </DSection>
            <DSection id="ex-category">
              <DLabel n="3" text="खर्च श्रेणी" required />
              <DSelect icon={List} value={category} onChange={(v) => { setCategory(v); clearErr('category') }} options={rule.categories} label="खर्च श्रेणी" error={errors.category} />
              <DErr>{errors.category}</DErr>
            </DSection>
          </div>

          {/* 4 + 5 */}
          <div className="grid grid-cols-2 gap-2.5">
            <DSection id="ex-details">
              <DLabel n="4" text="खर्च विवरण" required />
              <div className="relative">
                <textarea rows={4} maxLength={150} value={details} onChange={(e) => { setDetails(e.target.value); clearErr('details') }}
                  placeholder="उदाहरण: मई महीने का दुकान का किराया" aria-label="खर्च विवरण"
                  className="w-full h-[104px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                  style={{ borderColor: errors.details ? C.required : C.field, color: C.text }} />
                <span className="absolute right-3 bottom-2 text-[12px]" style={{ color: C.muted }}>{details.length}/150</span>
              </div>
              <DErr>{errors.details}</DErr>
            </DSection>
            <DSection id="ex-payee">
              <DLabel n="5" text="किसको भुगतान किया" required />
              <div className="relative">
                <input value={payee} onChange={(e) => { setPayee(e.target.value); clearErr('payee') }} aria-label="किसको भुगतान किया"
                  className={`${D_FIELD} pl-3 pr-11`} style={{ borderColor: errors.payee ? C.required : C.field, color: C.label }} />
                <button type="button" aria-label="नई पार्टी जोड़ें" onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')} className="absolute right-0 top-0 h-11 px-3 flex items-center focus-ring rounded-r-lg" style={{ color: C.label }}>
                  <UserPlus size={19} />
                </button>
              </div>
              <DErr>{errors.payee}</DErr>
            </DSection>
          </div>

          {/* 6 */}
          <DSection>
            <DLabel n="6" text="भुगतान का माध्यम (Source of Fund)" required info onInfo={() => pushToast('नकद पर Cash Book, बैंक पर Bank Book अपडेट होगी', 'info')} />
            <div className="grid grid-cols-[1fr_1fr_1.15fr] gap-3 items-stretch">
              <DSource icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
              <DSource icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              <div className="rounded-lg border px-3 py-2" style={{ background: C.greenSoft, borderColor: '#bfe0c8' }}>
                <p className="text-[12px] font-bold mb-1" style={{ color: C.green }}>यह चयन क्यों महत्वपूर्ण है?</p>
                <ul className="text-[11.5px] list-disc pl-4 space-y-0.5" style={{ color: C.text }}>
                  <li>नकद चुनने पर Cash Book अपडेट होगी।</li>
                  <li>बैंक चुनने पर Bank Book अपडेट होगी।</li>
                </ul>
              </div>
            </div>
            {source === 'bank' && (
              <div className="mt-3 max-w-[420px]">
                <p className="text-[12px] font-semibold mb-1.5" style={{ color: C.label }}>बैंक खाता</p>
                <DSelect icon={Landmark} value={bankAcc} onChange={setBankAcc} options={BANKS} label="बैंक खाता" />
              </div>
            )}
          </DSection>

          {/* 7 */}
          <DSection id="ex-amount">
            <DLabel n="7" text="कुल राशि (₹)" required />
            <div className="flex items-center h-11 rounded-lg px-3 focus-within:border-green-600" style={{ background: '#eef6f0', border: `1px solid ${errors.amount ? C.required : '#dcebe0'}` }}>
              <span className="text-[18px] font-semibold mr-4" style={{ color: C.text }}>₹</span>
              <input inputMode="decimal" aria-label="कुल राशि" value={amountDisplay} placeholder="0.00"
                onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
                onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); clearErr('amount') }}
                className="w-full min-w-0 bg-transparent outline-none text-[14px] font-semibold placeholder:text-slate-400" style={{ color: C.text }} />
            </div>
            {errors.amount ? <DErr>{errors.amount}</DErr> : <DHint>{numberToWordsINR(amountNum)}</DHint>}
          </DSection>

          {/* 8 + 9 */}
          <div className="grid grid-cols-2 gap-2.5">
            <DSection>
              <DLabel n="8" text="बिल/रसीद अपलोड करें (वैकल्पिक)" />
              <label className="flex flex-col items-center justify-center gap-1 h-[104px] rounded-lg cursor-pointer text-center px-3 focus-within:ring-2 focus-within:ring-green-600/40" style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8' }}>
                <span className="flex items-center gap-2 text-[12.5px] font-bold" style={{ color: C.label }}>
                  <Paperclip size={17} /> {file ? 'फ़ाइल बदलें' : 'फोटो / PDF / Document अपलोड करें'}
                </span>
                {file
                  ? <span className="max-w-full truncate text-[12px] font-medium" style={{ color: C.text }}>{file.name}</span>
                  : <span className="text-[12px] font-bold" style={{ color: C.label }}>अधिकतम साइज़: 10 MB</span>}
                <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
              </label>
              {file && <button type="button" onClick={() => setFile(null)} className="mt-1.5 text-[12px] font-semibold text-red-600 focus-ring rounded">फ़ाइल हटाएं</button>}
            </DSection>
            <DSection>
              <DLabel n="9" text="नोट (वैकल्पिक)" />
              <div className="relative">
                <textarea rows={4} maxLength={150} value={note} onChange={(e) => setNote(e.target.value)} placeholder="कोई अतिरिक्त जानकारी" aria-label="नोट"
                  className="w-full h-[104px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                  style={{ borderColor: C.field, color: C.text }} />
                <span className="absolute right-3 bottom-2 text-[12px]" style={{ color: C.muted }}>{note.length}/150</span>
              </div>
            </DSection>
          </div>

          {/* actions */}
          <div className="grid grid-cols-[1fr_1.45fr_1.4fr] gap-3 pt-0.5">
            <button type="button" onClick={() => window.history.back()} className="h-11 rounded-lg border bg-white text-[13px] font-semibold hover:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label }}>रद्द करें</button>
            <button type="button" onClick={saveDraft} className="h-11 rounded-lg border bg-white text-[13px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label }}>
              <FileText size={17} /> Draft के रूप में सुरक्षित करें
            </button>
            <button type="button" onClick={save} className="h-11 rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2 hover:opacity-95 focus-ring" style={{ background: C.green }}>
              <Save size={17} /> खर्च सेव करें
            </button>
          </div>
        </div>

        {/* ================= RIGHT: rules ================= */}
        <aside id="ex-rules" className="space-y-2.5 min-w-0" style={{ scrollMarginTop: 90 }}>
          <h3 className="text-[17px] font-bold mb-3 mt-1" style={{ color: C.green }}>खर्च के प्रकार और उनके नियम</h3>
          {RULES.map((r) => <RuleCard key={r.key} {...r} active={r.title === type} />)}
          <NoteCard />
        </aside>
      </div>

      <p className="text-center text-xs font-semibold text-green-800 mt-4">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
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
      <p className="text-[12.5px] font-medium leading-relaxed" style={{ color: C.text }}>{NOTE_TEXT}</p>
    </div>
  )
}

/* =====================================================================
   MOBILE (below lg) — prototype SCR-008
   ===================================================================== */
const boxH = cl(42, 12.5, 54)
const mInput = { color: C.text, fontSize: cl(12.5, 3.8, 16) }
const mIcon = { width: cl(17, 5, 22), height: cl(17, 5, 22) }

function MLabel({ n, text, required, info, onInfo }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <h2 className="font-bold" style={{ color: C.label, fontSize: cl(13, 3.9, 17) }}>
        {n}. {text}{required && <span style={{ color: C.required }}> *</span>}
      </h2>
      {info && (
        <button type="button" aria-label="जानकारी" onClick={onInfo} className="focus-ring rounded-full" style={{ color: C.label }}>
          <Info style={{ width: cl(14, 4.2, 18), height: cl(14, 4.2, 18) }} />
        </button>
      )}
    </div>
  )
}

function MBox({ children, style, error }) {
  return (
    <div className="relative flex items-center w-full rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: error ? C.required : C.field, height: boxH, ...style }}>
      {children}
    </div>
  )
}

function MSelect({ icon: Icon, value, onChange, options, label, tinted, error }) {
  return (
    <MBox error={error} style={tinted ? { background: '#f7faff', borderColor: '#c9d8f2' } : undefined}>
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...mIcon, color: C.label }} />
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="appearance-none w-full h-full bg-transparent pl-11 pr-9 font-semibold outline-none rounded-lg" style={{ ...mInput, color: C.label }}>
        {options.map((o) => <option key={o}>{o}</option>)}
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
      {active && <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}><Check size={13} strokeWidth={3} /></span>}
    </button>
  )
}

function ExpenseMobile({ f }) {
  const {
    pushToast, type, setType, rule, date, setDate, category, setCategory, details, setDetails, payee, setPayee,
    source, setSource, bankAcc, setBankAcc, setAmount, amountNum, amountDisplay, setEditingAmount,
    file, setFile, onFile, note, setNote, errors, clearErr, save,
  } = f
  const [rulesOpen, setRulesOpen] = useState(false)
  const sheetRef = useRef(null)
  useEffect(() => { if (rulesOpen) sheetRef.current?.focus() }, [rulesOpen])

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center mb-3">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>SCR-008</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>खर्च दर्ज करें (Expense Entry)</h1>
          <p className="font-medium mt-1 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>खर्च का विवरण और जानकारी भरें</p>
        </div>

        {/* ---- 1. type ---- */}
        <section className="mb-4 rounded-xl border bg-white shadow-sm" style={{ borderColor: C.border, padding: cl(10, 3.4, 18) }}>
          <MLabel n="1" text="खर्च का प्रकार चुनें" required info onInfo={() => setRulesOpen(true)} />
          <p className="font-semibold mb-1.5" style={{ color: C.label, fontSize: cl(10.5, 3.2, 14) }}>खर्च का प्रकार</p>
          <MSelect icon={HandCoins} value={type} onChange={setType} options={TYPE_TITLES} label="खर्च का प्रकार" tinted />
          <MHint>{rule.hint}</MHint>
        </section>

        {/* ---- 2 + 3 ---- */}
        <div className="grid grid-cols-2 mb-4" style={{ gap: cl(10, 3.4, 18) }}>
          <div id="ex-date" className="min-w-0">
            <MLabel n="2" text="खर्च दिनांक" required />
            <MBox error={errors.date}>
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...mIcon, color: C.label }} />
              <span className="pl-10 pr-2 font-medium" style={mInput}>{showDate(date)}</span>
              <input type="date" aria-label="खर्च दिनांक" value={date} onChange={(e) => { setDate(e.target.value); clearErr('date') }}
                onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </MBox>
            <MErr>{errors.date}</MErr>
          </div>
          <div id="ex-category" className="min-w-0">
            <MLabel n="3" text="खर्च श्रेणी" required />
            <MSelect icon={List} value={category} onChange={(v) => { setCategory(v); clearErr('category') }} options={rule.categories} label="खर्च श्रेणी" error={errors.category} />
            <MErr>{errors.category}</MErr>
          </div>
        </div>

        {/* ---- 4. details ---- */}
        <section id="ex-details" className="mb-4">
          <MLabel n="4" text="खर्च विवरण" required />
          <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: errors.details ? C.required : C.field }}>
            <textarea rows={4} maxLength={150} value={details} onChange={(e) => { setDetails(e.target.value); clearErr('details') }}
              placeholder="उदाहरण: मई महीने का दुकान का किराया" aria-label="खर्च विवरण"
              className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-6 outline-none placeholder:text-slate-400" style={mInput} />
            <span className="absolute right-3 bottom-1.5" style={{ color: C.muted, fontSize: cl(10, 3, 13) }}>{details.length}/150</span>
          </div>
          <MErr>{errors.details}</MErr>
        </section>

        {/* ---- 5. payee ---- */}
        <section id="ex-payee" className="mb-4">
          <MLabel n="5" text="किसको भुगतान किया" required />
          <MBox error={errors.payee}>
            <input value={payee} onChange={(e) => { setPayee(e.target.value); clearErr('payee') }} aria-label="किसको भुगतान किया"
              className="flex-1 min-w-0 h-full bg-transparent pl-3 pr-11 font-semibold outline-none" style={{ ...mInput, color: C.label }} />
            <button type="button" aria-label="नई पार्टी जोड़ें" onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')} className="absolute right-0 h-full px-3 flex items-center rounded-r-lg focus-ring" style={{ color: C.label }}>
              <UserPlus style={mIcon} />
            </button>
          </MBox>
          <MErr>{errors.payee}</MErr>
        </section>

        {/* ---- 6. source of fund (blue panel) ---- */}
        <section className="mb-4 rounded-xl border" style={{ background: '#f6f9ff', borderColor: '#c7dbf7', padding: cl(10, 3.4, 18) }}>
          <MLabel n="6" text="भुगतान का माध्यम (Source of Fund)" required info onInfo={() => pushToast('नकद पर Cash Book, बैंक पर Bank Book अपडेट होगी', 'info')} />
          <div className="grid grid-cols-2" style={{ gap: cl(10, 3.4, 18) }}>
            <MSource icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
            <MSource icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
          </div>
          <ul className="mt-2.5 space-y-1.5 rounded-lg border px-3 py-2.5 font-medium" style={{ background: C.greenSoft, borderColor: '#bfe0c8', color: C.green, fontSize: cl(10.5, 3.2, 14) }}>
            {['नकद चुनने पर आपकी Cash Book अपडेट होगी।', 'बैंक चुनने पर Bank Book अपडेट होगी।'].map((t) => (
              <li key={t} className="flex items-start gap-2"><BadgeCheck className="shrink-0 mt-px" style={{ width: 15, height: 15 }} />{t}</li>
            ))}
          </ul>
          {source === 'bank' && (
            <div className="mt-3">
              <p className="font-semibold mb-1.5" style={{ color: C.label, fontSize: cl(10.5, 3.2, 14) }}>बैंक खाता</p>
              <MSelect icon={Landmark} value={bankAcc} onChange={setBankAcc} options={BANKS} label="बैंक खाता" />
            </div>
          )}
        </section>

        {/* ---- 7. amount ---- */}
        <section id="ex-amount" className="mb-4">
          <MLabel n="7" text="कुल राशि (₹)" required />
          <MBox error={errors.amount} style={{ background: '#eef6f0', borderColor: errors.amount ? C.required : '#dcebe0' }}>
            <span className="pl-3 pr-2 font-semibold" style={{ color: C.text, fontSize: cl(16, 5, 22) }}>₹</span>
            <input inputMode="decimal" aria-label="कुल राशि" value={amountDisplay} placeholder="0.00"
              onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
              onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); clearErr('amount') }}
              className="flex-1 min-w-0 h-full bg-transparent pr-3 font-semibold outline-none placeholder:text-slate-400" style={mInput} />
          </MBox>
          {errors.amount ? <MErr>{errors.amount}</MErr> : <MHint>{numberToWordsINR(amountNum)}</MHint>}
        </section>

        {/* ---- 8. upload ---- */}
        <section className="mb-4">
          <MLabel n="8" text="बिल/रसीद अपलोड करें (वैकल्पिक)" />
          <label className="flex flex-col items-center justify-center gap-1 rounded-lg text-center cursor-pointer active:bg-green-50 focus-within:ring-2 focus-within:ring-green-600/40" style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8', padding: cl(14, 4.5, 22) }}>
            <span className="flex items-center gap-2 font-bold" style={{ color: C.label, fontSize: cl(12, 3.6, 15) }}>
              <Paperclip style={mIcon} />{file ? 'फ़ाइल बदलें' : 'फोटो / PDF / Document अपलोड करें'}
            </span>
            {file
              ? <span className="max-w-full truncate font-medium" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>{file.name}</span>
              : <span className="font-bold" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>अधिकतम साइज़: 10 MB</span>}
            <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
          </label>
          {file && <button type="button" onClick={() => setFile(null)} className="mt-1.5 font-semibold text-red-600 focus-ring rounded" style={{ fontSize: cl(11, 3.3, 14) }}>फ़ाइल हटाएं</button>}
        </section>

        {/* ---- 9. note ---- */}
        <section className="mb-1">
          <MLabel n="9" text="नोट (वैकल्पिक)" />
          <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
            <textarea rows={4} maxLength={150} value={note} onChange={(e) => setNote(e.target.value)} placeholder="कोई अतिरिक्त जानकारी" aria-label="नोट"
              className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-6 outline-none placeholder:text-slate-400" style={mInput} />
            <span className="absolute right-3 bottom-1.5" style={{ color: C.muted, fontSize: cl(10, 3, 13) }}>{note.length}/150</span>
          </div>
        </section>

        <p className="mt-4 text-center font-semibold" style={{ color: '#166534', fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav ---- */}
      <div className="shrink-0 grid grid-cols-[1fr_1.6fr] border-t bg-white py-2.5" style={{ borderColor: C.border, gap: cl(10, 3.5, 18), paddingInline: PAD }}>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>रद्द करें</button>
        <button type="button" onClick={save} className="rounded-lg font-semibold text-white inline-flex items-center justify-center gap-2 active:opacity-90 focus-ring" style={{ background: C.green, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>
          <Save size={17} /> खर्च सेव करें
        </button>
      </div>

      {/* ---- rules bottom sheet (opened by the (i) icon on section 1) ---- */}
      {rulesOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="खर्च के प्रकार और उनके नियम">
          <button type="button" aria-label="बंद करें" onClick={() => setRulesOpen(false)} className="absolute inset-0 bg-black/40" />
          <div ref={sheetRef} tabIndex={-1} className="relative max-h-[85%] flex flex-col rounded-t-2xl bg-white outline-none">
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b" style={{ borderColor: C.border }}>
              <h3 className="font-bold" style={{ color: C.green, fontSize: cl(15, 4.4, 20) }}>खर्च के प्रकार और उनके नियम</h3>
              <button type="button" aria-label="बंद करें" onClick={() => setRulesOpen(false)} className="p-1.5 rounded-full active:bg-slate-100 focus-ring" style={{ color: C.text }}><X size={20} /></button>
            </div>
            <div className="overflow-y-auto px-4 py-3 space-y-2.5">
              {RULES.map((r) => <RuleCard key={r.key} {...r} active={r.title === type} compact />)}
              <NoteCard />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}