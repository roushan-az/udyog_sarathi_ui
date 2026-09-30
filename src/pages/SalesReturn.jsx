
import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Share2, Printer, Save, Search, Calendar, Settings, User, Plus, Trash2, Paperclip, CheckCircle2, X,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Field, Input, Select, Textarea } from '../components/common/Form'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'

/* ---------- helpers ---------- */

const STEPS = ['रिटर्न जानकारी', 'आइटम विवरण', 'समरी & सेव']
const REASONS = ['माल वापस आया / Defective', 'गलत उत्पाद / Wrong Item', 'मात्रा में अंतर / Quantity Mismatch', 'अन्य / Other']
const MAX_FILE_MB = 10

const num = (v) => parseFloat(v) || 0
const fmt = (n) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const today = () => new Date().toISOString().slice(0, 10)
const toDMY = (iso) => (iso ? iso.split('-').reverse().join('/') : '')

/* Demo invoice register: replace with real data / API later */
const INVOICES = {
  'INV-1689': {
    date: '2025-05-17', customer: 'Shiv Traders', amount: 1892, open: 1892,
    items: [
      { name: 'मैदा 1kg', hsn: '1101', unit: 'PCS', rate: 110, gst: 18 },
      { name: 'सरसों तेल 1L', hsn: '1515', unit: 'PCS', rate: 150, gst: 5 },
      { name: 'चावल (सुपर) 25kg', hsn: '1006', unit: 'BAG', rate: 1200, gst: 5 },
    ],
  },
  'INV-1756': {
    date: '2025-05-17', customer: 'Shiv Traders', amount: 1892, open: 1500,
    items: [
      { name: 'मैदा 1kg', hsn: '1101', unit: 'PCS', rate: 110, gst: 5 },
      { name: 'सरसों तेल 1L', hsn: '1515', unit: 'PCS', rate: 150, gst: 5 },
    ],
  },
}

let uid = 1
const newItem = (o = {}) => ({ id: uid++, name: '', hsn: '', qty: '1', unit: 'PCS', rate: '', disc: '0', gst: '18', cess: '0', ...o })

/* rates are tax-inclusive (matches prototype: 110 @18% -> taxable 93.22) */
function calcLine(it) {
  const gross = num(it.qty) * num(it.rate)
  const total = Math.max(gross - num(it.disc), 0)
  const taxable = total / (1 + num(it.gst) / 100)
  const tax = total - taxable
  return { taxable, cgst: tax / 2, sgst: tax / 2, igst: 0, cess: num(it.cess), total: total + num(it.cess) }
}

function IconInput({ icon: Icon, onIconClick, ...props }) {
  return (
    <div className="relative">
      <Input {...props} />
      <button
        type="button"
        tabIndex={onIconClick ? 0 : -1}
        onClick={onIconClick}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 ${onIconClick ? 'hover:text-navy-600' : 'pointer-events-none'}`}
      >
        <Icon size={15} />
      </button>
    </div>
  )
}

const card = 'bg-white rounded-xl border border-slate-200 shadow-sm p-3'
const h3 = 'font-bold text-slate-800 text-sm mb-2'
const err = (m) => (m ? <p className="text-[10px] text-red-600 mt-0.5">{m}</p> : null)
const cell = 'border border-slate-200 px-1.5 py-1'
const cellIn = 'w-full bg-transparent text-center text-[11px] py-1 px-1 rounded border border-transparent hover:border-slate-300 focus:border-navy-600 focus:outline-none'

/* ---------- page ---------- */

export default function SalesReturn() {
  const { pushToast } = useApp()
  const navigate = useNavigate()
  const sectionRefs = [useRef(null), useRef(null), useRef(null)]
  const fileRef = useRef(null)

  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [invoice, setInvoice] = useState({ no: 'INV-1689', date: '2025-05-17', customer: 'Shiv Traders', amount: 1892, open: 1892 })
  const [loaded, setLoaded] = useState(INVOICES['INV-1689'])
  const [ret, setRet] = useState({ no: 'SRN-0042', date: '2025-05-20', reason: REASONS[0], remark: 'गुणवत्ता सही नहीं थी।' })
  const [items, setItems] = useState([newItem({ name: 'मैदा 1kg', hsn: '1101', rate: '110', gst: '18' })])
  const [files, setFiles] = useState([])

  const totals = useMemo(() => {
    const t = { taxable: 0, cgst: 0, sgst: 0, igst: 0, cess: 0, total: 0 }
    items.forEach((it) => {
      const c = calcLine(it)
      Object.keys(t).forEach((k) => { t[k] += c[k] })
    })
    return t
  }, [items])

  const goStep = (i) => {
    setStep(i)
    sectionRefs[i].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ----- invoice lookup ----- */
  const lookupInvoice = () => {
    const key = invoice.no.trim().toUpperCase()
    const found = INVOICES[key]
    if (!found) {
      setLoaded(null)
      setInvoice((p) => ({ ...p, no: key, date: '', customer: '', amount: 0, open: 0 }))
      setErrors((p) => ({ ...p, invoiceNo: 'यह इन्वॉइस नंबर नहीं मिला' }))
      pushToast('इन्वॉइस नहीं मिला। कृपया सही नंबर डालें')
      return
    }
    setLoaded(found)
    setInvoice({ no: key, date: found.date, customer: found.customer, amount: found.amount, open: found.open })
    setErrors((p) => ({ ...p, invoiceNo: undefined, customer: undefined }))
    pushToast(`इन्वॉइस ${key} लोड हो गया`)
  }

  /* ----- items ----- */
  const updateItem = (id, field, value) =>
    setItems((prev) => prev.map((it) => {
      if (it.id !== id) return it
      const next = { ...it, [field]: value }
      if (field === 'name' && loaded) {
        const m = loaded.items.find((p) => p.name === value)
        if (m) Object.assign(next, { hsn: m.hsn, unit: m.unit, rate: String(m.rate), gst: String(m.gst) })
      }
      return next
    }))
  const addItem = () => setItems((p) => [...p, newItem()])
  const removeItem = (id) => setItems((p) => p.filter((it) => it.id !== id))
  const clearItems = () => {
    if (!items.length) return
    setItems([])
    pushToast('सभी आइटम हटा दिए गए')
  }

  /* ----- attachments ----- */
  const onFiles = (e) => {
    const picked = Array.from(e.target.files || [])
    const ok = picked.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024)
    if (ok.length !== picked.length) pushToast(`कुछ फाइलें ${MAX_FILE_MB} MB से बड़ी हैं और जोड़ी नहीं गईं`)
    if (ok.length) setFiles((p) => [...p, ...ok])
    e.target.value = ''
  }

  /* ----- actions ----- */
  const validate = () => {
    const e = {}
    if (!invoice.no.trim()) e.invoiceNo = 'इन्वॉइस नंबर आवश्यक है'
    else if (!loaded) e.invoiceNo = 'पहले इन्वॉइस खोजें (🔍 पर क्लिक करें)'
    if (!invoice.customer.trim()) e.customer = 'ग्राहक का नाम आवश्यक है'
    if (!ret.no.trim()) e.retNo = 'रिटर्न नंबर आवश्यक है'
    if (!ret.date) e.retDate = 'रिटर्न दिनांक आवश्यक है'
    else if (invoice.date && ret.date < invoice.date) e.retDate = 'रिटर्न दिनांक बिल दिनांक से पहले नहीं हो सकती'
    if (!ret.reason) e.reason = 'रिटर्न का कारण चुनें'
    if (!items.length) e.items = 'कम से कम एक आइटम जोड़ें'
    else if (items.some((it) => !it.name.trim() || num(it.qty) <= 0 || num(it.rate) <= 0))
      e.items = 'हर आइटम में नाम, मात्रा और रेट भरना आवश्यक है'
    else if (totals.total > invoice.amount) e.items = `रिटर्न राशि मूल बिल राशि (₹ ${fmt(invoice.amount)}) से अधिक नहीं हो सकती`
    return e
  }

  const save = () => {
    const e = validate()
    setErrors(e)
    const first = Object.values(e)[0]
    if (first) {
      pushToast(first)
      goStep(e.invoiceNo || e.customer || e.retNo || e.retDate || e.reason ? 0 : 1)
      return
    }
    setStep(2)
    pushToast(`रिटर्न ${ret.no} सफलतापूर्वक सेव हो गया`)
    navigate('/sales-return')
  }

  const cancel = () => {
    pushToast('रिटर्न रद्द किया गया')
    navigate('/sales-return')
  }

  const share = async () => {
    const text = `Sales Return ${ret.no} | Invoice ${invoice.no} | ${invoice.customer} | ₹ ${fmt(totals.total)}`
    try {
      if (navigator.share) await navigator.share({ title: 'Sales Return', text })
      else {
        await navigator.clipboard.writeText(text)
        pushToast('विवरण कॉपी हो गया')
      }
    } catch {
      /* user closed the share sheet */
    }
  }

  const setR = (k) => (e) => setRet((p) => ({ ...p, [k]: e.target.value }))

  return (
    <Layout title="Sales Return" subtitle="सेल्स रिटर्न / क्रेडिट नोट">
      <PageHeader
        code="SCR-004A"
        title="सेल्स रिटर्न / क्रेडिट नोट"
        subtitle="Sales Return / Credit Note"
        actions={
          <>
            <Button variant="outline" icon={Share2} size="sm" onClick={share}>PDF / शेयर करें</Button>
            <Button variant="outline" icon={Printer} size="sm" onClick={() => window.print()}>प्रिंट करें</Button>
            <Button variant="primary" icon={Save} size="sm" onClick={save}>सेव करें</Button>
          </>
        }
      />

      {/* Stepper */}
      <div className="flex items-center justify-center mb-3">
        {STEPS.map((t, i) => (
          <React.Fragment key={t}>
            <button onClick={() => goStep(i)} className="shrink-0 flex items-center gap-2 focus-ring rounded">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border ${
                step >= i ? 'bg-green-700 text-white border-green-700' : 'bg-white text-slate-700 border-slate-400'
              }`}>{i + 1}</span>
              <span className="text-xs font-semibold text-slate-800">{t}</span>
            </button>
            {i < STEPS.length - 1 && <span className={`w-16 sm:w-40 h-px mx-3 ${step > i ? 'bg-green-700' : 'bg-slate-300'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3 space-y-3">
          {/* 1. Original invoice reference */}
          <div className={card} ref={sectionRefs[0]}>
            <h3 className={h3}>1. बिल संदर्भ (Original Invoice Reference)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="इन्वॉइस नंबर" required>
                <IconInput
                  icon={Search}
                  onIconClick={lookupInvoice}
                  value={invoice.no}
                  onChange={(e) => { setInvoice((p) => ({ ...p, no: e.target.value })); setLoaded(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && lookupInvoice()}
                  onBlur={() => invoice.no.trim() && !loaded && lookupInvoice()}
                />
                {err(errors.invoiceNo)}
              </Field>
              <Field label="इन्वॉइस दिनांक"><IconInput icon={Calendar} value={toDMY(invoice.date)} readOnly /></Field>
              <Field label="ग्राहक का नाम" required>
                <IconInput icon={User} value={invoice.customer} onChange={(e) => setInvoice((p) => ({ ...p, customer: e.target.value }))} />
                {err(errors.customer)}
              </Field>
              <Field label="मूल बिल राशि (₹)"><Input value={`:  ${fmt(invoice.amount)}`} readOnly className="text-right font-semibold" /></Field>
            </div>
          </div>

          {/* 2. Return info */}
          <div className={card}>
            <h3 className={h3}>2. रिटर्न जानकारी</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="रिटर्न / क्रेडिट नोट नंबर" required>
                <IconInput icon={Settings} value={ret.no} onChange={setR('no')} />
                {err(errors.retNo)}
              </Field>
              <Field label="रिटर्न दिनांक" required>
                <Input type="date" value={ret.date} max={today()} onChange={setR('date')} />
                {err(errors.retDate)}
              </Field>
              <Field label="रिटर्न का कारण" required>
                <Select value={ret.reason} onChange={setR('reason')}>
                  {REASONS.map((r) => <option key={r}>{r}</option>)}
                </Select>
                {err(errors.reason)}
              </Field>
              <Field label="अन्य कारण (यदि हो)">
                <Textarea rows={3} maxLength={250} value={ret.remark} onChange={setR('remark')} />
                <p className="text-[10px] text-slate-500 text-right">{ret.remark.length}/250</p>
              </Field>
            </div>
          </div>

          {/* 3. Items */}
          <div className={card} ref={sectionRefs[1]}>
            <h3 className={h3}>3. आइटम विवरण <span className="font-normal text-xs">(रिटर्न में लिए गए आइटम)</span></h3>
            <div className="scroll-x">
              <table className="w-full min-w-[820px] text-[11px] border border-slate-200 border-collapse text-slate-800">
                <thead>
                  <tr className="bg-slate-50 font-semibold text-center">
                    <th rowSpan={2} className={cell}>#</th>
                    <th rowSpan={2} className={cell}>प्रोडक्ट नाम</th>
                    <th rowSpan={2} className={cell}>HSN Code</th>
                    <th rowSpan={2} className={cell}>Qty<br />(रिटर्न)</th>
                    <th rowSpan={2} className={cell}>Unit</th>
                    <th rowSpan={2} className={cell}>रेट (₹)</th>
                    <th rowSpan={2} className={cell}>डिस्काउंट (₹)</th>
                    <th rowSpan={2} className={cell}>टैक्सेबल वैल्यू (₹)</th>
                    <th rowSpan={2} className={cell}>GST %</th>
                    <th colSpan={3} className={cell}>टैक्स (₹)</th>
                    <th rowSpan={2} className={cell}>Cess (₹)<br /><span className="font-normal">(यदि लागू हो)</span></th>
                    <th rowSpan={2} className={cell}>एक्शन</th>
                  </tr>
                  <tr className="bg-slate-50 font-semibold text-center">
                    <th className={cell}>CGST (₹)</th><th className={cell}>SGST (₹)</th><th className={cell}>IGST (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr><td colSpan={14} className="text-center text-slate-500 py-4">कोई आइटम नहीं है। "आइटम जोड़ें" पर क्लिक करें।</td></tr>
                  )}
                  {items.map((it, idx) => {
                    const c = calcLine(it)
                    return (
                      <tr key={it.id} className="text-center">
                        <td className={cell}>{idx + 1}</td>
                        <td className={cell}>
                          <input list="inv-products" className={`${cellIn} text-left`} value={it.name} placeholder="आइटम चुनें" onChange={(e) => updateItem(it.id, 'name', e.target.value)} />
                        </td>
                        <td className={cell}><input className={cellIn} value={it.hsn} onChange={(e) => updateItem(it.id, 'hsn', e.target.value)} /></td>
                        <td className={cell}><input type="number" min="0" step="0.01" className={cellIn} value={it.qty} onChange={(e) => updateItem(it.id, 'qty', e.target.value)} /></td>
                        <td className={cell}>
                          <select className={cellIn} value={it.unit} onChange={(e) => updateItem(it.id, 'unit', e.target.value)}>
                            {['PCS', 'BAG', 'KG', 'LTR', 'BOX'].map((u) => <option key={u}>{u}</option>)}
                          </select>
                        </td>
                        <td className={cell}><input type="number" min="0" step="0.01" className={cellIn} value={it.rate} onChange={(e) => updateItem(it.id, 'rate', e.target.value)} /></td>
                        <td className={cell}><input type="number" min="0" step="0.01" className={cellIn} value={it.disc} onChange={(e) => updateItem(it.id, 'disc', e.target.value)} /></td>
                        <td className={cell}>{fmt(c.taxable)}</td>
                        <td className={cell}>
                          <select className={cellIn} value={it.gst} onChange={(e) => updateItem(it.id, 'gst', e.target.value)}>
                            {['0', '5', '12', '18', '28'].map((g) => <option key={g} value={g}>{g}%</option>)}
                          </select>
                        </td>
                        <td className={cell}>{fmt(c.cgst)}</td>
                        <td className={cell}>{fmt(c.sgst)}</td>
                        <td className={cell}>{fmt(c.igst)}</td>
                        <td className={cell}><input type="number" min="0" step="0.01" className={cellIn} value={it.cess} onChange={(e) => updateItem(it.id, 'cess', e.target.value)} /></td>
                        <td className={cell}>
                          <button onClick={() => removeItem(it.id)} aria-label="आइटम हटाएं" className="text-red-500 hover:text-red-700 focus-ring rounded"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <datalist id="inv-products">
              {(loaded?.items || []).map((p) => <option key={p.name} value={p.name} />)}
            </datalist>
            {err(errors.items)}
            <div className="flex items-center justify-between mt-2">
              <button onClick={addItem} className="flex items-center gap-1 text-xs font-semibold text-green-700 border border-slate-200 rounded px-3 py-1.5 hover:bg-slate-50 focus-ring">
                <Plus size={13} /> आइटम जोड़ें
              </button>
              <button onClick={clearItems} className="flex items-center gap-1 text-xs font-semibold text-red-600 border border-red-200 rounded px-3 py-1.5 hover:bg-red-50 focus-ring">
                <Trash2 size={13} /> सभी हटाएं
              </button>
            </div>
          </div>

          {/* Return summary */}
          <div className={card} ref={sectionRefs[2]}>
            <h3 className={h3}>रिटर्न समरी</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center">
              {[
                ['टैक्सेबल वैल्यू (₹)', totals.taxable], ['CGST (₹)', totals.cgst], ['SGST (₹)', totals.sgst],
                ['IGST (₹)', totals.igst], ['Cess (₹)', totals.cess],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-slate-50 border border-slate-200 py-2">
                  <p className="text-[10px] text-slate-700">{l}</p>
                  <p className="text-lg font-bold text-slate-800">{fmt(v)}</p>
                </div>
              ))}
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 py-2">
                <p className="text-[10px] text-green-800">कुल रिटर्न राशि (₹)</p>
                <p className="text-lg font-bold text-slate-800">{fmt(totals.total)}</p>
              </div>
            </div>
          </div>

          {/* 4. Attachments */}
          <div className={card}>
            <h3 className={h3}>4. अटैचमेंट <span className="font-normal text-xs">(कोई दस्तावेज, फोटो)</span></h3>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onFiles({ target: { files: e.dataTransfer.files, value: '' } }) }}
              className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-green-500 py-5 text-center cursor-pointer hover:bg-emerald-50/40 focus-ring"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700"><Paperclip size={15} />दस्तावेज जोड़ें</span>
              <span className="text-[10px] text-slate-700">(फोटो / PDF / Document)</span>
              <span className="text-[10px] text-slate-700">अधिकतम साइज़: {MAX_FILE_MB} MB</span>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={onFiles} />
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1">
                    <span className="truncate">{f.name} <span className="text-slate-500">({(f.size / 1024).toFixed(0)} KB)</span></span>
                    <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} aria-label="फाइल हटाएं" className="text-red-500 hover:text-red-700"><X size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={cancel} className="py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-ring">रद्द करें</button>
            <button onClick={save} className="col-span-2 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 text-sm font-semibold text-white focus-ring">सेव करें</button>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <div className={card}>
            <h3 className={h3}>बिल संदर्भ सारांश</h3>
            <ul className="text-xs space-y-2">
              {[
                ['इन्वॉइस नंबर :', invoice.no || '-'],
                ['इन्वॉइस दिनांक :', toDMY(invoice.date) || '-'],
                ['ग्राहक का नाम :', invoice.customer || '-'],
                ['मूल बिल राशि (₹) :', fmt(invoice.amount)],
                ['ओपन अमाउंट (₹) :', fmt(invoice.open)],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between gap-2">
                  <span className="text-slate-700">{k}</span><span className="font-semibold text-slate-800 text-right">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={card}>
            <h3 className={h3}>रिटर्न नोट्स</h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {[
                'केवल उसी इन्वॉइस का रिटर्न करें जो पहले इस सिस्टम में बनाया गया हो।',
                'रिटर्न की गई मात्रा स्टॉक में वापस जुड़ जाएगी।',
                'क्रेडिट नोट ग्राहक को दिया जाएगा और यह GSTR-1 में रिपोर्ट होगा।',
              ].map((n) => (
                <li key={n} className="flex items-start gap-1.5"><CheckCircle2 size={14} className="text-green-600 shrink-0 mt-0.5" />{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="text-center text-xs font-semibold text-green-800 mt-3">Version 1.0 &nbsp;|&nbsp; © Udyog Saarthi</p>
    </Layout>
  )
}