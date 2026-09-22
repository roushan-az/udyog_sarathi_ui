import React from 'react'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const ICONS = { success: CheckCircle2, warn: AlertTriangle, info: Info }
const COLORS = {
  success: 'bg-emerald-600',
  warn: 'bg-amber-600',
  info: 'bg-navy-600',
}

export default function Toaster() {
  const { toasts } = useApp()
  return (
    <div className="fixed z-50 bottom-4 right-4 left-4 sm:left-auto flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => {
        const Icon = ICONS[t.tone] || Info
        return (
          <div
            key={t.id}
            className={`pointer-events-auto text-white text-sm font-medium rounded-lg shadow-lg px-4 py-3 flex items-center gap-2 ${COLORS[t.tone] || COLORS.info} w-full sm:w-auto sm:max-w-sm animate-[fadein_.2s_ease]`}
          >
            <Icon size={16} className="shrink-0" />
            <span>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
