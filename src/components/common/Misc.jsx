import React from 'react'
import { Headset, Phone, Check } from 'lucide-react'

export function SupportBox() {
  return (
    <div className="m-3 rounded-xl bg-navy-50 border border-navy-100 p-3.5 text-center">
      <div className="mx-auto w-9 h-9 rounded-full bg-navy-600 text-white flex items-center justify-center mb-2">
        <Headset size={17} />
      </div>
      <p className="text-sm font-semibold text-navy-700">सहायता केंद्र</p>
      <p className="text-xs text-slate-500 mt-0.5">किसी भी सहायता के लिए संपर्क करें</p>
      <a href="tel:18001234567" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brandGreen-700">
        <Phone size={14} /> 1800-123-4567
      </a>
    </div>
  )
}

export function Stepper({ steps, current, onStepClick }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scroll-x pb-1">
      {steps.map((label, i) => {
        const idx = i + 1
        const state = idx < current ? 'done' : idx === current ? 'active' : 'todo'
        return (
          <React.Fragment key={label}>
            <button
              onClick={() => onStepClick?.(idx)}
              className={`flex items-center gap-2 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-ring ${
                state === 'active'
                  ? 'bg-brandGreen-600 text-white'
                  : state === 'done'
                  ? 'bg-emerald-50 text-brandGreen-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                state === 'active' ? 'bg-white text-brandGreen-700' : state === 'done' ? 'bg-brandGreen-600 text-white' : 'bg-slate-300 text-white'
              }`}>
                {state === 'done' ? <Check size={10} /> : idx}
              </span>
              {label}
            </button>
            {i < steps.length - 1 && <span className="h-px w-4 bg-slate-300 shrink-0" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function NoteBanner({ children, tone = 'info' }) {
  const tones = {
    info: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warn: 'bg-amber-50 border-amber-200 text-amber-800',
  }
  return (
    <div className={`rounded-lg border px-4 py-2.5 text-sm flex items-start gap-2 ${tones[tone]}`}>
      <span>ⓘ</span>
      <span>{children}</span>
    </div>
  )
}
