import React, { useState } from 'react'
import { Share2, Printer, FileText, Save, Paperclip } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Field, Input, Select, Textarea } from '../components/common/Form'
import Button from '../components/common/Button'
import LineItemsTable, { newLineItem } from '../components/common/LineItemsTable'
import { useApp } from '../context/AppContext'
import { formatDateDMY } from '../utils/format'

const TABS = ['बिल जानकारी', 'ग्राहक जानकारी', 'उत्पाद विवरण', 'GST जानकारी', 'अन्य जानकारी', 'संलग्नक', 'रिटर्न / क्रेडिट नोट']

export default function SalesBill() {
  const { pushToast } = useApp()
  const [activeTab, setActiveTab] = useState(0)
  const [billType, setBillType] = useState('Tax Invoice (GST)')
  const [items, setItems] = useState([newLineItem(), newLineItem()])
  const [returnMode, setReturnMode] = useState('Credit Note')

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

      <div className="flex gap-1.5 overflow-x-auto scroll-x mb-5 pb-1">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
              activeTab === i ? 'bg-navy-600 text-white border-navy-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${activeTab === i ? 'bg-white text-navy-600' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">1. बिल जानकारी</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="बिल नं." required><Input defaultValue="INV-1756" /></Field>
              <Field label="बिल दिनांक" required><Input type="date" defaultValue="2025-05-17" /></Field>
              <Field label="बिल प्रकार" required>
                <Select value={billType} onChange={(e) => setBillType(e.target.value)}>
                  <option>Tax Invoice (GST)</option>
                  <option>Retail</option>
                  <option>Exempt</option>
                  <option>SEZ</option>
                  <option>Export</option>
                </Select>
              </Field>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">2. ग्राहक जानकारी</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="ग्राहक नाम" required><Input defaultValue="Shiv Traders" /></Field>
              <Field label="मोबाइल नं."><Input defaultValue="9876543210" /></Field>
              <Field label="GSTIN (यदि हो)"><Input defaultValue="10ABCDE1234F1Z5" /></Field>
              <Field label="राज्य / आपूर्ति स्थान" required>
                <Select defaultValue="Bihar (10)"><option>Bihar (10)</option><option>Uttar Pradesh (09)</option></Select>
              </Field>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">6. उत्पाद विवरण</h3>
            <LineItemsTable items={items} onChange={setItems} />
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">7. रिटर्न / क्रेडिट नोट</h3>
            <div className="flex gap-2 mb-4">
              {['Credit Note', 'Sales Return'].map((m) => (
                <button
                  key={m}
                  onClick={() => setReturnMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold border focus-ring ${
                    returnMode === m ? 'bg-navy-600 text-white border-navy-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="मूल बिल संदर्भ (Original Invoice Reference)" required><Input placeholder="INV-1689" /></Field>
              <Field label="क्रेडिट नोट क्र."><Input placeholder="CN-1023" /></Field>
              <Field label="रिटर्न का कारण" required>
                <Select defaultValue=""><option value="">चुनें</option><option>खराब माल / Defective</option><option>गलत उत्पाद</option><option>अन्य</option></Select>
              </Field>
              <Field label="टिप्पणी (Remarks)"><Input placeholder="कृपया जाँच कर सुधार करें।" /></Field>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">3. Transport / Delivery Details</h3>
            <div className="space-y-3">
              <Field label="Transport Name / Vehicle No."><Textarea rows={2} placeholder="Transport Name: Mahavir Transport&#10;Vehicle No.: BR01AB1234" /></Field>
              <Field label="E-way Bill No. (यदि आवश्यक)"><Input placeholder="4815 9876 1234" /></Field>
              <Field label="Remarks (टिप्पणी)"><Textarea rows={2} placeholder="समय पर डिलीवरी करें।" /></Field>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">5. संलग्नक (Attachments)</h3>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center cursor-pointer hover:border-brandGreen-400 transition-colors">
              <Paperclip size={22} className="text-brandGreen-600" />
              <span className="text-sm font-medium text-brandGreen-700">+ Attachment जोड़ें</span>
              <span className="text-xs text-slate-400">(फोटो / PDF / Document) अधिकतम साइज़: 10 MB</span>
              <input type="file" className="hidden" />
            </label>
          </Card>

          <Card className="p-4 bg-slate-50">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">महत्वपूर्ण नियम (Rules)</h3>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>✅ सभी जानकारी सही और पूर्ण भरें।</li>
              <li>✅ यह बिल GSTR-1 और GSTR-3B में आयोग्य होगा।</li>
              <li>✅ HSN, GST Rate, Taxable Value सही भरें।</li>
              <li>✅ रिटर्न / क्रेडिट नोट का उपयोग केवल आवश्यक होने पर करें।</li>
              <li>✅ संलग्नक अधिकतम साइज़ 10 MB तक अपलोड करें।</li>
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
