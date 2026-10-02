import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import peopleTalking from '../assets/illus-people-talking.png'
import growthIcon from '../assets/illus-growth-icon.png'
import mountainClimber from '../assets/illus-mountain-climber.png'

const SLIDE_COUNT = 3
// width / height of the desktop card for each slide (from the prototype images)
const CARD_RATIO = [1278 / 393, 10 / 3, 1273 / 303]
const SHOW_DESKTOP_DOTS = false // prototype desktop cards have no dots (mobile keeps them)

// Soft rolling-hill background from the prototype (Slide-1 & Slide-3): very pale green,
// high at the left/right edges, dipping gently to nearly-white in the middle so text never touches it.
// viewBox matches the 10:3 desktop card.
const WAVE_DEFS = `<defs>
      <linearGradient id='a' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#f3f9f5' stop-opacity='.9'/>
        <stop offset='1' stop-color='#ebf5ef' stop-opacity='.9'/>
      </linearGradient>
      <linearGradient id='b' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#ecf5ef' stop-opacity='.85'/>
        <stop offset='1' stop-color='#e3f0e8' stop-opacity='.85'/>
      </linearGradient>
    </defs>`
const svgUrl = (inner) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 360' preserveAspectRatio='none'>${WAVE_DEFS}${inner}</svg>`
  )}")`

// Slide 1: hills on both sides
const WAVE_BG = svgUrl(`
    <path d='M0 202 C140 202 250 236 350 296 C430 344 500 352 600 352 C700 352 770 344 850 296 C950 236 1060 202 1200 202 L1200 360 L0 360 Z' fill='url(#a)'/>
    <path d='M0 276 C90 276 170 300 250 360 L0 360 Z' fill='url(#b)'/>
    <path d='M1200 276 C1110 276 1030 300 950 360 L1200 360 Z' fill='url(#b)'/>`)

// Slide 3: left hill only (ends before the mountain, which has its own misty hills)
const WAVE_BG_LEFT = svgUrl(`
    <path d='M0 202 C140 202 250 236 350 296 C400 330 450 360 520 360 L0 360 Z' fill='url(#a)'/>
    <path d='M0 276 C90 276 170 300 250 360 L0 360 Z' fill='url(#b)'/>`)

// Prototype loader ring: pale-grey track, green arc (top -> right) then blue arc (lower right).
const ringMask = (thick) => `radial-gradient(farthest-side, transparent calc(100% - ${thick}), #000 calc(100% - ${thick}))`
const ringStyle = (size, thick) => ({
  width: size, height: size, borderRadius: '50%',
  background: 'conic-gradient(from -35deg, #2f9e4f 0deg 105deg, #1f66b0 105deg 195deg, #dde1e4 195deg 360deg)',
  WebkitMask: ringMask(thick), mask: ringMask(thick),
})

const Divider = ({ className = '', align = 'center' }) => (
  <div className={`flex items-center gap-2 ${align === 'left' ? 'justify-start' : 'justify-center'} ${className}`}>
    <span className="h-px w-16 bg-navy-700/60" />
    <span className="w-2 h-2 rounded-full bg-brandOrange-500 shrink-0" />
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

// SCR-001: 3 slides × 2 sec, then -> SCR-002 (Company Setup).
// Home (SCR-003) is only reached from the "Home Screen पर जाएं" button at the end of Company Setup.
export default function Splash() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < SLIDE_COUNT - 1) setIndex((i) => i + 1)
      else navigate('/company-setup', { replace: true })
    }, 2000)
    return () => clearTimeout(timer)
  }, [index, navigate])

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
              <img src={growthIcon} alt="" className="w-20 h-auto" />
              <Heading3 cls="text-2xl mt-3" />
              <Divider className="my-3" />
              <p className="text-sm font-medium text-slate-800 leading-7">सीखते रहिए, बढ़ते रहिए,<br />सफल होते रहिए ।</p>
              <img src={mountainClimber} alt="" className="w-full h-auto mt-4" />
            </>
          )}
        </div>
        <div className="mt-4"><SlideDots index={index} /></div>
        {index !== 0 && <p className="mt-3 text-[11px] font-medium text-slate-500">Version 1.0</p>}
      </div>

      {/* ================= DESKTOP (landscape) — wide CARD like the prototype =================
          Each slide is a wide card with the prototype's own proportions (slide 1 = 1278x393,
          slide 2 = 10:3, slide 3 = 1273x303). The card is as wide as the window allows and is
          centred; every size inside is in cqw (1% of card width), so text, logo, hills and the
          mountain keep exactly the same relative positions at any screen size. */}
      <div className="hidden lg:flex fixed inset-0 items-center justify-center bg-white overflow-hidden">
        <div
          className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-card"
          style={{
            width: `min(96vw, calc(92vh * ${CARD_RATIO[index]}))`,
            aspectRatio: `${CARD_RATIO[index]}`,
            containerType: 'inline-size',
            ...(index === 0 ? { backgroundImage: WAVE_BG, backgroundSize: '100% 100%' } : {}),
            ...(index === 2 ? { backgroundImage: WAVE_BG_LEFT, backgroundSize: '100% 100%' } : {}),
          }}
        >
          {/* ---------- Slide 1 ---------- */}
          {index === 0 && (
            <>
              <div className="absolute" style={{ left: '23.5cqw', top: '1.2cqw', width: '57cqw' }}>
                <Logo variant="splash" size="xl" className="!w-full" />
              </div>
              <span
                className="absolute animate-spin"
                style={{ left: '50%', marginLeft: '-2.35cqw', top: '18.4cqw', ...ringStyle('4.7cqw', '0.6cqw') }}
              />
              <p className="absolute w-full text-center font-semibold text-navy-800" style={{ top: '24.1cqw', fontSize: '1.8cqw', lineHeight: '2.4cqw' }}>Loading...</p>
              <p className="absolute w-full text-center font-semibold text-navy-800" style={{ top: '27.2cqw', fontSize: '1.8cqw', lineHeight: '2.4cqw' }}>Version 1.0</p>
            </>
          )}

          {/* ---------- Slide 2 ---------- */}
          {index === 1 && (
            <>
              <img
                src={peopleTalking}
                alt=""
                className="absolute mix-blend-multiply"
                style={{ left: '4.1cqw', top: '50%', transform: 'translateY(-49%)', width: '41.8cqw' }}
              />
              <div className="absolute text-center whitespace-nowrap" style={{ left: '70cqw', top: '50%', transform: 'translate(-50%,-50%)' }}>
                <h2 className="font-extrabold text-navy-700" style={{ fontSize: '3.4cqw', lineHeight: 1.3 }}>
                  हम आपके <span className="text-brandGreen-700">व्यवसाय</span> के साथी हैं
                </h2>
                <div className="flex items-center justify-center" style={{ margin: '2.2cqw auto', width: '30cqw', gap: '1cqw' }}>
                  <span className="flex-1 h-px bg-navy-700/30" />
                  <span className="rounded-full bg-brandOrange-500" style={{ width: '1.1cqw', height: '1.1cqw' }} />
                  <span className="flex-1 h-px bg-brandGreen-700/30" />
                </div>
                <p className="font-medium text-slate-800" style={{ fontSize: '2.35cqw', lineHeight: 1.4 }}>
                  व्यवसाय को समझने, सीखने, सुझाव पाने,<br />
                  रिपोर्ट देखने और अपने व्यवसाय को<br />
                  बेहतर जानने में हम आपका साथ देते हैं।
                </p>
              </div>
            </>
          )}

          {/* ---------- Slide 3 (positions measured from the prototype, 1273 px = 100cqw) ---------- */}
          {index === 2 && (
            <>
              <img
                src={growthIcon}
                alt=""
                className="absolute"
                style={{ left: '9cqw', top: '9.4cqw', transform: 'translateY(-50%)', width: '17.6cqw' }}
              />
              <h2
                className="absolute text-center whitespace-nowrap font-bold text-navy-700"
                style={{ left: '43.6cqw', top: '8.4cqw', transform: 'translate(-50%,-50%)', fontSize: '3.73cqw', lineHeight: 1.2 }}
              >
                हर बड़ा व्यवसाय<br />एक छोटे कदम से<br /><span className="text-[#1e8a2f]">शुरू होता है ।</span>
              </h2>
              <p
                className="absolute text-center whitespace-nowrap font-semibold text-navy-700"
                style={{ left: '43.6cqw', top: '19.4cqw', transform: 'translate(-50%,-50%)', fontSize: '2.75cqw', lineHeight: 1.3 }}
              >
                सीखते रहिए, बढ़ते रहिए,<br />सफल होते रहिए ।
              </p>
              <img
                src={mountainClimber}
                alt=""
                className="absolute mix-blend-multiply"
                style={{
                  right: 0, bottom: 0, width: '41.5cqw', height: 'auto',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, #000 14%), linear-gradient(to bottom, transparent, #000 18%)',
                  WebkitMaskComposite: 'source-in',
                  maskImage: 'linear-gradient(to right, transparent, #000 14%), linear-gradient(to bottom, transparent, #000 18%)',
                  maskComposite: 'intersect',
                }}
              />
            </>
          )}

          {SHOW_DESKTOP_DOTS && <div className="absolute bottom-4 left-1/2 -translate-x-1/2"><SlideDots index={index} /></div>}
        </div>
      </div>
    </div>
  )
}