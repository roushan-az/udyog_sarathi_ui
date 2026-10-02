import React from 'react'
import { Bell } from 'lucide-react'
import Logo from '../common/Logo'

/* Shared mobile top bar (phone, < lg): logo + tagline on the left, bell on the right.
   Use it at the top of every child page's mobile view so the size/spacing
   of menu icon, logo, tagline and bell stays the same everywhere. */
const C = { label: '#1e3a8a' }

export default function MobileHeader({ notifications = 3, onBellClick }) {
  return (
    <header className="lg:hidden shrink-0 flex items-center justify-between gap-3 px-[clamp(12px,4vw,28px)] pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 bg-white">
      <div className="flex flex-col items-start min-w-0">
        <div className="h-[34px] flex items-center [&_img]:h-full [&_img]:w-auto [&_img]:max-w-none [&_svg]:h-full [&_svg]:w-auto">
          <Logo size="md" />
        </div>
        <p className="mt-0.5 text-[clamp(10px,3vw,13px)] font-bold leading-none whitespace-nowrap" style={{ color: C.label }}>आपके व्यापार का सच्चा साथी</p>
      </div>
      <button type="button" aria-label="Notifications" onClick={onBellClick} className="relative w-10 h-10 flex items-center justify-end shrink-0" style={{ color: C.label }}>
        <Bell size={25} />
        {notifications > 0 && (
          <span className="absolute top-0.5 right-[-4px] min-w-[17px] h-[17px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{notifications}</span>
        )}
      </button>
    </header>
  )
}