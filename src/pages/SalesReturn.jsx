import React, { useRef, useState } from 'react'
import {
  Share2, Printer, FileText, Save, Paperclip, Plus, Search, Settings, Phone, Info, Calendar,
  Trash2, FilePlus, FileDown, CheckCircle2, ArrowLeft, MoreVertical, User, ChevronDown,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import { Field, Input, Select, Textarea } from '../components/common/Form'
import Button from '../components/common/Button'
import LineItemsTable, { newLineItem } from '../components/common/LineItemsTable'
import { useApp } from '../context/AppContext'

const TABS = ['बिल जानकारी', 'ग्राहक जानकारी', 'उत्पाद विवरण', 'GST जानकारी', 'अन्य जानकारी', 'संलग्नक', 'रिटर्न / क्रेडिट नोट']

const gstSummary = [
  { label: 'Taxable Value (₹)', value: '1,720.00' },
  { label: 'Total CGST (₹)', value: '86.00' },
  { label: 'Total SGST (₹)', value: '86.00' },
  { label: 'Total IGST (₹)', value: '0.00' },
  { label: 'Total Cess (₹)', value: '0.00' },
]

const rules = [
  'सभी जानकारी सही और पूर्ण भरें।',
  'यह बिल GSTR-1 और GSTR-3B में आयोग्य होगा।',
  'HSN, GST Rate, Taxable Value सही भरें।',
  'रिटर्न / क्रेडिट नोट का उपयोग केवल आवश्यक होने पर करें।',
  'संलग्नक अधिकतम साइज़ 10 MB तक अपलोड करें।',
]

const dataUsage = [
  'Sales Bill का डेटा GSTR-1, GSTR-3B, Sales Register, Day Book, Outstanding आदि रिपोर्ट में उपयोग होगा।',
  'Taxable Value, Tax Amount और HSN Summary रिपोर्ट में शामिल होगा।',
  'रिटर्न / क्रेडिट नोट का डेटा GSTR-1 और GSTR-3B में समायोजित होगा।',
]

const summaryRows = [
  ['कुल आइटम :', '3'], ['कुल मात्रा :', '5.00'], ['कुल कर योग्य मूल्य :', '₹ 1,720.00'],
  ['कुल CGST :', '₹ 86.00'], ['कुल SGST :', '₹ 86.00'], ['कुल IGST :', '₹ 0.00'],
  ['कुल Cess :', '₹ 0.00'], ['कुल देय राशि :', '₹ 1,892.00'],
]

const card = 'bg-white rounded-xl border border-slate-200 shadow-sm p-3'
const h3 = 'font-bold text-slate-800 text-sm mb-2'
const hint = 'text-[10px] text-slate-500 mt-1'

/* small input with an icon on the right, as in the prototype */
function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Input {...props} />
      <Icon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  )
}

export default function SalesBill() {
  const { pushToast } = useApp()
  const [activeTab, setActiveTab] = useState(0)
  const [billType, setBillType] = useState('Tax Invoice (GST)')
  const [items, setItems] = useState([newLineItem(), newLineItem()])
  const [returnMode, setReturnMode] = useState('Credit Note')
  const [remarks, setRemarks] = useState('समय पर डिलीवरी करें।')
  const [retRemarks, setRetRemarks] = useState('कृपया जाँच कर सुधार करें।')

  return (
    <Layout title="Sales Bill" subtitle="नया बिक्री बिल">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
      {/* Desktop: full page header with action buttons */}
      <div>
        <PageHeader
          code="SCR-004"
          title="Sales Bill (नया बिक्री बिल)"
          subtitle="New Sales Bill + GST (HSN & Rate) + Sales Return / Credit Note + Other Information"
          actions={
            <>
              <Button variant="outline" icon={Share2} size="sm">PDF / शेयर करें</Button>
              <Button variant="outline" icon={Printer} size="sm">प्रिंट करें</Button>
              <Button variant="outline" icon={FileText} size="sm">ड्राफ्ट सेव करें</Button>
              <Button variant="primary" icon={Save} size="sm" onClick={() => pushToast('बिल सफलतापूर्वक सेव हो गया')}>बिल सेव करें</Button>
            </>
          }
        />
      </div>

      {/* Stepper: numbered circles joined by lines */}
      <div className="flex items-center mb-3 overflow-x-auto scroll-x">
        {TABS.map((t, i) => (
          <React.Fragment key={t}>
            <button onClick={() => setActiveTab(i)} className="shrink-0 flex items-center gap-2 focus-ring rounded">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border ${
                activeTab === i ? 'bg-navy-600 text-white border-navy-600' : 'bg-white text-slate-700 border-slate-400'
              }`}>{i + 1}</span>
              <span className={`text-xs font-semibold ${activeTab === i ? 'text-navy-600' : 'text-slate-800'}`}>{t}</span>
            </button>
            {i < TABS.length - 1 && <span className="flex-1 min-w-[16px] h-px bg-slate-300 mx-3" />}
          </React.Fragment>
        ))}
      </div>

      {/* Main area: left 3/4 (3 cards + product table) | right 1/4 (GST, attachments, return) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
        <div className="lg:col-span-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {/* 1. Bill info */}
            <div className={card}>
              <h3 className={h3}>1. बिल जानकारी</h3>
              <div className="space-y-2.5">
                <Field label="बिल नं." required><IconInput icon={Settings} defaultValue="INV-1756" /></Field>
                <Field label="बिल दिनांक" required><IconInput icon={Calendar} defaultValue="17/05/2025" /></Field>
                <Field label="बिल प्रकार" required>
                  <Select value={billType} onChange={(e) => setBillType(e.target.value)}>
                    <option>Tax Invoice (GST)</option>
                    <option>Retail</option>
                    <option>Exempt</option>
                    <option>SEZ</option>
                    <option>Export</option>
                  </Select>
                </Field>
                <p className={hint}>(Tax Invoice / Retail / Exempt / SEZ / Export)</p>
              </div>
            </div>

            {/* 2. Customer info */}
            <div className={card}>
              <h3 className={h3}>2. ग्राहक जानकारी</h3>
              <div className="space-y-2.5">
                <Field label="ग्राहक नाम" required><Input defaultValue="Shiv Traders" /></Field>
                <Field label="मोबाइल नं."><IconInput icon={Phone} defaultValue="9876543210" /></Field>
                <Field label="GSTIN (यदि हो)"><Input defaultValue="10ABCDE1234F1Z5" /></Field>
                <Field label="राज्य / आपूर्ति स्थान" required>
                  <Select defaultValue="Bihar (10)"><option>Bihar (10)</option><option>Uttar Pradesh (09)</option></Select>
                </Field>
              </div>
            </div>

            {/* 3. Transport (heading as in prototype) */}
            <div className={card}>
              <h3 className={h3}>3. उत्पाद विवरण</h3>
              <div className="space-y-2.5">
                <Field label="Transport / Delivery Details (यदि आवश्यक)">
                  <Textarea rows={3} defaultValue={'Transport Name: Mahavir Transport\nVehicle No.: BR01AB1234'} />
                </Field>
                <Field label="E-way Bill No. (यदि आवश्यक)"><IconInput icon={Info} defaultValue="4815 9876 1234" /></Field>
                <Field label="Remarks (टिप्पणी)">
                  <Textarea rows={2} maxLength={250} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  <p className="text-[10px] text-slate-500 text-right">{remarks.length}/250</p>
                </Field>
              </div>
            </div>
          </div>

          {/* 6. Product details */}
          <div className={card}>
            <h3 className={h3}>6. उत्पाद विवरण</h3>
            <LineItemsTable items={items} onChange={setItems} />
          </div>
        </div>

        {/* Right column (2-up on tablets, stacked on phones / large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 content-start">
          {/* 4. GST summary */}
          <div className={card}>
            <h3 className={h3}>4. GST जानकारी</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              {gstSummary.map((g) => (
                <div key={g.label} className="py-1.5">
                  <p className="text-[10px] text-slate-600">{g.label}</p>
                  <p className="text-base font-bold text-slate-800">{g.value}</p>
                </div>
              ))}
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 py-1.5 px-1">
                <p className="text-[10px] font-medium text-green-800">Grand Total (₹)<br />(कुल देय राशि)</p>
                <p className="text-base font-bold text-slate-800">1,892.00</p>
              </div>
            </div>
          </div>

          {/* 5. Attachments */}
          <div className={card}>
            <h3 className={h3}>5. संलग्नक (Attachments)</h3>
            <label className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-green-500 py-3 text-center cursor-pointer">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700"><Paperclip size={14} />+ Attachment जोड़ें</span>
              <span className="text-[10px] text-slate-600">(फोटो / PDF / Document)</span>
              <span className="text-[10px] text-slate-600">अधिकतम साइज़: 10 MB</span>
              <input type="file" className="hidden" />
            </label>
          </div>

          {/* 7. Return / credit note */}
          <div className={`${card} md:col-span-2 lg:col-span-1`}>
            <h3 className={h3}>7. रिटर्न / क्रेडिट नोट</h3>
            <div className="inline-flex rounded overflow-hidden border border-slate-200 mb-2 text-[11px] font-semibold">
              {['Credit Note', 'Sales Return'].map((m) => (
                <button
                  key={m}
                  onClick={() => setReturnMode(m)}
                  className={`px-3 py-1 focus-ring ${returnMode === m ? 'bg-navy-600 text-white' : 'bg-white text-slate-700'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2">
              <div className="sm:col-span-3">
                <Field label="मूल बिल संदर्भ (Original Invoice Reference)" required><IconInput icon={Search} defaultValue="INV-1689" /></Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="क्रेडिट नोट क्र." required><IconInput icon={Settings} defaultValue="CN-1023" /></Field>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-800 mb-1">रिटर्न विवरण (रिटर्न के लिए)</p>
            <div className="scroll-x">
              <table className="w-full min-w-[260px] text-[10px] border border-slate-200 border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-800">
                    {['#', 'उत्पाद नाम', 'Qty', 'Rate (₹)', 'Amount (₹)', ''].map((h, i) => (
                      <th key={i} className="font-semibold py-1 px-1.5 border border-slate-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-slate-700 text-center">
                    <td className="py-1 border border-slate-200">1</td>
                    <td className="py-1 px-1.5 border border-slate-200 text-left">मैदा 1kg</td>
                    <td className="py-1 border border-slate-200">1.00</td>
                    <td className="py-1 border border-slate-200">110.00</td>
                    <td className="py-1 border border-slate-200">110.00</td>
                    <td className="py-1 border border-slate-200"><Trash2 size={12} className="text-red-500 inline" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button className="mt-2 mx-auto flex items-center gap-1 text-[11px] font-semibold text-green-700 border border-slate-200 rounded px-3 py-1 focus-ring">
              <Plus size={12} /> आइटम जोड़ें
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div>
                <Field label="रिटर्न मात्रा (कुल उत्पाद मात्रा)"><Input defaultValue="1.00 PCS" /></Field>
                <div className="mt-2">
                  <Field label="रिटर्न का कारण" required>
                    <Select defaultValue="खराब माल / Defective">
                      <option>खराब माल / Defective</option><option>गलत उत्पाद</option><option>अन्य</option>
                    </Select>
                  </Field>
                </div>
              </div>
              <Field label="टिप्पणी (Remarks)">
                <Textarea rows={4} maxLength={250} value={retRemarks} onChange={(e) => setRetRemarks(e.target.value)} />
                <p className="text-[10px] text-slate-500 text-right">{retRemarks.length}/250</p>
              </Field>
            </div>

            <label className="mt-2 flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed border-green-500 py-2 text-center cursor-pointer">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-green-700"><Paperclip size={12} />+ Attachment जोड़ें</span>
              <span className="text-[10px] text-slate-600">(फोटो / PDF / Document) अधिकतम साइज़: 10 MB</span>
              <input type="file" className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Bottom row: rules | data usage | quick actions | summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className={card}>
          <h3 className={h3}>महत्वपूर्ण नियम (Rules)</h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {rules.map((r) => (
              <li key={r} className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />{r}</li>
            ))}
          </ul>
        </div>

        <div className={card}>
          <h3 className={h3}>डेटा का उपयोग (Data Usage)</h3>
          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-700">
            {dataUsage.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </div>

        <div className={card}>
          <h3 className={h3}>त्वरित कार्य (Quick Actions)</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {[
              { l: 'ड्राफ्ट सेव करें', i: FileText },
              { l: 'PDF बनाएं', i: FileDown },
              { l: 'प्रिंट करें', i: Printer },
              { l: 'शेयर करें', i: Share2 },
              { l: 'नया बिल बनाएं', i: FilePlus },
            ].map((a) => (
              <button key={a.l} className="flex flex-col items-center gap-1.5 py-2 px-0.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 focus-ring">
                <a.i size={22} className="text-navy-600" />
                <span className="text-[9px] text-slate-700 text-center leading-tight">{a.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={card}>
          <h3 className={h3}>सारांश (Summary)</h3>
          <ul className="text-[11px] text-slate-700 space-y-0.5">
            {summaryRows.map(([k, v]) => (
              <li key={k} className="flex justify-between"><span>{k}</span><span>{v}</span></li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-xs font-semibold text-green-800">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </div>

      {/* ===================== MOBILE (prototype: SCR-004A) ===================== */}
      <SalesReturnMobile />
    </Layout>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg) — prototype SCR-004A
   Same shell as Reports.jsx: MobileHeader on top, scrolling body,
   Layout's bottom nav below. Sizes are clamp()-based so it scales.
   ===================================================================== */
const C = { green: '#14612e', label: '#1e3a8a', text: '#1f2937', muted: '#6b7280', border: '#e9ecf0', field: '#d9dde3' }
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const GST_RATE = 18 // return amounts are GST-inclusive
const ORIGINAL_BILL_AMOUNT = 1892
const REASONS = ['माल वापस आया / Defective', 'गलत प्रोडक्ट / Wrong item', 'ज़्यादा मात्रा / Excess quantity', 'अन्य / Other']
const STEPS = [
  { label: 'रिटर्न जानकारी', target: 'info' },
  { label: 'आइटम विवरण', target: 'items' },
  { label: 'सम्मरी & सेव', target: 'summary' },
]

const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
let rowId = 1

/* label + control wrapper */
function MField({ label, required, children }) {
  return (
    <div className="min-w-0">
      <span className="block font-semibold mb-1" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </div>
  )
}

/* bordered field shell (height scales with the screen) */
function Box({ children, readOnly, className = '' }) {
  return (
    <div
      className={`relative flex items-center w-full rounded-lg border ${readOnly ? 'bg-slate-100' : 'bg-white focus-within:border-green-600'} ${className}`}
      style={{ borderColor: C.field, height: cl(40, 11.5, 50) }}
    >
      {children}
    </div>
  )
}
const inputCls = 'flex-1 min-w-0 h-full bg-transparent pl-3 pr-9 outline-none placeholder:text-slate-400'
const inputStyle = { color: C.text, fontSize: cl(12, 3.6, 15) }
const iconStyle = { color: C.muted, width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }

function DateBox({ value, onChange, ariaLabel }) {
  return (
    <Box>
      <span className="pl-3 pr-9 font-medium" style={inputStyle}>{showDate(value)}</span>
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
      {/* native picker sits invisibly on top, so the box keeps the dd/mm/yyyy look */}
      <input
        type="date"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* not supported */ } }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </Box>
  )
}

function SectionTitle({ children }) {
  return <h2 className="font-bold mb-3" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>{children}</h2>
}

function SalesReturnMobile() {
  const { pushToast } = useApp()
  const scrollRef = useRef(null)
  const sections = { info: useRef(null), items: useRef(null), summary: useRef(null) }

  const [step, setStep] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [invoiceNo, setInvoiceNo] = useState('INV-1689')
  const [invoiceDate, setInvoiceDate] = useState('2025-05-17')
  const [customer, setCustomer] = useState('Shiv Traders')
  const [returnNo, setReturnNo] = useState('SRN-0042')
  const [returnDate, setReturnDate] = useState('2025-05-20')
  const [reason, setReason] = useState(REASONS[0])
  const [otherReason, setOtherReason] = useState('गुणवत्ता सही नहीं थी ।')
  const [items, setItems] = useState([{ id: rowId++, name: 'मैदा 1kg', qty: '1.00', rate: '110.00' }])
  const [file, setFile] = useState(null)

  const goTo = (i) => {
    setStep(i)
    sections[STEPS[i].target].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const updateItem = (id, key, value) => setItems((arr) => arr.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const removeItem = (id) => setItems((arr) => arr.filter((r) => r.id !== id))
  const addItem = () => setItems((arr) => [...arr, { id: rowId++, name: '', qty: '1.00', rate: '' }])

  // totals (rate is GST-inclusive: taxable = total / 1.18, tax split equally into CGST + SGST)
  const total = items.reduce((sum, r) => sum + num(r.qty) * num(r.rate), 0)
  const taxable = total / (1 + GST_RATE / 100)
  const halfTax = (total - taxable) / 2

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 10 * 1024 * 1024) {
      e.target.value = ''
      return pushToast('फ़ाइल का साइज़ 10 MB से ज़्यादा नहीं होना चाहिए', 'warn')
    }
    setFile(f)
  }

  const save = () => {
    if (!invoiceNo.trim()) return pushToast('इनवॉइस नंबर दर्ज करें', 'warn')
    if (!returnNo.trim()) return pushToast('रिटर्न / क्रेडिट नोट नंबर दर्ज करें', 'warn')
    if (!reason) return pushToast('रिटर्न का कारण चुनें', 'warn')
    if (total <= 0) return pushToast('कम से कम एक आइटम जोड़ें', 'warn')
    if (total > ORIGINAL_BILL_AMOUNT) return pushToast('रिटर्न राशि मूल बिल राशि से ज़्यादा नहीं हो सकती', 'warn')
    pushToast('रिटर्न / क्रेडिट नोट सफलतापूर्वक सेव हो गया')
  }

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-[clamp(12px,4vw,28px)] pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ---- title row: back | title | menu ---- */}
        <div className="grid items-center" style={{ gridTemplateColumns: '40px 1fr 40px' }}>
          <button type="button" aria-label="वापस जाएं" onClick={() => window.history.back()} className="h-10 w-10 -ml-2 flex items-center justify-center rounded-full active:bg-slate-100 focus-ring" style={{ color: C.label }}>
            <ArrowLeft size={22} />
          </button>
          <div className="text-center min-w-0">
            <h1 className="font-bold leading-tight" style={{ color: C.label, fontSize: cl(17, 5.4, 26) }}>सेल्स रिटर्न / क्रेडिट नोट</h1>
            <p className="font-semibold leading-tight mt-0.5" style={{ color: C.text, fontSize: cl(11, 3.4, 15) }}>(SCR-004A)</p>
          </div>
          <div className="relative justify-self-end">
            <button type="button" aria-label="और विकल्प" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className="h-10 w-10 -mr-2 flex items-center justify-center rounded-full active:bg-slate-100 focus-ring" style={{ color: C.text }}>
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border bg-white shadow-lg py-1" style={{ borderColor: C.border }}>
                {[
                  ['ड्राफ्ट सेव करें', FileText, () => pushToast('ड्राफ्ट सेव हो गया')],
                  ['प्रिंट करें', Printer, () => pushToast('प्रिंट तैयार किया जा रहा है', 'info')],
                  ['PDF / शेयर करें', Share2, () => pushToast('PDF तैयार किया जा रहा है', 'info')],
                ].map(([label, Icon, fn]) => (
                  <button key={label} type="button" onClick={() => { setMenuOpen(false); fn() }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] active:bg-slate-50" style={{ color: C.text }}>
                    <Icon size={15} style={{ color: C.label }} />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---- stepper ---- */}
        <div className="mt-4 mb-5 flex items-start">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <button type="button" onClick={() => goTo(i)} aria-current={step === i ? 'step' : undefined} className="flex flex-col items-center shrink-0 focus-ring rounded" style={{ width: cl(64, 22, 120) }}>
                <span
                  className="rounded-full flex items-center justify-center font-semibold border"
                  style={{
                    width: cl(28, 8.4, 40), height: cl(28, 8.4, 40), fontSize: cl(12, 3.6, 16),
                    background: step === i ? C.green : '#fff', color: step === i ? '#fff' : C.text, borderColor: step === i ? C.green : '#94a3b8',
                  }}
                >{i + 1}</span>
                <span className="mt-1 font-semibold text-center leading-tight" style={{ color: step === i ? C.green : C.text, fontSize: cl(9.5, 2.9, 13) }}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span className="flex-1 h-px bg-slate-300 min-w-[8px]" style={{ marginTop: cl(14, 4.2, 20) }} />}
            </React.Fragment>
          ))}
        </div>

        {/* ---- 1. original invoice reference ---- */}
        <section ref={sections.info} className="mb-5">
          <SectionTitle>1. बिल संदर्भ (Original Invoice Reference)</SectionTitle>
          <div className="grid grid-cols-2" style={{ gap: cl(8, 3, 16) }}>
            <MField label="इनवॉइस नंबर" required>
              <Box>
                <input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className={inputCls} style={inputStyle} aria-label="इनवॉइस नंबर" />
                <button type="button" aria-label="इनवॉइस खोजें" onClick={() => pushToast(`${invoiceNo || 'इनवॉइस'} खोजा जा रहा है`, 'info')} className="absolute right-0 h-full px-3 flex items-center focus-ring rounded-r-lg">
                  <Search style={{ ...iconStyle, color: C.label }} />
                </button>
              </Box>
            </MField>
            <MField label="इनवॉइस दिनांक">
              <DateBox value={invoiceDate} onChange={setInvoiceDate} ariaLabel="इनवॉइस दिनांक" />
            </MField>
            <MField label="ग्राहक का नाम">
              <Box>
                <input value={customer} onChange={(e) => setCustomer(e.target.value)} className={inputCls} style={inputStyle} aria-label="ग्राहक का नाम" />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
              </Box>
            </MField>
            <MField label="मूल बिल राशि (₹)">
              <Box readOnly>
                <input readOnly value={money(ORIGINAL_BILL_AMOUNT)} className="flex-1 min-w-0 h-full bg-transparent px-3 text-center font-bold outline-none" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }} aria-label="मूल बिल राशि" />
              </Box>
            </MField>
          </div>
        </section>

        {/* ---- 2. return info ---- */}
        <section className="mb-5">
          <SectionTitle>2. रिटर्न जानकारी</SectionTitle>
          <div className="grid grid-cols-2" style={{ gap: cl(8, 3, 16) }}>
            <MField label="रिटर्न /क्रेडिट नोट नंबर" required>
              <Box>
                <input value={returnNo} onChange={(e) => setReturnNo(e.target.value)} className={inputCls} style={inputStyle} aria-label="रिटर्न / क्रेडिट नोट नंबर" />
                <Settings className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
              </Box>
            </MField>
            <MField label="रिटर्न दिनांक" required>
              <DateBox value={returnDate} onChange={setReturnDate} ariaLabel="रिटर्न दिनांक" />
            </MField>
          </div>

          <div className="mt-3">
            <MField label="रिटर्न का कारण" required>
              <Box>
                <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="रिटर्न का कारण" className="appearance-none w-full h-full bg-transparent pl-3 pr-9 outline-none rounded-lg" style={inputStyle}>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconStyle, color: C.text }} />
              </Box>
            </MField>
          </div>

          <div className="mt-3">
            <MField label="अन्य कारण">
              <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
                <textarea
                  rows={3}
                  maxLength={250}
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  aria-label="अन्य कारण"
                  className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-5 outline-none"
                  style={inputStyle}
                />
                <span className="absolute right-2.5 bottom-1 text-[10px]" style={{ color: C.muted }}>{otherReason.length}/250</span>
              </div>
            </MField>
          </div>
        </section>

        {/* ---- 3. items ---- */}
        <section ref={sections.items} className="mb-5">
          <SectionTitle>3. आइटम विवरण <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(रिटर्न किए गए आइटम)</span></SectionTitle>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.field }}>
            <table className="w-full table-fixed border-collapse" style={{ fontSize: cl(10, 3, 13), color: C.text }}>
              <colgroup>
                <col style={{ width: '8%' }} />
                <col />
                <col style={{ width: '16%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead>
                <tr className="bg-slate-50 font-semibold leading-tight" style={{ color: C.label }}>
                  <th className="py-1.5 px-1 border-b border-r" style={{ borderColor: C.field }}>#</th>
                  <th className="py-1.5 px-1 border-b border-r" style={{ borderColor: C.field }}>प्रोडक्ट नाम</th>
                  <th className="py-1.5 px-0.5 border-b border-r" style={{ borderColor: C.field }}>Qty<br /><span className="font-medium">(रिटर्न)</span></th>
                  <th className="py-1.5 px-0.5 border-b border-r" style={{ borderColor: C.field }}>रेट (₹)</th>
                  <th className="py-1.5 px-0.5 border-b border-r" style={{ borderColor: C.field }}>राशि (₹)</th>
                  <th className="py-1.5 px-0.5 border-b" style={{ borderColor: C.field }}>हटाएं</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r, i) => (
                  <tr key={r.id} className="text-center">
                    <td className="py-1.5 border-b border-r" style={{ borderColor: C.field }}>{i + 1}</td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.name} onChange={(e) => updateItem(r.id, 'name', e.target.value)} placeholder="प्रोडक्ट" aria-label="प्रोडक्ट नाम" className="w-full min-w-0 bg-transparent px-1.5 py-1.5 text-left outline-none focus:bg-green-50 placeholder:text-slate-300" />
                    </td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.qty} inputMode="decimal" onChange={(e) => updateItem(r.id, 'qty', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="रिटर्न मात्रा" className="w-full min-w-0 bg-transparent px-0.5 py-1.5 text-center outline-none focus:bg-green-50" />
                    </td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.rate} inputMode="decimal" onChange={(e) => updateItem(r.id, 'rate', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="रेट" className="w-full min-w-0 bg-transparent px-0.5 py-1.5 text-center outline-none focus:bg-green-50" />
                    </td>
                    <td className="border-b border-r font-medium" style={{ borderColor: C.field }}>{money(num(r.qty) * num(r.rate))}</td>
                    <td className="border-b" style={{ borderColor: C.field }}>
                      <button type="button" aria-label="आइटम हटाएं" onClick={() => removeItem(r.id)} className="p-1.5 text-red-500 active:scale-90 focus-ring rounded">
                        <Trash2 style={{ width: cl(13, 3.8, 18), height: cl(13, 3.8, 18) }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="py-4 text-center text-slate-400">कोई आइटम नहीं जोड़ा गया</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={addItem} className="mt-3 mx-auto flex items-center justify-center gap-1.5 rounded-lg border bg-white font-semibold active:bg-green-50 focus-ring" style={{ borderColor: C.field, color: C.green, height: cl(36, 10.5, 46), width: cl(130, 38, 200), fontSize: cl(12, 3.6, 15) }}>
            <Plus size={16} /> आइटम जोड़ें
          </button>

          {/* return summary */}
          <div ref={sections.summary} className="mt-4 rounded-xl border bg-slate-50 px-3.5 py-3" style={{ borderColor: C.field }}>
            <h3 className="font-bold mb-2" style={{ color: C.text, fontSize: cl(13, 3.9, 17) }}>रिटर्न समरी</h3>
            <dl style={{ fontSize: cl(12, 3.6, 15), color: C.text }} className="space-y-1.5">
              {[
                ['टैक्सेबल वैल्यू (₹)', money(taxable)],
                ['CGST (₹)', money(halfTax)],
                ['SGST (₹)', money(halfTax)],
                ['IGST', money(0)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt>{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-2 pt-2 border-t flex justify-between items-baseline font-bold" style={{ borderColor: C.field }}>
              <span style={{ color: C.text, fontSize: cl(13, 3.9, 17) }}>कुल रिटर्न राशि (₹)</span>
              <span style={{ color: C.green, fontSize: cl(16, 5, 22) }}>{money(total)}</span>
            </div>
          </div>
        </section>

        {/* ---- 4. attachment ---- */}
        <section className="mb-2">
          <SectionTitle>4. अटैचमेंट <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(कोई दस्तावेज, फोटो)</span></SectionTitle>
          <label className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed text-center cursor-pointer active:bg-green-50 focus-within:ring-2 focus-within:ring-green-600/40" style={{ borderColor: '#22a24a', padding: cl(12, 4, 20) }}>
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: C.green, fontSize: cl(13, 3.9, 17) }}>
              <Paperclip size={16} />{file ? 'फ़ाइल बदलें' : 'दस्तावेज जोड़ें'}
            </span>
            {file ? (
              <span className="max-w-full truncate font-medium" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>{file.name}</span>
            ) : (
              <>
                <span style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>(फोटो / PDF / Document)</span>
                <span style={{ color: C.muted, fontSize: cl(10, 3, 13) }}>अधिकतम साइज़: 10 MB</span>
              </>
            )}
            <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
          </label>
        </section>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav ---- */}
      <div className="shrink-0 grid grid-cols-2 border-t bg-white px-[clamp(12px,4vw,28px)] py-2.5" style={{ borderColor: C.border, gap: cl(10, 3.5, 18) }}>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.green, color: C.green, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>रद्द करें</button>
        <button type="button" onClick={save} className="rounded-lg font-semibold text-white active:opacity-90 focus-ring" style={{ background: C.green, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>सेव करें</button>
      </div>
    </div>
  )
}