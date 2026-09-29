import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import { useApp } from '../context/AppContext'
import peopleTalking from '../assets/illus-people-talking.png'
import growthIcon from '../assets/illus-growth-icon.png'
import mountainClimber from '../assets/illus-mountain-climber.png'

const SLIDE_COUNT = 3

// Soft green corner waves used on the card background (as in SCR-001):
// visible only at the bottom-left and bottom-right corners, flat/invisible in the middle.
const WAVE_BG = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 420' preserveAspectRatio='none'>
    <path d='M0 420 L0 290 C120 250 260 300 380 420 Z' fill='#e3f4e9' fill-opacity='.85'/>
    <path d='M1200 420 L1200 290 C1080 250 940 300 820 420 Z' fill='#e3f4e9' fill-opacity='.85'/>
    <path d='M0 420 L0 340 C80 310 170 345 260 420 Z' fill='#d3ecdc' fill-opacity='.9'/>
    <path d='M1200 420 L1200 340 C1120 310 1030 345 940 420 Z' fill='#d3ecdc' fill-opacity='.9'/>
  </svg>`
)}")`

const Divider = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-2 ${className}`}>
    <span className="h-px w-16 bg-navy-700/60" />
    <span className="w-2 h-2 rounded-full bg-brandOrange-500" />
    <span className="h-px w-16 bg-brandGreen-700/60" />
  </div>
)

const Spinner = ({ big }) => (
  <div className="flex flex-col items-center gap-1.5">
    <span className={`${big ? 'w-11 h-11 border-[5px]' : 'w-9 h-9 border-4'} rounded-full border-slate-200 border-t-brandGreen-600 border-r-brandGreen-600 animate-spin`} />
    <p className="text-sm font-semibold text-navy-800">Loading...</p>
    <p className="text-xs font-medium text-slate-700">Version 1.0</p>
  </div>
)

function SlideDots({ index }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
        <span key={i} className={`h-2 rounded-full transition-all ${i === index ? 'w-2 bg-brandGreen-600' : 'w-2 bg-slate-300'}`} />
      ))}
    </div>
  )
}

const Heading2 = ({ cls = '' }) => (
  <h2 className={`font-extrabold text-navy-700 leading-snug ${cls}`}>
    हम आपके <span className="text-brandGreen-700">व्यवसाय</span> के साथी हैं
  </h2>
)
const Heading3 = ({ cls = '' }) => (
  <h2 className={`font-extrabold text-navy-700 leading-snug ${cls}`}>
    हर बड़ा व्यवसाय<br />एक छोटे कदम से<br /><span className="text-brandGreen-700">शुरू होता है ।</span>
  </h2>
)

// SCR-001: 3 slides × 2 sec, then -> SCR-002 (first time) or SCR-003 (returning user)
export default function Splash() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const { onboardingCompleted } = useApp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < SLIDE_COUNT - 1) setIndex((i) => i + 1)
      else navigate(onboardingCompleted ? '/dashboard' : '/company-setup', { replace: true })
    }, 2000)
    return () => clearTimeout(timer)
  }, [index, navigate, onboardingCompleted])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* ================= MOBILE (portrait) ================= */}
      <div className="lg:hidden relative w-full max-w-sm min-h-screen sm:min-h-[640px] sm:my-6 sm:rounded-[2rem] sm:border sm:border-slate-200 sm:shadow-card overflow-hidden flex flex-col items-center px-6 pt-16 pb-8 bg-white">
        <div className="flex-1 w-full flex flex-col items-center justify-center text-center">
          {index === 0 && (
            <>
              <Logo variant="stacked" size="lg" />
              <div className="mt-10"><Spinner big /></div>
            </>
          )}
          {index === 1 && (
            <>
              <img src={peopleTalking} alt="" className="w-64 h-auto mix-blend-multiply" />
              <Heading2 cls="text-2xl mt-6" />
              <Divider className="my-3" />
              <p className="text-sm font-medium text-slate-800 leading-7 max-w-[17rem]">
                व्यवसाय को समझने, सीखने, सुझाव पाने, रिपोर्ट देखने और अपने व्यवसाय को बेहतर जानने में हम आपका साथ देते हैं।
              </p>
            </>
          )}
          {index === 2 && (
            <>
              <img src={growthIcon} alt="" className="w-20 h-auto mix-blend-multiply" />
              <Heading3 cls="text-2xl mt-3" />
              <Divider className="my-3" />
              <p className="text-sm font-medium text-slate-800 leading-7">सीखते रहिए, बढ़ते रहिए,<br />सफल होते रहिए ।</p>
              <img src={mountainClimber} alt="" className="w-full h-auto mt-4 mix-blend-multiply [mask-image:linear-gradient(to_bottom,transparent,black_18%)]" />
            </>
          )}
        </div>
        <div className="mt-4"><SlideDots index={index} /></div>
        {index !== 0 && <p className="mt-3 text-[11px] font-medium text-slate-500">Version 1.0</p>}
      </div>

      {/* ================= DESKTOP (landscape) ================= */}
      <div
        className="hidden lg:block relative w-full max-w-5xl h-[440px] mx-6 rounded-2xl border border-slate-200 shadow-card overflow-hidden bg-[#fbfdfb]"
        style={index === 1 ? undefined : { backgroundImage: WAVE_BG, backgroundSize: '100% 100%' }}
      >
        {index === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
            <Logo variant="splash" size="xl" />
            <Spinner big />
          </div>
        )}

        {index === 1 && (
          <div className="absolute inset-0 flex items-center px-16 gap-10">
            <img src={peopleTalking} alt="" className="w-[26rem] h-auto shrink-0 mix-blend-multiply" />
            <div className="flex-1 flex flex-col items-center text-center">
              <Heading2 cls="text-[2.15rem]" />
              <Divider className="my-4" />
              <p className="text-lg font-medium text-slate-800 leading-8 max-w-sm">
                व्यवसाय को समझने, सीखने, सुझाव पाने, रिपोर्ट देखने और अपने व्यवसाय को बेहतर जानने में हम आपका साथ देते हैं।
              </p>
            </div>
          </div>
        )}

        {index === 2 && (
          <div className="absolute inset-0 flex items-center">
            <img src={growthIcon} alt="" className="w-40 h-auto shrink-0 ml-16 mix-blend-multiply" />
            <div className="flex-1 flex flex-col items-center text-center px-6">
              <Heading3 cls="text-[2.3rem]" />
              <Divider className="my-4" />
              <p className="text-lg font-medium text-slate-800 leading-8">सीखते रहिए, बढ़ते रहिए,<br />सफल होते रहिए ।</p>
            </div>
            <img
              src={mountainClimber}
              alt=""
              className="h-full w-[26rem] shrink-0 object-cover object-left mix-blend-multiply [mask-image:linear-gradient(to_right,transparent,black_22%)]"
            />
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2"><SlideDots index={index} /></div>
      </div>
    </div>
  )
}
