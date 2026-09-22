import React from 'react'

export default function PageHeader({ code, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
      <div className="flex items-start gap-3">
        {code && (
          <span className="shrink-0 mt-0.5 rounded-md bg-brandGreen-600 text-white text-xs font-bold px-2.5 py-1">
            {code}
          </span>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
