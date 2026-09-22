import React, { useState } from 'react'
import { FileSpreadsheet, Printer, Plus, Paperclip, Save } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { Field, Input, Select, Textarea } from '../components/common/Form'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { numberToWordsINR } from '../utils/format'

const RULES = [
  { n: 1, title: 'Supplier Payment (आपूर्तिकर्ता को भुगतान)', color: 'blue', desc: 'व्यवसाय द्वारा सामान/सेवा के बदले में सप्लायर को भुगतान।', effects: ['संबंधित party का बकाया कम होगा', 'Bank/Cash Ledger कम होगा।'] },
  { n: 2, title: 'Customer Refund (ग्राहक को वापसी)', color: 'purple', desc: 'ग्राहक को अधिक भुगतान या रिफंड देने पर।', effects: ['संबंधित customer का बकाया कम होगा', 'Bank/Cash Ledger कम होगा।'] },
  { n: 3, title: 'Salary Payment (वेतन भुगतान)', color: 'orange', desc: 'कर्मचारियों के वेतन के भुगतान के लिए।', effects: ['P&L में Salary Expense घटेगा', 'Bank/Cash Ledger कम होगा।'] },
  { n: 4, title: 'Other Payment (अन्य भुगतान)', color: 'green', desc: 'किराया, विद्युत बिल, फोन बिल, लोन EMI, टैक्स आदि के लिए।', effects: ['संबंधित Expense खाता घटेगा', 'Bank/Cash Ledger कम होगा।'] },
]

export default function Payment() {
  const { pushToast } = useApp()
  const [source, setSource] = useState('bank')

  return (
    <Layout title="Payment" subtitle="भुगतान दर्ज करें">
      <PageHeader
        code="SCR-010"
        title="भुगतान दर्ज करें (Payment Entry)"
        subtitle="व्यवसाय द्वारा किसी को किए गए भुगतान की जानकारी भरें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm">PDF प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm">नया भुगतान दर्ज करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="1. भुगतान का प्रकार चुनें" required>
                <Select defaultValue="Payment to Supplier (आपूर्तिकर्ता को भुगतान)">
                  <option>Payment to Supplier (आपूर्तिकर्ता को भुगतान)</option>
                  <option>Customer Refund (ग्राहक को वापसी)</option>
                  <option>Salary Payment (वेतन भुगतान)</option>
                  <option>Other Payment (अन्य भुगतान)</option>
                </Select>
                <p className="text-xs text-slate-400 mt-1">आप जिनको भुगतान कर रहे हैं, उनका चयन करें।</p>
              </Field>
              <Field label="2. भुगतान दिनांक" required><Input type="date" defaultValue="2025-05-17" /></Field>
            </div>

            <Field label="3. किसको भुगतान किया" required>
              <Select defaultValue="मनोज ट्रेडर्स (MT0008)"><option>मनोज ट्रेडर्स (MT0008)</option></Select>
              <p className="text-xs text-red-500 mt-1">कुल बकाया शेष: ₹ 48,250.00 (क्रेडिट अवधि समाप्ति: 25/05/2025)</p>
            </Field>

            <Field label="4. किस बिल के लिए भुगतान" required>
              <Select defaultValue="Bill No. 145 - दिनांक 05/05/2025"><option>Bill No. 145 - दिनांक 05/05/2025 | कुल राशि: ₹48,250 | बकाया: ₹48,250</option></Select>
            </Field>

            <Field label="5. भुगतान का माध्यम (Source of Fund)" required>
              <div className="grid grid-cols-2 gap-3">
                <SourceOption label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
                <SourceOption label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              </div>
            </Field>

            {source === 'bank' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="6. बैंक खाता" required>
                  <Select defaultValue="SBI Current A/c - 12345678901"><option>SBI Current A/c - 12345678901</option></Select>
                  <p className="text-xs text-slate-400 mt-1">उपलब्ध शेष: ₹ 1,25,780.00</p>
                </Field>
                <Field label="7. भुगतान का तरीका (Mode of Payment)" required><Select defaultValue="NEFT"><option>NEFT</option><option>RTGS</option><option>UPI</option><option>चेक</option></Select></Field>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="8. भुगतान राशि (₹)" required>
                <Input type="number" defaultValue={48250} />
                <p className="text-xs text-slate-400 mt-1">अंकों में: {numberToWordsINR(48250)}</p>
              </Field>
              <Field label="9. संदर्भ संख्या (Reference No.)"><Input defaultValue="NEFT1234567890" /></Field>
            </div>

            <Field label="10. विवरण (Remarks)"><Textarea rows={2} defaultValue="Invoice No. 145 के भुगतान हेतु" maxLength={150} /></Field>

            <Field label="11. बिल / रसीद अपलोड करें (वैकल्पिक)">
              <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-5 text-center cursor-pointer hover:border-brandGreen-400 transition-colors">
                <Paperclip size={17} className="text-brandGreen-600" />
                <span className="text-xs text-slate-500">फोटो / PDF अपलोड करें (अधिकतम साइज़: 10 MB)</span>
                <input type="file" className="hidden" />
              </label>
            </Field>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline">रद्द करें</Button>
              <Button variant="outline" icon={FileSpreadsheet}>Draft के रूप में सुरक्षित करें</Button>
              <Button variant="primary" icon={Save} className="sm:ml-auto" onClick={() => pushToast('भुगतान सफलतापूर्वक सेव हो गया')}>भुगतान सेव करें</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">भुगतान के प्रकार और उनके नियम</h3>
          {RULES.map((r) => <RuleCard key={r.n} {...r} />)}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-sm font-semibold text-amber-800 mb-1">💡 ध्यान दें</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• यदि आप Cash चुनें हैं, तो Cash Balance से पैसा घटेगा।</li>
              <li>• यदि आप Bank चुनें हैं, तो चुने गए बैंक खाते का Balance घटेगा।</li>
              <li>• यह स्क्रीन पैसा "बाहर जाने" के लिए है।</li>
            </ul>
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

function RuleCard({ n, title, color, desc, effects }) {
  return (
    <Card className={`p-4 border ${RULE_COLORS[color]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold">{n}</span>
        <p className="font-bold text-sm">{title}</p>
      </div>
      <p className="text-xs mb-1.5 opacity-90">{desc}</p>
      <p className="text-xs font-semibold mb-1">सिस्टम प्रभाव:</p>
      <ul className="text-xs opacity-90 space-y-0.5">{effects.map((e) => <li key={e}>→ {e}</li>)}</ul>
    </Card>
  )
}
