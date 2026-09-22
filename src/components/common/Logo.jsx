import React from 'react'

export default function Logo({ withTagline = true, size = 'md' }) {
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'
  const markSize = size === 'lg' ? 40 : size === 'sm' ? 24 : 32
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={markSize} height={markSize} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="usBlue" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#12266e" />
          </linearGradient>
          <linearGradient id="usGreen" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#65C466" />
            <stop offset="1" stopColor="#166028" />
          </linearGradient>
        </defs>
        <path d="M8 8 V38 C8 50 18 56 28 56 C38 56 44 50 44 40" stroke="url(#usBlue)" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M56 14 C48 8 34 10 30 20 C27 28 34 30 40 32 C48 35 50 42 44 48 C38 54 26 52 22 44" stroke="url(#usGreen)" strokeWidth="10" strokeLinecap="round" fill="none" />
      </svg>
      <div className="leading-tight">
        <p className={`font-extrabold text-navy-700 ${textSize}`}>
          <span className="text-navy-700">उद्योग</span> <span className="text-brandGreen-700">सारथी</span>
          <sup className="text-[9px] ml-0.5 align-super">™</sup>
        </p>
        {withTagline && <p className="text-[11px] text-slate-500 -mt-0.5">आपके व्यवसाय के तरक्की में भरोसेमंद साथी</p>}
      </div>
    </div>
  )
}
