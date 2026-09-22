import React, { useState } from 'react'
import { Menu, Bell, ChevronDown, Store, Globe } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Logo from '../common/Logo'

export default function Header({ title, subtitle }) {
  const { setSidebarOpen, company, language, setLanguage } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md focus-ring" onClick={() => setSidebarOpen(true)} aria-label="मेन्यू खोलें">
            <Menu size={22} />
          </button>
          <div className="lg:hidden">
            <Logo size="sm" withTagline={false} />
          </div>
          {title && (
            <div className="hidden lg:block min-w-0">
              <h2 className="text-lg font-bold text-slate-800 truncate">{title}</h2>
              {subtitle && <p className="text-xs text-slate-400 truncate">{subtitle}</p>}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 focus-ring"
            >
              <Globe size={15} />
              {language === 'hi' ? 'हिंदी' : 'English'}
              <ChevronDown size={14} />
            </button>
          </div>

          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full focus-ring" aria-label="सूचनाएं">
            <Bell size={19} />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 hover:bg-slate-50 focus-ring"
            >
              <span className="w-7 h-7 rounded-full bg-navy-600 text-white flex items-center justify-center">
                <Store size={14} />
              </span>
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[140px] truncate">{company.name}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-40">
                <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-100">व्यवसाय चुनें</div>
                <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">{company.name}</button>
                <button className="w-full text-left px-3 py-2 text-sm text-navy-600 hover:bg-slate-50 border-t border-slate-100">+ नया व्यवसाय जोड़ें</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
