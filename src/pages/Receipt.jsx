import React, { useState } from 'react'
import { FileSpreadsheet, Printer, Plus, Paperclip, Save, UserPlus } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Field, Input, Select, Textarea } from '../components/common/Form'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

const RULES = [
  { n: 1, title: 'Customer Receipt (ग्राहक से प्राप्ति)', color: 'blue', desc: 'ग्राहक से माल/सेवा की बिक्री पर प्राप्त राशि।', examples: ['प्रोडक्ट बिक्री का भुगतान', 'सर्विस का भुगतान', 'एडवांस प्राप्ति'], effects: ['यह राशि आपके व्यवसाय में आएगी', 'बैंक/नकद बुक अपडेट होगी', 'P&L में शामिल नहीं होगी (जब तक यह अन्य आय न हो)।'] },
  { n: 2, title: 'Other Income (अन्य आय)', color: 'purple', desc: 'व्यवसाय से संबंधित अन्य आय जैसे:', examples: ['ब्याज प्राप्ति', 'किराया प्राप्ति', 'डिस्काउंट प्राप्ति', 'कमीशन प्राप्ति', 'अन्य आय'], effects: ['यह राशि व्यवसाय में आएगी', 'P&L (Other Income) में शामिल होगी।'] },
  { n: 3, title: 'Loan Received (ऋण प्राप्ति)', color: 'orange', desc: 'जब आपने किसी व्यक्ति, संस्था या बैंक से ऋण प्राप्त किया हो।', examples: ['मित्र/रिश्तेदार से ऋण', 'बैंक लोन', 'संस्था/फाइनेंस कंपनी से ऋण'], effects: ['यह राशि व्यवसाय में आएगी', 'Liability (Loan Account) में दर्ज होगी', 'P&L में शामिल नहीं होगी।'] },
  { n: 4, title: 'Owner Fund Addition (मालिक द्वारा पैसा लगाना)', color: 'green', desc: 'जब मालिक अपने व्यक्तिगत धन को व्यवसाय में लगाता है।', examples: ['कैश डालना', 'बैंक ट्रांसफर करना', 'अतिरिक्त पूंजी लगाना'], effects: ['यह राशि Capital Account में जाएगी', 'P&L को प्रभावित नहीं करेगी', 'व्यवसाय की वित्तीय स्थिति मजबूत करेगी।'] },
]

export default function Receipt() {
  const { pushToast } = useApp()
  const [source, setSource] = useState('bank')

  return (
    <Layout title="Receipt" subtitle="प्राप्ति दर्ज करें">
      <PageHeader
        code="SCR-009"
        title="प्राप्ति दर्ज करें (Receipt Entry)"
        subtitle="व्यवसाय में प्राप्त होने वाली राशि की जानकारी भरें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm">PDF प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm">नई प्राप्ति दर्ज करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-5 space-y-4">
            <Field label="1. प्राप्ति का प्रकार चुनें" required>
              <Select defaultValue="Customer Receipt (ग्राहक से प्राप्ति)">
                <option>Customer Receipt (ग्राहक से प्राप्ति)</option>
                <option>Other Income (अन्य आय)</option>
                <option>Loan Received (ऋण प्राप्ति)</option>
                <option>Owner Fund Addition (मालिक द्वारा पैसा लगाना)</option>
              </Select>
              <p className="text-xs text-slate-400 mt-1">यह प्राप्ति आपके व्यवसाय में ग्राहक से मिली राशि की दर्शाती है।</p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="2. प्राप्ति दिनांक" required><Input type="date" defaultValue="2025-05-17" /></Field>
              <Field label="3. प्राप्त राशि (₹)" required>
                <Input type="number" defaultValue={25000} />
                <p className="text-xs text-slate-400 mt-1">{numberToWordsINR(25000)}</p>
              </Field>
            </div>

            <Field label="4. किससे प्राप्त हुआ" required>
              <div className="flex gap-2">
                <Input defaultValue="रवि ट्रेडर्स" className="flex-1" />
                <Button variant="outline" icon={UserPlus} size="sm" />
              </div>
            </Field>

            <Field label="5. भुगतान का माध्यम (Source of Fund)" required>
              <div className="grid grid-cols-2 gap-3">
                <SourceOption label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
                <SourceOption label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              </div>
              {source === 'bank' && <p className="text-xs text-brandGreen-700 mt-2">✓ बैंक से राशि प्राप्त होने पर Bank Book अपडेट होगी।</p>}
            </Field>

            {source === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="6. बैंक खाता" required><Select defaultValue="SBI Current A/c - 12345678901"><option>SBI Current A/c - 12345678901</option></Select></Field>
                <Field label="7. प्राप्ति का तरीका (Mode of Receipt)" required><Select defaultValue="NEFT"><option>NEFT</option><option>RTGS</option><option>UPI</option><option>चेक</option></Select></Field>
              </div>
            )}

            <Field label="8. विवरण (Remarks)"><Textarea rows={2} defaultValue="Invoice No. 145 के भुगतान के रूप में प्राप्ति" maxLength={150} /></Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="9. बिल/दस्तावेज़ अपलोड करें (वैकल्पिक)">
                <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-5 text-center cursor-pointer hover:border-brandGreen-400 transition-colors">
                  <Paperclip size={17} className="text-brandGreen-600" />
                  <span className="text-xs text-slate-500">फोटो / PDF / Document (अधिकतम 10 MB)</span>
                  <input type="file" className="hidden" />
                </label>
              </Field>
              <Field label="10. नोट (वैकल्पिक)"><Textarea rows={2} placeholder="कोई अतिरिक्त जानकारी" maxLength={150} /></Field>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline">रद्द करें</Button>
              <Button variant="outline" icon={FileSpreadsheet}>Draft के रूप में सुरक्षित करें</Button>
              <Button variant="primary" icon={Save} className="sm:ml-auto" onClick={() => pushToast('प्राप्ति सफलतापूर्वक सेव हो गई')}>प्राप्ति सेव करें</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">प्राप्ति के प्रकार और उनके नियम</h3>
          {RULES.map((r) => <RuleCard key={r.n} {...r} />)}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-sm font-semibold text-amber-800 mb-1">💡 ध्यान दें</p>
            <p className="text-xs text-amber-700">व्यय (Expense) यानी पैसा बाहर जाना SCR-008 में दर्ज करें। यहाँ केवल प्राप्ति (Money In) के लिए है।</p>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

function SourceOption({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium focus-ring ${
        active ? 'border-brandGreen-500 bg-brandGreen-50 text-brandGreen-700' : 'border-slate-200 text-slate-600'
      }`}
    >
      {label}
      {active && <span className="w-4 h-4 rounded-full bg-brandGreen-600 text-white flex items-center justify-center text-[10px]">✓</span>}
    </button>
  )
}

const RULE_COLORS = {
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  purple: 'border-purple-200 bg-purple-50 text-purple-700',
  orange: 'border-orange-200 bg-orange-50 text-orange-700',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

function RuleCard({ n, title, color, desc, examples, effects }) {
  return (
    <Card className={`p-4 border ${RULE_COLORS[color]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold">{n}</span>
        <p className="font-bold text-sm">{title}</p>
      </div>
      <p className="text-xs mb-1.5 opacity-90">{desc}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <p className="text-xs font-semibold mb-1">उदाहरण:</p>
          <ul className="text-xs opacity-90 list-disc pl-4">{examples.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
        <div>
          <p className="text-xs font-semibold mb-1">सिस्टम प्रभाव:</p>
          <ul className="text-xs opacity-90 space-y-0.5">{effects.map((e) => <li key={e}>→ {e}</li>)}</ul>
        </div>
      </div>
    </Card>
  )
}
