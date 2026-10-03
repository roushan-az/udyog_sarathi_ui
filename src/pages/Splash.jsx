import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import peopleTalking from '../assets/illus-people-talking.png'
import growthIcon from '../assets/illus-growth-icon.png'
import mountainClimber from '../assets/illus-mountain-climber.png'
import mountainMobile from '../assets/illus-mountain-mobile.png'

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

// Slide 3: left hills only, traced from the prototype card (viewBox = card 1273 x 303).
// Layer 1 starts at y=174 on the left edge and sinks to the card bottom by x~420 (fading to white);
// layer 2 is the darker strip at the bottom-left. Both stay well below the icon and end before the mountain.
const WAVE_BG_LEFT = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1273 303' preserveAspectRatio='none'>
    <defs>
      <linearGradient id='h1' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='420' y2='0'>
        <stop offset='0' stop-color='#e6f1e9'/><stop offset='.3' stop-color='#ebf3ec'/>
        <stop offset='.66' stop-color='#f5f9f5'/><stop offset='1' stop-color='#fcfdfc'/>
      </linearGradient>
      <linearGradient id='h2' gradientUnits='userSpaceOnUse' x1='0' y1='0' x2='235' y2='0'>
        <stop offset='0' stop-color='#dfeee3'/><stop offset='1' stop-color='#eaf4ed'/>
      </linearGradient>
    </defs>
    <path d='M0 174 C6 174 25 175 36 177 C47 179 56 184 66 188 C76 192 86 197 96 203 C106 209 116 218 126 226 C136 234 146 242 156 248 C166 254 174 260 186 265 C198 270 215 275 230 279 C245 283 261 285 276 287 C291 289 303 291 320 293 C337 295 363 299 380 301 C397 303 413 303 420 303 L0 303 Z' fill='url(#h1)'/>
    <path d='M0 233 C6 234 25 235 36 236 C47 237 56 239 66 241 C76 243 86 246 96 249 C106 252 116 256 126 260 C136 264 146 270 156 274 C166 278 176 283 186 287 C196 291 207 296 215 299 C223 302 232 302 235 303 L0 303 Z' fill='url(#h2)'/>
  </svg>`
)}")`

// Mobile slide 1: soft pale-green hills along the bottom of the phone screen (prototype Slide-1).
// Drawn in a fixed 400 x 170 box that is pinned to the bottom, so the hills keep their shape on any phone height.
const WAVE_BG_MOBILE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 170' preserveAspectRatio='none'>
    <defs>
      <linearGradient id='m1' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#f6faf7'/><stop offset='1' stop-color='#ecf5ef'/>
      </linearGradient>
      <linearGradient id='m2' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#eef6f1'/><stop offset='1' stop-color='#e2efe7'/>
      </linearGradient>
    </defs>
    <path d='M0 62 C60 40 130 52 200 92 C260 126 330 128 400 96 L400 170 L0 170 Z' fill='url(#m1)'/>
    <path d='M0 120 C70 100 150 132 240 140 C310 146 360 136 400 122 L400 170 L0 170 Z' fill='url(#m2)'/>
  </svg>`
)}")`

// Prototype loader ring: pale-grey track, green arc (top -> right) then blue arc (lower right).
const ringMask = (thick) => `radial-gradient(farthest-side, transparent calc(100% - ${thick}), #000 calc(100% - ${thick}))`
const ringStyle = (size, thick) => ({
  width: size, height: size, borderRadius: '50%',
  background: 'conic-gradient(from -35deg, #2f9e4f 0deg 105deg, #1f66b0 105deg 195deg, #dde1e4 195deg 360deg)',
  WebkitMask: ringMask(thick), mask: ringMask(thick),
})

// Slide dots. Desktop keeps the original (rem based) look; mobile scales with the phone width (cqw)
// and can use white inactive dots so they stay visible over the mountain image on slide 3.
function SlideDots({ index, mobile = false, light = false, size = '4.2cqw', gap = '6.8cqw' }) {
  if (!mobile) {
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all ${i === index ? 'w-2 bg-brandGreen-600' : 'w-2 bg-slate-300'}`} />
        ))}
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center" style={{ gap }}>
      {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="rounded-full transition-all"
          style={{
            width: size,
            height: size,
            background: i === index ? '#1e8a2f' : light ? '#ffffff' : '#bfc2c5',
          }}
        />
      ))}
    </div>
  )
}

// Thin line - orange dot - thin line (mobile). Width is a % of phone width.
const MobileDivider = ({ width = '84cqw', lineOpacity = 0.5, margin, dot = '2.2cqw' }) => (
  <div className="flex items-center justify-center mx-auto" style={{ width, gap: '1.6cqw', margin }}>
    <span className="flex-1 bg-navy-700" style={{ height: '1px', opacity: lineOpacity }} />
    <span className="rounded-full bg-brandOrange-500 shrink-0" style={{ width: dot, height: dot }} />
    <span className="flex-1 bg-brandGreen-700" style={{ height: '1px', opacity: lineOpacity }} />
  </div>
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
      {/* ================= MOBILE (portrait) =================
          Rebuilt to match the prototype phone screens exactly. The screen fills the phone
          (full height, max 430px wide; on small tablets it sits centred inside a rounded frame).
          Every size is in cqw (1% of the screen width) and vertical anchors are % of the screen height,
          so text, logo, spinner, illustrations, hills and dots keep the prototype's proportions on every phone. */}
      <div
        className="lg:hidden relative w-full max-w-[430px] h-screen h-[100dvh] sm:h-[min(880px,calc(100dvh-3rem))] sm:my-6 sm:rounded-[2rem] sm:border sm:border-slate-200 sm:shadow-card overflow-hidden bg-white"
        style={{ containerType: 'inline-size' }}
      >
        {/* ---------- Slide 1 : logo + loader ---------- */}
        {index === 0 && (
          <>
            {/* pale-green hills at the bottom */}
            <div
              className="absolute left-0 bottom-0 w-full pointer-events-none"
              style={{ height: '78cqw', backgroundImage: WAVE_BG_MOBILE, backgroundSize: '100% 100%' }}
            />
            <div className="absolute" style={{ left: '0', top: '14%', width: '100cqw' }}>
              <Logo variant="splash" size="xl" className="!w-full" />
            </div>
            <div className="absolute w-full flex flex-col items-center" style={{ top: '58%', gap: '2.8cqw' }}>
              <span className="animate-spin block" style={ringStyle('14cqw', '1.7cqw')} />
              <p className="font-bold text-navy-800 text-center" style={{ fontSize: '5.7cqw', lineHeight: '7.6cqw' }}>Loading...</p>
            </div>
            <p
              className="absolute w-full text-center font-bold text-navy-800"
              style={{ bottom: '3.4%', fontSize: '5.2cqw', lineHeight: '6.8cqw' }}
            >
              Version 1.0
            </p>
          </>
        )}

        {/* ---------- Slide 2 : people talking ---------- */}
        {index === 1 && (
          <>
            <img
              src={peopleTalking}
              alt=""
              className="absolute mix-blend-multiply h-auto"
              style={{ left: '50%', transform: 'translateX(-50%)', top: '7%', width: '94cqw' }}
            />
            <div className="absolute w-full text-center" style={{ top: '45.5%' }}>
              <h2 className="font-extrabold text-navy-700 whitespace-nowrap" style={{ fontSize: '7.2cqw', lineHeight: '9.4cqw' }}>
                हम आपके <span className="text-brandGreen-700">व्यवसाय</span> के साथी हैं
              </h2>
              <MobileDivider width="86cqw" lineOpacity={0.55} margin="5cqw auto 4.6cqw" />
              <p className="font-medium text-slate-800 whitespace-nowrap" style={{ fontSize: '5.7cqw', lineHeight: '10.4cqw' }}>
                व्यवसाय को समझने, सीखने, सुझाव पाने,<br />
                रिपोर्ट देखने और अपने व्यवसाय को<br />
                बेहतर जानने में हम आपका साथ देते हैं।
              </p>
            </div>
          </>
        )}

        {/* ---------- Slide 3 : small steps / mountain ---------- */}
        {index === 2 && (
          <>
            <img
              src={growthIcon}
              alt=""
              className="absolute h-auto"
              style={{ left: '50%', transform: 'translate(-50%,-50%)', top: '15.5%', width: '40cqw' }}
            />
            <div className="absolute w-full text-center" style={{ top: 'calc(26% - 5.7cqw)' }}>
              <h2 className="font-bold text-navy-700 whitespace-nowrap" style={{ fontSize: '9.2cqw', lineHeight: '11.4cqw' }}>
                हर बड़ा व्यवसाय<br />एक छोटे कदम से<br /><span className="text-[#1e8a2f]">शुरू होता है ।</span>
              </h2>
              <MobileDivider width="44cqw" lineOpacity={0.45} dot="3.2cqw" margin="3cqw auto 3.4cqw" />
              <p className="font-medium text-navy-700 whitespace-nowrap" style={{ fontSize: '6.3cqw', lineHeight: '9cqw' }}>
                सीखते रहिए, बढ़ते रहिए,<br />सफल होते रहिए ।
              </p>
            </div>
            {/* full mobile scene (climber, hills, forest and winding path) - pinned to the bottom, full width */}
            <img
              src={mountainMobile}
              alt=""
              className="absolute left-0 bottom-0 w-full h-auto mix-blend-multiply pointer-events-none select-none"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 12%)',
                maskImage: 'linear-gradient(to bottom, transparent, #000 12%)',
              }}
            />
          </>
        )}

        {/* dots: slides 2 & 3 only (prototype slide 1 shows "Version 1.0" instead) */}
        {index !== 0 && (
          <div className="absolute w-full z-10" style={{ bottom: '3.6%' }}>
            <SlideDots
              index={index}
              mobile
              light={index === 2}
              size={index === 2 ? '4.8cqw' : '4.2cqw'}
              gap={index === 2 ? '4.4cqw' : '6.8cqw'}
            />
          </div>
        )}
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