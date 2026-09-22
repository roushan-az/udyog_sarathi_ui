import React from 'react'

const VARIANTS = {
  primary: 'bg-brandGreen-600 hover:bg-brandGreen-700 text-white border-transparent',
  navy: 'bg-navy-600 hover:bg-navy-700 text-white border-transparent',
  outline: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent',
  danger: 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200',
}

export default function Button({ children, icon: Icon, variant = 'primary', className = '', size = 'md', ...rest }) {
  const sizeCls = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm'
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${sizeCls} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}
