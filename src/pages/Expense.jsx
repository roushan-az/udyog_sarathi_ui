import React, { useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, CalendarDays, UserPlus,
  Banknote, Landmark, Info, ChevronDown, Check, FileText, ArrowRight,
  Lightbulb, HandCoins, CreditCard, BadgeCheck,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
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
  border: '#e9ecf0',
  required: '#dc2626',
  field: '#d9dde3',
}

const THEMES = {
  blue: { bg: '#f2f7ff', border: '#c7dbf7', num: '#2563eb', title: '#1d4ed8' },
  purple: { bg: '#f7f3ff', border: '#d9cdf5', num: '#7c3aed', title: '#6d28d9' },
  orange: { bg: '#fff6f0', border: '#f8d5c2', num: '#f97316', title: '#c2410c' },
  green: { bg: '#f0faf3', border: '#bfe0c8', num: '#16a34a', title: '#15803d' },
}

const RULES = [
  { n: 1, title: 'Customer Receipt (ग्राहक से प्राप्ति)', color: 'blue', desc: 'ग्राहक से माल/सेवा की बिक्री पर प्राप्त राशि।', examples: ['प्रोडक्ट बिक्री का भुगतान', 'सर्विस का भुगतान', 'एडवांस प्राप्ति'], effects: ['यह राशि आपके व्यवसाय में आएगी।', 'बैंक/नकद बुक अपडेट होगी।', 'P&L में शामिल नहीं होगी (जब तक यह अन्य आय न हो)।'] },
  { n: 2, title: 'Other Income (अन्य आय)', color: 'purple', desc: 'व्यवसाय से संबंधित अन्य आय जैसे:', examples: ['ब्याज प्राप्ति', 'किराया प्राप्ति', 'डिस्काउंट प्राप्ति', 'कमीशन प्राप्ति', 'अन्य आय'], effects: ['यह राशि व्यवसाय में आएगी।', 'P&L (Other Income) में शामिल होगी।'] },
  { n: 3, title: 'Loan Received (ऋण प्राप्ति)', color: 'orange', desc: 'जब आपने किसी व्यक्ति, संस्था या बैंक से ऋण प्राप्त किया हो।', examples: ['मित्र/रिश्तेदार से ऋण', 'बैंक लोन', 'संस्था/फाइनेंस कंपनी से ऋण'], effects: ['यह राशि व्यवसाय में आएगी।', 'Liability (Loan Account) में दर्ज होगी।', 'P&L में शामिल नहीं होगी।'] },
  { n: 4, title: 'Owner Fund Addition (मालिक द्वारा पैसा लगाना)', color: 'green', desc: 'जब मालिक अपने व्यक्तिगत धन को व्यवसाय में लगाता है।', examples: ['कैश डालना', 'बैंक ट्रांसफर करना', 'अतिरिक्त पूंजी लगाना'], effects: ['यह राशि Capital Account में जाएगी।', 'P&L को प्रभावित नहीं करेगी।', 'व्यवसाय की वित्तीय स्थिति मजबूत करेगी।'] },
]

const TYPE_HELP = {
  'Customer Receipt (ग्राहक से प्राप्ति)': 'यह प्राप्ति आपके व्यवसाय में ग्राहक से मिली राशि की दर्शाती है।',
  'Other Income (अन्य आय)': 'यह प्राप्ति व्यवसाय से संबंधित अन्य आय को दर्शाती है।',
  'Loan Received (ऋण प्राप्ति)': 'यह प्राप्ति किसी व्यक्ति, संस्था या बैंक से मिले ऋण को दर्शाती है।',
  'Owner Fund Addition (मालिक द्वारा पैसा लगाना)': 'यह प्राप्ति मालिक द्वारा व्यवसाय में लगाए गए पैसे को दर्शाती है।',
}

export default function Receipt() {
  const { pushToast } = useApp()
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
      {/* ---------------- Page header ---------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex items-center rounded-lg px-3.5 py-2 text-[13px] font-bold text-white leading-none" style={{ background: C.green }}>
            SCR-009
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: C.text }}>प्राप्ति दर्ज करें (Receipt Entry)</h1>
            <p className="text-[13px] font-medium mt-0.5" style={{ color: C.text }}>व्यवसाय में प्राप्त होने वाली राशि की जानकारी भरें</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HeaderBtn icon={FileSpreadsheet} iconColor="#16a34a">Excel में निर्यात करें</HeaderBtn>
          <HeaderBtn icon={Printer} iconColor="#2563eb">PDF प्रिंट करें</HeaderBtn>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-5 h-11 text-[13px] font-semibold text-white" style={{ background: C.green }}>
            <Plus size={18} /> नई प्राप्ति दर्ज करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-5">
        {/* ---------------- LEFT: form (outer card) ---------------- */}
        <div className="rounded-2xl bg-white p-3.5 space-y-2.5 self-start" style={{ border: `1px solid ${C.border}` }}>
          {/* 1 */}
          <Section>
            <SectionLabel n="1." text="प्राप्ति का प्रकार चुनें" required info />
            <p className="text-[12px] font-semibold mb-2" style={{ color: C.text }}>प्राप्ति का प्रकार</p>
            <SelectBox icon={HandCoins} value={type} onChange={setType} options={Object.keys(TYPE_HELP)} />
            <Hint>{TYPE_HELP[type]}</Hint>
          </Section>

          {/* 2 + 3 */}
          <div className="grid grid-cols-2 gap-2.5">
            <Section>
              <SectionLabel n="2." text="प्राप्ति दिनांक" required />
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.label }} />
                <input type="date" defaultValue="2025-05-17"
                  className="w-full h-11 rounded-lg border bg-white pl-10 pr-3 text-[13px] font-semibold outline-none focus:border-green-600"
                  style={{ borderColor: C.field, color: C.label }} />
              </div>
            </Section>
            <Section>
              <SectionLabel n="3." text="प्राप्त राशि (₹)" required />
              <div className="flex items-center h-11 rounded-lg px-3" style={{ background: '#fff', border: `1px solid ${C.field}` }}>
                <span className="text-[18px] font-semibold mr-4" style={{ color: C.text }}>₹</span>
                <input type="text" inputMode="decimal" value={amountDisplay}
                  onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full min-w-0 bg-transparent outline-none text-[13px] font-semibold" style={{ color: C.label }} />
              </div>
              <Hint>{numberToWordsINR(Number(amount) || 0)}</Hint>
            </Section>
          </div>

          {/* 4 */}
          <Section>
            <SectionLabel n="4." text="किससे प्राप्त हुआ" required />
            <div className="relative">
              <UserPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.green }} />
              <input defaultValue="रवि ट्रेडर्स"
                className="w-full h-11 rounded-lg border bg-white pl-10 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
                style={{ borderColor: C.field, color: C.label }} />
              <Plus size={17} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.label }} />
            </div>
          </Section>

          {/* 5 */}
          <Section>
            <SectionLabel n="5." text="भुगतान का माध्यम (Source of Fund)" required info />
            <div className="grid grid-cols-2 gap-3">
              <SourceOption icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
              <SourceOption icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
            </div>
            <div className="flex items-center gap-2 mt-2.5 rounded-md px-3 h-8 text-[12px] font-medium"
              style={{ background: '#eef7f0', border: '1px solid #d7ebdc', color: C.green }}>
              <BadgeCheck size={15} />
              {source === 'bank' ? 'बैंक से राशि प्राप्त होने पर Bank Book अपडेट होगी।' : 'नकद प्राप्त होने पर Cash Book अपडेट होगी।'}
            </div>
          </Section>

          {/* 6 + 7 */}
          {source === 'bank' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Section>
                <SectionLabel n="6." text="बैंक खाता" required />
                <SelectBox icon={Landmark} defaultValue="SBI Current A/c - 12345678901" options={['SBI Current A/c - 12345678901']} />
              </Section>
              <Section>
                <SectionLabel n="7." text="प्राप्ति का तरीका (Mode of Receipt)" required />
                <SelectBox icon={CreditCard} defaultValue="NEFT" options={['NEFT', 'RTGS', 'UPI', 'चेक']} />
              </Section>
            </div>
          )}

          {/* 8 */}
          <Section>
            <SectionLabel n="8." text="विवरण (Remarks)" />
            <div className="relative">
              <textarea rows={3} maxLength={150} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-[88px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600"
                style={{ borderColor: C.field, color: C.muted }} />
              <span className="absolute right-3 bottom-2 text-[12px]" style={{ color: C.muted }}>{remarks.length}/150</span>
            </div>
          </Section>

          {/* 9 + 10 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-2.5">
            <Section>
              <SectionLabel n="9." text="बिल/दस्तावेज़ अपलोड करें (वैकल्पिक)" />
              <label className="flex flex-col items-center justify-center gap-1 h-[72px] rounded-lg cursor-pointer text-center px-3"
                style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8' }}>
                <span className="flex items-center gap-2 text-[12.5px] font-bold" style={{ color: C.green }}>
                  <Paperclip size={17} /> फोटो / PDF / Document अपलोड करें
                </span>
                <span className="text-[12px] font-bold" style={{ color: C.label }}>अधिकतम साइज़: 10 MB</span>
                <input type="file" className="hidden" />
              </label>
            </Section>
            <Section>
              <SectionLabel n="10." text="नोट (वैकल्पिक)" />
              <div className="relative">
                <textarea rows={3} maxLength={150} value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="कोई अतिरिक्त जानकारी"
                  className="w-full h-[72px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                  style={{ borderColor: C.field, color: C.text }} />
                <span className="absolute right-3 bottom-1.5 text-[12px]" style={{ color: C.muted }}>{note.length}/150</span>
              </div>
            </Section>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-[1fr_1.6fr] sm:grid-cols-[1fr_1.45fr_1.2fr] gap-3 pt-0.5">
            <button type="button" className="h-11 rounded-lg border bg-white text-[13px] font-semibold" style={{ borderColor: C.field, color: C.label }}>
              रद्द करें
            </button>
            <button type="button" className="hidden sm:inline-flex h-11 rounded-lg border bg-white text-[13px] font-semibold items-center justify-center gap-2" style={{ borderColor: C.field, color: C.label }}>
              <FileText size={17} /> Draft के रूप में सुरक्षित करें
            </button>
            <button type="button" onClick={() => pushToast('प्राप्ति सफलतापूर्वक सेव हो गई')}
              className="h-11 rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2" style={{ background: C.green }}>
              <FileText size={17} /> प्राप्ति सेव करें
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT: rules ---------------- */}
        <div className="space-y-2.5">
          <h3 className="text-[16px] font-bold mb-3 mt-1" style={{ color: C.green }}>प्राप्ति के प्रकार और उनके नियम</h3>
          {RULES.map((r) => <RuleCard key={r.n} {...r} theme={THEMES[r.color]} />)}
          <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde9b0' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb size={17} style={{ color: '#d97706' }} />
              <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>ध्यान दें</p>
            </div>
            <p className="text-[12.5px] font-medium leading-relaxed" style={{ color: C.text }}>
              व्यय (Expense) यानी पैसा बाहर जाना SCR-008 में दर्ज करें।<br />
              यहाँ केवल प्राप्ति (Money In) के लिए है।
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

/* ====================== helpers ====================== */

function Section({ children }) {
  return <div className="rounded-xl bg-white p-3.5" style={{ border: `1px solid ${C.border}` }}>{children}</div>
}

function SectionLabel({ n, text, required, info }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-[14px] font-bold" style={{ color: C.label }}>
        {n} {text}{required && <span style={{ color: C.required }}> *</span>}
      </span>
      {info && <Info size={14} style={{ color: C.label }} />}
    </div>
  )
}

function Hint({ children }) {
  return <p className="text-[12px] mt-2" style={{ color: C.muted }}>{children}</p>
}

function SelectBox({ icon: Icon, options, value, defaultValue, onChange }) {
  const controlled = value !== undefined
  return (
    <div className="relative">
      <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.green }} />
      <select
        {...(controlled ? { value, onChange: (e) => onChange(e.target.value) } : { defaultValue })}
        className="w-full h-11 appearance-none rounded-lg border bg-white pl-12 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
        style={{ borderColor: C.field, color: C.label }}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
    </div>
  )
}

function SourceOption({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3.5 h-11 text-[13px] font-semibold text-left"
      style={{
        border: `1px solid ${active ? C.greenBorder : C.field}`,
        background: active ? C.greenSoft : '#fff',
        color: active ? C.green : C.label,
      }}>
      <Icon size={22} />
      <span className="flex-1">{label}</span>
      {active ? (
        <span className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: C.green }}>
          <Check size={13} strokeWidth={3} />
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full border" style={{ borderColor: '#cbd5e1' }} />
      )}
    </button>
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

function RuleCard({ n, title, theme, desc, examples, effects }) {
  const [en, hi] = title.split(/ (?=\()/)
  return (
    <div className="rounded-xl p-3.5" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
      <div className="flex items-center gap-2.5 mb-1.5">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ background: theme.num }}>{n}</span>
        <p style={{ color: theme.title }}>
          <span className="text-[14.5px] font-semibold">{en}</span>
          {hi && <span className="text-[12px] font-medium"> {hi}</span>}
        </p>
      </div>
      <p className="text-[12.5px] mb-2" style={{ color: C.text }}>{desc}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="sm:pr-3">
          <p className="text-[12px] font-bold mb-1" style={{ color: theme.title }}>उदाहरण:</p>
          <ul className="text-[12.5px] list-disc pl-5 space-y-0.5" style={{ color: C.text }}>
            {examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
        <div className="sm:pl-3 sm:border-l mt-2 sm:mt-0" style={{ borderColor: theme.border }}>
          <p className="text-[12px] font-bold mb-1" style={{ color: theme.title }}>सिस्टम प्रभाव:</p>
          <ul className="space-y-1">
            {effects.map((e) => (
              <li key={e} className="flex items-start gap-1.5 text-[12.5px]" style={{ color: C.text }}>
                <ArrowRight size={14} className="mt-[3px] shrink-0" style={{ color: theme.num }} />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}