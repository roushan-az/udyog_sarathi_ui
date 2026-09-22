import React from 'react'

export function Field({ label, required, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  )
}

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus-ring focus:border-navy-600 transition-colors'

export function Input({ className = '', icon: Icon, ...rest }) {
  if (Icon) {
    return (
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className={`${inputBase} pl-9 ${className}`} {...rest} />
      </div>
    )
  }
  return <input className={`${inputBase} ${className}`} {...rest} />
}

export function Select({ className = '', children, ...rest }) {
  return (
    <select className={`${inputBase} appearance-none bg-no-repeat pr-8 ${className}`} {...rest}>
      {children}
    </select>
  )
}

export function Textarea({ className = '', ...rest }) {
  return <textarea className={`${inputBase} resize-none ${className}`} {...rest} />
}

export function Checkbox({ label, className = '', ...rest }) {
  return (
    <label className={`inline-flex items-center gap-2 text-sm text-slate-700 ${className}`}>
      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-navy-600 focus-ring" {...rest} />
      {label}
    </label>
  )
}
