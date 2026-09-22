import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, CheckCircle2 } from 'lucide-react'
import Logo from '../components/common/Logo'
import { Field, Input, Select, Checkbox } from '../components/common/Form'
import Button from '../components/common/Button'
import { Stepper } from '../components/common/Misc'

const STEPS = ['कंपनी जानकारी', 'पता जानकारी', 'व्यवसाय विवरण', 'अतिरिक्त जानकारी', 'पूरी करें']

const initialForm = {
  companyName: '', companyType: '', ownerName: '', mobile: '',
  address: '', state: '', district: '', city: '', pincode: '',
  businessType: '', mainProduct: '', startDate: '', gst: '',
  pan: '', bankName: '', fyStart: '', confirm: false,
}

export default function CompanySetup() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target?.type === 'checkbox' ? e.target.checked : e.target.value }))
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const back = () => setStep((s) => Math.max(s - 1, 1))
  const finish = () => navigate('/', { replace: true })

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Logo />
          <span className="text-xs font-semibold text-slate-400">Version 1.0</span>
        </div>

        <div className="px-6 pt-5">
          <Stepper steps={STEPS} current={step} onStepClick={setStep} />
        </div>

        <div className="p-6">
          {step === 1 && (
            <StepBlock icon={Store} title="आइए, आपका व्यवसाय सेटअप करें" desc="कुछ आसान जानकारी भरें और अपना व्यवसाय ऐप में शुरू करें।">
              <Grid>
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
              </Grid>
            </StepBlock>
          )}

          {step === 2 && (
            <StepBlock title="पता जानकारी">
              <Grid>
                <Field label="दुकान / कार्यालय का पता" required className="sm:col-span-2">
                  <Input placeholder="पूरा पता दर्ज करें" value={form.address} onChange={update('address')} />
                </Field>
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
              </Grid>
            </StepBlock>
          )}

          {step === 3 && (
            <StepBlock title="व्यवसाय विवरण">
              <Grid>
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
              </Grid>
            </StepBlock>
          )}

          {step === 4 && (
            <StepBlock title="अतिरिक्त जानकारी">
              <Grid>
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
                <Field label="वित्तीय वर्ष प्रारंभ माह" required>
                  <Select value={form.fyStart} onChange={update('fyStart')}>
                    <option value="">चुनें (उदा. अप्रैल)</option>
                    <option>अप्रैल</option>
                    <option>जनवरी</option>
                  </Select>
                </Field>
              </Grid>
              <Checkbox
                className="mt-4"
                label="मैं ऊपर दी गई जानकारी सही है और इसे भविष्य में उपयोग के लिए सेव करना चाहता हूँ।"
                checked={form.confirm}
                onChange={update('confirm')}
              />
            </StepBlock>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center text-center gap-3 py-8">
              <CheckCircle2 size={56} className="text-brandGreen-600" />
              <h3 className="text-lg font-bold text-slate-800">बधाई हो!</h3>
              <p className="text-sm text-slate-500 max-w-sm">आपकी कंपनी / व्यवसाय की जानकारी सफलतापूर्वक सेव हो गई है। अब आप ऐप का उपयोग शुरू कर सकते हैं।</p>
              <Button variant="primary" size="lg" onClick={finish} className="mt-2">Home Screen पर जाएं</Button>
            </div>
          )}

          {step < 5 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={back} disabled={step === 1}>वापस</Button>
              {step < STEPS.length - 1 ? (
                <Button variant="primary" onClick={next}>आगे</Button>
              ) : (
                <Button variant="primary" onClick={() => setStep(5)}>सेव करें और आगे बढ़ें</Button>
              )}
            </div>
          )}
        </div>

        {step < 5 && (
          <div className="px-6 pb-5 text-xs text-slate-400">ⓘ नोट: * वाले फ़ील्ड आवश्यक हैं। आप बाद में Settings से जानकारी बदल सकते हैं।</div>
        )}
      </div>
    </div>
  )
}

function StepBlock({ icon: Icon, title, desc, children }) {
  return (
    <div>
      <div className="mb-4">
        {Icon && <Icon size={20} className="text-brandGreen-600 mb-1" />}
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        {desc && <p className="text-sm text-slate-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}
