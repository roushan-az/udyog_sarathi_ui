import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Check } from 'lucide-react'
import Logo from '../components/common/Logo'
import { Field, Input, Select, Checkbox } from '../components/common/Form'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import shopIllustration from '../assets/illus-my-business.png'

const STEPS = ['कंपनी जानकारी', 'पता जानकारी', 'व्यवसाय विवरण', 'अतिरिक्त जानकारी', 'पूरी करें']
const STEP_TITLES = ['कंपनी जानकारी', 'पता जानकारी', 'व्यवसाया विवरण', 'अतिरिक्त जानकारी', 'पूरी करें']

const initialForm = {
  companyName: '', companyType: '', ownerName: '', mobile: '',
  address: '', state: '', district: '', city: '', pincode: '',
  businessType: '', mainProduct: '', startDate: '', gst: '',
  pan: '', bankName: '', fyStart: '', confirm: false,
}

export default function CompanySetup() {
  const [step, setStep] = useState(1)
  const [showMobileIntro, setShowMobileIntro] = useState(true)
  const [form, setForm] = useState(initialForm)
  const navigate = useNavigate()
  const { setOnboardingCompleted } = useApp()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target?.type === 'checkbox' ? e.target.checked : e.target.value }))
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const back = () => setStep((s) => Math.max(s - 1, 1))
  const finish = () => {
    setOnboardingCompleted(true)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      {/* ===================== MOBILE (portrait) ===================== */}
      <div className="lg:hidden w-full max-w-sm bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        {showMobileIntro ? (
          <div className="p-6 flex flex-col items-center text-center gap-4">
            <Logo />
            <h2 className="text-lg font-bold text-slate-800 mt-2">आइए, आपका व्यवसाय सेटअप करें</h2>
            <p className="text-sm text-slate-500">कुछ आसान जानकारी भरें और अपना व्यवसाय ऐप में शुरू करें।</p>
            <img src={shopIllustration} alt="" className="w-44 h-auto my-2" />
            <Button variant="primary" size="lg" className="w-full" onClick={() => setShowMobileIntro(false)}>शुरू करें</Button>
          </div>
        ) : (
          <>
            <div className="px-5 pt-5 flex items-center justify-center gap-1.5">
              {STEPS.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${i + 1 === step ? 'w-6 bg-brandGreen-600' : 'w-1.5 bg-slate-200'}`} />
              ))}
            </div>
            <div className="p-5">
              {step < 5 && <h3 className="text-base font-bold text-slate-800 mb-4">{STEP_TITLES[step - 1]}</h3>}
              <StepFields step={step} form={form} update={update} stacked />
              {step < 5 ? (
                <div className="flex items-center gap-2 mt-6">
                  <Button variant="outline" className="flex-1" onClick={back} disabled={step === 1}>वापस</Button>
                  {step < 4 ? (
                    <Button variant="primary" className="flex-1" onClick={next}>आगे</Button>
                  ) : (
                    <Button variant="primary" className="flex-1" onClick={() => setStep(5)}>सेव करें और आगे बढ़ें</Button>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <Button variant="primary" size="lg" className="w-full" onClick={finish}>Home Screen पर जाएं</Button>
                </div>
              )}
            </div>
          </>
        )}
        {!showMobileIntro && step < 5 && (
          <div className="px-5 pb-5 text-xs text-slate-400">ⓘ नोट: * वाले फ़ील्ड आवश्यक हैं। आप बाद में Settings से जानकारी बदल सकते हैं।</div>
        )}
      </div>

      {/* ===================== DESKTOP (landscape) ===================== */}
      <div className="hidden lg:block w-full max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          {step < 5 ? (
            <p className="text-sm font-semibold text-brandGreen-700 flex items-center gap-1.5">
              <span className="text-brandGreen-600">➜</span> Step - {step} ({STEP_TITLES[step - 1]})
            </p>
          ) : <span />}
          <Logo size="sm" />
        </div>

        <div className="flex items-start gap-5">
          <div className="w-60 shrink-0 rounded-xl border border-slate-200 bg-white p-3 space-y-1">
            {STEPS.map((label, i) => {
              const idx = i + 1
              const active = idx === step
              return (
                <div key={label} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-brandGreen-600 text-white' : 'text-slate-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${active ? 'bg-white text-brandGreen-700' : 'bg-slate-100 text-slate-400'}`}>
                    {idx}
                  </span>
                  {label}
                </div>
              )
            })}
          </div>

          <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6">
            {step === 5 ? (
              <div className="flex flex-col items-center text-center gap-3 py-8">
                <CheckCircle2 size={56} className="text-brandGreen-600" />
                <h3 className="text-lg font-bold text-slate-800">बधाई हो!</h3>
                <p className="text-sm text-slate-500 max-w-sm">आपकी कंपनी / व्यवसाय की जानकारी सफलतापूर्वक सेव हो गई है। अब आप ऐप का उपयोग शुरू कर सकते हैं।</p>
                <Button variant="primary" size="lg" onClick={finish} className="mt-2">Home Screen पर जाएं (SCR-003)</Button>
              </div>
            ) : (
              <>
                <StepFields step={step} form={form} update={update} />
                <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={step === 1 ? undefined : back}>{step === 1 ? 'रद्द करें' : 'वापस'}</Button>
                  {step < 4 ? (
                    <Button variant="primary" onClick={next}>आगे</Button>
                  ) : (
                    <Button variant="primary" onClick={() => setStep(5)}>सेव करें और आगे बढ़ें</Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {step < 5 && (
          <p className="text-xs text-slate-400 mt-3">ⓘ नोट: * वाले फ़ील्ड आवश्यक हैं। आप बाद में Settings से जानकारी बदल सकते हैं।</p>
        )}
      </div>
    </div>
  )
}

// Field sets for each step. `stacked` = mobile (single column); desktop uses the
// exact multi-column layout shown in SCR-002's desktop panel.
function StepFields({ step, form, update, stacked = false }) {
  const grid2 = stacked ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-4'
  const grid4 = stacked ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-4 gap-4'

  if (step === 1) {
    return (
      <div className={grid2}>
        <Field label="कंपनी / व्यवसाय का नाम" required>
          <Input placeholder="नाम दर्ज करें" value={form.companyName} onChange={update('companyName')} />
        </Field>
        <Field label="कंपनी का प्रकार" required>
          <Select value={form.companyType} onChange={update('companyType')}>
            <option value="">चुनें</option>
            <option>एकल स्वामी (Proprietorship)</option>
            <option>पार्टनरशिप</option>
            <option>प्राइवेट लिमिटेड</option>
            <option>अन्य</option>
          </Select>
        </Field>
        <Field label="मालिक का नाम" required>
          <Input placeholder="नाम दर्ज करें" value={form.ownerName} onChange={update('ownerName')} />
        </Field>
        <Field label="मोबाइल नंबर" required>
          <Input placeholder="मोबाइल नंबर दर्ज करें" value={form.mobile} onChange={update('mobile')} />
        </Field>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <Field label="दुकान / कार्यालय का पता" required>
          <Input placeholder="पूरा पता दर्ज करें" value={form.address} onChange={update('address')} />
        </Field>
        <div className={grid4}>
          <Field label="राज्य" required>
            <Select value={form.state} onChange={update('state')}>
              <option value="">चुनें</option>
              <option>Bihar</option>
              <option>Uttar Pradesh</option>
              <option>Delhi</option>
              <option>Maharashtra</option>
            </Select>
          </Field>
          <Field label="जिला" required>
            <Select value={form.district} onChange={update('district')}>
              <option value="">चुनें</option>
              <option>Patna</option>
              <option>Gaya</option>
              <option>Muzaffarpur</option>
            </Select>
          </Field>
          <Field label="शहर / गाँव" required>
            <Input placeholder="नाम दर्ज करें" value={form.city} onChange={update('city')} />
          </Field>
          <Field label="पिन कोड" required>
            <Input placeholder="पिन कोड दर्ज करें" value={form.pincode} onChange={update('pincode')} />
          </Field>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className={grid2}>
        <Field label="व्यवसाय का प्रकार" required>
          <Select value={form.businessType} onChange={update('businessType')}>
            <option value="">चुनें</option>
            <option>व्यापार (Trading)</option>
            <option>सेवा (Service)</option>
            <option>निर्माण (Manufacturing)</option>
          </Select>
        </Field>
        <Field label="मुख्य उत्पाद / सेवा">
          <Input placeholder="उदाहरण: कपड़ा, किराना, मोबाइल आदि" value={form.mainProduct} onChange={update('mainProduct')} />
        </Field>
        <Field label="व्यवसाय शुरू करने की तारीख" required>
          <Input type="date" value={form.startDate} onChange={update('startDate')} />
        </Field>
        <Field label="GST नंबर (यदि है)">
          <Input placeholder="GST नंबर दर्ज करें" value={form.gst} onChange={update('gst')} />
        </Field>
      </div>
    )
  }

  // step === 4
  return (
    <div className="space-y-4">
      <div className={grid2}>
        <Field label="PAN नंबर (यदि है)">
          <Input placeholder="PAN नंबर दर्ज करें" value={form.pan} onChange={update('pan')} />
        </Field>
        <Field label="बैंक खाता (यदि है)">
          <Select value={form.bankName} onChange={update('bankName')}>
            <option value="">बैंक का नाम चुनें</option>
            <option>SBI</option>
            <option>HDFC</option>
            <option>ICICI</option>
            <option>PNB</option>
          </Select>
        </Field>
      </div>
      <Field label="वित्तीय वर्ष प्रारंभ माह" required>
        <Select value={form.fyStart} onChange={update('fyStart')}>
          <option value="">चुनें (उदा. अप्रैल)</option>
          <option>अप्रैल</option>
          <option>जनवरी</option>
        </Select>
      </Field>
      <Checkbox
        label="मैं ऊपर दी गई जानकारी सही है और इसे भविष्य में उपयोग के लिए सेव करना चाहता हूँ।"
        checked={form.confirm}
        onChange={update('confirm')}
      />
    </div>
  )
}
