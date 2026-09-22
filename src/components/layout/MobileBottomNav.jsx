import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { mobileNavItems, navItems } from './navConfig'
import { useApp } from '../../context/AppContext'

export default function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const { setSidebarOpen } = useApp()

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex items-stretch"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {mobileNavItems.map((item) => {
          if (item.to === '/more') {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-slate-500"
              >
                <item.icon size={20} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </button>
            )
          }
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 ${isActive ? 'text-brandGreen-700' : 'text-slate-500'}`
              }
            >
              <item.icon size={20} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex items-end" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/50" />
          <div
            className="relative w-full bg-white rounded-t-2xl p-4 max-h-[75vh] overflow-y-auto"
            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">सभी विकल्प</h3>
              <button onClick={() => setMoreOpen(false)} className="p-1 text-slate-400"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 text-xs font-medium text-center"
                >
                  <item.icon size={20} className="text-navy-600" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
