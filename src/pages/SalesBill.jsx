import React, { useState } from 'react'
import {
  Share2, Printer, FileText, Save, Paperclip, Plus, Search, Settings, Phone, Info, Calendar,
  Trash2, FilePlus, FileDown, CheckCircle2,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
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
    </Layout>
  )
}