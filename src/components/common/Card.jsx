import React from 'react'

export function Card({ children, className = '', as: As = 'div', ...rest }) {
  return (
    <As className={`bg-white rounded-xl border border-slate-200 shadow-card ${className}`} {...rest}>
      {children}
    </As>
  )
}

const ICON_BG = {
  blue: 'bg-blue-100 text-navy-600',
  green: 'bg-emerald-100 text-brandGreen-700',
  orange: 'bg-amber-100 text-amber-700',
  purple: 'bg-purple-100 text-purple-700',
  red: 'bg-red-100 text-red-600',
  sky: 'bg-sky-100 text-sky-700',
}

export function StatCard({ icon: Icon, label, value, sub, tone = 'blue', trend, onClick, className = '' }) {
  return (
    <Card
      as={onClick ? 'button' : 'div'}
      onClick={onClick}
      className={`p-4 flex flex-col gap-2 text-left w-full ${onClick ? 'hover:shadow-md transition-shadow cursor-pointer focus-ring' : ''} ${className}`}
    >
      <div className="flex items-center justify-between">
        {Icon && (
          <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${ICON_BG[tone] || ICON_BG.blue}`}>
            <Icon size={18} strokeWidth={2.2} />
          </span>
        )}
        {trend != null && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}% {trend >= 0 ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </Card>
  )
}
