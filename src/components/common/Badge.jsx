import React from 'react'

const TONES = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  orange: 'bg-amber-50 text-amber-700 border-amber-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
}

export default function Badge({ children, tone = 'slate', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${TONES[tone] || TONES.slate} ${className}`}
    >
      {children}
    </span>
  )
}

export function statusTone(status) {
  const s = (status || '').toLowerCase()
  if (['सक्रिय', 'उपलब्ध', 'active', 'वकाया'].includes(status)) return 'green'
  if (['निष्क्रिय', 'inactive', 'आउट ऑफ स्टॉक'].includes(status)) return 'red'
  if (['कम स्टॉक', 'लो स्टॉक', 'देय'].includes(status)) return 'orange'
  return 'slate'
}
