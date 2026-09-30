import React, { useMemo, useRef, useState } from 'react'
import {
  Send, Printer, FileText, Save, Paperclip, Settings, Calendar, User, Phone,
  ChevronDown, Trash2, Plus, Info,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'

/* ------------------------------------------------------------------ */
/* constants & helpers                                                 */
/* ------------------------------------------------------------------ */
const STEPS = [
  { label: 'बिल जानकारी', target: 'sec-bill' },
  { label: 'सप्लायर जानकारी', target: 'sec-supplier' },
  { label: 'आइटम विवरण', target: 'sec-items' },
  { label: 'GST जानकारी', target: 'sec-gst' },
  { label: 'अन्य जानकारी', target: 'sec-other' },
  { label: 'सारांश & सेव', target: 'sec-summary' },
]

const UNITS = ['BAG', 'KG', 'PCS', 'LTR', 'MTR', 'TON', 'BOX', 'NOS']

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
/* small presentational pieces (styled explicitly to match SCR-005)    */
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

const TaxRow = ({ label, value }) => (
  <div className="grid grid-cols-[4.5rem_1fr_auto] items-baseline text-[11px]">
    <span className="font-medium text-navy-800">{label}</span>
    <span className="text-navy-800">:</span>
    <span className="font-medium text-slate-900">{value}</span>
  </div>
)

const cellInput =
  'w-full bg-transparent text-center text-[11px] text-slate-700 outline-none rounded focus:bg-slate-50 py-1.5'

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */
export default function PurchaseBill() {
  const { pushToast } = useApp()
  const nextId = useRef(4)
  const [step, setStep] = useState(1)

  // 1. bill info
  const [billNo, setBillNo] = useState('PB-2025-0015')
  const [billDate, setBillDate] = useState('2025-05-17')
  const [billType, setBillType] = useState('Tax Invoice')
  const [purchaseType, setPurchaseType] = useState('Taxable Purchase')
  const [retail, setRetail] = useState(false)

  // 2. supplier
  const [supplier, setSupplier] = useState('Shree Ganesh Traders')
  const [mobile, setMobile] = useState('9876543210')
  const [gstin, setGstin] = useState('10ABCDE1234F1Z5')
  const [state, setState] = useState('Bihar (10)')

  // 3. items
  const [items, setItems] = useState([
    { id: 1, name: 'सीमेंट 50kg', hsn: '2523', qty: '10.00', unit: 'BAG', rate: '350.00' },
    { id: 2, name: 'सरिया 10mm', hsn: '7214', qty: '100.00', unit: 'KG', rate: '60.00' },
    { id: 3, name: 'ईंट (Bricks)', hsn: '6904', qty: '500.00', unit: 'PCS', rate: '7.00' },
  ])

  // 4. GST
  const [gstRate, setGstRate] = useState('18')

  // 5. other
  const [transport, setTransport] = useState('Shiv Transport')
  const [eway, setEway] = useState('4712 9876 1234')
  const [vehicle, setVehicle] = useState('BR01AB1234')
  const [payMethod, setPayMethod] = useState('Bank Transfer')
  const [payTerm, setPayTerm] = useState('7 दिन के भीतर')
  const [remark, setRemark] = useState('सामान सही प्राप्त हुआ।')

  // 6. attachment
  const [fileName, setFileName] = useState('')

  /* ---------- calculations ---------- */
  const calc = useMemo(() => {
    const rows = items.map((it) => ({ ...it, taxable: round2(num(it.qty) * num(it.rate)) }))
    const taxable = round2(rows.reduce((s, r) => s + r.taxable, 0))
    const rate = num(gstRate)
    const intraState = state === 'Bihar (10)'
    const cgst = intraState ? round2((taxable * rate) / 200) : 0
    const sgst = intraState ? round2((taxable * rate) / 200) : 0
    const igst = intraState ? 0 : round2((taxable * rate) / 100)
    const cess = 0
    const totalTax = round2(cgst + sgst + igst + cess)
    const total = round2(taxable + totalTax)
    return { rows, taxable, cgst, sgst, igst, cess, totalTax, total }
  }, [items, gstRate, state])

  const updateItem = (id, key, value) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, [key]: value } : it)))
  const addItem = () =>
    setItems((list) => [...list, { id: nextId.current++, name: '', hsn: '', qty: '', unit: 'PCS', rate: '' }])
  const removeItem = (id) => setItems((list) => list.filter((it) => it.id !== id))

  const goToStep = (i) => {
    setStep(i + 1)
    document.getElementById(STEPS[i].target)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const saveBill = () => pushToast('खरीद बिल सफलतापूर्वक सेव हो गया')

  return (
    <Layout title="Purchase Bill" subtitle="नया खरीद बिल">
      <PageHeader
        code="SCR-005"
        title="नया खरीद बिल (Purchase Bill)"
        subtitle="New Purchase Bill + GST (HSN & Rate) + Other Information"
        actions={
          <>
            <Button variant="outline" icon={Send} size="md">PDF / शेयर करें</Button>
            <Button variant="outline" icon={Printer} size="md">प्रिंट करें</Button>
            <Button variant="outline" icon={FileText} size="md">ड्राफ्ट सेव करें</Button>
            <Button variant="primary" icon={Save} size="md" onClick={saveBill}>बिल सेव करें</Button>
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
                <span className={`text-xs font-semibold whitespace-nowrap ${active ? 'text-brandGreen-700' : 'text-navy-800'}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span className="flex-1 min-w-[1.5rem] h-px bg-slate-300 mx-1" />}
            </React.Fragment>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_clamp(17.5rem,20%,21rem)] gap-4 items-start">
        {/* ============ LEFT / MAIN COLUMN ============ */}
        <div className="space-y-4 min-w-0">
          {/* --- row 1: bill info | supplier | items --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[minmax(21rem,1.9fr)_minmax(14.5rem,1fr)_minmax(0,2.45fr)] gap-4 items-stretch">
            <Panel id="sec-bill" className="h-full">
              <CardTitle>1. बिल जानकारी</CardTitle>
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <Field label="खरीद बिल नंबर" required>
                  <TextBox icon={Settings} value={billNo} onChange={(e) => setBillNo(e.target.value)} />
                </Field>
                <Field label="बिल दिनांक" required>
                  <DateBox value={billDate} onChange={(e) => setBillDate(e.target.value)} />
                </Field>
                <Field label="बिल प्रकार" required>
                  <SelectBox value={billType} onChange={(e) => setBillType(e.target.value)}>
                    <option>Tax Invoice</option>
                    <option>Retail</option>
                  </SelectBox>
                </Field>
                <Field label="खरीद का प्रकार">
                  <SelectBox value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)}>
                    <option>Taxable Purchase</option>
                    <option>Exempt Purchase</option>
                  </SelectBox>
                </Field>
              </div>
              <label className="mt-3 inline-flex items-center gap-2 text-[11px] font-medium text-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={retail}
                  onChange={(e) => setRetail(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 accent-[#15803d]"
                />
                रिटेल पर्चेज़ (B2C)
              </label>
            </Panel>

            <Panel id="sec-supplier" className="h-full">
              <CardTitle className="whitespace-nowrap">2. सप्लायर जानकारी</CardTitle>
              <div className="space-y-3">
                <Field label="सप्लायर का नाम" required>
                  <TextBox icon={User} value={supplier} onChange={(e) => setSupplier(e.target.value)} />
                </Field>
                <Field label="मोबाइल नंबर">
                  <TextBox icon={Phone} value={mobile} onChange={(e) => setMobile(e.target.value)} inputMode="tel" />
                </Field>
                <Field label="GSTIN (यदि हो)">
                  <TextBox value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} maxLength={15} />
                </Field>
                <Field label="राज्य" required>
                  <SelectBox value={state} onChange={(e) => setState(e.target.value)}>
                    <option>Bihar (10)</option>
                  </SelectBox>
                </Field>
              </div>
            </Panel>

            <Panel id="sec-items" className="h-full min-w-0 md:col-span-2 2xl:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[13px] font-bold text-navy-800">3. आइटम विवरण</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md border border-brandGreen-600 text-brandGreen-700 text-[11px] font-semibold hover:bg-brandGreen-50 focus-ring"
                >
                  <Plus size={13} /> आइटम जोड़ें
                </button>
              </div>

              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[28rem] border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium text-center leading-tight h-16">
                        <th className="border border-slate-200 w-8">#</th>
                        <th className="border border-slate-200 px-2">प्रोडक्ट नाम</th>
                        <th className="border border-slate-200 w-[3.25rem]">HSN<br /><span className="font-normal text-[10px] text-slate-500">कोड</span></th>
                        <th className="border border-slate-200 w-14">Qty<br /><span className="font-normal text-[10px] text-slate-500">(मात्रा)</span></th>
                        <th className="border border-slate-200 w-[4.5rem]">Unit<br /><span className="font-normal text-[10px] text-slate-500">(इकाई)</span></th>
                        <th className="border border-slate-200 w-14">Rate (₹)</th>
                        <th className="border border-slate-200 w-[4.5rem]">Taxable<br />Value (₹)</th>
                        <th className="border border-slate-200 w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calc.rows.map((r, i) => (
                        <tr key={r.id} className="text-center text-slate-700 h-12">
                          <td className="border border-slate-200">{i + 1}</td>
                          <td className="border border-slate-200 px-1">
                            <input className={`${cellInput} text-left px-1`} value={r.name} placeholder="प्रोडक्ट नाम" onChange={(e) => updateItem(r.id, 'name', e.target.value)} />
                          </td>
                          <td className="border border-slate-200 px-1">
                            <input className={cellInput} value={r.hsn} onChange={(e) => updateItem(r.id, 'hsn', e.target.value)} />
                          </td>
                          <td className="border border-slate-200 px-1">
                            <input className={cellInput} value={r.qty} inputMode="decimal" onChange={(e) => updateItem(r.id, 'qty', e.target.value)} />
                          </td>
                          <td className="border border-slate-200 px-1.5">
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
                          <td className="border border-slate-200 px-1">
                            <input className={cellInput} value={r.rate} inputMode="decimal" onChange={(e) => updateItem(r.id, 'rate', e.target.value)} />
                          </td>
                          <td className="border border-slate-200">{fmt(r.taxable)}</td>
                          <td className="border border-slate-200">
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
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between gap-3 bg-slate-50 border-t border-slate-200 px-3 py-2.5 text-[11px] font-semibold text-navy-800">
                  <span>कुल आइटम: {items.length}</span>
                  <span>कुल टैक्सेबल वैल्यू (₹) : {fmt(calc.taxable)}</span>
                </div>
              </div>
            </Panel>
          </div>

          {/* --- row 2: GST --- */}
          <Panel id="sec-gst">
            <CardTitle>4. GST जानकारी</CardTitle>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,.9fr)_minmax(0,.9fr)_minmax(0,.85fr)] gap-x-8 gap-y-4">
              <Field label="GST दर (%)" required>
                <SelectBox value={gstRate} onChange={(e) => setGstRate(e.target.value)}>
                  {['0', '5', '12', '18', '28'].map((r) => <option key={r} value={r}>{r}%</option>)}
                </SelectBox>
              </Field>
              <Field label="टैक्सेबल वैल्यू (₹)">
                <input readOnly value={fmt(calc.taxable)} className={`${CONTROL} !bg-slate-100 text-slate-700`} />
              </Field>
              <Field label="CGST (₹)"><input readOnly value={fmt(calc.cgst)} className={CONTROL} /></Field>
              <Field label="SGST (₹)"><input readOnly value={fmt(calc.sgst)} className={CONTROL} /></Field>
              <Field label="IGST (₹)"><input readOnly value={fmt(calc.igst)} className={CONTROL} /></Field>
              <Field label="Cess (₹)"><input readOnly value={fmt(calc.cess)} className={CONTROL} /></Field>
            </div>

            <div className="mt-5 rounded-lg border border-[#cfe6d4] bg-[#eef6ef] pl-8 pr-8 xl:pr-24 py-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-navy-800">कुल टैक्स (₹)</p>
                <p className="text-2xl font-bold text-brandGreen-700 mt-1 leading-tight">{fmt(calc.totalTax)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-navy-800">कुल बिल राशि (₹)</p>
                <p className="text-2xl font-bold text-brandGreen-700 mt-1 leading-tight">{fmt(calc.total)}</p>
                <p className="text-[10px] font-semibold text-navy-800 mt-0.5">({rupeesInHindi(calc.total)})</p>
              </div>
            </div>
          </Panel>

          {/* --- row 3: other info | attachment --- */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-4">
            <Panel id="sec-other">
              <CardTitle>5. अन्य जानकारी</CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
                <Field label="ट्रांसपोर्ट नाम (यदि हो)">
                  <TextBox value={transport} onChange={(e) => setTransport(e.target.value)} />
                </Field>
                <Field label="ई-वे बिल नंबर (यदि हो)">
                  <TextBox value={eway} onChange={(e) => setEway(e.target.value)} />
                </Field>
                <Field label="वाहन नंबर (यदि हो)">
                  <TextBox value={vehicle} onChange={(e) => setVehicle(e.target.value.toUpperCase())} />
                </Field>
                <Field label="भुगतान विधि" required>
                  <SelectBox value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                  </SelectBox>
                </Field>
                <Field label="भुगतान शर्त (यदि हो)">
                  <SelectBox value={payTerm} onChange={(e) => setPayTerm(e.target.value)}>
                    <option>7 दिन के भीतर</option>
                    <option>तुरंत</option>
                    <option>30 दिन के भीतर</option>
                  </SelectBox>
                </Field>
                <Field label="टिप्पणी (यदि हो)">
                  <div className="relative">
                    <textarea
                      value={remark}
                      maxLength={250}
                      onChange={(e) => setRemark(e.target.value)}
                      className={`${CONTROL} h-[4.5rem] py-2 resize-none`}
                    />
                    <span className="absolute right-2.5 bottom-1.5 text-[10px] text-slate-500">{remark.length}/250</span>
                  </div>
                </Field>
              </div>
            </Panel>

            <Panel>
              <CardTitle>6. अटैचमेंट (कोई दस्तावेज़, फोटो)</CardTitle>
              <label className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-brandGreen-600 min-h-[10.5rem] px-3 py-6 text-center cursor-pointer hover:bg-brandGreen-50/40 transition-colors">
                <Paperclip size={20} className="text-navy-700" />
                <span className="text-xs font-bold text-navy-800">{fileName || 'दस्तावेज़ जोड़ें'}</span>
                <span className="text-[11px] font-semibold text-navy-800">(फोटो / PDF / Document)</span>
                <span className="text-[11px] text-navy-800">अधिकतम साइज़: 10 MB</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
              </label>
            </Panel>
          </div>

          {/* --- row 4: actions --- */}
          <div id="sec-summary" className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => pushToast('ड्राफ्ट सेव हो गया')}
              className="sm:flex-[1.2] h-10 inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-xs font-semibold text-navy-800 hover:bg-slate-50 focus-ring"
            >
              <FileText size={15} /> ड्राफ्ट के रुप में सेव करें
            </button>
            <button
              type="button"
              className="sm:flex-1 h-10 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-semibold text-navy-800 hover:bg-slate-50 focus-ring"
            >
              रद्द करें
            </button>
            <button
              type="button"
              onClick={saveBill}
              className="sm:flex-[1.2] h-10 inline-flex items-center justify-center gap-2 rounded-md bg-brandGreen-700 text-white text-xs font-semibold hover:bg-brandGreen-600 focus-ring"
            >
              <Save size={15} /> बिल सेव करें
            </button>
          </div>
        </div>

        {/* ============ RIGHT COLUMN ============ */}
        <aside className="space-y-4">
          <Panel>
            <CardTitle className="!text-sm">बिल सारांश</CardTitle>
            <div className="space-y-2.5">
              <SummaryRow label="बिल नंबर" value={billNo || '—'} />
              <SummaryRow label="बिल दिनांक" value={displayDate(billDate)} />
              <SummaryRow label="सप्लायर का नाम" value={supplier || '—'} />
              <SummaryRow label="कुल आइटम" value={items.length} />
              <SummaryRow label="कुल टैक्सेबल वैल्यू" value={`₹ ${fmt(calc.taxable)}`} />
              <SummaryRow label="कुल टैक्स" value={`₹ ${fmt(calc.totalTax)}`} />
              <SummaryRow label="कुल बिल राशि" value={`₹ ${fmt(calc.total)}`} />
            </div>
          </Panel>

          <Panel>
            <CardTitle className="!text-sm">टैक्स ब्रेकअप</CardTitle>
            <div className="space-y-2.5">
              <TaxRow label="CGST (₹)" value={fmt(calc.cgst)} />
              <TaxRow label="SGST (₹)" value={fmt(calc.sgst)} />
              <TaxRow label="IGST (₹)" value={fmt(calc.igst)} />
              <TaxRow label="Cess (₹)" value={fmt(calc.cess)} />
            </div>
            <div className="mt-3 rounded-lg border border-[#cfe6d4] bg-[#eef6ef] px-3 py-3 flex items-center justify-between">
              <span className="text-[11px] font-bold text-navy-800">कुल टैक्स (₹) :</span>
              <span className="text-xl font-bold text-brandGreen-700">{fmt(calc.totalTax)}</span>
            </div>
          </Panel>

          <Panel className="!bg-slate-50/60">
            <h3 className="flex items-center gap-1.5 text-[11px] font-bold text-navy-800 mb-2">
              <Info size={14} className="text-navy-700" /> नोट:
            </h3>
            <ul className="text-[11px] text-slate-700 space-y-2 leading-relaxed list-disc pl-4">
              <li>यह बिल GSTR-3B (ITC) और GSTR-2B / GSTR-1 (HSN Summary) के लिए उपयोग होगा।</li>
              <li>सभी जानकारी सही भरें।</li>
              <li>बिल सेव करने के बाद स्टॉक अपने-आप अपडेट हो जाएगा।</li>
            </ul>
          </Panel>
        </aside>
      </div>
    </Layout>
  )
}