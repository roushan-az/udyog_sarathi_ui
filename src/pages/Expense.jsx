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
  {
    n: 1, title: 'Operational Expense (व्यावसायिक खर्च)', color: 'blue',
    desc: 'जो खर्च आपके व्यवसाय के दैनिक संचालन में होता है।',
    examples: ['किराया, बिजली, वेतन, इंटरनेट, फोन, पेट्रोल, स्टेशनरी, अन्य खर्च'],
    effect: 'यह खर्च सीधे P&L (लाभ-हानि) खाते में चलेगा।',
  },
  {
    n: 2, title: 'Capital Expenditure (पूंजीगत खर्च)', color: 'purple',
    desc: 'जो लंबे समय तक उपयोग होने वाली संपत्ति खरीदने पर किया गया खर्च है।',
    examples: ['मशीन, कंप्यूटर, फर्नीचर, AC / वाहन, ऑफिस सेटअप, अन्य स्थायी सामान'],
    effect: 'यह खर्च Assets (संपत्ति) में जाएगा। आगे चलकर इस पर अवमूल्यन (Depreciation) लागू होगा (Version 2.0 से)।',
  },
  {
    n: 3, title: 'Personal Expense (व्यक्तिगत खर्च / व्यवसाय से निकासी)', color: 'orange',
    desc: 'यह खर्च घर या निजी उपयोग के लिए व्यवसाय से निकाला गया पैसा है।',
    examples: ['घर का राशन, बच्चों की फीस, परिवार यात्रा, व्यक्तिगत खर्च, चिकित्सा खर्च'],
    effect: 'यह खर्च Withdrawal Ledger (निकासी खाता) में जाएगा। यह P&L में नहीं जाएगा। यह Asset में भी नहीं जाएगा।',
  },
]

export default function Expense() {
  const { pushToast } = useApp()
  const [source, setSource] = useState('cash')

  return (
    <Layout title="Expense" subtitle="खर्च दर्ज करें">
      <PageHeader
        code="SCR-008"
        title="खर्च दर्ज करें (Expense Entry)"
        subtitle="खर्च का विवरण और जानकारी भरें"
        actions={
          <>
            <Button variant="outline" icon={FileSpreadsheet} size="sm">Excel में निर्यात करें</Button>
            <Button variant="outline" icon={Printer} size="sm">PDF प्रिंट करें</Button>
            <Button variant="primary" icon={Plus} size="sm">नया खर्च दर्ज करें</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card className="p-5 space-y-4">
            <Field label="1. खर्च का प्रकार चुनें" required>
              <Select defaultValue="Operational Expense (व्यावसायिक खर्च)">
                <option>Operational Expense (व्यावसायिक खर्च)</option>
                <option>Capital Expenditure (पूंजीगत खर्च)</option>
                <option>Personal Expense (व्यक्तिगत खर्च)</option>
              </Select>
              <p className="text-xs text-slate-400 mt-1">यह खर्च आपके व्यवसाय के दैनिक संचालन से संबंधित है।</p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="2. खर्च दिनांक" required><Input type="date" defaultValue="2025-05-17" /></Field>
              <Field label="3. खर्च श्रेणी" required>
                <Select defaultValue="किराया (Rent)"><option>किराया (Rent)</option><option>बिजली (Electricity)</option><option>वेतन (Salary)</option><option>इंटरनेट/फोन</option></Select>
              </Field>
            </div>

            <Field label="4. खर्च विवरण" required><Textarea rows={2} placeholder="उदाहरण: मई महीने का दुकान का किराया" maxLength={150} /></Field>
            <Field label="5. किसको भुगतान किया" required><Input defaultValue="मकान मालिक" /></Field>

            <Field label="6. भुगतान का माध्यम (Source of Fund)" required>
              <div className="grid grid-cols-2 gap-3">
                <SourceOption label="नकद (Cash)" active={source === 'cash'} onClick={() => setSource('cash')} />
                <SourceOption label="बैंक (Bank)" active={source === 'bank'} onClick={() => setSource('bank')} />
              </div>
              <p className="text-xs text-slate-400 mt-2">{source === 'cash' ? 'नकद चुनने पर Cash Book अपडेट होगा।' : 'बैंक चुनने पर Bank Book अपडेट होगा।'}</p>
            </Field>

            <Field label="7. कुल राशि (₹)" required>
              <Input type="number" defaultValue={12500} />
              <p className="text-xs text-slate-400 mt-1">{numberToWordsINR(12500)}</p>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="8. बिल/रसीद अपलोड करें (वैकल्पिक)">
                <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-5 text-center cursor-pointer hover:border-brandGreen-400 transition-colors">
                  <Paperclip size={17} className="text-brandGreen-600" />
                  <span className="text-xs text-slate-500">फोटो / PDF / Document अपलोड करें (अधिकतम साइज़: 10 MB)</span>
                  <input type="file" className="hidden" />
                </label>
              </Field>
              <Field label="9. नोट (वैकल्पिक)"><Textarea rows={2} placeholder="कोई अतिरिक्त जानकारी" maxLength={150} /></Field>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button variant="outline" className="sm:order-1">रद्द करें</Button>
              <Button variant="outline" icon={FileSpreadsheet} className="sm:order-2">Draft के रूप में सुरक्षित करें</Button>
              <Button variant="primary" icon={Save} className="sm:order-3 sm:ml-auto" onClick={() => pushToast('खर्च सफलतापूर्वक सेव हो गया')}>खर्च सेव करें</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-800">खर्च के प्रकार और उनके नियम</h3>
          {RULES.map((r) => (
            <RuleCard key={r.n} {...r} />
          ))}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <p className="text-sm font-semibold text-amber-800 mb-1">💡 ध्यान दें</p>
            <p className="text-xs text-amber-700">Owner Fund Addition (मालिक द्वारा पैसा लगाना) Receipt (SCR-009) में दर्ज किया जाएगा क्योंकि यह पैसा व्यवसाय में आता है, न कि जाता है।</p>
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
}

function RuleCard({ n, title, color, desc, examples, effect }) {
  return (
    <Card className={`p-4 border ${RULE_COLORS[color]}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold">{n}</span>
        <p className="font-bold text-sm">{title}</p>
      </div>
      <p className="text-xs mb-1.5 opacity-90">{desc}</p>
      <p className="text-xs font-semibold mb-1">उदाहरण:</p>
      <ul className="text-xs opacity-90 list-disc pl-4 mb-2">
        {examples.map((e) => <li key={e}>{e}</li>)}
      </ul>
      <p className="text-xs font-semibold mb-1">सिस्टम प्रभाव:</p>
      <p className="text-xs opacity-90">→ {effect}</p>
    </Card>
  )
}
