import React, { useEffect, useRef, useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, Wallet, CalendarDays,
  UserPlus, Banknote, Landmark, Info, ChevronDown, Check, FileText,
  ArrowRight, Lightbulb, Save, Building2, CreditCard,
  Calendar, X, CheckCircle2, FilePlus,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* ---------- Design tokens (same as Expense.jsx) ---------- */
const C = {
  green: '#14612e',
  greenSoft: '#eef7f0',
  greenBorder: '#2f8f4e',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e7eb',
  required: '#dc2626',
}

const THEMES = {
  blue: { bg: '#f2f7ff', border: '#c7dbf7', num: '#2563eb', title: '#1d4ed8', arrow: '#2563eb' },
  purple: { bg: '#f7f3ff', border: '#d9cdf5', num: '#7c3aed', title: '#6d28d9', arrow: '#7c3aed' },
  orange: { bg: '#fff6f0', border: '#f8d5c2', num: '#f97316', title: '#c2410c', arrow: '#ea580c' },
  green: { bg: '#f0faf3', border: '#bfe0c8', num: '#16a34a', title: '#15803d', arrow: '#16a34a' },
}

const RULES = [
  { n: 1, title: 'Customer Receipt (ग्राहक से प्राप्ति)', color: 'blue', desc: 'ग्राहक से माल/सेवा की बिक्री पर प्राप्त राशि।', examples: ['प्रोडक्ट बिक्री का भुगतान', 'सर्विस का भुगतान', 'एडवांस प्राप्ति'], effects: ['यह राशि आपके व्यवसाय में आएगी', 'बैंक/नकद बुक अपडेट होगी', 'P&L में शामिल नहीं होगी (जब तक यह अन्य आय न हो)।'] },
  { n: 2, title: 'Other Income (अन्य आय)', color: 'purple', desc: 'व्यवसाय से संबंधित अन्य आय जैसे:', examples: ['ब्याज प्राप्ति', 'किराया प्राप्ति', 'डिस्काउंट प्राप्ति', 'कमीशन प्राप्ति', 'अन्य आय'], effects: ['यह राशि व्यवसाय में आएगी', 'P&L (Other Income) में शामिल होगी।'] },
  { n: 3, title: 'Loan Received (ऋण प्राप्ति)', color: 'orange', desc: 'जब आपने किसी व्यक्ति, संस्था या बैंक से ऋण प्राप्त किया हो।', examples: ['मित्र/रिश्तेदार से ऋण', 'बैंक लोन', 'संस्था/फाइनेंस कंपनी से ऋण'], effects: ['यह राशि व्यवसाय में आएगी', 'Liability (Loan Account) में दर्ज होगी', 'P&L में शामिल नहीं होगी।'] },
  { n: 4, title: 'Owner Fund Addition (मालिक द्वारा पैसा लगाना)', color: 'green', desc: 'जब मालिक अपने व्यक्तिगत धन को व्यवसाय में लगाता है।', examples: ['कैश डालना', 'बैंक ट्रांसफर करना', 'अतिरिक्त पूंजी लगाना'], effects: ['यह राशि Capital Account में जाएगी', 'P&L को प्रभावित नहीं करेगी', 'व्यवसाय की वित्तीय स्थिति मजबूत करेगी।'] },
]

const TYPE_HELP = {
  'Customer Receipt (ग्राहक से प्राप्ति)': 'यह प्राप्ति आपके व्यवसाय में ग्राहक से मिली राशि को दर्शाती है।',
  'Other Income (अन्य आय)': 'यह प्राप्ति व्यवसाय से संबंधित अन्य आय को दर्शाती है।',
  'Loan Received (ऋण प्राप्ति)': 'यह प्राप्ति किसी व्यक्ति, संस्था या बैंक से मिले ऋण को दर्शाती है।',
  'Owner Fund Addition (मालिक द्वारा पैसा लगाना)': 'यह प्राप्ति मालिक द्वारा व्यवसाय में लगाए गए पैसे को दर्शाती है।',
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

export default function Receipt() {
  const { pushToast } = useApp()
  const isDesktop = useIsDesktop()
  const [source, setSource] = useState('bank')
  const [type, setType] = useState('Customer Receipt (ग्राहक से प्राप्ति)')
  const [remarks, setRemarks] = useState('Invoice No. 145 के भुगतान के रूप में प्राप्ति')
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState(25000)
  const [editingAmount, setEditingAmount] = useState(false)

  const amountDisplay = editingAmount
    ? String(amount)
    : Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Layout title="Receipt" subtitle="प्राप्ति दर्ज करें">
      {/* Only ONE view is mounted at a time (JS media query), so the desktop
          PageHeader can never show up on phones / small tablets. */}
      {isDesktop ? (
      <div>
      {/* ---------------- Page header (same as SalesReturn) ---------------- */}
      <div>
        <PageHeader
          code="SCR-009"
          title="प्राप्ति दर्ज करें (Receipt Entry)"
          subtitle="व्यवसाय में प्राप्त होने वाली राशि की जानकारी भरें"
          actions={
            <>
              <Button variant="outline" icon={FileSpreadsheet} size="sm">Excel में निर्यात करें</Button>
              <Button variant="outline" icon={Printer} size="sm">PDF प्रिंट करें</Button>
              <Button variant="primary" icon={Plus} size="sm">नई प्राप्ति दर्ज करें</Button>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        {/* ---------------- LEFT: form ---------------- */}
        <div className="space-y-3">
          {/* 1. Receipt type */}
          <Section>
            <SectionLabel n="1." text="प्राप्ति का प्रकार चुनें" required info />
            <p className="text-[12px] font-semibold mb-2" style={{ color: C.text }}>प्राप्ति का प्रकार</p>
            <SelectBox icon={Wallet} value={type} onChange={setType} tinted options={Object.keys(TYPE_HELP)} />
            <Hint>{TYPE_HELP[type]}</Hint>
          </Section>

          {/* 2 + 3 */}
          <div className="grid grid-cols-2 gap-3">
            <Section>
              <SectionLabel n="2." text="प्राप्ति दिनांक" required />
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.label }} />
                <input
                  type="date"
                  defaultValue="2025-05-17"
                  className="w-full h-11 rounded-lg border bg-white pl-10 pr-3 text-[13px] font-medium outline-none focus:border-green-600"
                  style={{ borderColor: '#d1d5db', color: C.text }}
                />
              </div>
            </Section>
            <Section>
              <SectionLabel n="3." text="प्राप्त राशि (₹)" required />
              <div
                className="flex items-center h-11 rounded-lg px-3"
                style={{ background: '#e9f5ec', border: '1px solid #e1efe5' }}
              >
                <span className="text-[18px] font-semibold mr-3" style={{ color: C.green }}>₹</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amountDisplay}
                  onFocus={() => setEditingAmount(true)}
                  onBlur={() => setEditingAmount(false)}
                  onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); clearErr('amount') }}
                  className="w-full min-w-0 bg-transparent outline-none text-[14px] font-semibold"
                  style={{ color: C.text }}
                />
              </div>
              <Hint>{numberToWordsINR(Number(amount) || 0)}</Hint>
            </Section>
          </div>

          {/* 4. From whom */}
          <Section>
            <SectionLabel n="4." text="किससे प्राप्त हुआ" required />
            <div className="relative">
              <input
                defaultValue="रवि ट्रेडर्स"
                className="w-full h-11 rounded-lg border bg-white pl-3 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
                style={{ borderColor: '#d1d5db', color: C.text }}
              />
              <UserPlus size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.green }} />
            </div>
          </Section>

          {/* 5. Source of fund */}
          <Section>
            <SectionLabel n="5." text="भुगतान का माध्यम (Source of Fund)" required info />
            <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1.15fr] gap-3 items-stretch">
              <SourceOption icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
              <SourceOption icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              <div
                className="col-span-2 md:col-span-1 rounded-lg border px-3 py-2.5"
                style={{ background: '#eef7f0', borderColor: '#bfe0c8' }}
              >
                <p className="text-[12px] font-bold mb-1" style={{ color: C.green }}>यह चयन क्यों महत्वपूर्ण है?</p>
                <ul className="text-[11.5px] list-disc pl-4 space-y-0.5" style={{ color: C.text }}>
                  <li>नकद प्राप्त होने पर Cash Book अपडेट होगी।</li>
                  <li>बैंक से राशि प्राप्त होने पर Bank Book अपडेट होगी।</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* 6 + 7 (bank only) */}
          {source === 'bank' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Section>
                <SectionLabel n="6." text="बैंक खाता" required />
                <SelectBox icon={Building2} defaultValue="SBI Current A/c - 12345678901" options={['SBI Current A/c - 12345678901']} />
              </Section>
              <Section>
                <SectionLabel n="7." text="प्राप्ति का तरीका (Mode of Receipt)" required />
                <SelectBox icon={CreditCard} defaultValue="NEFT" options={['NEFT', 'RTGS', 'UPI', 'चेक']} />
              </Section>
            </div>
          )}

          {/* 8. Remarks */}
          <Section>
            <SectionLabel n="8." text="विवरण (Remarks)" />
            <div className="relative">
              <textarea
                rows={3}
                maxLength={150}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="उदाहरण: Invoice No. 145 के भुगतान के रूप में प्राप्ति"
                className="w-full h-[88px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                style={{ borderColor: '#d1d5db', color: C.text }}
              />
              <span className="absolute right-3 bottom-2 text-[11px]" style={{ color: C.muted }}>{remarks.length}/150</span>
            </div>
          </Section>

          {/* 9 + 10 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-3">
            <Section>
              <SectionLabel n="9." text="बिल/दस्तावेज़ अपलोड करें (वैकल्पिक)" />
              <label
                className="flex flex-col items-center justify-center gap-1 h-[88px] rounded-lg cursor-pointer text-center px-3"
                style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8' }}
              >
                <span className="flex items-center gap-2 text-[12.5px] font-bold" style={{ color: C.green }}>
                  <Paperclip size={17} /> फोटो / PDF / Document अपलोड करें
                </span>
                <span className="text-[12px] font-bold" style={{ color: C.text }}>अधिकतम साइज़: 10 MB</span>
                <input type="file" className="hidden" />
              </label>
            </Section>
            <Section>
              <SectionLabel n="10." text="नोट (वैकल्पिक)" />
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={150}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="कोई अतिरिक्त जानकारी"
                  className="w-full h-[88px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                  style={{ borderColor: '#d1d5db', color: C.text }}
                />
                <span className="absolute right-3 bottom-2 text-[11px]" style={{ color: C.muted }}>{note.length}/150</span>
              </div>
            </Section>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-[1fr_1.6fr] sm:grid-cols-[1fr_1.35fr_1.7fr] gap-3 pt-1">
            <button
              type="button"
              className="h-11 rounded-lg border bg-white text-[13px] font-semibold"
              style={{ borderColor: '#d1d5db', color: C.label }}
            >
              रद्द करें
            </button>
            <button
              type="button"
              className="hidden sm:inline-flex h-11 rounded-lg border bg-white text-[13px] font-semibold items-center justify-center gap-2"
              style={{ borderColor: '#d1d5db', color: C.label }}
            >
              <FileText size={17} /> Draft के रूप में सुरक्षित करें
            </button>
            <button
              type="button"
              onClick={() => pushToast('प्राप्ति सफलतापूर्वक सेव हो गई')}
              className="h-11 rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2"
              style={{ background: C.green }}
            >
              <Save size={17} /> प्राप्ति सेव करें
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT: rules ---------------- */}
        <div className="space-y-3">
          <h3 className="text-[16px] font-bold mb-3 mt-1" style={{ color: C.green }}>
            प्राप्ति के प्रकार और उनके नियम
          </h3>
          {RULES.map((r) => <RuleCard key={r.n} {...r} theme={THEMES[r.color]} />)}

          <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde9b0' }}>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={17} style={{ color: '#d97706' }} />
              <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>ध्यान दें</p>
            </div>
            <p className="text-[12.5px] font-medium leading-relaxed" style={{ color: C.text }}>
              व्यय (Expense) यानी पैसा बाहर जाना SCR-008 में दर्ज करें। यहाँ केवल प्राप्ति (Money In) के लिए है।
            </p>
          </div>
        </div>
      </div>
      </div>
      ) : (
        /* ===================== MOBILE (prototype: SCR-009) ===================== */
        <ReceiptMobile />
      )}
    </Layout>
  )
}

/* ====================== helpers ====================== */

function Section({ children }) {
  return (
    <div className="rounded-xl bg-white p-3.5" style={{ border: `1px solid ${C.border}` }}>
      {children}
    </div>
  )
}

function SectionLabel({ n, text, required, info }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-[14px] font-bold" style={{ color: C.label }}>
        {n} {text}
        {required && <span style={{ color: C.required }}> *</span>}
      </span>
      {info && <Info size={14} style={{ color: C.muted }} />}
    </div>
  )
}

function Hint({ children }) {
  return <p className="text-[12px] mt-2" style={{ color: C.muted }}>{children}</p>
}

function SelectBox({ icon: Icon, options, value, defaultValue, onChange, tinted }) {
  const controlled = value !== undefined
  return (
    <div className="relative">
      <Icon size={19} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.green }} />
      <select
        {...(controlled ? { value, onChange: (e) => onChange(e.target.value) } : { defaultValue })}
        className="w-full h-11 appearance-none rounded-lg border pl-11 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
        style={{ borderColor: tinted ? '#c9d8f2' : '#d1d5db', background: tinted ? '#f4f8ff' : '#fff', color: C.text }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
    </div>
  )
}

function SourceOption({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3.5 h-[52px] text-[13px] font-semibold text-left"
      style={{
        border: `1px solid ${active ? C.greenBorder : '#d1d5db'}`,
        background: active ? C.greenSoft : '#fff',
        color: active ? C.green : C.text,
      }}
    >
      <Icon size={22} />
      <span className="flex-1">{label}</span>
      {active && (
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: C.green }}>
          <Check size={13} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

function RuleCard({ n, title, theme, desc, examples, effects }) {
  return (
    <div className="rounded-xl p-4" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
          style={{ background: theme.num }}
        >
          {n}
        </span>
        <p className="text-[13.5px] font-semibold" style={{ color: theme.title }}>{title}</p>
      </div>

      <p className="text-[12.5px] mb-2" style={{ color: C.text }}>{desc}</p>

      <p className="text-[12px] font-bold mb-1" style={{ color: theme.title }}>उदाहरण:</p>
      <ul className="text-[12.5px] list-disc pl-5 mb-2.5 space-y-0.5" style={{ color: C.text }}>
        {examples.map((e) => <li key={e}>{e}</li>)}
      </ul>

      <p className="text-[12px] font-bold mb-1" style={{ color: theme.title }}>सिस्टम प्रभाव:</p>
      <ul className="space-y-1">
        {effects.map((e) => (
          <li key={e} className="flex items-start gap-1.5 text-[12.5px]" style={{ color: C.text }}>
            <ArrowRight size={14} className="mt-[3px] shrink-0" style={{ color: theme.arrow }} />
            <span>{e}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg) — SCR-009
   Written in the SAME format as SalesBill.jsx: MobileHeader on top, centred
   title block, sticky stepper, bordered SectionCards, MField labels, plain
   boxes, summary / quick-actions / rules cards, footer line and a sticky
   action bar above Layout's bottom nav. All sizes are clamp()-based.
   ===================================================================== */
const FIELD = '#d9dde3'
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)'
const MODES = ['NEFT', 'RTGS', 'UPI', 'चेक']
const BANK_ACCOUNTS = ['SBI Current A/c - 12345678901']
const MOBILE_STEPS = ['प्राप्ति जानकारी', 'किससे प्राप्त', 'भुगतान माध्यम', 'विवरण / नोट', 'दस्तावेज़']

const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* ---------- small building blocks (same as SalesBill) ---------- */
function MField({ label, required, children, hintText, error }) {
  return (
    <div className="min-w-0">
      <span className="block font-semibold mb-1" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {error
        ? <p role="alert" className="mt-1 font-semibold text-red-600" style={{ fontSize: cl(9.5, 2.8, 12) }}>{error}</p>
        : hintText && <p className="mt-1" style={{ color: C.muted, fontSize: cl(9.5, 2.8, 12) }}>{hintText}</p>}
    </div>
  )
}

const boxH = cl(40, 11.5, 50)
const inputStyle = { color: C.text, fontSize: cl(12, 3.6, 15) }
const iconStyle = { color: C.muted, width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }
const inputCls = 'flex-1 min-w-0 h-full bg-transparent pl-3 pr-9 outline-none placeholder:text-slate-400'

function Box({ children, readOnly, error }) {
  return (
    <div
      className={`relative flex items-center w-full rounded-lg border ${readOnly ? 'bg-slate-100' : 'bg-white focus-within:border-green-600'}`}
      style={{ borderColor: error ? '#dc2626' : FIELD, height: boxH }}
    >
      {children}
    </div>
  )
}

function TextBox({ icon: Icon, readOnly, error, ...props }) {
  return (
    <Box readOnly={readOnly} error={error}>
      <input
        readOnly={readOnly}
        {...props}
        className={Icon ? inputCls : 'flex-1 min-w-0 h-full bg-transparent px-3 outline-none placeholder:text-slate-400'}
        style={inputStyle}
      />
      {Icon && <Icon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />}
    </Box>
  )
}

function MSelect({ value, onChange, options, label }) {
  return (
    <Box>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="appearance-none w-full h-full bg-transparent pl-3 pr-9 outline-none rounded-lg" style={inputStyle}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconStyle, color: C.text }} />
    </Box>
  )
}

function DateBox({ value, onChange, label, error }) {
  return (
    <Box error={error}>
      <span className="pl-3 pr-9 font-medium" style={inputStyle}>{showDate(value)}</span>
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
      {/* native picker sits invisibly on top so the box keeps the dd/mm/yyyy look */}
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </Box>
  )
}

function AreaBox({ value, onChange, rows = 3, label, max = 150, placeholder }) {
  return (
    <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: FIELD }}>
      <textarea
        rows={rows}
        maxLength={max}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-5 outline-none placeholder:text-slate-400"
        style={inputStyle}
      />
      <span className="absolute right-2.5 bottom-1 text-[10px]" style={{ color: C.muted }}>{value.length}/{max}</span>
    </div>
  )
}

function SectionCard({ title, sub, innerRef, children }) {
  return (
    <section ref={innerRef} className="rounded-xl border bg-white mt-3" style={{ borderColor: '#e9ecf0', padding: cl(12, 3.6, 18), scrollMarginTop: 72 }}>
      <h2 className="font-bold mb-3" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>
        {title}{sub && <span className="font-semibold ml-1" style={{ fontSize: cl(11, 3.4, 14) }}>{sub}</span>}
      </h2>
      {children}
    </section>
  )
}

function AttachBox({ files, onFiles, onRemove }) {
  return (
    <>
      <label className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed text-center cursor-pointer active:bg-green-50 focus-within:ring-2 focus-within:ring-green-600/40" style={{ borderColor: '#22a24a', padding: cl(12, 3.4, 20) }}>
        <span className="flex items-center gap-1.5 font-semibold" style={{ color: C.green, fontSize: cl(12, 3.8, 16) }}><Paperclip size={15} />+ Attachment जोड़ें</span>
        <span style={{ color: C.text, fontSize: cl(10.5, 3.2, 13) }}>(फोटो / PDF / Document)</span>
        <span style={{ color: C.muted, fontSize: cl(9.5, 3, 12) }}>अधिकतम साइज़: 10 MB</span>
        <input type="file" multiple accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFiles} />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg bg-slate-50 border px-2.5 py-1.5" style={{ borderColor: '#e9ecf0', fontSize: cl(11, 3.3, 14), color: C.text }}>
              <FileText size={14} style={{ color: C.label }} className="shrink-0" />
              <span className="flex-1 truncate">{f.name}</span>
              <button type="button" aria-label="फ़ाइल हटाएं" onClick={() => onRemove(i)} className="p-1 text-slate-500 focus-ring rounded"><X size={14} /></button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function SourceBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="flex items-center gap-2 rounded-lg border px-3 text-left font-semibold focus-ring"
      style={{
        height: boxH, fontSize: cl(12, 3.6, 15),
        borderColor: active ? C.greenBorder : FIELD,
        background: active ? C.greenSoft : '#fff',
        color: active ? C.green : C.text,
      }}
    >
      <Icon className="shrink-0" style={{ width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }} />
      <span className="flex-1 truncate">{label}</span>
      {active && (
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
          <Check size={13} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

/* ---------- the page ---------- */
function ReceiptMobile() {
  const { pushToast } = useApp()
  const mainRef = useRef(null)
  const secRefs = useRef([])
  const chipRefs = useRef([])
  const [active, setActive] = useState(0)

  // 1. receipt info
  const [type, setType] = useState(Object.keys(TYPE_HELP)[0])
  const [date, setDate] = useState('2025-05-17')
  const [amount, setAmount] = useState('25000')
  const [editingAmount, setEditingAmount] = useState(false)
  // 2. from whom
  const [party, setParty] = useState('रवि ट्रेडर्स')
  // 3. source of fund
  const [source, setSource] = useState('bank')
  const [bankAcc, setBankAcc] = useState(BANK_ACCOUNTS[0])
  const [mode, setMode] = useState(MODES[0])
  // 4. remarks / note
  const [remarks, setRemarks] = useState('')
  const [note, setNote] = useState('')
  // 5. attachments
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})

  const amountNum = parseFloat(amount) || 0
  const amountDisplay = editingAmount ? amount : amountNum ? money(amountNum) : ''
  const rule = RULES.find((r) => r.title === type) || RULES[0]
  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))

  /* ----- stepper <-> scroll (same behaviour as SalesBill) ----- */
  const goTo = (i) => {
    setActive(i)
    secRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const onScroll = () => {
    const main = mainRef.current
    if (!main) return
    const line = main.getBoundingClientRect().top + 96 // just below the sticky stepper
    let idx = 0
    secRefs.current.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= line) idx = i })
    setActive((prev) => (prev === idx ? prev : idx))
  }
  useEffect(() => {
    chipRefs.current[active]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    const ok = picked.filter((f) => f.size <= 10 * 1024 * 1024)
    if (ok.length < picked.length) pushToast('10 MB से बड़ी फ़ाइल जोड़ी नहीं गई', 'warn')
    if (ok.length) setFiles((prev) => [...prev, ...ok])
  }

  const save = () => {
    const errs = {}
    if (!date) errs.date = 'तिथि चुनें'
    if (amountNum <= 0) errs.amount = 'राशि दर्ज करें'
    if (!party.trim()) errs.party = 'यह बताएं कि राशि किससे प्राप्त हुई'
    setErrors(errs)
    if (errs.date || errs.amount) { goTo(0); return pushToast(errs.date || errs.amount, 'warn') }
    if (errs.party) { goTo(1); return pushToast(errs.party, 'warn') }
    if (source === 'bank' && (!bankAcc || !mode)) { goTo(2); return pushToast('बैंक खाता और प्राप्ति का तरीका चुनें', 'warn') }
    pushToast('प्राप्ति सफलतापूर्वक सेव हो गई')
  }

  const reset = () => {
    setType(Object.keys(TYPE_HELP)[0]); setDate(todayIso()); setAmount(''); setParty('')
    setSource('cash'); setBankAcc(BANK_ACCOUNTS[0]); setMode(MODES[0])
    setRemarks(''); setNote(''); setFiles([]); setErrors({})
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    pushToast('नई प्राप्ति शुरू करें', 'info')
  }

  const summary = [
    ['प्राप्ति का प्रकार :', type.split(' (')[0]],
    ['प्राप्ति दिनांक :', showDate(date) || '—'],
    ['किससे प्राप्त :', party || '—'],
    ['भुगतान माध्यम :', source === 'bank' ? `बैंक (${mode})` : 'नकद (Cash)'],
  ]
  const quickActions = [
    { l: 'Excel निर्यात', i: FileSpreadsheet, fn: () => pushToast('Excel तैयार किया जा रहा है', 'info') },
    { l: 'PDF प्रिंट', i: Printer, fn: () => pushToast('PDF तैयार किया जा रहा है', 'info') },
    { l: 'ड्राफ्ट सेव करें', i: FileText, fn: () => pushToast('ड्राफ्ट सेव हो गया') },
    { l: 'नई प्राप्ति', i: FilePlus, fn: reset },
  ]

  const gap = cl(8, 3, 16)

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main ref={mainRef} onScroll={onScroll} className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>SCR-009</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>प्राप्ति दर्ज करें (Receipt Entry)</h1>
          <p className="font-medium mt-1 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>व्यवसाय में प्राप्त होने वाली राशि की जानकारी भरें</p>
        </div>

        {/* ---- sticky stepper (scrolls sideways, follows the page) ---- */}
        <nav aria-label="प्राप्ति के चरण" className="sticky top-0 z-10 bg-white mt-3 border-b" style={{ borderColor: '#e9ecf0', marginInline: `calc(-1 * ${PAD})`, paddingInline: PAD }}>
          <ol className="flex items-center overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MOBILE_STEPS.map((t, i) => (
              <li key={t} className="flex items-center shrink-0">
                <button
                  type="button"
                  ref={(el) => { chipRefs.current[i] = el }}
                  onClick={() => goTo(i)}
                  aria-current={active === i ? 'step' : undefined}
                  className="flex items-center gap-1.5 rounded-full focus-ring"
                >
                  <span className="rounded-full flex items-center justify-center font-semibold border shrink-0" style={{
                    width: cl(24, 7, 30), height: cl(24, 7, 30), fontSize: cl(11, 3.3, 14),
                    background: active === i ? C.green : '#fff', color: active === i ? '#fff' : C.text, borderColor: active === i ? C.green : '#94a3b8',
                  }}>{i + 1}</span>
                  <span className="font-semibold whitespace-nowrap" style={{ color: active === i ? C.green : C.text, fontSize: cl(11, 3.3, 14) }}>{t}</span>
                </button>
                {i < MOBILE_STEPS.length - 1 && <span className="h-px w-4 bg-slate-300 mx-2 shrink-0" />}
              </li>
            ))}
          </ol>
        </nav>

        {/* ---- 1. receipt info ---- */}
        <SectionCard title="1. प्राप्ति जानकारी" innerRef={(el) => { secRefs.current[0] = el }}>
          <MField label="प्राप्ति का प्रकार" required hintText={TYPE_HELP[type]}>
            <MSelect value={type} onChange={setType} options={Object.keys(TYPE_HELP)} label="प्राप्ति का प्रकार" />
          </MField>
          <div className="grid grid-cols-2 mt-3" style={{ gap }}>
            <MField label="प्राप्ति दिनांक" required error={errors.date}>
              <DateBox value={date} onChange={(v) => { setDate(v); clearErr('date') }} label="प्राप्ति दिनांक" error={errors.date} />
            </MField>
            <MField label="प्राप्त राशि (₹)" required error={errors.amount} hintText={amountNum > 0 ? numberToWordsINR(amountNum) : undefined}>
              <Box error={errors.amount}>
                <span className="pl-3 pr-1 font-semibold" style={{ color: C.green, fontSize: cl(14, 4.3, 18) }}>₹</span>
                <input
                  inputMode="decimal"
                  aria-label="प्राप्त राशि"
                  value={amountDisplay}
                  placeholder="0.00"
                  onFocus={() => setEditingAmount(true)}
                  onBlur={() => setEditingAmount(false)}
                  onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, '')); clearErr('amount') }}
                  className="flex-1 min-w-0 h-full bg-transparent px-2 font-semibold outline-none placeholder:text-slate-400"
                  style={inputStyle}
                />
              </Box>
            </MField>
          </div>
        </SectionCard>

        {/* ---- 2. from whom ---- */}
        <SectionCard title="2. किससे प्राप्त हुआ" innerRef={(el) => { secRefs.current[1] = el }}>
          <MField label="पार्टी / व्यक्ति का नाम" required error={errors.party}>
            <Box error={errors.party}>
              <input
                value={party}
                onChange={(e) => { setParty(e.target.value); clearErr('party') }}
                aria-label="किससे प्राप्त हुआ"
                className={inputCls}
                style={inputStyle}
              />
              <button type="button" aria-label="नई पार्टी जोड़ें" onClick={() => pushToast('नई पार्टी जोड़ने का फॉर्म खुलेगा', 'info')} className="absolute right-0 h-full px-3 flex items-center rounded-r-lg focus-ring" style={{ color: C.green }}>
                <UserPlus style={iconStyle} />
              </button>
            </Box>
          </MField>
        </SectionCard>

        {/* ---- 3. source of fund ---- */}
        <SectionCard title="3. भुगतान का माध्यम" sub="(Source of Fund)" innerRef={(el) => { secRefs.current[2] = el }}>
          <div className="grid grid-cols-2" style={{ gap }}>
            <SourceBtn icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
            <SourceBtn icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
          </div>
          <div className="mt-3 rounded-lg border px-3 py-2.5 font-semibold" style={{ background: C.greenSoft, borderColor: '#bfe0c8', color: C.green, fontSize: cl(10.5, 3.2, 14) }}>
            {source === 'bank' ? 'बैंक से राशि प्राप्त होने पर Bank Book अपडेट होगी।' : 'नकद प्राप्त होने पर Cash Book अपडेट होगी।'}
          </div>
          {source === 'bank' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-3" style={{ gap }}>
              <MField label="बैंक खाता" required>
                <MSelect value={bankAcc} onChange={setBankAcc} options={BANK_ACCOUNTS} label="बैंक खाता" />
              </MField>
              <MField label="प्राप्ति का तरीका (Mode of Receipt)" required>
                <MSelect value={mode} onChange={setMode} options={MODES} label="प्राप्ति का तरीका" />
              </MField>
            </div>
          )}
        </SectionCard>

        {/* ---- 4. remarks / note ---- */}
        <SectionCard title="4. विवरण / नोट" innerRef={(el) => { secRefs.current[3] = el }}>
          <div className="space-y-3">
            <MField label="विवरण (Remarks)">
              <AreaBox rows={3} value={remarks} onChange={setRemarks} label="विवरण" placeholder="उदाहरण: Invoice No. 145 के भुगतान के रूप में प्राप्ति" />
            </MField>
            <MField label="नोट (वैकल्पिक)">
              <AreaBox rows={3} value={note} onChange={setNote} label="नोट" placeholder="कोई अतिरिक्त जानकारी" />
            </MField>
          </div>
        </SectionCard>

        {/* ---- 5. attachments ---- */}
        <SectionCard title="5. बिल / दस्तावेज़" sub="(वैकल्पिक)" innerRef={(el) => { secRefs.current[4] = el }}>
          <AttachBox files={files} onFiles={addFiles} onRemove={(i) => setFiles((a) => a.filter((_, k) => k !== i))} />
        </SectionCard>

        {/* ---- summary ---- */}
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: '#e9ecf0', padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-2" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>सारांश <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Summary)</span></h2>
          <dl className="space-y-1.5" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }}>
            {summary.map(([k, v]) => <div key={k} className="flex justify-between gap-3"><dt className="shrink-0">{k}</dt><dd className="font-medium text-right truncate">{v}</dd></div>)}
          </dl>
          <div className="mt-2 pt-2 border-t flex justify-between items-baseline font-bold" style={{ borderColor: FIELD }}>
            <span style={{ color: C.text, fontSize: cl(13, 3.9, 17) }}>कुल प्राप्त राशि :</span>
            <span style={{ color: C.green, fontSize: cl(16, 5, 22) }}>₹ {money(amountNum)}</span>
          </div>
        </section>

        {/* ---- quick actions ---- */}
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: '#e9ecf0', padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-2.5" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>त्वरित कार्य <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Quick Actions)</span></h2>
          <div className="grid grid-cols-4" style={{ gap: cl(4, 1.6, 10) }}>
            {quickActions.map((a) => (
              <button key={a.l} type="button" onClick={a.fn} className="min-w-0 flex flex-col items-center gap-1.5 py-2 px-0.5 rounded-lg border active:bg-slate-50 focus-ring" style={{ borderColor: '#e9ecf0' }}>
                <a.i style={{ color: C.label, width: cl(18, 5.6, 26), height: cl(18, 5.6, 26) }} />
                <span className="text-center leading-tight" style={{ color: C.text, fontSize: cl(9, 2.6, 12) }}>{a.l}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ---- rules for the selected type ---- */}
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: '#e9ecf0', padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-1" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>प्राप्ति के नियम <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Rules)</span></h2>
          <p className="font-semibold mb-1.5" style={{ color: THEMES[rule.color].title, fontSize: cl(11.5, 3.4, 14.5) }}>{rule.title}</p>
          <p className="mb-2" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>{rule.desc}</p>
          <p className="font-bold mb-1" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>उदाहरण:</p>
          <ul className="list-disc pl-4 space-y-1 mb-2.5" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>
            {rule.examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
          <p className="font-bold mb-1" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>सिस्टम प्रभाव:</p>
          <ul className="space-y-1.5" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>
            {rule.effects.map((r) => <li key={r} className="flex items-start gap-1.5"><CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />{r}</li>)}
          </ul>
        </section>
        <section className="rounded-xl border mt-3" style={{ background: '#fffbeb', borderColor: '#fde9b0', padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-1.5 flex items-center gap-1.5" style={{ color: '#92400e', fontSize: cl(13, 3.9, 17) }}><Lightbulb size={16} style={{ color: '#d97706' }} /> ध्यान दें</h2>
          <p style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>व्यय (Expense) यानी पैसा बाहर जाना SCR-008 में दर्ज करें। यहाँ केवल प्राप्ति (Money In) के लिए है।</p>
        </section>

        <p className="text-center font-semibold mt-4" style={{ color: C.green, fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav ---- */}
      <div className="shrink-0 grid grid-cols-2 border-t bg-white py-2.5" style={{ borderColor: '#e9ecf0', gap: cl(10, 3.5, 18), paddingInline: PAD }}>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.green, color: C.green, height: boxH, fontSize: cl(13, 3.9, 16) }}>रद्द करें</button>
        <button type="button" onClick={save} className="rounded-lg font-semibold text-white active:opacity-90 focus-ring inline-flex items-center justify-center gap-2" style={{ background: C.green, height: boxH, fontSize: cl(13, 3.9, 16) }}><Save size={17} /> प्राप्ति सेव करें</button>
      </div>
    </div>
  )
}