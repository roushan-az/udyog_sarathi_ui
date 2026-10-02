import React, { useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, Wallet, CalendarDays, List,
  UserPlus, Banknote, Landmark, Info, ChevronDown, Check, FileText,
  ArrowRight, Lightbulb, Save,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* ---------- Design tokens (change here to tune the whole page) ---------- */
const C = {
  green: '#14612e',       // primary buttons, badge, right-panel heading
  greenSoft: '#eef7f0',   // active / tinted green background
  greenBorder: '#2f8f4e',
  label: '#1e3a8a',       // field labels (navy blue)
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e7eb',
  required: '#dc2626',
}

const RULES = [
  {
    n: 1, title: 'Operational Expense (व्यावसायिक खर्च)',
    theme: { bg: '#f2f7ff', border: '#c7dbf7', num: '#2563eb', title: '#1d4ed8', arrow: '#2563eb', link: '#1d4ed8' },
    desc: 'जो खर्च आपके व्यवसाय के दैनिक संचालन में होता है।',
    examples: ['किराया, बिजली, वेतन, इंटरनेट, फोन, पेट्रोल, स्टेशनरी, अन्य खर्च'],
    effects: [{ pre: 'यह खर्च सीधे ', link: 'P&L (लाभ-हानि)', post: ' खाते में चलेगा।' }],
  },
  {
    n: 2, title: 'Capital Expenditure (पूंजीगत खर्च)',
    theme: { bg: '#f7f3ff', border: '#d9cdf5', num: '#7c3aed', title: '#6d28d9', arrow: '#7c3aed', link: '#6d28d9' },
    desc: 'जो लंबे समय तक उपयोग होने वाली संपत्ति खरीदने पर किया गया खर्च है।',
    examples: ['मशीन, कंप्यूटर, फर्नीचर, AC / वाहन, ऑफिस सेटअप,', 'अन्य स्थायी सामान'],
    effects: [
      { pre: 'यह खर्च Assets (संपत्ति) में जाएगा।' },
      { pre: 'आगे चलकर इस पर अवमूल्यन (Depreciation) लागू होगा (Version 2.0 से)।' },
    ],
  },
  {
    n: 3, title: 'Personal Expense (व्यक्तिगत खर्च / व्यवसाय से निकासी)',
    theme: { bg: '#fff6f0', border: '#f8d5c2', num: '#f97316', title: '#c2410c', arrow: '#ea580c', link: '#c2410c' },
    desc: 'यह खर्च घर या निजी उपयोग के लिए व्यवसाय से निकाला गया पैसा है।',
    examples: ['घर का राशन, बच्चों की फीस, परिवार यात्रा, व्यक्तिगत खर्च,', 'चिकित्सा खर्च'],
    effects: [
      { pre: 'यह खर्च Withdrawal Ledger (निकासी खाता) में जाएगा।' },
      { pre: 'यह P&L में नहीं जाएगा।' },
      { pre: 'यह Asset में भी नहीं जाएगा।' },
    ],
  },
]

const TYPE_HELP = {
  'Operational Expense (व्यावसायिक खर्च)': 'यह खर्च आपके व्यवसाय के दैनिक संचालन से संबंधित है।',
  'Capital Expenditure (पूंजीगत खर्च)': 'यह खर्च लंबे समय तक उपयोग होने वाली संपत्ति से संबंधित है।',
  'Personal Expense (व्यक्तिगत खर्च)': 'यह खर्च व्यवसाय से निजी उपयोग के लिए निकासी है।',
}

export default function Expense() {
  const { pushToast } = useApp()
  const [source, setSource] = useState('cash')
  const [type, setType] = useState('Operational Expense (व्यावसायिक खर्च)')
  const [desc, setDesc] = useState('')
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState(12500)
  const [editingAmount, setEditingAmount] = useState(false)

  const amountDisplay = editingAmount
    ? String(amount)
    : Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Layout title="Expense" subtitle="खर्च दर्ज करें">
      {/* ---------------- Page header ---------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 inline-flex items-center rounded-lg px-3.5 py-2 text-[13px] font-bold text-white leading-none"
            style={{ background: C.green }}
          >
            SCR-008
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: C.text }}>
              खर्च दर्ज करें (Expense Entry)
            </h1>
            <p className="text-[13px] font-medium mt-0.5" style={{ color: C.text }}>
              खर्च का विवरण और जानकारी भरें
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <HeaderBtn icon={FileSpreadsheet} iconColor="#16a34a">Excel में निर्यात करें</HeaderBtn>
          <HeaderBtn icon={Printer} iconColor="#2563eb">PDF प्रिंट करें</HeaderBtn>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg px-5 h-11 text-[13px] font-semibold text-white"
            style={{ background: C.green }}
          >
            <Plus size={18} /> नया खर्च दर्ज करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6">
        {/* ---------------- LEFT: form ---------------- */}
        <div className="space-y-3">
          {/* 1. Expense type */}
          <Section>
            <SectionLabel n="1." text="खर्च का प्रकार चुनें" required info />
            <p className="text-[12px] font-semibold mb-2" style={{ color: C.text }}>खर्च का प्रकार</p>
            <SelectBox
              icon={Wallet}
              value={type}
              onChange={setType}
              tinted
              options={Object.keys(TYPE_HELP)}
            />
            <Hint>{TYPE_HELP[type]}</Hint>
          </Section>

          {/* 2 + 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-3">
            <Section>
              <SectionLabel n="2." text="खर्च दिनांक" required />
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
              <SectionLabel n="3." text="खर्च श्रेणी" required />
              <SelectBox
                icon={List}
                defaultValue="किराया (Rent)"
                options={['किराया (Rent)', 'बिजली (Electricity)', 'वेतन (Salary)', 'इंटरनेट/फोन']}
              />
            </Section>
          </div>

          {/* 4 + 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-3">
            <Section>
              <SectionLabel n="4." text="खर्च विवरण" required />
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={150}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="उदाहरण: मई महीने का दुकान का किराया"
                  className="w-full h-[88px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600 placeholder:text-slate-400"
                  style={{ borderColor: '#d1d5db', color: C.text }}
                />
                <span className="absolute right-3 bottom-2 text-[11px]" style={{ color: C.muted }}>{desc.length}/150</span>
              </div>
            </Section>
            <Section>
              <SectionLabel n="5." text="किसको भुगतान किया" required />
              <div className="relative">
                <input
                  defaultValue="मकान मालिक"
                  className="w-full h-11 rounded-lg border bg-white pl-3 pr-10 text-[13px] font-semibold outline-none focus:border-green-600"
                  style={{ borderColor: '#d1d5db', color: C.text }}
                />
                <UserPlus size={18} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.green }} />
              </div>
            </Section>
          </div>

          {/* 6. Source of fund */}
          <Section>
            <SectionLabel n="6." text="भुगतान का माध्यम (Source of Fund)" required info />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.15fr] gap-3 items-stretch">
              <SourceOption icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
              <SourceOption icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              <div
                className="rounded-lg border px-3 py-2.5"
                style={{ background: '#eef7f0', borderColor: '#bfe0c8' }}
              >
                <p className="text-[12px] font-bold mb-1" style={{ color: C.green }}>यह चयन क्यों महत्वपूर्ण है?</p>
                <ul className="text-[11.5px] list-disc pl-4 space-y-0.5" style={{ color: C.text }}>
                  <li>नकद चुनने पर Cash Book अपडेट होगा।</li>
                  <li>बैंक चुनने पर Bank Book अपडेट होगा।</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* 7. Amount */}
          <Section>
            <SectionLabel n="7." text="कुल राशि (₹)" required />
            <div
              className="flex items-center h-11 rounded-lg px-3"
              style={{ background: '#e9f5ec', border: '1px solid #e1efe5' }}
            >
              <span className="text-[18px] font-semibold mr-4" style={{ color: C.green }}>₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amountDisplay}
                onFocus={() => setEditingAmount(true)}
                onBlur={() => setEditingAmount(false)}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="flex-1 bg-transparent outline-none text-[14px] font-semibold"
                style={{ color: C.text }}
              />
            </div>
            <Hint>{numberToWordsINR(Number(amount) || 0)}</Hint>
          </Section>

          {/* 8 + 9 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-3">
            <Section>
              <SectionLabel n="8." text="बिल/रसीद अपलोड करें (वैकल्पिक)" />
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
              <SectionLabel n="9." text="नोट (वैकल्पिक)" />
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
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.35fr_1.7fr] gap-3 pt-1">
            <button
              type="button"
              className="h-11 rounded-lg border bg-white text-[13px] font-semibold"
              style={{ borderColor: '#d1d5db', color: C.label }}
            >
              रद्द करें
            </button>
            <button
              type="button"
              className="h-11 rounded-lg border bg-white text-[13px] font-semibold inline-flex items-center justify-center gap-2"
              style={{ borderColor: '#d1d5db', color: C.label }}
            >
              <FileText size={17} /> Draft के रूप में सुरक्षित करें
            </button>
            <button
              type="button"
              onClick={() => pushToast('खर्च सफलतापूर्वक सेव हो गया')}
              className="h-11 rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2"
              style={{ background: C.green }}
            >
              <Save size={17} /> खर्च सेव करें
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT: rules ---------------- */}
        <div className="space-y-3">
          <h3 className="text-[16px] font-bold mb-3 mt-1" style={{ color: C.green }}>
            खर्च के प्रकार और उनके नियम
          </h3>
          {RULES.map((r) => <RuleCard key={r.n} {...r} />)}

          <div
            className="rounded-xl p-4"
            style={{ background: '#fffbeb', border: '1px solid #fde9b0' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={17} style={{ color: '#d97706' }} />
              <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>ध्यान दें</p>
            </div>
            <p className="text-[12.5px] font-medium leading-relaxed" style={{ color: C.text }}>
              Owner Fund Addition (मालिक द्वारा पैसा लगाना) Receipt (SCR-009) में दर्ज किया जाएगा
              <br />
              क्योंकि यह पैसा व्यवसाय में आता है, न कि जाता है।
            </p>
          </div>
        </div>
      </div>
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

function HeaderBtn({ icon: Icon, iconColor, children }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 h-11 text-[12.5px] font-semibold"
      style={{ borderColor: '#d1d5db', color: C.label }}
    >
      <Icon size={20} style={{ color: iconColor }} />
      {children}
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
        {effects.map((ef, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[12.5px]" style={{ color: C.text }}>
            <ArrowRight size={14} className="mt-[3px] shrink-0" style={{ color: theme.arrow }} />
            <span>
              {ef.pre}
              {ef.link && <span style={{ color: theme.link, fontWeight: 600 }}>{ef.link}</span>}
              {ef.post}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}