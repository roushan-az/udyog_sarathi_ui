import React, { useState } from 'react'
import {
  FileSpreadsheet, Printer, Plus, Paperclip, CalendarDays, UserPlus,
  Banknote, Landmark, Info, ChevronDown, Check, FileText, ArrowRight,
  Lightbulb, HandCoins, CreditCard,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

/* ---------- Design tokens (same as Expense.jsx / Receipt.jsx) ---------- */
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

const THEMES = {
  blue: { bg: '#f2f7ff', border: '#c7dbf7', num: '#3b6ef5', title: '#1d4ed8' },
  purple: { bg: '#f7f3ff', border: '#d9cdf5', num: '#7c3aed', title: '#6d28d9' },
  orange: { bg: '#fff6f0', border: '#f8d5c2', num: '#f97316', title: '#c2410c' },
  green: { bg: '#f0faf3', border: '#bfe0c8', num: '#15803d', title: '#15803d' },
}

const RULES = [
  { n: 1, title: 'Supplier Payment (आपूर्तिकर्ता को भुगतान)', color: 'blue', desc: 'व्यवसाय द्वारा सामान/सेवा के बदले में सप्लायर को भुगतान।', effects: ['संबंधित party का बकाया कम होगा।', 'Bank/Cash Ledger कम होगा।'] },
  { n: 2, title: 'Customer Refund (ग्राहक को वापसी)', color: 'purple', desc: 'ग्राहक को अधिक भुगतान या रिफंड देने पर।', effects: ['संबंधित customer का बकाया कम होगा।', 'Bank/Cash Ledger कम होगा।'] },
  { n: 3, title: 'Salary Payment (वेतन भुगतान)', color: 'orange', desc: 'कर्मचारियों के वेतन के भुगतान के लिए।', effects: ['P&L में Salary Expense घटेगा।', 'Bank/Cash Ledger कम होगा।'] },
  { n: 4, title: 'Other Payment (अन्य भुगतान)', color: 'green', desc: 'किराया, विद्युत बिल, फोन बिल, लोन EMI, टैक्स आदि के लिए।', effects: ['संबंधित Expense खाता घटेगा।', 'Bank/Cash Ledger कम होगा।'] },
]

const TYPES = [
  { label: 'Payment to Supplier (आपूर्तिकर्ता को भुगतान)' },
  { label: 'Customer Refund (ग्राहक को वापसी)' },
  { label: 'Salary Payment (वेतन भुगतान)' },
  { label: 'Other Payment (अन्य भुगतान)' },
]

export default function Payment() {
  const { pushToast } = useApp()
  const [source, setSource] = useState('bank')
  const [remarks, setRemarks] = useState('Invoice No. 145 के भुगतान हेतु')
  const [amount, setAmount] = useState(48250)
  const [editingAmount, setEditingAmount] = useState(false)

  const amountDisplay = editingAmount
    ? String(amount)
    : Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Layout title="Payment" subtitle="भुगतान दर्ज करें">
      {/* ---------------- Page header ---------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="mt-1 inline-flex items-center rounded-lg px-3.5 py-2 text-[13px] font-bold text-white leading-none" style={{ background: C.green }}>
            SCR-010
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight" style={{ color: C.text }}>भुगतान दर्ज करें (Payment Entry)</h1>
            <p className="text-[13px] font-medium mt-0.5" style={{ color: C.text }}>व्यवसाय द्वारा किसी को किए गए भुगतान की जानकारी भरें</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <HeaderBtn icon={FileSpreadsheet} iconColor="#16a34a">Excel में निर्यात करें</HeaderBtn>
          <HeaderBtn icon={Printer} iconColor="#2563eb">PDF प्रिंट करें</HeaderBtn>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg px-5 h-11 text-[13px] font-semibold text-white" style={{ background: C.green }}>
            <Plus size={18} /> नया भुगतान दर्ज करें
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-5">
        {/* ---------------- LEFT: form (outer card) ---------------- */}
        <div className="rounded-2xl bg-white p-3.5 space-y-2.5 self-start" style={{ border: `1px solid ${C.border}` }}>
          {/* 1 + 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.45fr_1fr] gap-2.5">
            <Section>
              <SectionLabel n="1." text="भुगतान का प्रकार चुनें" required info />
              <p className="text-[12px] font-semibold mb-2" style={{ color: C.text }}>भुगतान का प्रकार</p>
              <SelectBox icon={HandCoins} defaultValue={TYPES[0].label} options={TYPES} />
              <Hint>आप जिनको भुगतान कर रहे हैं, उनका चयन करें।</Hint>
            </Section>
            <Section>
              <SectionLabel n="2." text="भुगतान दिनांक" required />
              <div className="relative">
                <CalendarDays size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.label }} />
                <input type="date" defaultValue="2025-05-17"
                  className="w-full h-11 rounded-lg border bg-white pl-10 pr-3 text-[13px] font-semibold outline-none focus:border-green-600"
                  style={{ borderColor: C.field, color: C.label }} />
              </div>
            </Section>
          </div>

          {/* 3 + balance */}
          <div className="grid grid-cols-1 sm:grid-cols-[1.45fr_1fr] gap-2.5">
            <Section>
              <SectionLabel n="3." text="किसको भुगतान किया" required />
              <SelectBox icon={UserPlus} defaultValue="मनोज ट्रेडर्स (MT0008)" options={[{ label: 'मनोज ट्रेडर्स (MT0008)' }]} />
            </Section>
            <div>
              <div className="rounded-lg bg-white px-3.5 py-2.5" style={{ border: `1px solid ${C.field}` }}>
                <p className="text-[12.5px] font-semibold mb-1" style={{ color: C.text }}>कुल बकाया शेष</p>
                <p className="text-[16px] font-bold" style={{ color: C.red }}>₹ 48,250.00</p>
              </div>
              <p className="text-[11.5px] mt-1.5 px-1" style={{ color: C.muted }}>क्रेडिट अवधि समाप्ति: 25/05/2025</p>
            </div>
          </div>

          {/* 4 + 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Section>
              <SectionLabel n="4." text="किस बिल के लिए भुगतान" required />
              <SelectBox
                icon={FileText}
                defaultValue="Bill No. 145 - दिनांक 05/05/2025"
                options={[{ label: 'Bill No. 145 - दिनांक 05/05/2025', sub: 'कुल राशि: ₹ 48,250.00  |  बकाया: ₹ 48,250.00' }]}
              />
            </Section>
            <Section>
              <SectionLabel n="5." text="भुगतान का माध्यम (Source of Fund)" required info />
              <div className="grid grid-cols-2 gap-2.5">
                <SourceOption icon={Banknote} label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
                <SourceOption icon={Landmark} label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              </div>
            </Section>
          </div>

          {/* 6 + 7 */}
          {source === 'bank' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Section>
                <SectionLabel n="6." text="बैंक खाता" required />
                <SelectBox
                  icon={Landmark}
                  defaultValue="SBI Current A/c - 12345678901"
                  options={[{ label: 'SBI Current A/c - 12345678901', sub: 'उपलब्ध शेष: ₹ 1,25,780.00' }]}
                />
              </Section>
              <Section>
                <SectionLabel n="7." text="भुगतान का तरीका (Mode of Payment)" required />
                <SelectBox icon={CreditCard} defaultValue="NEFT" options={['NEFT', 'RTGS', 'UPI', 'चेक'].map((l) => ({ label: l }))} />
              </Section>
            </div>
          )}

          {/* 8 + 9 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Section>
              <SectionLabel n="8." text="भुगतान राशि (₹)" required />
              <div className="flex items-center h-11 rounded-lg px-3 bg-white" style={{ border: `1px solid ${C.field}` }}>
                <span className="text-[16px] font-semibold mr-3" style={{ color: C.text }}>₹</span>
                <input type="text" inputMode="decimal" value={amountDisplay}
                  onFocus={() => setEditingAmount(true)} onBlur={() => setEditingAmount(false)}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  className="w-full min-w-0 bg-transparent outline-none text-[13px] font-semibold" style={{ color: C.text }} />
              </div>
              <Hint>अंकों में: {numberToWordsINR(Number(amount) || 0)}</Hint>
            </Section>
            <Section>
              <SectionLabel n="9." text="संदर्भ संख्या (Reference No.)" />
              <input defaultValue="NEFT1234567890"
                className="w-full h-11 rounded-lg border bg-white px-3 text-[13px] font-semibold outline-none focus:border-green-600"
                style={{ borderColor: C.field, color: C.label }} />
            </Section>
          </div>

          {/* 10 */}
          <Section>
            <SectionLabel n="10." text="विवरण (Remarks)" />
            <div className="relative">
              <textarea rows={3} maxLength={150} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                className="w-full h-[72px] resize-none rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none focus:border-green-600"
                style={{ borderColor: C.field, color: C.muted }} />
              <span className="absolute right-3 bottom-1.5 text-[12px]" style={{ color: C.muted }}>{remarks.length}/150</span>
            </div>
          </Section>

          {/* 11 */}
          <Section>
            <SectionLabel n="11." text="बिल / रसीद अपलोड करें (वैकल्पिक)" />
            <label className="flex flex-col items-center justify-center gap-1 h-[60px] rounded-lg cursor-pointer text-center px-3"
              style={{ border: `1.5px dashed ${C.greenBorder}`, background: '#f7fbf8' }}>
              <span className="flex items-center gap-2 text-[12.5px] font-bold" style={{ color: C.green }}>
                <Paperclip size={17} /> फोटो / PDF अपलोड करें
              </span>
              <span className="text-[12px] font-bold" style={{ color: C.label }}>अधिकतम साइज़: 10 MB</span>
              <input type="file" className="hidden" />
            </label>
          </Section>

          {/* Actions */}
          <div className="grid grid-cols-[1fr_1.6fr] sm:grid-cols-[1fr_1.55fr_1.3fr] gap-3 pt-0.5">
            <button type="button" className="h-11 rounded-lg border bg-white text-[13px] font-semibold" style={{ borderColor: C.field, color: C.label }}>
              रद्द करें
            </button>
            <button type="button" className="hidden sm:inline-flex h-11 rounded-lg border bg-white text-[13px] font-semibold items-center justify-center gap-2" style={{ borderColor: C.field, color: C.label }}>
              <FileText size={17} /> Draft के रूप में सुरक्षित करें
            </button>
            <button type="button" onClick={() => pushToast('भुगतान सफलतापूर्वक सेव हो गया')}
              className="h-11 rounded-lg text-[13px] font-semibold text-white inline-flex items-center justify-center gap-2" style={{ background: C.green }}>
              <FileText size={17} /> भुगतान सेव करें
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT: rules ---------------- */}
        <div className="space-y-2.5">
          <h3 className="text-[16px] font-bold mb-3 mt-1" style={{ color: C.green }}>भुगतान के प्रकार और उनके नियम</h3>
          {RULES.map((r) => <RuleCard key={r.n} {...r} theme={THEMES[r.color]} />)}
          <div className="rounded-xl p-4" style={{ background: '#fffbeb', border: '1px solid #fde9b0' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb size={17} style={{ color: '#d97706' }} />
              <p className="text-[13px] font-semibold" style={{ color: '#92400e' }}>ध्यान दें</p>
            </div>
            <ul className="text-[12.5px] font-medium leading-relaxed space-y-0.5" style={{ color: C.text }}>
              <li>• यदि आप Cash चुनें हैं, तो Cash Balance से पैसा घटेगा।</li>
              <li>• यदि आप Bank चुनें हैं, तो चुने गए बैंक खाते का Balance घटेगा।</li>
              <li>• यह स्क्रीन पैसा "बाहर जाने" के लिए है।</li>
            </ul>
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

/* options: [{ label, sub? }] — shows label (+ optional second line) over a transparent native select */
function SelectBox({ icon: Icon, options, defaultValue }) {
  const [val, setVal] = useState(defaultValue ?? options[0].label)
  const cur = options.find((o) => o.label === val) || options[0]
  return (
    <div className="relative">
      <div
        className={`flex items-center rounded-lg border bg-white pl-12 pr-10 ${cur.sub ? 'h-[52px]' : 'h-11'}`}
        style={{ borderColor: C.field }}
      >
        <div className="min-w-0">
          <p className="text-[13px] font-semibold truncate" style={{ color: C.label }}>{cur.label}</p>
          {cur.sub && <p className="text-[11.5px] truncate" style={{ color: C.muted }}>{cur.sub}</p>}
        </div>
      </div>
      <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.green }} />
      <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
      <select
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label={cur.label}
      >
        {options.map((o) => <option key={o.label} value={o.label}>{o.label}</option>)}
      </select>
    </div>
  )
}

function SourceOption({ icon: Icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg px-3 h-[52px] text-[13px] font-semibold text-left"
      style={{
        border: `1px solid ${active ? C.greenBorder : C.field}`,
        background: active ? C.greenSoft : '#fff',
        color: active ? C.green : C.label,
      }}>
      <Icon size={21} />
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

function RuleCard({ n, title, theme, desc, effects }) {
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
  )
}