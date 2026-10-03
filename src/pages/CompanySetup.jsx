import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Logo from '../components/common/Logo'
import { Field, Input, Select, Checkbox } from '../components/common/Form'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import shopIllustration from '../assets/illus-my-business.png'

const STEPS = ['कंपनी जानकारी', 'पता जानकारी', 'व्यवसाय विवरण', 'अतिरिक्त जानकारी', 'पूरी करें']
const STEP_TITLES = ['कंपनी जानकारी', 'पता जानकारी', 'व्यवसाय विवरण', 'अतिरिक्त जानकारी', 'पूरी करें']

// Phone screen titles (prototype): the intro is "Step 1", so the 5-dot progress shows form step + 1.
const MOBILE_TITLES = ['कंपनी / व्यवसाय की जानकारी', 'पता जानकारी', 'व्यवसाय विवरण', 'अतिरिक्त जानकारी']

const NAVY = 'text-[#1b2a5c]'
const GREEN_BG = 'bg-[#0b7a3e] hover:bg-[#096a35]'

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
    <div className="min-h-screen bg-white lg:bg-slate-50">
      {/* ===================== MOBILE (portrait) — full screen, like the prototype phones ===================== */}
      <div className="lg:hidden relative mx-auto w-full max-w-[480px] h-screen h-[100dvh] bg-white flex flex-col overflow-hidden">
        {showMobileIntro ? (
          <>
            {/* Step 1 : intro */}
            <div className="flex-1 overflow-y-auto px-6 pt-14">
              <div className="w-[82%]">
                <Logo variant="stacked" size="xl" className="!w-full" />
              </div>
              <h2 className={`mt-8 text-[19px] font-bold leading-snug ${NAVY}`}>आइए, आपका व्यवसाय सेटअप करें</h2>
              <p className={`mt-3 text-[14px] leading-6 font-medium ${NAVY}`}>
                कुछ आसान जानकारी भरें और अपना व्यवसाय ऐप में शुरू करें।
              </p>
              {/* The PNG has grey vertical lines baked into its right edge. Crop the image to a
                  window centred on the shop (1.5%-78.5% of its width) and centre that window. */}
              <div className="mt-6 mx-auto w-[60%] overflow-hidden">
                <img
                  src={shopIllustration}
                  alt=""
                  className="block h-auto"
                  style={{ width: '129.9%', maxWidth: 'none', marginLeft: '-1.95%' }}
                />
              </div>
            </div>
            <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setShowMobileIntro(false)}
                className={`w-full h-12 rounded-lg text-white text-base font-bold ${GREEN_BG}`}
              >
                शुरू करें
              </button>
            </div>
          </>
        ) : step === 5 ? (
          <>
            {/* Finished */}
            <div className="pt-[max(2rem,env(safe-area-inset-top))]">
              <MobileStepper reached={5} />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 px-8">
              <CheckCircle2 size={64} className="text-[#0b7a3e]" />
              <h3 className={`text-xl font-bold ${NAVY}`}>बधाई हो!</h3>
              <p className="text-sm text-slate-500">आपकी कंपनी / व्यवसाय की जानकारी सफलतापूर्वक सेव हो गई है। अब आप ऐप का उपयोग शुरू कर सकते हैं।</p>
            </div>
            <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-3 bg-white">
              <button
                type="button"
                onClick={back}
                className={`flex-1 h-12 rounded-lg border border-slate-300 bg-white text-base font-bold ${NAVY}`}
              >
                वापस
              </button>
              <button type="button" onClick={finish} className={`flex-[2] h-12 rounded-lg text-white text-base font-bold ${GREEN_BG}`}>
                Home Screen पर जाएं
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Steps 2-5 : title + progress, scrolling fields, buttons pinned to the bottom */}
            <div className="pt-[max(2rem,env(safe-area-inset-top))] pb-2 px-5">
              <h3 className={`text-center text-[19px] font-bold ${NAVY}`}>{MOBILE_TITLES[step - 1]}</h3>
              <div className="mt-4"><MobileStepper reached={step + 1} /></div>
            </div>
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 pt-3 pb-3 [&_label]:text-[13px] [&_label]:font-semibold [&_label]:text-[#1b2a5c] [&_input:not([type=checkbox])]:h-11 [&_select]:h-11 [&_input]:rounded-lg [&_select]:rounded-lg [&_input]:text-sm [&_select]:text-sm">
              <StepFields step={step} form={form} update={update} stacked />
            </div>
            <div className="px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-3 bg-white">
              <button
                type="button"
                onClick={step === 1 ? () => setShowMobileIntro(true) : back}
                className={`flex-1 h-12 rounded-lg border border-slate-300 bg-white text-base font-bold ${NAVY}`}
              >
                वापस
              </button>
              <button
                type="button"
                onClick={step < 4 ? next : () => setStep(5)}
                className={`${step < 4 ? 'flex-1' : 'flex-[2]'} h-12 rounded-lg text-white text-base font-bold ${GREEN_BG}`}
              >
                {step < 4 ? 'आगे' : 'सेव करें और आगे बढ़ें'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ===================== DESKTOP (landscape) ===================== */}
      <div className="hidden lg:flex lg:flex-col w-full min-h-screen px-8 xl:px-14 py-6">
        <div className="flex items-center justify-between mb-5">
          {step < 5 ? (
            <p className="text-base font-semibold text-brandGreen-700 flex items-center gap-1.5">
              <span className="text-brandGreen-600">➜</span> Step - {step} ({STEP_TITLES[step - 1]})
            </p>
          ) : <span />}
          <Logo size="md" />
        </div>

        <div className="flex flex-1 items-stretch gap-6">
          <div className="w-64 xl:w-72 shrink-0 rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            {STEPS.map((label, i) => {
              const idx = i + 1
              const active = idx === step
              return (
                <div key={label} className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-base font-medium transition-colors ${active ? 'bg-brandGreen-600 text-white' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${active ? 'bg-white text-brandGreen-700' : 'bg-slate-100 text-slate-400'}`}>
                    {idx}
                  </span>
                  {label}
                </div>
              )
            })}
          </div>

          <div className="flex-1 flex flex-col rounded-xl border border-slate-200 bg-white p-8 xl:p-10 text-base [&_input:not([type=checkbox])]:h-12 [&_select]:h-12 [&_input]:text-base [&_select]:text-base">
            {step === 5 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center gap-3 py-8">
                <CheckCircle2 size={56} className="text-brandGreen-600" />
                <h3 className="text-lg font-bold text-slate-800">बधाई हो!</h3>
                <p className="text-sm text-slate-500 max-w-sm">आपकी कंपनी / व्यवसाय की जानकारी सफलतापूर्वक सेव हो गई है। अब आप ऐप का उपयोग शुरू कर सकते हैं।</p>
                <div className="flex items-center gap-3 mt-2">
                  <Button variant="outline" size="lg" onClick={back}>वापस</Button>
                  <Button variant="primary" size="lg" onClick={finish}>Home Screen पर जाएं (SCR-003)</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <StepFields step={step} form={form} update={update} />
                </div>
                <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-slate-100">
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
          <p className="text-sm text-slate-400 mt-4">ⓘ नोट: * वाले फ़ील्ड आवश्यक हैं। आप बाद में Settings से जानकारी बदल सकते हैं।</p>
        )}
      </div>
    </div>
  )
}

// 5-step progress: numbered circles joined by lines; the first `reached` circles are green.
function MobileStepper({ reached }) {
  return (
    <div className="flex items-center justify-center">
      {[1, 2, 3, 4, 5].map((n) => (
        <React.Fragment key={n}>
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 ${
              n <= reached ? 'bg-[#0b7a3e] border-[#0b7a3e] text-white' : 'bg-white border-slate-300 text-slate-500'
            }`}
          >
            {n}
          </span>
          {n < 5 && <span className={`h-0.5 w-8 ${n < reached ? 'bg-[#0b7a3e]' : 'bg-slate-300'}`} />}
        </React.Fragment>
      ))}
    </div>
  )
}

// Field sets for each step. `stacked` = mobile (single column); desktop uses the
// exact multi-column layout shown in SCR-002's desktop panel.
function StepFields({ step, form, update, stacked = false }) {
  const grid2 = stacked ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-2 gap-6'
  const area = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none'
  const grid4 = stacked ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-4 gap-6'

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
      <div className={stacked ? "space-y-4" : "space-y-6"}>
        <Field label="दुकान / कार्यालय का पता" required>
          {stacked
            ? <textarea rows={2} className={area} placeholder="पूरा पता दर्ज करें" value={form.address} onChange={update('address')} />
            : <Input placeholder="पूरा पता दर्ज करें" value={form.address} onChange={update('address')} />}
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
          {stacked
            ? <textarea rows={2} className={area} placeholder="उदाहरण: कपड़ा, किराना, मोबाइल आदि" value={form.mainProduct} onChange={update('mainProduct')} />
            : <Input placeholder="उदाहरण: कपड़ा, किराना, मोबाइल आदि" value={form.mainProduct} onChange={update('mainProduct')} />}
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
    <div className={stacked ? "space-y-4" : "space-y-6"}>
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