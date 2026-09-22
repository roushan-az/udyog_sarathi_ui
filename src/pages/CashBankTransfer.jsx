import React, { useState } from 'react'
import { FileSpreadsheet, Printer, Plus, Paperclip, Save, CheckCircle2, Phone } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Field, Input, Select, Textarea } from '../components/common/Form'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { formatDateDMY, numberToWordsINR } from '../utils/format'

const TRANSFER_TYPES = [
  { key: 'Cash Deposit (नकद जमा)', label: 'Cash Deposit (नकद जमा)' },
  { key: 'Cash Withdrawal (नकद निकासी)', label: 'Cash Withdrawal (नकद निकासी)' },
  { key: 'Bank Transfer (बैंक ट्रांसफर)', label: 'Bank Transfer (बैंक ट्रांसफर)' },
  { key: 'Cheque Deposit (चेक जमा)', label: 'Cheque Deposit (चेक जमा)' },
  { key: 'Cheque Withdrawal (चेक निकासी)', label: 'Cheque Withdrawal (चेक निकासी)' },
]

export default function CashBankTransfer() {
  const { pushToast } = useApp()
  const [mode, setMode] = useState(TRANSFER_TYPES[0].key)

  return (
    <Layout title="Cash & Bank Transfer" subtitle="नकद / बैंक स्थानांतरण">
      <PageHeader
        code="SCR-011"
        title="नकद / बैंक स्थानांतरण (Cash & Bank Transfer)"
        subtitle="कैश और बैंक खातों के बीच पैसे को स्थानांतरित करें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm">PDF प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm">नया स्थानांतरण करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="1. दिनांक" required><Input type="date" defaultValue="2025-05-17" /></Field>
              <Field label="2. From (कहाँ से)" required><Select defaultValue="नकद (Cash)"><option>नकद (Cash)</option><option>SBI Current A/c - 12345678901</option></Select></Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Field label="3. To (कहाँ तक)" required><Select defaultValue="SBI Current A/c - 12345678901"><option>SBI Current A/c - 12345678901</option><option>नकद (Cash)</option></Select></Field>
              <p className="text-xs text-brandGreen-700 bg-emerald-50 rounded-lg px-3 py-2.5 flex items-center gap-1.5"><CheckCircle2 size={14} /> From और To एक जैसा नहीं हो सकता।</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="4. राशि (₹)" required>
                <Input type="number" defaultValue={25000} />
                <p className="text-xs text-slate-400 mt-1">अंकों में: {numberToWordsINR(25000)}</p>
              </Field>
              <Field label="5. स्थानांतरण का प्रकार" required>
                <Select value={mode} onChange={(e) => setMode(e.target.value)}>
                  {TRANSFER_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                </Select>
              </Field>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">6. माध्यम</p>
              <div className="space-y-2">
                {TRANSFER_TYPES.map((t) => (
                  <label key={t.key} className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm cursor-pointer ${mode === t.key ? 'border-brandGreen-500 bg-brandGreen-50 text-brandGreen-700' : 'border-slate-200 text-slate-600'}`}>
                    <input type="radio" name="mode" checked={mode === t.key} onChange={() => setMode(t.key)} className="text-brandGreen-600 focus-ring" />
                    {t.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="7. संदर्भ संख्या (Reference No.)" hint="उदाहरण: CD20250517001 / TRF123456"><Input defaultValue="CD20250517001" /></Field>
              <Field label="8. विवरण (Remarks)"><Textarea rows={2} defaultValue="नकद राशि SBI बैंक में जमा किया।" maxLength={150} /></Field>
            </div>

            <Field label="9. बिल /स्लिप अपलोड करें (वैकल्पिक)">
              <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-5 text-center cursor-pointer hover:border-brandGreen-400 transition-colors">
                <Paperclip size={17} className="text-brandGreen-600" />
                <span className="text-xs text-slate-500">फोटो / PDF / Document अपलोड करें (अधिकतम साइज़: 10 MB)</span>
                <input type="file" className="hidden" />
              </label>
            </Field>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline">रद्द करें</Button>
              <Button variant="outline" icon={FileSpreadsheet}>Draft के रूप में सुरक्षित करें</Button>
              <Button variant="primary" icon={Save} className="sm:ml-auto" onClick={() => pushToast('स्थानांतरण सफलतापूर्वक सहेजा गया')}>स्थानांतरण सहेजें</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 border-emerald-200 bg-emerald-50">
            <p className="font-bold text-sm text-emerald-800 mb-1.5">✅ यह क्या है?</p>
            <p className="text-xs text-emerald-700">यह पैसा कहीं से कहीं भेजने का लेन-देन है। इसमें और कोई आय नहीं आती, न लाभ न हानि।</p>
          </Card>

          <Card className="p-4">
            <p className="font-bold text-sm text-slate-800 mb-1.5">📄 उदाहरण</p>
            <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
              <li>नकद को बैंक में जमा करना</li>
              <li>बैंक से नकद निकालना</li>
              <li>एक बैंक खाते से दूसरे बैंक खाते में भेजना</li>
              <li>करंट अकाउंट से सेविंग अकाउंट में भेजना</li>
            </ul>
          </Card>

          <Card className="p-4 border-purple-200 bg-purple-50">
            <p className="font-bold text-sm text-purple-800 mb-1.5">❓ ध्यान दें</p>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>From और To एक जैसा नहीं हो सकता।</li>
              <li>यह लेन-देन आपके Cash Balance और Bank Balance को अपडेट करेगा।</li>
              <li>P&L पर कोई प्रभाव नहीं पड़ेगा।</li>
            </ul>
          </Card>

          <Card className="p-4 border-amber-200 bg-amber-50">
            <p className="font-bold text-sm text-amber-800 mb-1.5">💡 कैसे काम करता है?</p>
            <div className="text-xs text-amber-700 space-y-1.5">
              <p className="font-semibold">Cash → Bank</p>
              <p>नकद से बैंक में जमा — Cash घटेगा (-), Bank बढ़ेगा (+)</p>
              <p className="font-semibold pt-1">Bank → Cash</p>
              <p>बैंक से नकद निकासी — Cash बढ़ेगा (+), Bank घटेगा (-)</p>
              <p className="font-semibold pt-1">Bank → Bank</p>
              <p>एक बैंक से दूसरे में भेजना — पहले Bank से घटेगा (-), दूसरे में बढ़ेगा (+)</p>
            </div>
          </Card>

          <Card className="p-4 border-red-200 bg-red-50 text-center">
            <p className="font-bold text-sm text-red-700 mb-1">🎧 सहायता चाहिए?</p>
            <p className="text-xs text-red-600 mb-2">कोई समस्या हो तो हमसे संपर्क करें।</p>
            <a href="tel:18001234567" className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700"><Phone size={14} /> 1800-123-4567</a>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
