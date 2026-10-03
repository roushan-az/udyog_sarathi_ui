import React, { useEffect, useRef, useState } from 'react'
import {
  Share2, Printer, Save, Paperclip, Plus, Search, Settings, Calendar, Trash2, CheckCircle2,
  ArrowLeft, MoreVertical, User, ChevronDown, FileText,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'

/* ---------- shared form state: ONE source of truth for desktop + mobile ---------- */
function useReturnForm() {
  const { pushToast } = useApp()
  const [invoiceNo, setInvoiceNo] = useState('INV-1689')
  const [invoiceDate, setInvoiceDate] = useState('2025-05-17')
  const [customer, setCustomer] = useState('Shiv Traders')
  const [returnNo, setReturnNo] = useState('SRN-0042')
  const [returnDate, setReturnDate] = useState('2025-05-20')
  const [reason, setReason] = useState(REASONS[0])
  const [otherReason, setOtherReason] = useState('गुणवत्ता सही नहीं थी ।')
  const [items, setItems] = useState([newRow({ name: 'मैदा 1kg', hsn: '1101', rate: '110.00' })])
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})

  const clearErr = (k) => setErrors((e) => (e[k] ? { ...e, [k]: undefined } : e))
  const updateItem = (id, key, value) => setItems((arr) => arr.map((r) => (r.id === id ? { ...r, [key]: value } : r)))
  const removeItem = (id) => setItems((arr) => arr.filter((r) => r.id !== id))
  const addItem = () => setItems((arr) => [...arr, newRow()])
  const clearItems = () => setItems([])

  const rows = items.map((r) => ({ r, ...lineCalc(r) }))
  const totals = rows.reduce(
    (t, x) => ({
      taxable: t.taxable + x.taxable, cgst: t.cgst + x.cgst, sgst: t.sgst + x.sgst,
      igst: t.igst + x.igst, cess: t.cess + x.cess, total: t.total + x.net,
    }),
    { taxable: 0, cgst: 0, sgst: 0, igst: 0, cess: 0, total: 0 },
  )

  const save = () => {
    const errs = {}
    if (!invoiceNo.trim()) errs.invoiceNo = 'इनवॉइस नंबर दर्ज करें'
    if (!returnNo.trim()) errs.returnNo = 'रिटर्न / क्रेडिट नोट नंबर दर्ज करें'
    setErrors(errs)
    const first = errs.invoiceNo || errs.returnNo
    if (first) return pushToast(first, 'warn')
    if (!reason) return pushToast('रिटर्न का कारण चुनें', 'warn')
    if (totals.total <= 0) return pushToast('कम से कम एक आइटम जोड़ें', 'warn')
    if (totals.total > ORIGINAL_BILL_AMOUNT) return pushToast('रिटर्न राशि मूल बिल राशि से ज़्यादा नहीं हो सकती', 'warn')
    pushToast('रिटर्न / क्रेडिट नोट सफलतापूर्वक सेव हो गया')
  }

  return {
    pushToast, invoiceNo, setInvoiceNo, invoiceDate, setInvoiceDate, customer, setCustomer,
    returnNo, setReturnNo, returnDate, setReturnDate, reason, setReason, otherReason, setOtherReason,
    items, rows, updateItem, removeItem, addItem, clearItems, file, setFile, totals, errors, clearErr, save,
  }
}

/* GST-inclusive rate: taxable = (qty x rate - discount) / (1 + GST%), tax split into CGST + SGST */
function lineCalc(r) {
  const gross = num(r.qty) * num(r.rate)
  const net = gross - Math.min(num(r.disc), gross)
  const taxable = net / (1 + num(r.gst) / 100)
  const tax = net - taxable
  return { gross, net, taxable, cgst: tax / 2, sgst: tax / 2, igst: 0, cess: 0 }
}

/* true from 1024px (Tailwind `lg`) upwards */
function useIsDesktop() {
  const query = '(min-width: 1024px)'
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [match, setMatch] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setMatch(e.matches)
    setMatch(mq.matches)
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange)
    return () => (mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange))
  }, [])
  return match
}

export default function SalesReturn() {
  const form = useReturnForm()
  const isDesktop = useIsDesktop()
  return (
    <Layout title="Sales Return" subtitle="सेल्स रिटर्न / क्रेडिट नोट">
      {/* Only ONE view is mounted at a time: wide screens get the desktop layout,
          phones / small tablets get the mobile layout (MobileHeader + bottom nav). */}
      {isDesktop ? <SalesReturnDesktop f={form} /> : <SalesReturnMobile f={form} />}
    </Layout>
  )
}

/* =====================================================================
   DESKTOP VIEW (lg and up) — prototype SCR-004A (wide screen)
   ===================================================================== */
const DINPUT = 'w-full h-11 rounded-lg border bg-white text-[13px] font-semibold outline-none focus:border-green-600 placeholder:text-slate-300'

function DField({ label, required, children, error }) {
  return (
    <div className="min-w-0">
      <span className="block text-[12px] font-semibold mb-1.5" style={{ color: C.label }}>
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {error && <p role="alert" className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  )
}

function DInput({ icon: Icon, error, readOnly, center, onIconClick, iconLabel, ...props }) {
  return (
    <div className="relative">
      <input
        readOnly={readOnly}
        {...props}
        className={`${DINPUT} ${Icon ? 'pl-3 pr-10' : 'px-3'} ${center ? 'text-right' : ''} ${readOnly ? 'bg-slate-100' : ''}`}
        style={{ borderColor: error ? '#dc2626' : C.field, color: C.text }}
      />
      {Icon && (onIconClick
        ? <button type="button" aria-label={iconLabel} onClick={onIconClick} className="absolute right-0 top-0 h-11 px-3 flex items-center focus-ring rounded-r-lg"><Icon size={17} style={{ color: C.label }} /></button>
        : <Icon size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }} />)}
    </div>
  )
}

function DDate({ value, onChange, label }) {
  return (
    <div className="relative h-11 rounded-lg border bg-white flex items-center focus-within:border-green-600" style={{ borderColor: C.field }}>
      <span className="pl-3 pr-10 text-[13px] font-semibold" style={{ color: C.text }}>{showDate(value)}</span>
      <Calendar size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.muted }} />
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* unsupported */ } }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  )
}

function DCard({ title, sub, innerRef, children }) {
  return (
    <section ref={innerRef} className="rounded-xl border bg-white p-4 xl:p-5" style={{ borderColor: C.border, scrollMarginTop: 90 }}>
      <h2 className="text-[16px] font-bold mb-4" style={{ color: C.label }}>
        {title}{sub && <span className="ml-1.5 text-[14px] font-semibold">{sub}</span>}
      </h2>
      {children}
    </section>
  )
}

const TH = 'px-2 py-2.5 text-[11px] font-bold border border-slate-200 text-center leading-tight whitespace-nowrap'
const TD = 'border border-slate-200 text-center text-[12px]'
const cellIn = 'w-full min-w-0 h-10 bg-transparent px-1.5 text-center outline-none focus:bg-green-50'

function SalesReturnDesktop({ f }) {
  const {
    pushToast, invoiceNo, setInvoiceNo, invoiceDate, setInvoiceDate, customer, setCustomer,
    returnNo, setReturnNo, returnDate, setReturnDate, reason, setReason, otherReason, setOtherReason,
    rows, updateItem, removeItem, addItem, clearItems, file, setFile, totals, errors, clearErr, save,
  } = f
  const refs = { info: useRef(null), items: useRef(null), summary: useRef(null) }
  const [step, setStep] = useState(0)

  // highlight the step whose section is currently in view
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    const els = STEPS.map((s) => refs[s.target].current)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) setStep(els.indexOf(en.target)) }),
      { rootMargin: '-15% 0px -60% 0px' },
    )
    els.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goTo = (i) => {
    setStep(i)
    refs[STEPS[i].target].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const onFile = (e) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    if (picked.size > 10 * 1024 * 1024) {
      e.target.value = ''
      return pushToast('फ़ाइल का साइज़ 10 MB से ज़्यादा नहीं होना चाहिए', 'warn')
    }
    setFile(picked)
  }
  const tiles = [
    ['टैक्सेबल वैल्यू (₹)', totals.taxable],
    ['CGST (₹)', totals.cgst],
    ['SGST (₹)', totals.sgst],
    ['IGST (₹)', totals.igst],
    ['Cess (₹)', totals.cess],
  ]

  return (
    <div>
      <PageHeader
        code="SCR-004A"
        title="सेल्स रिटर्न / क्रेडिट नोट"
        subtitle="Sales Return / Credit Note"
        actions={
          <>
            <Button variant="outline" icon={Share2} size="sm" onClick={() => pushToast('PDF तैयार किया जा रहा है', 'info')}>PDF / शेयर करें</Button>
            <Button variant="outline" icon={Printer} size="sm" onClick={() => pushToast('प्रिंट तैयार किया जा रहा है', 'info')}>प्रिंट करें</Button>
            <Button variant="primary" icon={Save} size="sm" onClick={save}>सेव करें</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_320px] mb-3">
        {/* ================= LEFT: form ================= */}
        <div className="min-w-0 space-y-4">
          {/* stepper */}
          <nav aria-label="चरण" className="flex items-center px-2 pt-1">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.label}>
                <button type="button" onClick={() => goTo(i)} aria-current={step === i ? 'step' : undefined} className="shrink-0 flex items-center gap-2 focus-ring rounded">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold border" style={{
                    background: step === i ? C.green : '#fff', color: step === i ? '#fff' : C.text, borderColor: step === i ? C.green : '#94a3b8',
                  }}>{i + 1}</span>
                  <span className="text-[12.5px] font-semibold" style={{ color: step === i ? C.green : C.text }}>{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="flex-1 h-px bg-slate-300 mx-4" />}
              </React.Fragment>
            ))}
          </nav>

          {/* 1. original invoice reference */}
          <DCard title="1. बिल संदर्भ" sub="(Original Invoice Reference)" innerRef={refs.info}>
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
              <DField label="इनवॉइस नंबर" required error={errors.invoiceNo}>
                <DInput icon={Search} iconLabel="इनवॉइस खोजें" onIconClick={() => pushToast(`${invoiceNo || 'इनवॉइस'} खोजा जा रहा है`, 'info')} value={invoiceNo} error={errors.invoiceNo} onChange={(e) => { setInvoiceNo(e.target.value); clearErr('invoiceNo') }} aria-label="इनवॉइस नंबर" />
              </DField>
              <DField label="इनवॉइस दिनांक">
                <DDate value={invoiceDate} onChange={setInvoiceDate} label="इनवॉइस दिनांक" />
              </DField>
              <DField label="ग्राहक का नाम" required>
                <DInput icon={User} value={customer} onChange={(e) => setCustomer(e.target.value)} aria-label="ग्राहक का नाम" />
              </DField>
              <DField label="मूल बिल राशि (₹)">
                <DInput readOnly center value={money(ORIGINAL_BILL_AMOUNT)} aria-label="मूल बिल राशि" />
              </DField>
            </div>
          </DCard>

          {/* 2. return info */}
          <DCard title="2. रिटर्न जानकारी">
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
              <DField label="रिटर्न / क्रेडिट नोट नंबर" required error={errors.returnNo}>
                <DInput icon={Settings} value={returnNo} error={errors.returnNo} onChange={(e) => { setReturnNo(e.target.value); clearErr('returnNo') }} aria-label="रिटर्न नंबर" />
              </DField>
              <DField label="रिटर्न दिनांक" required>
                <DDate value={returnDate} onChange={setReturnDate} label="रिटर्न दिनांक" />
              </DField>
              <DField label="रिटर्न का कारण" required>
                <div className="relative">
                  <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="रिटर्न का कारण" className={`${DINPUT} appearance-none pl-3 pr-9`} style={{ borderColor: C.field, color: C.text }}>
                    {REASONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={17} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.text }} />
                </div>
              </DField>
              <DField label="अन्य कारण (यदि हो)">
                <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
                  <textarea rows={3} maxLength={250} value={otherReason} onChange={(e) => setOtherReason(e.target.value)} aria-label="अन्य कारण" className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-5 text-[13px] outline-none" style={{ color: C.text }} />
                  <span className="absolute right-2.5 bottom-1 text-[10px]" style={{ color: C.muted }}>{otherReason.length}/250</span>
                </div>
              </DField>
            </div>
          </DCard>

          {/* 3. items */}
          <DCard title="3. आइटम विवरण" sub="(रिटर्न के लिए आइटम)" innerRef={refs.items}>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full min-w-[980px] border-collapse" style={{ color: C.text }}>
                <thead>
                  <tr className="bg-slate-50" style={{ color: C.label }}>
                    <th rowSpan={2} className={TH}>#</th>
                    <th rowSpan={2} className={`${TH} min-w-[130px]`}>प्रोडक्ट नाम</th>
                    <th rowSpan={2} className={TH}>HSN<br />Code</th>
                    <th rowSpan={2} className={TH}>Qty<br /><span className="font-medium">(रिटर्न)</span></th>
                    <th rowSpan={2} className={TH}>Unit</th>
                    <th rowSpan={2} className={TH}>रेट (₹)</th>
                    <th rowSpan={2} className={TH}>डिस्काउंट (₹)</th>
                    <th rowSpan={2} className={TH}>टैक्सेबल<br />वैल्यू (₹)</th>
                    <th rowSpan={2} className={TH}>GST %</th>
                    <th colSpan={3} className={TH}>टैक्स (₹)</th>
                    <th rowSpan={2} className={TH}>Cess (₹)<br /><span className="font-medium">(यदि लागू हो)</span></th>
                    <th rowSpan={2} className={TH}>राशि (₹)</th>
                    <th rowSpan={2} className={TH}>एक्शन</th>
                  </tr>
                  <tr className="bg-slate-50" style={{ color: C.label }}>
                    <th className={TH}>CGST (₹)</th><th className={TH}>SGST (₹)</th><th className={TH}>IGST (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ r, taxable, cgst, sgst, igst, cess, net }, i) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className={`${TD} w-10`}>{i + 1}</td>
                      <td className={TD}><input value={r.name} onChange={(e) => updateItem(r.id, 'name', e.target.value)} placeholder="प्रोडक्ट" aria-label="प्रोडक्ट नाम" className={`${cellIn} text-left`} /></td>
                      <td className={`${TD} w-[76px]`}><input value={r.hsn} onChange={(e) => updateItem(r.id, 'hsn', e.target.value.replace(/\D/g, ''))} aria-label="HSN" className={cellIn} /></td>
                      <td className={`${TD} w-[72px]`}><input value={r.qty} inputMode="decimal" onChange={(e) => updateItem(r.id, 'qty', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="मात्रा" className={cellIn} /></td>
                      <td className={`${TD} w-[70px]`}>
                        <select value={r.unit} onChange={(e) => updateItem(r.id, 'unit', e.target.value)} aria-label="Unit" className="w-full h-10 bg-transparent text-center outline-none focus:bg-green-50">{UNITS.map((u) => <option key={u}>{u}</option>)}</select>
                      </td>
                      <td className={`${TD} w-[90px]`}><input value={r.rate} inputMode="decimal" onChange={(e) => updateItem(r.id, 'rate', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="रेट" className={cellIn} /></td>
                      <td className={`${TD} w-[84px]`}><input value={r.disc} inputMode="decimal" onChange={(e) => updateItem(r.id, 'disc', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="डिस्काउंट" className={cellIn} /></td>
                      <td className={`${TD} w-[84px]`}>{money(taxable)}</td>
                      <td className={`${TD} w-[70px]`}>
                        <select value={r.gst} onChange={(e) => updateItem(r.id, 'gst', e.target.value)} aria-label="GST" className="w-full h-10 bg-transparent text-center outline-none focus:bg-green-50">{GST_SLABS.map((g) => <option key={g} value={g}>{g}%</option>)}</select>
                      </td>
                      <td className={`${TD} w-[70px]`}>{money(cgst)}</td>
                      <td className={`${TD} w-[70px]`}>{money(sgst)}</td>
                      <td className={`${TD} w-[70px]`}>{money(igst)}</td>
                      <td className={`${TD} w-[70px]`}>{money(cess)}</td>
                      <td className={`${TD} w-[84px] font-semibold`}>{money(net)}</td>
                      <td className={`${TD} w-[64px]`}>
                        <button type="button" aria-label="आइटम हटाएं" onClick={() => removeItem(r.id)} className="p-2 text-red-500 hover:bg-red-50 rounded focus-ring"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={15} className="py-6 text-center text-[13px] text-slate-400 border border-slate-200">कोई आइटम नहीं जोड़ा गया</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border bg-white text-[13px] font-semibold hover:bg-green-50 focus-ring" style={{ borderColor: C.field, color: C.green }}>
                <Plus size={16} /> आइटम जोड़ें
              </button>
              <button type="button" onClick={clearItems} disabled={rows.length === 0} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg border bg-white text-[13px] font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 focus-ring" style={{ borderColor: '#fca5a5' }}>
                <Trash2 size={15} /> सभी हटाएं
              </button>
            </div>

            {/* return summary tiles */}
            <div ref={refs.summary} className="mt-5 rounded-xl border p-3 xl:p-4" style={{ borderColor: C.border, scrollMarginTop: 90 }}>
              <h3 className="text-[14px] font-bold mb-3" style={{ color: C.text }}>रिटर्न समरी</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                {tiles.map(([k, v]) => (
                  <div key={k} className="rounded-lg border bg-white px-2 py-3 text-center" style={{ borderColor: C.border }}>
                    <p className="text-[11.5px] font-semibold mb-1.5" style={{ color: C.text }}>{k}</p>
                    <p className="text-[19px] font-bold leading-none" style={{ color: C.text }}>{money(v)}</p>
                  </div>
                ))}
                <div className="rounded-lg border px-2 py-3 text-center" style={{ background: '#eef7f0', borderColor: '#cfe8d6' }}>
                  <p className="text-[11.5px] font-semibold mb-1.5" style={{ color: C.green }}>कुल रिटर्न राशि (₹)</p>
                  <p className="text-[19px] font-bold leading-none" style={{ color: C.green }}>{money(totals.total)}</p>
                </div>
              </div>
            </div>
          </DCard>

          {/* 4. attachment */}
          <DCard title="4. अटैचमेंट" sub="(कोई दस्तावेज, फोटो)">
            <label className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-center cursor-pointer py-7 hover:bg-green-50/40 focus-within:ring-2 focus-within:ring-green-600/40" style={{ borderColor: '#22a24a' }}>
              <span className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: C.green }}><Paperclip size={18} />{file ? 'फ़ाइल बदलें' : 'दस्तावेज जोड़ें'}</span>
              {file ? (
                <span className="max-w-full truncate px-4 text-[12.5px] font-medium" style={{ color: C.text }}>{file.name}</span>
              ) : (
                <>
                  <span className="text-[12.5px]" style={{ color: C.text }}>(फोटो / PDF / Document)</span>
                  <span className="text-[12px]" style={{ color: C.muted }}>अधिकतम साइज़: 10 MB</span>
                </>
              )}
              <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
            </label>
            {file && <button type="button" onClick={() => setFile(null)} className="mt-2 text-[12px] font-semibold text-red-600 focus-ring rounded">फ़ाइल हटाएं</button>}
          </DCard>

          {/* actions */}
          <div className="grid grid-cols-[1fr_1.4fr] gap-4">
            <button type="button" onClick={() => window.history.back()} className="h-12 rounded-lg border bg-white text-[14px] font-semibold hover:bg-slate-50 focus-ring" style={{ borderColor: C.field, color: C.label }}>रद्द करें</button>
            <button type="button" onClick={save} className="h-12 rounded-lg text-[14px] font-semibold text-white hover:opacity-95 focus-ring" style={{ background: C.green }}>सेव करें</button>
          </div>
        </div>

        {/* ================= RIGHT: reference + notes ================= */}
        <aside className="min-w-0 space-y-4 lg:sticky lg:top-4 self-start">
          <section className="rounded-xl border bg-white p-4" style={{ borderColor: C.border }}>
            <h3 className="text-[15px] font-bold mb-3" style={{ color: C.label }}>बिल संदर्भ सारांश</h3>
            <dl className="space-y-2.5 text-[12px]" style={{ color: C.text }}>
              {[
                ['इनवॉइस नंबर :', invoiceNo || '—'],
                ['इनवॉइस दिनांक :', showDate(invoiceDate) || '—'],
                ['ग्राहक का नाम :', customer || '—'],
                ['मूल बिल राशि (₹) :', money(ORIGINAL_BILL_AMOUNT)],
                ['ओपन अमाउंट (₹) :', money(ORIGINAL_BILL_AMOUNT)],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3"><dt>{k}</dt><dd className="font-semibold text-right truncate">{v}</dd></div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border bg-white p-4" style={{ borderColor: C.border }}>
            <h3 className="text-[15px] font-bold mb-3" style={{ color: C.label }}>रिटर्न नोट्स</h3>
            <ul className="space-y-3 text-[12px] leading-snug" style={{ color: C.text }}>
              {RETURN_NOTES.map((n) => (
                <li key={n} className="flex items-start gap-2"><CheckCircle2 size={15} className="text-green-600 shrink-0 mt-0.5" />{n}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <p className="text-center text-xs font-semibold text-green-800 mt-2">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
    </div>
  )
}

const RETURN_NOTES = [
  'केवल उसी इनवॉइस का रिटर्न करें जो पहले इस सिस्टम में बनाया गया हो।',
  'रिटर्न की गई मात्रा स्टॉक में वापस जुड़ जाएगी।',
  'क्रेडिट नोट ग्राहक को दिया जाएगा और यह GSTR-1 में रिपोर्ट होगा।',
]

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg) — prototype SCR-004A
   Same shell as Reports.jsx: MobileHeader on top, scrolling body,
   Layout's bottom nav below. Sizes are clamp()-based so it scales.
   ===================================================================== */
const C = { green: '#14612e', label: '#1e3a8a', text: '#1f2937', muted: '#6b7280', border: '#e9ecf0', field: '#d9dde3' }
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const ORIGINAL_BILL_AMOUNT = 1892
const UNITS = ['PCS', 'KG', 'GM', 'LTR', 'BOX', 'MTR']
const GST_SLABS = ['0', '5', '12', '18', '28']
const REASONS = ['माल वापस आया / Defective', 'गलत प्रोडक्ट / Wrong item', 'ज़्यादा मात्रा / Excess quantity', 'अन्य / Other']
const STEPS = [
  { label: 'रिटर्न जानकारी', target: 'info' },
  { label: 'आइटम विवरण', target: 'items' },
  { label: 'सम्मरी & सेव', target: 'summary' },
]

const money = (v) => Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const showDate = (iso) => (iso ? iso.split('-').reverse().join('/') : '')
const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}
let rowId = 1
const newRow = (o = {}) => ({ id: rowId++, name: '', hsn: '', unit: 'PCS', qty: '1.00', rate: '', disc: '0', gst: '18', ...o })

/* label + control wrapper */
function MField({ label, required, children }) {
  return (
    <div className="min-w-0">
      <span className="block font-semibold mb-1" style={{ color: C.label, fontSize: cl(11, 3.3, 14) }}>
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </div>
  )
}

/* bordered field shell (height scales with the screen) */
function Box({ children, readOnly, error, className = '' }) {
  return (
    <div
      className={`relative flex items-center w-full rounded-lg border ${readOnly ? 'bg-slate-100' : 'bg-white focus-within:border-green-600'} ${className}`}
      style={{ borderColor: error ? '#dc2626' : C.field, height: cl(40, 11.5, 50) }}
    >
      {children}
    </div>
  )
}
const inputCls = 'flex-1 min-w-0 h-full bg-transparent pl-3 pr-9 outline-none placeholder:text-slate-400'
const inputStyle = { color: C.text, fontSize: cl(12, 3.6, 15) }
const iconStyle = { color: C.muted, width: cl(15, 4.4, 20), height: cl(15, 4.4, 20) }

function DateBox({ value, onChange, ariaLabel }) {
  return (
    <Box>
      <span className="pl-3 pr-9 font-medium" style={inputStyle}>{showDate(value)}</span>
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
      {/* native picker sits invisibly on top, so the box keeps the dd/mm/yyyy look */}
      <input
        type="date"
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => { try { e.currentTarget.showPicker?.() } catch { /* not supported */ } }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </Box>
  )
}

function SectionTitle({ children }) {
  return <h2 className="font-bold mb-3" style={{ color: C.label, fontSize: cl(14, 4.3, 19) }}>{children}</h2>
}

function SalesReturnMobile({ f }) {
  const {
    pushToast, invoiceNo, setInvoiceNo, invoiceDate, setInvoiceDate, customer, setCustomer,
    returnNo, setReturnNo, returnDate, setReturnDate, reason, setReason, otherReason, setOtherReason,
    items, updateItem, removeItem, addItem, file, setFile, totals, errors, clearErr, save,
  } = f
  const { total, taxable, cgst, sgst } = totals
  const halfTax = cgst // CGST == SGST (intra-state)
  const scrollRef = useRef(null)
  const sections = { info: useRef(null), items: useRef(null), summary: useRef(null) }
  const [step, setStep] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const goTo = (i) => {
    setStep(i)
    sections[STEPS[i].target].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const onFile = (e) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    if (picked.size > 10 * 1024 * 1024) {
      e.target.value = ''
      return pushToast('फ़ाइल का साइज़ 10 MB से ज़्यादा नहीं होना चाहिए', 'warn')
    }
    setFile(picked)
  }

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-[clamp(12px,4vw,28px)] pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* ---- title row: back | title | menu ---- */}
        <div className="grid items-center" style={{ gridTemplateColumns: '40px 1fr 40px' }}>
          <button type="button" aria-label="वापस जाएं" onClick={() => window.history.back()} className="h-10 w-10 -ml-2 flex items-center justify-center rounded-full active:bg-slate-100 focus-ring" style={{ color: C.label }}>
            <ArrowLeft size={22} />
          </button>
          <div className="text-center min-w-0">
            <h1 className="font-bold leading-tight" style={{ color: C.label, fontSize: cl(17, 5.4, 26) }}>सेल्स रिटर्न / क्रेडिट नोट</h1>
            <p className="font-semibold leading-tight mt-0.5" style={{ color: C.text, fontSize: cl(11, 3.4, 15) }}>(SCR-004A)</p>
          </div>
          <div className="relative justify-self-end">
            <button type="button" aria-label="और विकल्प" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)} className="h-10 w-10 -mr-2 flex items-center justify-center rounded-full active:bg-slate-100 focus-ring" style={{ color: C.text }}>
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border bg-white shadow-lg py-1" style={{ borderColor: C.border }}>
                {[
                  ['ड्राफ्ट सेव करें', FileText, () => pushToast('ड्राफ्ट सेव हो गया')],
                  ['प्रिंट करें', Printer, () => pushToast('प्रिंट तैयार किया जा रहा है', 'info')],
                  ['PDF / शेयर करें', Share2, () => pushToast('PDF तैयार किया जा रहा है', 'info')],
                ].map(([label, Icon, fn]) => (
                  <button key={label} type="button" onClick={() => { setMenuOpen(false); fn() }} className="w-full flex items-center gap-2 px-3 py-2 text-left text-[13px] active:bg-slate-50" style={{ color: C.text }}>
                    <Icon size={15} style={{ color: C.label }} />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---- stepper ---- */}
        <div className="mt-4 mb-5 flex items-start">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <button type="button" onClick={() => goTo(i)} aria-current={step === i ? 'step' : undefined} className="flex flex-col items-center shrink-0 focus-ring rounded" style={{ width: cl(64, 22, 120) }}>
                <span
                  className="rounded-full flex items-center justify-center font-semibold border"
                  style={{
                    width: cl(28, 8.4, 40), height: cl(28, 8.4, 40), fontSize: cl(12, 3.6, 16),
                    background: step === i ? C.green : '#fff', color: step === i ? '#fff' : C.text, borderColor: step === i ? C.green : '#94a3b8',
                  }}
                >{i + 1}</span>
                <span className="mt-1 font-semibold text-center leading-tight" style={{ color: step === i ? C.green : C.text, fontSize: cl(9.5, 2.9, 13) }}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && <span className="flex-1 h-px bg-slate-300 min-w-[8px]" style={{ marginTop: cl(14, 4.2, 20) }} />}
            </React.Fragment>
          ))}
        </div>

        {/* ---- 1. original invoice reference ---- */}
        <section ref={sections.info} className="mb-5">
          <SectionTitle>1. बिल संदर्भ (Original Invoice Reference)</SectionTitle>
          <div className="grid grid-cols-2" style={{ gap: cl(8, 3, 16) }}>
            <MField label="इनवॉइस नंबर" required>
              <Box error={errors.invoiceNo}>
                <input value={invoiceNo} onChange={(e) => { setInvoiceNo(e.target.value); clearErr('invoiceNo') }} className={inputCls} style={inputStyle} aria-label="इनवॉइस नंबर" />
                <button type="button" aria-label="इनवॉइस खोजें" onClick={() => pushToast(`${invoiceNo || 'इनवॉइस'} खोजा जा रहा है`, 'info')} className="absolute right-0 h-full px-3 flex items-center focus-ring rounded-r-lg">
                  <Search style={{ ...iconStyle, color: C.label }} />
                </button>
              </Box>
            </MField>
            <MField label="इनवॉइस दिनांक">
              <DateBox value={invoiceDate} onChange={setInvoiceDate} ariaLabel="इनवॉइस दिनांक" />
            </MField>
            <MField label="ग्राहक का नाम">
              <Box>
                <input value={customer} onChange={(e) => setCustomer(e.target.value)} className={inputCls} style={inputStyle} aria-label="ग्राहक का नाम" />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
              </Box>
            </MField>
            <MField label="मूल बिल राशि (₹)">
              <Box readOnly>
                <input readOnly value={money(ORIGINAL_BILL_AMOUNT)} className="flex-1 min-w-0 h-full bg-transparent px-3 text-center font-bold outline-none" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }} aria-label="मूल बिल राशि" />
              </Box>
            </MField>
          </div>
        </section>

        {/* ---- 2. return info ---- */}
        <section className="mb-5">
          <SectionTitle>2. रिटर्न जानकारी</SectionTitle>
          <div className="grid grid-cols-2" style={{ gap: cl(8, 3, 16) }}>
            <MField label="रिटर्न /क्रेडिट नोट नंबर" required>
              <Box error={errors.returnNo}>
                <input value={returnNo} onChange={(e) => { setReturnNo(e.target.value); clearErr('returnNo') }} className={inputCls} style={inputStyle} aria-label="रिटर्न / क्रेडिट नोट नंबर" />
                <Settings className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={iconStyle} />
              </Box>
            </MField>
            <MField label="रिटर्न दिनांक" required>
              <DateBox value={returnDate} onChange={setReturnDate} ariaLabel="रिटर्न दिनांक" />
            </MField>
          </div>

          <div className="mt-3">
            <MField label="रिटर्न का कारण" required>
              <Box>
                <select value={reason} onChange={(e) => setReason(e.target.value)} aria-label="रिटर्न का कारण" className="appearance-none w-full h-full bg-transparent pl-3 pr-9 outline-none rounded-lg" style={inputStyle}>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ ...iconStyle, color: C.text }} />
              </Box>
            </MField>
          </div>

          <div className="mt-3">
            <MField label="अन्य कारण">
              <div className="relative rounded-lg border bg-white focus-within:border-green-600" style={{ borderColor: C.field }}>
                <textarea
                  rows={3}
                  maxLength={250}
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  aria-label="अन्य कारण"
                  className="block w-full resize-none bg-transparent px-3 pt-2.5 pb-5 outline-none"
                  style={inputStyle}
                />
                <span className="absolute right-2.5 bottom-1 text-[10px]" style={{ color: C.muted }}>{otherReason.length}/250</span>
              </div>
            </MField>
          </div>
        </section>

        {/* ---- 3. items ---- */}
        <section ref={sections.items} className="mb-5">
          <SectionTitle>3. आइटम विवरण <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(रिटर्न किए गए आइटम)</span></SectionTitle>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.field }}>
            <table className="w-full table-fixed border-collapse" style={{ fontSize: cl(10, 3, 13), color: C.text }}>
              <colgroup>
                <col style={{ width: '8%' }} />
                <col />
                <col style={{ width: '16%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '11%' }} />
              </colgroup>
              <thead>
                <tr className="bg-slate-50 font-semibold leading-tight" style={{ color: C.label }}>
                  <th className="py-1.5 px-1 border-b border-r" style={{ borderColor: C.field }}>#</th>
                  <th className="py-1.5 px-1 border-b border-r" style={{ borderColor: C.field }}>प्रोडक्ट नाम</th>
                  <th className="py-1.5 px-0.5 border-b border-r" style={{ borderColor: C.field }}>Qty<br /><span className="font-medium">(रिटर्न)</span></th>
                  <th className="py-1.5 px-0.5 border-b border-r" style={{ borderColor: C.field }}>रेट (₹)</th>
                  <th className="py-1.5 px-0.5 border-b border-r" style={{ borderColor: C.field }}>राशि (₹)</th>
                  <th className="py-1.5 px-0.5 border-b" style={{ borderColor: C.field }}>हटाएं</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r, i) => (
                  <tr key={r.id} className="text-center">
                    <td className="py-1.5 border-b border-r" style={{ borderColor: C.field }}>{i + 1}</td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.name} onChange={(e) => updateItem(r.id, 'name', e.target.value)} placeholder="प्रोडक्ट" aria-label="प्रोडक्ट नाम" className="w-full min-w-0 bg-transparent px-1.5 py-1.5 text-left outline-none focus:bg-green-50 placeholder:text-slate-300" />
                    </td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.qty} inputMode="decimal" onChange={(e) => updateItem(r.id, 'qty', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="रिटर्न मात्रा" className="w-full min-w-0 bg-transparent px-0.5 py-1.5 text-center outline-none focus:bg-green-50" />
                    </td>
                    <td className="border-b border-r" style={{ borderColor: C.field }}>
                      <input value={r.rate} inputMode="decimal" onChange={(e) => updateItem(r.id, 'rate', e.target.value.replace(/[^0-9.]/g, ''))} aria-label="रेट" className="w-full min-w-0 bg-transparent px-0.5 py-1.5 text-center outline-none focus:bg-green-50" />
                    </td>
                    <td className="border-b border-r font-medium" style={{ borderColor: C.field }}>{money(num(r.qty) * num(r.rate))}</td>
                    <td className="border-b" style={{ borderColor: C.field }}>
                      <button type="button" aria-label="आइटम हटाएं" onClick={() => removeItem(r.id)} className="p-1.5 text-red-500 active:scale-90 focus-ring rounded">
                        <Trash2 style={{ width: cl(13, 3.8, 18), height: cl(13, 3.8, 18) }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={6} className="py-4 text-center text-slate-400">कोई आइटम नहीं जोड़ा गया</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={addItem} className="mt-3 mx-auto flex items-center justify-center gap-1.5 rounded-lg border bg-white font-semibold active:bg-green-50 focus-ring" style={{ borderColor: C.field, color: C.green, height: cl(36, 10.5, 46), width: cl(130, 38, 200), fontSize: cl(12, 3.6, 15) }}>
            <Plus size={16} /> आइटम जोड़ें
          </button>

          {/* return summary */}
          <div ref={sections.summary} className="mt-4 rounded-xl border bg-slate-50 px-3.5 py-3" style={{ borderColor: C.field }}>
            <h3 className="font-bold mb-2" style={{ color: C.text, fontSize: cl(13, 3.9, 17) }}>रिटर्न समरी</h3>
            <dl style={{ fontSize: cl(12, 3.6, 15), color: C.text }} className="space-y-1.5">
              {[
                ['टैक्सेबल वैल्यू (₹)', money(taxable)],
                ['CGST (₹)', money(halfTax)],
                ['SGST (₹)', money(halfTax)],
                ['IGST', money(0)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between"><dt>{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-2 pt-2 border-t flex justify-between items-baseline font-bold" style={{ borderColor: C.field }}>
              <span style={{ color: C.text, fontSize: cl(13, 3.9, 17) }}>कुल रिटर्न राशि (₹)</span>
              <span style={{ color: C.green, fontSize: cl(16, 5, 22) }}>{money(total)}</span>
            </div>
          </div>
        </section>

        {/* ---- 4. attachment ---- */}
        <section className="mb-2">
          <SectionTitle>4. अटैचमेंट <span className="font-semibold" style={{ fontSize: cl(11, 3.4, 14) }}>(कोई दस्तावेज, फोटो)</span></SectionTitle>
          <label className="flex flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed text-center cursor-pointer active:bg-green-50 focus-within:ring-2 focus-within:ring-green-600/40" style={{ borderColor: '#22a24a', padding: cl(12, 4, 20) }}>
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: C.green, fontSize: cl(13, 3.9, 17) }}>
              <Paperclip size={16} />{file ? 'फ़ाइल बदलें' : 'दस्तावेज जोड़ें'}
            </span>
            {file ? (
              <span className="max-w-full truncate font-medium" style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>{file.name}</span>
            ) : (
              <>
                <span style={{ color: C.text, fontSize: cl(11, 3.3, 14) }}>(फोटो / PDF / Document)</span>
                <span style={{ color: C.muted, fontSize: cl(10, 3, 13) }}>अधिकतम साइज़: 10 MB</span>
              </>
            )}
            <input type="file" accept="image/*,.pdf,.doc,.docx" className="sr-only" onChange={onFile} />
          </label>
        </section>
      </main>

      {/* ---- sticky actions, sit right above the bottom nav ---- */}
      <div className="shrink-0 grid grid-cols-2 border-t bg-white px-[clamp(12px,4vw,28px)] py-2.5" style={{ borderColor: C.border, gap: cl(10, 3.5, 18) }}>
        <button type="button" onClick={() => window.history.back()} className="rounded-lg border bg-white font-semibold active:bg-slate-50 focus-ring" style={{ borderColor: C.green, color: C.green, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>रद्द करें</button>
        <button type="button" onClick={save} className="rounded-lg font-semibold text-white active:opacity-90 focus-ring" style={{ background: C.green, height: cl(40, 11.5, 50), fontSize: cl(13, 3.9, 16) }}>सेव करें</button>
      </div>
    </div>
  )
}