import React from 'react'
import { NavLink } from 'react-router-dom'
import { X, ShieldCheck } from 'lucide-react'
import Logo from '../common/Logo'
import { SupportBox } from '../common/Misc'
import Button from '../common/Button'
import { navItems } from './navConfig'
import { useApp } from '../../context/AppContext'

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring ${
          isActive ? 'bg-brandGreen-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
        }`
      }
    >
      <Icon size={18} strokeWidth={2} />
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, company } = useApp()

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-100 flex items-center justify-between">
        <Logo />
        <button className="lg:hidden p-1 text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)} aria-label="बंद करें">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* SCR-003: License validity card sits in the sidebar, below the nav */}
      {company.licenseValid && (
        <div className="mx-3 mb-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3.5">
          <p className="text-sm font-semibold text-brandGreen-700 flex items-center gap-1.5">
            <ShieldCheck size={16} /> License वैध है
          </p>
          <p className="text-xs text-slate-500 mt-1">{company.licenseExpiry} तक</p>
          <Button variant="primary" size="sm" className="w-full mt-2">नवीनीकरण करें</Button>
        </div>
      )}

      <SupportBox />
      <p className="text-center text-[11px] text-slate-400 pb-3">Version 1.0 | © Udyog Sarthi</p>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-72 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl animate-[slidein_.2s_ease]">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}
