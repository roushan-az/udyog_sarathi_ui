import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Input } from './Form'
import { formatINR } from '../../utils/format'

let uid = 100

export function newLineItem() {
  uid += 1
  return { id: uid, name: '', hsn: '', qty: 1, unit: 'PCS', rate: 0, discount: 0, gst: 5 }
}

export function computeLineTotals(item) {
  const gross = item.qty * item.rate
  const discountAmt = (gross * (item.discount || 0)) / 100
  const taxable = gross - discountAmt
  const gstAmt = (taxable * (item.gst || 0)) / 100
  const cgst = gstAmt / 2
  const sgst = gstAmt / 2
  const amount = taxable + gstAmt
  return { taxable, cgst, sgst, gstAmt, amount }
}

export default function LineItemsTable({ items, onChange, unitOptions = ['PCS', 'KG', 'BAG', 'MTR', 'CFT', 'LTR', 'BOX'] }) {
  const update = (id, key, value) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: key === 'name' || key === 'hsn' || key === 'unit' ? value : Number(value) } : it)))
  }
  const remove = (id) => onChange(items.filter((it) => it.id !== id))
  const add = () => onChange([...items, newLineItem()])

  const totals = items.reduce(
    (acc, it) => {
      const t = computeLineTotals(it)
      acc.taxable += t.taxable
      acc.cgst += t.cgst
      acc.sgst += t.sgst
      acc.amount += t.amount
      acc.qty += Number(it.qty) || 0
      return acc
    },
    { taxable: 0, cgst: 0, sgst: 0, amount: 0, qty: 0 }
  )

  return (
    <div>
      <div className="scroll-x rounded-xl border border-slate-200">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <th className="px-3 py-2 text-left font-semibold w-10">#</th>
              <th className="px-3 py-2 text-left font-semibold min-w-[160px]">उत्पाद नाम</th>
              <th className="px-3 py-2 text-left font-semibold w-24">HSN कोड</th>
              <th className="px-3 py-2 text-left font-semibold w-20">Qty</th>
              <th className="px-3 py-2 text-left font-semibold w-24">Unit</th>
              <th className="px-3 py-2 text-left font-semibold w-24">Rate (₹)</th>
              <th className="px-3 py-2 text-left font-semibold w-20">Disc %</th>
              <th className="px-3 py-2 text-left font-semibold w-16">GST %</th>
              <th className="px-3 py-2 text-right font-semibold w-28">Amount (₹)</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => {
              const t = computeLineTotals(it)
              return (
                <tr key={it.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                  <td className="px-2 py-1.5"><Input value={it.name} onChange={(e) => update(it.id, 'name', e.target.value)} placeholder="उत्पाद नाम" /></td>
                  <td className="px-2 py-1.5"><Input value={it.hsn} onChange={(e) => update(it.id, 'hsn', e.target.value)} placeholder="कोड" /></td>
                  <td className="px-2 py-1.5"><Input type="number" min="0" value={it.qty} onChange={(e) => update(it.id, 'qty', e.target.value)} /></td>
                  <td className="px-2 py-1.5">
                    <select value={it.unit} onChange={(e) => update(it.id, 'unit', e.target.value)} className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm focus-ring">
                      {unitOptions.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5"><Input type="number" min="0" value={it.rate} onChange={(e) => update(it.id, 'rate', e.target.value)} /></td>
                  <td className="px-2 py-1.5"><Input type="number" min="0" value={it.discount} onChange={(e) => update(it.id, 'discount', e.target.value)} /></td>
                  <td className="px-2 py-1.5"><Input type="number" min="0" value={it.gst} onChange={(e) => update(it.id, 'gst', e.target.value)} /></td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-700">{t.amount.toFixed(2)}</td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={() => remove(it.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md focus-ring" aria-label="हटाएं"><Trash2 size={15} /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button onClick={add} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brandGreen-700 hover:text-brandGreen-800 focus-ring">
        <Plus size={16} /> उत्पाद जोड़ें
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mt-3 text-sm text-slate-500">
        <span>कुल आइटम: {items.length}</span>
        <span>कुल राशि (₹): <span className="font-bold text-slate-800">{formatINR(totals.amount, { decimals: 2 })}</span></span>
      </div>

      <GstSummary totals={totals} />
    </div>
  )
}

export function GstSummary({ totals }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
      <SummaryBox label="Taxable Value (₹)" value={totals.taxable} />
      <SummaryBox label="Total CGST (₹)" value={totals.cgst} />
      <SummaryBox label="Total SGST (₹)" value={totals.sgst} />
      <SummaryBox label="Grand Total (₹)" value={totals.amount} highlight />
    </div>
  )
}

function SummaryBox({ label, value, highlight }) {
  return (
    <div className={`rounded-lg border p-3 ${highlight ? 'bg-brandGreen-50 border-brandGreen-200' : 'bg-slate-50 border-slate-200'}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-base font-bold mt-0.5 ${highlight ? 'text-brandGreen-700' : 'text-slate-800'}`}>{formatINR(value, { decimals: 2 })}</p>
    </div>
  )
}
