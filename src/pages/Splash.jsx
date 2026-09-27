import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import { useApp } from '../context/AppContext'
import peopleTalking from '../assets/illus-people-talking.png'
import growthIcon from '../assets/illus-growth-icon.png'
import mountainClimber from '../assets/illus-mountain-climber.png'
import logoWithTagLine from '../assets/logo_with_tag-line.png'

const SLIDE_COUNT = 3

// SCR-001: 3 slides, 2 sec each = ~6 sec total, then auto-navigates:
// first-time app use -> SCR-002 (Company Setup); otherwise -> SCR-003 (Home Screen)
export default function Splash() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const { onboardingCompleted } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < SLIDE_COUNT - 1) {
        setIndex((i) => i + 1)
      } else {
        navigate(onboardingCompleted ? '/dashboard' : '/company-setup', { replace: true })
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [index, navigate, onboardingCompleted])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      {/* MOBILE (portrait): stacked, centered phone-style card, matches SCR-001 mobile panels */}
      <div className="lg:hidden w-full max-w-sm flex flex-col items-center gap-8">
        <div className="min-h-[220px] flex items-center justify-center">
          {index === 0 && (
            <div className="flex flex-col items-center text-center gap-4">
              <Logo size="lg" />
            </div>
          )}
          {index === 1 && (
            <div className="flex flex-col items-center text-center gap-4">
              <img src={peopleTalking} alt="" className="w-48 h-auto" />
              <h2 className="text-lg font-bold text-slate-800">हम आपके व्यवसाय के साथी हैं</h2>
              <p className="text-sm text-slate-500 max-w-xs">
                व्यवसाय को समझने, सीखने, सुझाव पाने, रिपोर्ट देखने और अपने व्यवसाय को बेहतर जानने में हम आपका साथ देते हैं।
              </p>
            </div>
          )}
          {index === 2 && (
            <div className="flex flex-col items-center text-center gap-4">
              <img src={growthIcon} alt="" className="w-14 h-auto" />
              <h2 className="text-lg font-bold text-slate-800">हर बड़ा व्यवसाय एक छोटे कदम से शुरू होता है।</h2>
              <p className="text-sm text-slate-500 max-w-xs">सीखते रहिए, बढ़ते रहिए, सफल होते रहिए।</p>
              <img src={mountainClimber} alt="" className="w-40 h-auto mt-1" />
            </div>
          )}
        </div>

        <SlideDots index={index} />

        <div className="flex flex-col items-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-brandGreen-600 animate-spin" />
          <p className="text-xs text-slate-400">Loading...</p>
        </div>

        <p className="text-xs text-slate-300">Version 1.0</p>
      </div>

      {/* DESKTOP (landscape): wide banner card, matches SCR-001 desktop panel */}
      <div className="hidden lg:flex w-full max-w-4xl min-h-[380px] rounded-2xl border border-slate-100 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/30 shadow-card items-center justify-center px-16 py-14 relative overflow-hidden">
        {index === 0 && (
          <div className="flex flex-col items-center text-center gap-5">
            <Logo size="lg" />
            <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-brandGreen-600 animate-spin" />
            <p className="text-sm text-slate-400">Loading...</p>
            <p className="text-xs text-slate-300">Version 1.0</p>
          </div>
        )}

        {index === 1 && (
          <div className="flex items-center gap-14 w-full">
            <img src={peopleTalking} alt="" className="w-72 h-auto shrink-0" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">हम आपके व्यवसाय के साथी हैं</h2>
              <div className="w-16 h-px bg-brandGreen-300 mb-3 relative">
                <span className="absolute -left-0 -top-[3px] w-1.5 h-1.5 rounded-full bg-brandOrange-500" />
              </div>
              <p className="text-base text-slate-500 max-w-md">
                व्यवसाय को समझने, सीखने, सुझाव पाने, रिपोर्ट देखने और अपने व्यवसाय को बेहतर जानने में हम आपका साथ देते हैं।
              </p>
            </div>
          </div>
        )}

        {index === 2 && (
          <div className="flex items-center gap-14 w-full">
            <div className="flex-1">
              <img src={growthIcon} alt="" className="w-16 h-auto mb-4" />
              <h2 className="text-3xl font-bold text-slate-800 mb-3">हर बड़ा व्यवसाय एक छोटे कदम से शुरू होता है।</h2>
              <div className="w-16 h-px bg-brandGreen-300 mb-3 relative">
                <span className="absolute -left-0 -top-[3px] w-1.5 h-1.5 rounded-full bg-brandOrange-500" />
              </div>
              <p className="text-base text-slate-500 max-w-md">सीखते रहिए, बढ़ते रहिए, सफल होते रहिए।</p>
            </div>
            <img src={mountainClimber} alt="" className="w-72 h-auto shrink-0" />
          </div>
        )}

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
          <SlideDots index={index} />
        </div>
      </div>
    </div>
  )
}

function SlideDots({ index }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
        <span key={i} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-brandGreen-600' : 'w-1.5 bg-slate-200'}`} />
      ))}
    </div>
  )
}
