import React, { useMemo, useRef, useState } from 'react'
import {
  Send, Printer, FileText, Save, Paperclip, Settings, Calendar, User, Search,
  ChevronDown, Trash2, Plus,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'

/* ------------------------------------------------------------------ */
/* constants & helpers (shared with PurchaseBill.jsx)                  */
/* ------------------------------------------------------------------ */
const SCREEN_CODE = 'SCR-006' // TODO: set the real screen code for this page

const STEPS = [
  { label: 'रिटर्न जानकारी', target: 'sec-return' },
  { label: 'आइटम विवरण', target: 'sec-items' },
  { label: 'सारांश & सेव', target: 'sec-summary' },
]

const UNITS = ['BAG', 'KG', 'PCS', 'LTR', 'MTR', 'TON', 'BOX', 'NOS']

// TODO: replace with an API lookup of the original purchase bill
const ORIGINAL_BILLS = {
  'PB-2025-0015': { date: '2025-05-17', supplier: 'Shree Ganesh Traders', amount: 15340, state: 'Bihar (10)' },
}
const HOME_STATE = 'Bihar (10)'

const fmt = (n) =>
  (Number.isFinite(n) ? n : 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100
const num = (v) => {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}
const displayDate = (iso) => {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

const HI = [
  'शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह',
  'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस', 'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस',
  'सत्ताईस', 'अट्ठाईस', 'उनतीस', 'तीस', 'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस',
  'अड़तीस', 'उनतालीस', 'चालीस', 'इकतालीस', 'बयालीस', 'तैंतालीस', 'चौवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस',
  'अड़तालीस', 'उनचास', 'पचास', 'इक्यावन', 'बावन', 'तिरपन', 'चौवन', 'पचपन', 'छप्पन', 'सत्तावन', 'अट्ठावन',
  'उनसठ', 'साठ', 'इकसठ', 'बासठ', 'तिरसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
  'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उन्यासी', 'अस्सी',
  'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सत्तासी', 'अट्ठासी', 'नवासी', 'नब्बे', 'इक्यानवे',
  'बानवे', 'तिरानवे', 'चौरानवे', 'पचानवे', 'छियानवे', 'सत्तानवे', 'अट्ठानवे', 'निन्यानवे',
]

function rupeesInHindi(total) {
  let rupees = Math.floor(total + 1e-9)
  const paise = Math.round((total - rupees) * 100)
  if (rupees === 0 && paise === 0) return 'रुपये शून्य मात्र'
  const parts = []
  const crore = Math.floor(rupees / 1e7); rupees %= 1e7
  const lakh = Math.floor(rupees / 1e5); rupees %= 1e5
  const thousand = Math.floor(rupees / 1e3); rupees %= 1e3
  const hundred = Math.floor(rupees / 100); rupees %= 100
  if (crore) parts.push(`${HI[crore]} करोड़`)
  if (lakh) parts.push(`${HI[lakh]} लाख`)
  if (thousand) parts.push(`${HI[thousand]} हजार`)
  if (hundred) parts.push(`${HI[hundred]} सौ`)
  if (rupees) parts.push(HI[rupees])
  let text = `रुपये ${parts.join(' ') || 'शून्य'}`
  if (paise) text += ` और ${HI[paise]} पैसे`
  return `${text} मात्र`
}

/* ------------------------------------------------------------------ */
/* small presentational pieces (styled explicitly, same as SCR-005)    */
/* ------------------------------------------------------------------ */
const CONTROL =
  'w-full h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 ' +
  'focus:outline-none focus:border-brandGreen-500 focus:ring-1 focus:ring-brandGreen-500'

const Panel = ({ id, className = '', children }) => (
  <section id={id} className={`bg-white rounded-xl border border-slate-200 shadow-[0_1px_2px_rgba(15,23,42,.04)] p-4 flex flex-col ${className}`}>
    {children}
  </section>
)

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-[13px] font-bold text-navy-800 mb-3 ${className}`}>{children}</h3>
)

const Field = ({ label, required, className = '', children }) => (
  <label className={`block ${className}`}>
    <span className="block text-[11px] font-semibold text-navy-800 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </span>
    {children}
  </label>
)

const TextBox = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative">
    <input {...props} className={`${CONTROL} ${Icon ? 'pr-8' : ''} ${className}`} />
    {Icon && <Icon size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />}
  </div>
)

const DateBox = (props) => (
  <div className="relative">
    <input
      type="date"
      {...props}
      className={`${CONTROL} pr-8 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
    />
    <Calendar size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
  </div>
)

const SelectBox = ({ children, className = '', ...props }) => (
  <div className="relative">
    <select {...props} className={`${CONTROL} appearance-none pr-8 ${className}`}>{children}</select>
    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
  </div>
)

const SummaryRow = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-3 text-[11px]">
    <span className="text-navy-800 font-normal">{label} :</span>
    <span className="text-slate-900 text-right font-medium">{value}</span>
  </div>
)

const cellInput =
  'w-full bg-transparent text-center text-[11px] text-slate-700 outline-none rounded focus:bg-slate-50 py-1.5'

const th = 'border border-slate-200 font-medium text-slate-600 text-center leading-tight'
const sub = 'block font-normal text-[10px] text-slate-500'
const td = 'border border-slate-200'

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */
export default function PurchaseBillReturn() {
  const { pushToast } = useApp()
  const nextId = useRef(3)
  const [step, setStep] = useState(1)

  // 1. original bill reference
  const [origNo, setOrigNo] = useState('PB-2025-0015')
  const [origDate, setOrigDate] = useState('2025-05-17')
  const [supplier, setSupplier] = useState('Shree Ganesh Traders')
  const [origAmount, setOrigAmount] = useState(15340)
  const [origState, setOrigState] = useState(HOME_STATE)

  // 2. return info
  const [debitNo, setDebitNo] = useState('PRN-005A-0001')
  const [returnDate, setReturnDate] = useState('2025-05-20')
  const [reason, setReason] = useState('गुणवत्ता सही नहीं थी ।')

  // 3. items
  const [items, setItems] = useState([
    { id: 1, name: 'सीमेंट 50kg', hsn: '2523', qty: '2.00', unit: 'BAG', rate: '350.00', disc: '0.00' },
    { id: 2, name: 'सरिया 10mm', hsn: '7214', qty: '1.00', unit: 'KG', rate: '60.00', disc: '0.00' },
  ])

  // 4. GST
  const [gstRate, setGstRate] = useState('18')

  // 5 & 6
  const [fileName, setFileName] = useState('')
  const [remarks, setRemarks] = useState('')

  /* ---------- calculations ---------- */
  const calc = useMemo(() => {
    const rate = num(gstRate)
    const intra = origState === HOME_STATE
    const rows = items.map((it) => {
      const disc = Math.min(Math.max(num(it.disc), 0), 100)
      const taxable = round2(num(it.qty) * num(it.rate) * (1 - disc / 100))
      const cgst = intra ? round2((taxable * rate) / 200) : 0
      const sgst = intra ? round2((taxable * rate) / 200) : 0
      const igst = intra ? 0 : round2((taxable * rate) / 100)
      return { ...it, taxable, cgst, sgst, igst, cess: 0 }
    })
    const sum = (k) => round2(rows.reduce((s, r) => s + r[k], 0))
    const taxable = sum('taxable')
    const cgst = sum('cgst')
    const sgst = sum('sgst')
    const igst = sum('igst')
    const cess = sum('cess')
    const totalTax = round2(cgst + sgst + igst + cess)
    const total = round2(taxable + totalTax)
    return { rows, taxable, cgst, sgst, igst, cess, totalTax, total }
  }, [items, gstRate, origState])

  const updateItem = (id, key, value) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [key]: value } : it)))
  const addItem = () =>
    setItems((list) => [...list, { id: nextId.current++, name: '', hsn: '', qty: '', unit: 'PCS', rate: '', disc: '0.00' }])
  const removeItem = (id) => setItems((list) => list.filter((it) => it.id !== id))

  const lookupBill = () => {
    const bill = ORIGINAL_BILLS[origNo.trim().toUpperCase()]
    if (!bill) {
      pushToast('मूल बिल नहीं मिला')
      return
    }
    setOrigDate(bill.date)
    setSupplier(bill.supplier)
    setOrigAmount(bill.amount)
    setOrigState(bill.state)
  }

  const goToStep = (i) => {
    setStep(i + 1)
    document.getElementById(STEPS[i].target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const saveReturn = () => {
    if (!origNo.trim() || !supplier.trim()) return pushToast('मूल बिल की जानकारी भरें')
    if (!debitNo.trim()) return pushToast('डेबिट नोट नंबर भरें')
    if (!calc.rows.length || calc.taxable <= 0) return pushToast('कम से कम एक रिटर्न आइटम जोड़ें')
    pushToast('खरीद रिटर्न सफलतापूर्वक सेव हो गया')
  }

  return (
    <Layout title="Purchase Return" subtitle="खरीद बिल रिटर्न">
      <PageHeader
        code={SCREEN_CODE}
        title="खरीद बिल रिटर्न (Purchase Bill Return)"
        subtitle="Purchase Return + Debit Note + GST (HSN & Rate)"
        actions={
          <>
            <Button variant="outline" icon={Send} size="md">PDF / शेयर करें</Button>
            <Button variant="outline" icon={Printer} size="md">प्रिंट करें</Button>
            <Button variant="outline" icon={FileText} size="md">ड्राफ्ट सेव करें</Button>
            <Button variant="primary" icon={Save} size="md" onClick={saveReturn}>सेव करें</Button>
          </>
        }
      />

      {/* ---------------- stepper ---------------- */}
      <div className="flex items-center gap-3 overflow-x-auto scroll-x mb-4 pb-1">
        {STEPS.map((s, i) => {
          const active = step === i + 1
          return (
            <React.Fragment key={s.label}>
              <button
                type="button"
                onClick={() => goToStep(i)}
                className="shrink-0 flex items-center gap-2 focus-ring rounded-full"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                    active ? 'bg-brandGreen-700 border-brandGreen-700 text-white' : 'bg-white border-slate-300 text-navy-800'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`text-xs font-semibold whitespace-nowrap ${active ? 'text-brandGreen-700' : 'text-navy-800'}`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && <span className="flex-1 min-w-[1.5rem] h-px bg-slate-300 mx-1" />}
            </React.Fragment>
          )
        })}
      </div>

      <div className="space-y-4 min-w-0">
        {/* --- row 1: original bill | return info | summary --- */}
        <div
          id="sec-return"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1.7fr)_minmax(15rem,1fr)] gap-4 items-stretch"
        >
          <Panel className="h-full">
            <CardTitle>1. मूल बिल जानकारी (Original Bill Reference)</CardTitle>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              <Field label="बिल नंबर" required>
                <div className="relative">
                  <input
                    value={origNo}
                    onChange={(e) => setOrigNo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && lookupBill()}
                    className={`${CONTROL} pr-8`}
                  />
                  <button
                    type="button"
                    onClick={lookupBill}
                    aria-label="मूल बिल खोजें"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 hover:text-brandGreen-700 focus-ring rounded"
                  >
                    <Search size={14} />
                  </button>
                </div>
              </Field>
              <Field label="बिल दिनांक">
                <DateBox value={origDate} onChange={(e) => setOrigDate(e.target.value)} />
              </Field>
              <Field label="सप्लायर का नाम" required>
                <TextBox icon={User} value={supplier} onChange={(e) => setSupplier(e.target.value)} />
              </Field>
              <Field label="मूल बिल राशि (₹)">
                <input readOnly value={fmt(origAmount)} className={CONTROL} />
              </Field>
            </div>
          </Panel>

          <Panel className="h-full">
            <CardTitle>2. रिटर्न जानकारी</CardTitle>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 flex-1">
              <Field label="डेबिट नोट नंबर" required>
                <TextBox icon={Settings} value={debitNo} onChange={(e) => setDebitNo(e.target.value)} />
              </Field>
              <Field label="रिटर्न दिनांक" required>
                <DateBox value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </Field>
              <Field label="अन्य कारण" className="col-span-2">
                <div className="relative">
                  <textarea
                    value={reason}
                    maxLength={250}
                    onChange={(e) => setReason(e.target.value)}
                    className={`${CONTROL} h-[5.25rem] py-2 resize-none`}
                  />
                  <span className="absolute right-2.5 bottom-1.5 text-[10px] text-slate-500">{reason.length}/250</span>
                </div>
              </Field>
            </div>
          </Panel>

          <Panel className="h-full md:col-span-2 xl:col-span-1">
            <CardTitle className="!text-sm">रिटर्न सारांश</CardTitle>
            <div className="space-y-2.5">
              <SummaryRow label="मूल बिल राशि (₹)" value={fmt(origAmount)} />
              <SummaryRow label="कुल रिटर्न टैक्सेबल (₹)" value={fmt(calc.taxable)} />
              <SummaryRow label="कुल टैक्स (₹)" value={fmt(calc.totalTax)} />
              <SummaryRow label="कुल रिटर्न राशि (₹)" value={fmt(calc.total)} />
            </div>
          </Panel>
        </div>

        {/* --- row 2: items --- */}
        <Panel id="sec-items">
          <CardTitle>3. आइटम विवरण (रिटर्न के लिए आइटम)</CardTitle>

          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 h-8">
                    <th rowSpan={2} className={`${th} w-8`}>#</th>
                    <th rowSpan={2} className={`${th} px-2`}>प्रोडक्ट नाम</th>
                    <th rowSpan={2} className={`${th} w-20`}>HSN कोड</th>
                    <th rowSpan={2} className={`${th} w-20`}>Qty<span className={sub}>(रिटर्न)</span></th>
                    <th rowSpan={2} className={`${th} w-[4.5rem]`}>Unit</th>
                    <th rowSpan={2} className={`${th} w-20`}>Rate (₹)</th>
                    <th rowSpan={2} className={`${th} w-20`}>Discount (%)</th>
                    <th rowSpan={2} className={`${th} w-20`}>Taxable<br />Value (₹)</th>
                    <th colSpan={4} className={th}>टैक्स (₹)</th>
                    <th rowSpan={2} className={`${th} w-14`}>एक्शन</th>
                  </tr>
                  <tr className="bg-slate-50 h-9">
                    <th className={`${th} w-20`}>CGST (₹)</th>
                    <th className={`${th} w-20`}>SGST (₹)</th>
                    <th className={`${th} w-20`}>IGST (₹)</th>
                    <th className={`${th} w-24`}>Cess (₹)<span className={sub}>(यदि लागू हो)</span></th>
                  </tr>
                </thead>
                <tbody>
                  {calc.rows.map((r, i) => (
                    <tr key={r.id} className="text-center text-slate-700 h-12">
                      <td className={td}>{i + 1}</td>
                      <td className={`${td} px-1`}>
                        <input className={`${cellInput} text-left px-1`} value={r.name} placeholder="प्रोडक्ट नाम" onChange={(e) => updateItem(r.id, 'name', e.target.value)} />
                      </td>
                      <td className={`${td} px-1`}>
                        <input className={cellInput} value={r.hsn} onChange={(e) => updateItem(r.id, 'hsn', e.target.value)} />
                      </td>
                      <td className={`${td} px-1`}>
                        <input className={cellInput} value={r.qty} inputMode="decimal" onChange={(e) => updateItem(r.id, 'qty', e.target.value)} />
                      </td>
                      <td className={`${td} px-1.5`}>
                        <div className="relative">
                          <select
                            value={r.unit}
                            onChange={(e) => updateItem(r.id, 'unit', e.target.value)}
                            className="w-full appearance-none h-6 rounded border border-slate-200 bg-white pl-2 pr-5 text-[10px] font-semibold text-slate-700 outline-none"
                          >
                            {UNITS.map((u) => <option key={u}>{u}</option>)}
                          </select>
                          <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                        </div>
                      </td>
                      <td className={`${td} px-1`}>
                        <input className={cellInput} value={r.rate} inputMode="decimal" onChange={(e) => updateItem(r.id, 'rate', e.target.value)} />
                      </td>
                      <td className={`${td} px-1`}>
                        <input className={cellInput} value={r.disc} inputMode="decimal" onChange={(e) => updateItem(r.id, 'disc', e.target.value)} />
                      </td>
                      <td className={td}>{fmt(r.taxable)}</td>
                      <td className={td}>{fmt(r.cgst)}</td>
                      <td className={td}>{fmt(r.sgst)}</td>
                      <td className={td}>{fmt(r.igst)}</td>
                      <td className={td}>{fmt(r.cess)}</td>
                      <td className={td}>
                        <button
                          type="button"
                          onClick={() => removeItem(r.id)}
                          aria-label="आइटम हटाएँ"
                          className="text-red-500 hover:text-red-600 p-1 focus-ring rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!calc.rows.length && (
                    <tr>
                      <td colSpan={13} className="py-6 text-center text-[11px] text-slate-500">
                        कोई आइटम नहीं है — “आइटम जोड़ें” दबाएँ।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-md border border-slate-300 bg-white text-navy-800 text-[11px] font-semibold hover:bg-slate-50 focus-ring"
            >
              <Plus size={13} /> आइटम जोड़ें
            </button>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-1 text-[11px] font-semibold text-navy-800">
              <span>कुल आइटम: {items.length}</span>
              <span>कुल रिटर्न टैक्सेबल (₹) : {fmt(calc.taxable)}</span>
            </div>
          </div>
        </Panel>

        {/* --- row 3: GST --- */}
        <Panel id="sec-gst">
          <CardTitle>4. टैक्स विवरण (रिटर्न के लिए)</CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,.95fr)_minmax(0,.92fr)_minmax(0,1.7fr)] gap-x-4 gap-y-4 items-center">
            <Field label="GST दर (%)" required>
              <SelectBox value={gstRate} onChange={(e) => setGstRate(e.target.value)}>
                {['0', '5', '12', '18', '28'].map((r) => <option key={r} value={r}>{r}%</option>)}
              </SelectBox>
            </Field>
            <Field label="रिटर्न टैक्सेबल (₹)">
              <input readOnly value={fmt(calc.taxable)} className={`${CONTROL} !bg-slate-100 text-slate-700`} />
            </Field>
            <Field label="CGST (₹)"><input readOnly value={fmt(calc.cgst)} className={CONTROL} /></Field>
            <Field label="SGST (₹)"><input readOnly value={fmt(calc.sgst)} className={CONTROL} /></Field>
            <Field label="IGST (₹)"><input readOnly value={fmt(calc.igst)} className={CONTROL} /></Field>
            <Field label="Cess (₹)"><input readOnly value={fmt(calc.cess)} className={CONTROL} /></Field>

            <div className="col-span-2 md:col-span-4 xl:col-span-1 rounded-lg border border-[#cfe6d4] bg-[#eef6ef] px-3 py-3 text-center">
              <p className="text-[11px] font-semibold text-navy-800">कुल रिटर्न राशि (₹)</p>
              <p className="text-xl font-bold text-brandGreen-700 mt-1 leading-tight">{fmt(calc.total)}</p>
              <p className="text-[10px] font-semibold text-navy-800 mt-1">({rupeesInHindi(calc.total)})</p>
            </div>
          </div>
        </Panel>

        {/* --- row 4: attachment | remarks --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <Panel id="sec-other" className="h-full">
            <CardTitle>5. अटैचमेंट (कोई दस्तावेज़, फोटो)</CardTitle>
            <label className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-brandGreen-600 min-h-[8.5rem] px-3 py-5 text-center cursor-pointer hover:bg-brandGreen-50/40 transition-colors">
              <Paperclip size={18} className="text-navy-700" />
              <span className="text-xs font-bold text-navy-800">{fileName || 'दस्तावेज़ जोड़ें'}</span>
              <span className="text-[11px] font-semibold text-navy-800">(फोटो / PDF / Document)</span>
              <span className="text-[10px] font-semibold text-navy-800">अधिकतम साइज़: 10 MB</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
              />
            </label>
          </Panel>

          <Panel className="h-full">
            <CardTitle>6. टिप्पणी (Remarks)</CardTitle>
            <div className="relative flex-1 flex">
              <textarea
                value={remarks}
                maxLength={250}
                placeholder="आपकी टिप्पणी लिखें ।"
                onChange={(e) => setRemarks(e.target.value)}
                className={`${CONTROL} h-auto min-h-[8.5rem] flex-1 py-2 resize-none`}
              />
              <span className="absolute right-2.5 bottom-1.5 text-[10px] text-slate-500">{remarks.length}/250</span>
            </div>
          </Panel>
        </div>

        {/* --- row 5: actions --- */}
        <div id="sec-summary" className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            className="sm:flex-1 h-10 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-semibold text-navy-800 hover:bg-slate-50 focus-ring"
          >
            रद्द करें
          </button>
          <button
            type="button"
            onClick={() => pushToast('ड्राफ्ट सेव हो गया')}
            className="sm:flex-[1.4] h-10 inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-xs font-semibold text-navy-800 hover:bg-slate-50 focus-ring"
          >
            <FileText size={15} /> ड्राफ्ट के रूप में सेव करें
          </button>
          <button
            type="button"
            onClick={saveReturn}
            className="sm:flex-[1.6] h-10 inline-flex items-center justify-center gap-2 rounded-md bg-brandGreen-700 text-white text-xs font-semibold hover:bg-brandGreen-600 focus-ring"
          >
            <Save size={15} /> सेव करें
          </button>
        </div>
      </div>
    </Layout>
  )
}