import React, { useEffect, useRef, useState } from 'react'
import {
  Share2, Printer, FileText, Save, Paperclip, Plus, Search, Settings, Phone, Info, Calendar,
  Trash2, FilePlus, FileDown, CheckCircle2, ChevronDown, X,
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

      {/* ===================== MOBILE (phone / small tablet, < lg) ===================== */}
      <SalesBillMobile />
    </Layout>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg)
   Same shell as Reports.jsx / SalesReturn: MobileHeader on top, scrolling
   body, Layout's bottom nav below. Sections follow the 7 steps in TABS
   and sizes are clamp()-based so the page scales with the screen width.
   ===================================================================== */
const C = { green: '#14612e', label: '#1e3a8a', text: '#1f2937', muted: '#6b7280', border: '#e9ecf0', field: '#d9dde3' }
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)'
const SELLER_STATE = 'Bihar (10)'
const STATES = ['Bihar (10)', 'Uttar Pradesh (09)', 'Jharkhand (20)', 'West Bengal (19)', 'Delhi (07)']
const BILL_TYPES = ['Tax Invoice (GST)', 'Retail', 'Exempt', 'SEZ', 'Export']
const GST_SLABS = ['0', '5', '12', '18', '28']
const RETURN_REASONS = ['खराब माल / Defective', 'गलत उत्पाद', 'अन्य']

const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
let uid = 1

/* ---------- small building blocks ---------- */
function MField({ label, required, children, hintText }) {
  return (
    <div className="min-w-0">
      <span className="block font-semibold mb-1" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {hintText && <p className="mt-1" style={{ color: C.muted, fontSize: cl(9.5, 2.8, 12) }}>{hintText}</p>}
    </div>
  )
}

const boxH = cl(40, 11.5, 50)
const inputStyle = { color: C.text, fontSize: cl(12, 3.6, 15) }
const iconStyle = { color: C.muted, width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }
const inputCls = 'flex-1 min-w-0 h-full bg-transparent pl-3 pr-9 outline-none placeholder:text-slate-400'

function Box({ children, readOnly }) {
  return (
    <div
      className={`relative flex items-center w-full rounded-lg border ${readOnly ? 'bg-slate-100' : 'bg-white focus-within:border-green-600'}`}
      style={{ borderColor: C.field, height: boxH }}
    >
      {children}
    </div>
  )
}

function TextBox({ icon: Icon, readOnly, center, ...props }) {
  return (
    <Box readOnly={readOnly}>
      <input
        readOnly={readOnly}
        {...props}
        className={Icon ? inputCls : `flex-1 min-w-0 h-full bg-transparent px-3 outline-none placeholder:text-slate-400 ${center ? 'text-center' : ''}`}
        style={inputStyle}
      />
      {Icon && <Icon className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />}
    </Box>
  )
}

function SelectBox({ value, onChange, options, label }) {
  return (
    <Box>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="appearance-none w-full h-full bg-transparent pl-3 pr-9 outline-none rounded-lg" style={inputStyle}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconStyle, color: C.text }} />
    </Box>
  )
}

function DateBox({ value, onChange, label }) {
  return (
    <Box>
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

function AreaBox({ value, onChange, rows = 3, label, max = 250 }) {
  return (
    <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
      <textarea
        rows={rows}
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-5 outline-none"
        style={inputStyle}
      />
      <span className="absolute right-2.5 bottom-1 text-[10px]" style={{ color: C.muted }}>{value.length}/{max}</span>
    </div>
  )
}

function SectionCard({ title, sub, innerRef, children }) {
  return (
    <section ref={innerRef} className="rounded-xl border bg-white mt-3" style={{ borderColor: C.border, padding: cl(12, 3.6, 18), scrollMarginTop: 72 }}>
      <h2 className="font-bold mb-3" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>
        {title}{sub && <span className="font-semibold ml-1" style={{ fontSize: cl(11, 3.4, 14) }}>{sub}</span>}
      </h2>
      {children}
    </section>
  )
}

function AttachBox({ files, onFiles, onRemove, compact }) {
  return (
    <>
      <label className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed text-center cursor-pointer active:bg-green-50 focus-within:ring-2 focus-within:ring-green-600/40" style={{ borderColor: '#22a24a', padding: cl(compact ? 8 : 12, 3.4, compact ? 14 : 20) }}>
        <span className="flex items-center gap-1.5 font-semibold" style={{ color: C.green, fontSize: cl(12, 3.8, 16) }}><Paperclip size={15} />+ Attachment जोड़ें</span>
        <span style={{ color: C.text, fontSize: cl(10.5, 3.2, 13) }}>(फोटो / PDF / Document)</span>
        <span style={{ color: C.muted, fontSize: cl(9.5, 3, 12) }}>अधिकतम साइज़: 10 MB</span>
        <input type="file" multiple accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFiles} />
      </label>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-lg bg-slate-50 border px-2.5 py-1.5" style={{ borderColor: C.border, fontSize: cl(11, 3.3, 14), color: C.text }}>
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

/* ---------- the page ---------- */
const MOBILE_STEPS = TABS // same 7 steps as the desktop stepper

function SalesBillMobile() {
  const { pushToast } = useApp()
  const mainRef = useRef(null)
  const secRefs = useRef([])
  const chipRefs = useRef([])
  const [active, setActive] = useState(0)

  // 1. bill info
  const [billNo, setBillNo] = useState('INV-1756')
  const [billDate, setBillDate] = useState('2025-05-17')
  const [billType, setBillType] = useState(BILL_TYPES[0])
  // 2. customer
  const [customer, setCustomer] = useState('Shiv Traders')
  const [mobile, setMobile] = useState('9876543210')
  const [gstin, setGstin] = useState('10ABCDE1234F1Z5')
  const [state, setState] = useState(SELLER_STATE)
  // 3. items (sample data adds up to the 1,720 taxable / 1,892 total shown on desktop)
  const [items, setItems] = useState([
    { id: uid++, name: 'चावल 1kg', hsn: '1006', qty: '1', rate: '170', gst: '0' },
    { id: uid++, name: 'चाय पत्ती 250g', hsn: '0902', qty: '1', rate: '200', gst: '5' },
    { id: uid++, name: 'घी 500g', hsn: '0405', qty: '3', rate: '450', gst: '12' },
  ])
  // 5. other info
  const [transport, setTransport] = useState('Transport Name: Mahavir Transport\nVehicle No.: BR01AB1234')
  const [eway, setEway] = useState('4815 9876 1234')
  const [remarks, setRemarks] = useState('समय पर डिलीवरी करें।')
  // 6. attachments
  const [files, setFiles] = useState([])
  // 7. return / credit note
  const [returnMode, setReturnMode] = useState('Credit Note')
  const [origInvoice, setOrigInvoice] = useState('INV-1689')
  const [creditNo, setCreditNo] = useState('CN-1023')
  const [retItems, setRetItems] = useState([{ id: uid++, name: 'मैदा 1kg', qty: '1.00', rate: '110.00' }])
  const [retReason, setRetReason] = useState(RETURN_REASONS[0])
  const [retRemarks, setRetRemarks] = useState('कृपया जाँच कर सुधार करें।')
  const [retFiles, setRetFiles] = useState([])

  /* ----- totals ----- */
  const taxable = items.reduce((s, r) => s + num(r.qty) * num(r.rate), 0)
  const tax = items.reduce((s, r) => s + (num(r.qty) * num(r.rate) * num(r.gst)) / 100, 0)
  const intra = state === SELLER_STATE
  const cgst = intra ? tax / 2 : 0
  const sgst = intra ? tax / 2 : 0
  const igst = intra ? 0 : tax
  const grand = taxable + tax
  const totalQty = items.reduce((s, r) => s + num(r.qty), 0)
  const retTotal = retItems.reduce((s, r) => s + num(r.qty) * num(r.rate), 0)
  const retQty = retItems.reduce((s, r) => s + num(r.qty), 0)

  /* ----- stepper <-> scroll ----- */
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

  /* ----- item helpers ----- */
  const upd = (setter) => (id, key, value) => setter((arr) => arr.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const updItem = upd(setItems)
  const updRet = upd(setRetItems)
  const decimal = (v) => v.replace(/[^0-9.]/g, '')

  const addFiles = (setter) => (e) => {
    const picked = Array.from(e.target.files || [])
    e.target.value = ''
    const ok = picked.filter((f) => f.size <= 10 * 1024 * 1024)
    if (ok.length < picked.length) pushToast('10 MB से बड़ी फ़ाइल जोड़ी नहीं गई', 'warn')
    if (ok.length) setter((prev) => [...prev, ...ok])
  }

  const save = () => {
    if (!billNo.trim()) return pushToast('बिल नंबर दर्ज करें', 'warn')
    if (!customer.trim()) return pushToast('ग्राहक का नाम दर्ज करें', 'warn')
    if (grand <= 0) return pushToast('कम से कम एक आइटम जोड़ें', 'warn')
    pushToast('बिल सफलतापूर्वक सेव हो गया')
  }

  const summary = [
    ['कुल आइटम :', String(items.length)],
    ['कुल मात्रा :', money(totalQty)],
    ['कुल कर योग्य मूल्य :', `₹ ${money(taxable)}`],
    ['कुल CGST :', `₹ ${money(cgst)}`],
    ['कुल SGST :', `₹ ${money(sgst)}`],
    ['कुल IGST :', `₹ ${money(igst)}`],
    ['कुल Cess :', '₹ 0.00'],
  ]
  const quickActions = [
    { l: 'ड्राफ्ट सेव करें', i: FileText, fn: () => pushToast('ड्राफ्ट सेव हो गया') },
    { l: 'PDF बनाएं', i: FileDown, fn: () => pushToast('PDF तैयार किया जा रहा है', 'info') },
    { l: 'प्रिंट करें', i: Printer, fn: () => pushToast('प्रिंट तैयार किया जा रहा है', 'info') },
    { l: 'शेयर करें', i: Share2, fn: () => pushToast('शेयर विकल्प खोले जा रहे हैं', 'info') },
    { l: 'नया बिल बनाएं', i: FilePlus, fn: () => pushToast('नया बिल', 'info') },
  ]

  const gap = cl(8, 3, 16)

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main ref={mainRef} onScroll={onScroll} className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>SCR-004</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>नया बिक्री बिल (Sales Bill)</h1>
          <p className="font-medium mt-1 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>GST, रिटर्न / क्रेडिट नोट और अन्य जानकारी के साथ बिल बनाएं</p>
        </div>

        {/* ---- sticky stepper (scrolls sideways, follows the page) ---- */}
        <nav aria-label="बिल के चरण" className="sticky top-0 z-10 bg-white mt-3 border-b" style={{ borderColor: C.border, marginInline: `calc(-1 * ${PAD})`, paddingInline: PAD }}>
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

        {/* ---- 1. bill info ---- */}
        <SectionCard title="1. बिल जानकारी" innerRef={(el) => { secRefs.current[0] = el }}>
          <div className="grid grid-cols-2" style={{ gap }}>
            <MField label="बिल नं." required>
              <TextBox icon={Settings} value={billNo} onChange={(e) => setBillNo(e.target.value)} aria-label="बिल नंबर" />
            </MField>
            <MField label="बिल दिनांक" required>
              <DateBox value={billDate} onChange={setBillDate} label="बिल दिनांक" />
            </MField>
          </div>
          <div className="mt-3">
            <MField label="बिल प्रकार" required hintText="(Tax Invoice / Retail / Exempt / SEZ / Export)">
              <SelectBox value={billType} onChange={setBillType} options={BILL_TYPES} label="बिल प्रकार" />
            </MField>
          </div>
        </SectionCard>

        {/* ---- 2. customer ---- */}
        <SectionCard title="2. ग्राहक जानकारी" innerRef={(el) => { secRefs.current[1] = el }}>
          <MField label="ग्राहक नाम" required>
            <TextBox value={customer} onChange={(e) => setCustomer(e.target.value)} aria-label="ग्राहक नाम" />
          </MField>
          <div className="grid grid-cols-2 mt-3" style={{ gap }}>
            <MField label="मोबाइल नं.">
              <TextBox icon={Phone} inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} aria-label="मोबाइल नंबर" />
            </MField>
            <MField label="राज्य / आपूर्ति स्थान" required>
              <SelectBox value={state} onChange={setState} options={STATES} label="राज्य" />
            </MField>
          </div>
          <div className="mt-3">
            <MField label="GSTIN (यदि हो)">
              <TextBox value={gstin} maxLength={15} onChange={(e) => setGstin(e.target.value.toUpperCase())} aria-label="GSTIN" />
            </MField>
          </div>
        </SectionCard>

        {/* ---- 3. products ---- */}
        <SectionCard title="3. उत्पाद विवरण" innerRef={(el) => { secRefs.current[2] = el }}>
          <div className="space-y-2.5">
            {items.map((r, i) => {
              const amt = num(r.qty) * num(r.rate)
              return (
                <div key={r.id} className="rounded-lg border bg-slate-50 p-2.5" style={{ borderColor: C.field }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold truncate" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }}>{i + 1}. {r.name || 'नया आइटम'}</span>
                    <button type="button" aria-label="आइटम हटाएं" onClick={() => setItems((a) => a.filter((x) => x.id !== r.id))} className="p-1.5 -mr-1 text-red-500 active:scale-90 focus-ring rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2" style={{ gap: cl(6, 2.4, 12) }}>
                    <div className="col-span-2">
                      <MField label="प्रोडक्ट नाम">
                        <TextBox value={r.name} placeholder="प्रोडक्ट का नाम" onChange={(e) => updItem(r.id, 'name', e.target.value)} aria-label="प्रोडक्ट नाम" />
                      </MField>
                    </div>
                    <MField label="HSN कोड">
                      <TextBox value={r.hsn} inputMode="numeric" onChange={(e) => updItem(r.id, 'hsn', e.target.value.replace(/\D/g, ''))} aria-label="HSN कोड" />
                    </MField>
                    <MField label="GST दर (%)">
                      <SelectBox value={r.gst} onChange={(v) => updItem(r.id, 'gst', v)} options={GST_SLABS} label="GST दर" />
                    </MField>
                    <MField label="मात्रा (Qty)">
                      <TextBox center value={r.qty} inputMode="decimal" onChange={(e) => updItem(r.id, 'qty', decimal(e.target.value))} aria-label="मात्रा" />
                    </MField>
                    <MField label="रेट (₹)">
                      <TextBox center value={r.rate} inputMode="decimal" onChange={(e) => updItem(r.id, 'rate', decimal(e.target.value))} aria-label="रेट" />
                    </MField>
                  </div>
                  <p className="mt-2 flex justify-between font-semibold" style={{ color: C.text, fontSize: cl(11.5, 3.5, 14) }}>
                    <span>राशि (₹)</span><span>{money(amt)}</span>
                  </p>
                </div>
              )
            })}
            {items.length === 0 && <p className="py-4 text-center text-slate-400 text-sm">कोई आइटम नहीं जोड़ा गया</p>}
          </div>
          <button
            type="button"
            onClick={() => setItems((a) => [...a, { id: uid++, name: '', hsn: '', qty: '1', rate: '', gst: '5' }])}
            className="mt-3 mx-auto flex items-center justify-center gap-1.5 rounded-lg border bg-white font-semibold active:bg-green-50 focus-ring"
            style={{ borderColor: C.field, color: C.green, height: cl(36, 10.5, 46), width: cl(130, 38, 200), fontSize: cl(12, 3.6, 15) }}
          >
            <Plus size={16} /> आइटम जोड़ें
          </button>
        </SectionCard>

        {/* ---- 4. GST ---- */}
        <SectionCard title="4. GST जानकारी" innerRef={(el) => { secRefs.current[3] = el }}>
          <div className="grid grid-cols-2" style={{ gap: cl(8, 2.6, 12) }}>
            {[
              ['Taxable Value (₹)', taxable],
              ['Total CGST (₹)', cgst],
              ['Total SGST (₹)', sgst],
              ['Total IGST (₹)', igst],
              ['Total Cess (₹)', 0],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border bg-slate-50 px-3 py-2 text-center" style={{ borderColor: C.border }}>
                <p style={{ color: C.muted, fontSize: cl(10, 3, 12.5) }}>{k}</p>
                <p className="font-bold" style={{ color: C.text, fontSize: cl(14, 4.3, 18) }}>{money(v)}</p>
              </div>
            ))}
            <div className="rounded-lg border px-3 py-2 text-center" style={{ background: '#ecf8f0', borderColor: '#bfe3cb' }}>
              <p className="font-medium leading-tight" style={{ color: C.green, fontSize: cl(10, 3, 12.5) }}>Grand Total (₹)<br />(कुल देय राशि)</p>
              <p className="font-bold" style={{ color: C.text, fontSize: cl(14, 4.3, 18) }}>{money(grand)}</p>
            </div>
          </div>
          <p className="mt-2" style={{ color: C.muted, fontSize: cl(9.5, 2.8, 12) }}>
            {intra ? 'राज्य के अंदर की बिक्री: CGST + SGST लागू' : 'राज्य के बाहर की बिक्री: IGST लागू'}
          </p>
        </SectionCard>

        {/* ---- 5. other info ---- */}
        <SectionCard title="5. अन्य जानकारी" innerRef={(el) => { secRefs.current[4] = el }}>
          <div className="space-y-3">
            <MField label="Transport / Delivery Details (यदि आवश्यक)">
              <AreaBox rows={3} value={transport} onChange={setTransport} label="Transport details" />
            </MField>
            <MField label="E-way Bill No. (यदि आवश्यक)">
              <TextBox icon={Info} value={eway} onChange={(e) => setEway(e.target.value)} aria-label="E-way Bill No." />
            </MField>
            <MField label="Remarks (टिप्पणी)">
              <AreaBox rows={2} value={remarks} onChange={setRemarks} label="Remarks" />
            </MField>
          </div>
        </SectionCard>

        {/* ---- 6. attachments ---- */}
        <SectionCard title="6. संलग्नक" sub="(Attachments)" innerRef={(el) => { secRefs.current[5] = el }}>
          <AttachBox files={files} onFiles={addFiles(setFiles)} onRemove={(i) => setFiles((a) => a.filter((_, k) => k !== i))} />
        </SectionCard>

        {/* ---- 7. return / credit note ---- */}
        <SectionCard title="7. रिटर्न / क्रेडिट नोट" innerRef={(el) => { secRefs.current[6] = el }}>
          <div role="group" aria-label="प्रकार" className="inline-flex rounded-lg overflow-hidden border mb-3 font-semibold" style={{ borderColor: C.field, fontSize: cl(11, 3.4, 14) }}>
            {['Credit Note', 'Sales Return'].map((m) => (
              <button key={m} type="button" onClick={() => setReturnMode(m)} aria-pressed={returnMode === m} className="px-4 py-1.5 focus-ring" style={{ background: returnMode === m ? C.green : '#fff', color: returnMode === m ? '#fff' : C.text }}>{m}</button>
            ))}
          </div>

          <div className="space-y-3">
            <MField label="मूल बिल संदर्भ (Original Invoice Reference)" required>
              <Box>
                <input value={origInvoice} onChange={(e) => setOrigInvoice(e.target.value)} aria-label="मूल बिल संदर्भ" className={inputCls} style={inputStyle} />
                <button type="button" aria-label="इनवॉइस खोजें" onClick={() => pushToast(`${origInvoice || 'इनवॉइस'} खोजा जा रहा है`, 'info')} className="absolute right-0 h-full px-3 flex items-center focus-ring rounded-r-lg">
                  <Search style={{ ...iconStyle, color: C.label }} />
                </button>
              </Box>
            </MField>
            <MField label="क्रेडिट नोट क्र." required>
              <TextBox icon={Settings} value={creditNo} onChange={(e) => setCreditNo(e.target.value)} aria-label="क्रेडिट नोट क्रमांक" />
            </MField>
          </div>

          <p className="font-semibold mt-4 mb-1.5" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>रिटर्न विवरण (रिटर्न के लिए)</p>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.field }}>
            <table className="w-full table-fixed border-collapse" style={{ fontSize: cl(10, 3, 13), color: C.text }}>
              <colgroup><col style={{ width: '8%' }} /><col /><col style={{ width: '16%' }} /><col style={{ width: '17%' }} /><col style={{ width: '18%' }} /><col style={{ width: '11%' }} /></colgroup>
              <thead>
                <tr className="bg-slate-50 font-semibold leading-tight" style={{ color: C.label }}>
                  {['#', 'उत्पाद नाम', 'Qty', 'Rate (₹)', 'Amount (₹)', ''].map((h, i) => (
                    <th key={i} className={`py-1.5 px-0.5 border-b ${i < 5 ? 'border-r' : ''}`} style={{ borderColor: C.field }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {retItems.map((r, i) => (
                  <tr key={r.id} className="text-center">
                    <td className="py-1.5 border-b border-r" style={{ borderColor: C.field }}>{i + 1}</td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.name} placeholder="प्रोडक्ट" aria-label="उत्पाद नाम" onChange={(e) => updRet(r.id, 'name', e.target.value)} className="w-full min-w-0 bg-transparent px-1.5 py-1.5 text-left outline-none focus:bg-green-50 placeholder:text-slate-300" />
                    </td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.qty} inputMode="decimal" aria-label="मात्रा" onChange={(e) => updRet(r.id, 'qty', decimal(e.target.value))} className="w-full min-w-0 bg-transparent px-0.5 py-1.5 text-center outline-none focus:bg-green-50" />
                    </td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.rate} inputMode="decimal" aria-label="रेट" onChange={(e) => updRet(r.id, 'rate', decimal(e.target.value))} className="w-full min-w-0 bg-transparent px-0.5 py-1.5 text-center outline-none focus:bg-green-50" />
                    </td>
                    <td className="border-b border-r font-medium" style={{ borderColor: C.field }}>{money(num(r.qty) * num(r.rate))}</td>
                    <td className="border-b" style={{ borderColor: C.field }}>
                      <button type="button" aria-label="आइटम हटाएं" onClick={() => setRetItems((a) => a.filter((x) => x.id !== r.id))} className="p-1.5 text-red-500 active:scale-90 focus-ring rounded"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
                {retItems.length === 0 && <tr><td colSpan={6} className="py-3 text-center text-slate-400">कोई आइटम नहीं</td></tr>}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => setRetItems((a) => [...a, { id: uid++, name: '', qty: '1.00', rate: '' }])} className="mt-2.5 mx-auto flex items-center justify-center gap-1.5 rounded-lg border bg-white font-semibold active:bg-green-50 focus-ring" style={{ borderColor: C.field, color: C.green, height: cl(34, 10, 44), width: cl(120, 36, 190), fontSize: cl(12, 3.6, 15) }}>
            <Plus size={15} /> आइटम जोड़ें
          </button>

          <div className="space-y-3 mt-3">
            <div className="grid grid-cols-2" style={{ gap }}>
              <MField label="रिटर्न मात्रा">
                <Box readOnly><input readOnly value={`${money(retQty)} PCS`} aria-label="रिटर्न मात्रा" className="flex-1 min-w-0 h-full bg-transparent px-3 outline-none" style={inputStyle} /></Box>
              </MField>
              <MField label="कुल रिटर्न राशि (₹)">
                <Box readOnly><input readOnly value={money(retTotal)} aria-label="कुल रिटर्न राशि" className="flex-1 min-w-0 h-full bg-transparent px-3 text-right font-bold outline-none" style={{ ...inputStyle, color: C.green }} /></Box>
              </MField>
            </div>
            <MField label="रिटर्न का कारण" required>
              <SelectBox value={retReason} onChange={setRetReason} options={RETURN_REASONS} label="रिटर्न का कारण" />
            </MField>
            <MField label="टिप्पणी (Remarks)">
              <AreaBox rows={3} value={retRemarks} onChange={setRetRemarks} label="रिटर्न टिप्पणी" />
            </MField>
            <AttachBox compact files={retFiles} onFiles={addFiles(setRetFiles)} onRemove={(i) => setRetFiles((a) => a.filter((_, k) => k !== i))} />
          </div>
        </SectionCard>

        {/* ---- summary ---- */}
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: C.border, padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-2" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>सारांश <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Summary)</span></h2>
          <dl className="space-y-1.5" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }}>
            {summary.map(([k, v]) => <div key={k} className="flex justify-between"><dt>{k}</dt><dd className="font-medium">{v}</dd></div>)}
          </dl>
          <div className="mt-2 pt-2 border-t flex justify-between items-baseline font-bold" style={{ borderColor: C.field }}>
            <span style={{ color: C.text, fontSize: cl(13, 3.9, 17) }}>कुल देय राशि :</span>
            <span style={{ color: C.green, fontSize: cl(16, 5, 22) }}>₹ {money(grand)}</span>
          </div>
        </section>

        {/* ---- quick actions ---- */}
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: C.border, padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-2.5" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>त्वरित कार्य <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Quick Actions)</span></h2>
          <div className="grid grid-cols-5" style={{ gap: cl(4, 1.6, 10) }}>
            {quickActions.map((a) => (
              <button key={a.l} type="button" onClick={a.fn} className="min-w-0 flex flex-col items-center gap-1.5 py-2 px-0.5 rounded-lg border active:bg-slate-50 focus-ring" style={{ borderColor: C.border }}>
                <a.i style={{ color: C.label, width: cl(18, 5.6, 26), height: cl(18, 5.6, 26) }} />
                <span className="text-center leading-tight" style={{ color: C.text, fontSize: cl(8.5, 2.5, 11.5) }}>{a.l}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ---- rules + data usage ---- */}
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: C.border, padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-2" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>महत्वपूर्ण नियम <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Rules)</span></h2>
          <ul className="space-y-1.5" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>
            {rules.map((r) => <li key={r} className="flex items-start gap-1.5"><CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />{r}</li>)}
          </ul>
        </section>
        <section className="rounded-xl border bg-white mt-3" style={{ borderColor: C.border, padding: cl(12, 3.6, 18) }}>
          <h2 className="font-bold mb-2" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>डेटा का उपयोग <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(Data Usage)</span></h2>
          <ul className="list-disc pl-4 space-y-1.5" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>
            {dataUsage.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </section>

        <p className="text-center font-semibold mt-4" style={{ color: C.green, fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav ---- */}
      <div className="shrink-0 grid grid-cols-2 border-t bg-white py-2.5" style={{ borderColor: C.border, gap: cl(10, 3.5, 18), paddingInline: PAD }}>
        <button type="button" onClick={() => pushToast('ड्राफ्ट सेव हो गया')} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.green, color: C.green, height: boxH, fontSize: cl(13, 3.9, 16) }}>ड्राफ्ट सेव करें</button>
        <button type="button" onClick={save} className="rounded-lg font-semibold text-white active:opacity-90 focus-ring" style={{ background: C.green, height: boxH, fontSize: cl(13, 3.9, 16) }}>बिल सेव करें</button>
      </div>
    </div>
  )
}