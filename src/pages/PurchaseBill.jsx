import React, { useState } from 'react'
import { Share2, Printer, FileText, Save, Paperclip } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Field, Input, Select, Checkbox } from '../components/common/Form'
import Button from '../components/common/Button'
import LineItemsTable, { newLineItem } from '../components/common/LineItemsTable'
import { useApp } from '../context/AppContext'

const STEPS = ['बिल जानकारी', 'सप्लायर जानकारी', 'आइटम विवरण', 'GST जानकारी', 'अन्य जानकारी', 'सारांश & सेव']

export default function PurchaseBill() {
  const { pushToast } = useApp()
  const [step, setStep] = useState(2)
  const [items, setItems] = useState([newLineItem(), newLineItem(), newLineItem()])

  return (
    <Layout title="Purchase Bill" subtitle="नया खरीद बिल">
      <PageHeader
        code="SCR-005"
        title="नया खरीद बिल (Purchase Bill)"
        subtitle="New Purchase Bill + GST (HSN & Rate) + Other Information"
        actions={
          <>
            <Button variant="outline" icon={Share2} size="sm">PDF / शेयर करें</Button>
            <Button variant="outline" icon={Printer} size="sm">प्रिंट करें</Button>
            <Button variant="outline" icon={FileText} size="sm">ड्राफ्ट सेव करें</Button>
            <Button variant="primary" icon={Save} size="sm" onClick={() => pushToast('खरीद बिल सफलतापूर्वक सेव हो गया')}>बिल सेव करें</Button>
          </>
        }
      />

      <div className="flex gap-1.5 overflow-x-auto scroll-x mb-5 pb-1">
        {STEPS.map((t, i) => (
          <button
            key={t}
            onClick={() => setStep(i + 1)}
            className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors focus-ring ${
              step === i + 1 ? 'bg-navy-600 text-white border-navy-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === i + 1 ? 'bg-white text-navy-600' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</span>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">1. बिल जानकारी</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="खरीद बिल नंबर" required><Input defaultValue="PB-2025-0015" /></Field>
              <Field label="बिल दिनांक" required><Input type="date" defaultValue="2025-05-17" /></Field>
              <Field label="बिल प्रकार" required><Select defaultValue="Tax Invoice"><option>Tax Invoice</option><option>Retail</option></Select></Field>
              <Field label="खरीद का प्रकार"><Select defaultValue="Taxable Purchase"><option>Taxable Purchase</option><option>Exempt Purchase</option></Select></Field>
            </div>
            <Checkbox className="mt-3" label="रिटेल पर्चेज़ (B2C)" />
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">2. सप्लायर जानकारी</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="सप्लायर का नाम" required><Input defaultValue="Shree Ganesh Traders" /></Field>
              <Field label="मोबाइल नंबर"><Input defaultValue="9876543210" /></Field>
              <Field label="GSTIN (यदि हो)"><Input defaultValue="10ABCDE1234F1Z5" /></Field>
              <Field label="राज्य" required><Select defaultValue="Bihar (10)"><option>Bihar (10)</option></Select></Field>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">3. आइटम विवरण</h3>
            </div>
            <LineItemsTable items={items} onChange={setItems} />
          </Card>

          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">5. अन्य जानकारी</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="ट्रांसपोर्ट नाम (यदि हो)"><Input defaultValue="Shiv Transport" /></Field>
              <Field label="ई-वे बिल नंबर (यदि हो)"><Input defaultValue="4712 9876 1234" /></Field>
              <Field label="वाहन नंबर (यदि हो)"><Input defaultValue="BR01AB1234" /></Field>
              <Field label="भुगतान विधि" required><Select defaultValue="Bank Transfer"><option>Bank Transfer</option><option>Cash</option><option>Cheque</option></Select></Field>
              <Field label="भुगतान शर्त (यदि हो)"><Select defaultValue="7 दिन के भीतर"><option>7 दिन के भीतर</option><option>तुरंत</option><option>30 दिन के भीतर</option></Select></Field>
              <Field label="टिप्पणी (यदि हो)"><Input defaultValue="सामान सही प्राप्त हुआ।" /></Field>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-4">
            <h3 className="font-bold text-slate-800 mb-3">6. अटैचमेंट (कोई दस्तावेज़, फोटो)</h3>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-center cursor-pointer hover:border-brandGreen-400 transition-colors">
              <Paperclip size={22} className="text-brandGreen-600" />
              <span className="text-sm font-medium text-brandGreen-700">दस्तावेज़ जोड़ें</span>
              <span className="text-xs text-slate-400">(फोटो / PDF / Document) अधिकतम साइज़: 10 MB</span>
              <input type="file" className="hidden" />
            </label>
          </Card>

          <Card className="p-4 bg-slate-50">
            <h3 className="font-bold text-slate-800 mb-2 text-sm">नोट:</h3>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>• यह बिल GSTR-3B (ITC) और GSTR-2B / GSTR-1 (HSN Summary) के लिए उपयोग होगा।</li>
              <li>• सभी जानकारी सही भरें।</li>
              <li>• बिल सेव करने के बाद स्टॉक अपने-आप अपडेट हो जाएगा।</li>
            </ul>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="outline" icon={FileText}>ड्राफ्ट के रुप में सेव करें</Button>
            <Button variant="outline">रद्द करें</Button>
            <Button variant="primary" icon={Save} onClick={() => pushToast('खरीद बिल सफलतापूर्वक सेव हो गया')}>बिल सेव करें</Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
