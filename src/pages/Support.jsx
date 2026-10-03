import React from 'react'
import {
  ClipboardEdit, Lightbulb, HelpCircle, MonitorPlay, MessageCircle, Phone, ArrowRight, Info,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import { useApp } from '../context/AppContext'

/* ---------- Design tokens (same family as SalesBill / Settings / CashBankTransfer) ---------- */
const C = {
  green: '#14612e',
  greenInk: '#15803d',
  label: '#1e3a8a',
  blue: '#2563eb',
  blueBtn: '#1d4ed8',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e8ed',
}
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)' // same side padding as SalesBill mobile

/* screen code shown in the mobile title badge: change if your prototype uses another number */
const SCR_CODE = 'SCR-015'

const OPTIONS = [
  { icon: HelpCircle, title: 'सहायता लेख', desc: 'उपयोग गाइड और FAQ' },
  { icon: MonitorPlay, title: 'वीडियो ट्यूटोरियल', desc: 'वीडियो देखकर सीखें' },
  { icon: MessageCircle, title: 'लाइव चैट', desc: 'हमसे बात करें' },
  { icon: Phone, title: 'कॉल करें', desc: 'सहायता से सीधे बात करें' },
]

const CARDS = [
  {
    key: 'complaint',
    bg: '#f3f6ff', border: '#dfe6f7',
    icon: ClipboardEdit, iconColor: C.blue, titleColor: C.label,
    title: 'A) शिकायत दर्ज करें', sub: '(Shikayat Darj Kare)',
    desc: 'ऐप या किसी समस्या के बारे में अपनी शिकायत हमें भेजें।',
    btn: 'शिकायत दर्ज करें', btnBg: C.blueBtn, toast: 'शिकायत फॉर्म खुलेगा',
  },
  {
    key: 'suggest',
    bg: '#f2faf4', border: '#d9ecde',
    icon: Lightbulb, iconColor: C.greenInk, titleColor: C.greenInk,
    title: 'B) गुणवत्ता सुधार का सुझाव दें', sub: '(Gunwatta Sudhar Ka Sujhao De)',
    desc: 'ऐप को और बेहतर बनाने के लिए अपना सुझाव हमें भेजें।',
    btn: 'सुझाव भेजें', btnBg: C.green, toast: 'सुझाव फॉर्म खुलेगा',
  },
]

const NOTE = 'हमारी टीम जल्द से जल्द आपके साथ संपर्क करेगी।'

export default function Support() {
  const { pushToast } = useApp()
  const info = (msg) => pushToast(msg, 'info')

  return (
    <Layout title="सपोर्ट / हेल्प" subtitle="हम आपकी सहायता के लिए हमेशा तैयार हैं">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
        {/* Page title */}
        <div className="pb-5 mb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h1 className="text-[28px] font-bold leading-tight" style={{ color: C.label }}>सपोर्ट / हेल्प (Support &amp; Help)</h1>
          <p className="text-[14.5px] mt-2" style={{ color: C.muted }}>हम आपकी सहायता के लिए हमेशा तैयार हैं</p>
        </div>

        <div className="lg:pr-4 space-y-7">
          {/* A / B cards */}
          <div className="grid grid-cols-2 gap-6 xl:gap-9">
            {CARDS.map((c) => (
              <ActionCard key={c.key} {...c} onClick={() => info(c.toast)} />
            ))}
          </div>

          {/* Other help options */}
          <div className="rounded-xl bg-white px-6 pt-5 pb-6" style={{ border: `1px solid ${C.border}` }}>
            <h3 className="text-[16px] font-bold mb-5" style={{ color: C.label }}>अन्य सहायता विकल्प</h3>
            <div className="grid grid-cols-4">
              {OPTIONS.map((o, i) => (
                <button
                  key={o.title}
                  type="button"
                  onClick={() => info(`${o.title} खोला जा रहा है`)}
                  className="flex items-center gap-4 px-5 py-2 text-left hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  style={i > 0 ? { borderLeft: `1px solid ${C.border}` } : { borderRadius: 8 }}
                >
                  <o.icon size={38} strokeWidth={1.5} className="shrink-0" style={{ color: C.blue }} />
                  <span className="min-w-0">
                    <span className="block text-[14.5px] font-semibold" style={{ color: C.label }}>{o.title}</span>
                    <span className="block text-[13px] mt-1.5" style={{ color: C.muted }}>{o.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="flex items-center gap-3 rounded-lg px-4 min-h-14 py-2" style={{ background: '#f1f8f3', border: '1px solid #dcebe0' }}>
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
              <Info size={15} />
            </span>
            <p className="text-[14px]" style={{ color: C.text }}>{NOTE}</p>
          </div>
        </div>

        <p className="text-center text-xs font-semibold text-green-800 mt-5">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </div>

      {/* ===================== MOBILE (< lg) ===================== */}
      <SupportMobile onCard={(c) => info(c.toast)} onOption={(o) => info(`${o.title} खोला जा रहा है`)} />
    </Layout>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg)
   Same shell as SalesBillMobile / SettingsMobile: MobileHeader on top,
   scrolling body, Layout's bottom nav below. Everything is clamp()-based
   so icons, fonts, buttons and gaps scale with the screen width; the two
   action cards sit side by side once there is room (tablets).
   ===================================================================== */
function SupportMobile({ onCard, onOption }) {
  const gap = cl(10, 3.2, 18)
  const cardPad = cl(14, 4.6, 26)

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>{SCR_CODE}</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>सपोर्ट / हेल्प (Support &amp; Help)</h1>
          <p className="font-medium mt-1 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>हम आपकी सहायता के लिए हमेशा तैयार हैं</p>
        </div>

        {/* ---- A / B cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-4" style={{ gap }}>
          {CARDS.map((c) => (
            <div
              key={c.key}
              className="rounded-xl flex flex-col items-center text-center"
              style={{ background: c.bg, border: `1px solid ${c.border}`, padding: cardPad }}
            >
              <span className="rounded-full bg-white flex items-center justify-center shrink-0" style={{ border: '1px solid #e8ecf3', width: cl(64, 21, 104), height: cl(64, 21, 104) }}>
                <c.icon strokeWidth={1.4} style={{ color: c.iconColor, width: cl(32, 10.5, 52), height: cl(32, 10.5, 52) }} />
              </span>

              <h2 className="font-bold leading-snug" style={{ color: c.titleColor, fontSize: cl(16, 5, 22), marginTop: cl(10, 3.4, 20) }}>{c.title}</h2>
              <p className="font-semibold leading-snug" style={{ color: c.titleColor, fontSize: cl(12, 3.7, 17), marginTop: cl(3, 1, 8) }}>{c.sub}</p>

              <div className="w-4/5" style={{ borderTop: '1px solid #dfe3ea', marginBlock: cl(10, 3.4, 20) }} />

              <p className="flex-1" style={{ color: C.text, fontSize: cl(12, 3.6, 15) }}>{c.desc}</p>

              <button
                type="button"
                onClick={() => onCard(c)}
                className="w-full inline-flex items-center justify-center rounded-lg font-semibold text-white active:opacity-90 focus-ring"
                style={{ background: c.btnBg, height: cl(40, 11.5, 52), marginTop: cl(12, 4, 22), gap: cl(8, 2.6, 12), fontSize: cl(13, 3.9, 17) }}
              >
                {c.btn} <ArrowRight style={{ width: cl(16, 4.8, 22), height: cl(16, 4.8, 22) }} />
              </button>
            </div>
          ))}
        </div>

        {/* ---- other help options ---- */}
        <section className="rounded-xl border bg-white" style={{ borderColor: C.border, padding: cl(12, 3.6, 22), marginTop: gap }}>
          <h2 className="font-bold" style={{ color: C.label, fontSize: cl(14, 4.3, 19), marginBottom: cl(6, 2, 12) }}>अन्य सहायता विकल्प</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4">
            {OPTIONS.map((o, i) => (
              <li key={o.title} className={i === 0 ? '' : i === 1 ? 'border-t sm:border-t-0' : 'border-t'} style={{ borderColor: C.border }}>
                <button
                  type="button"
                  onClick={() => onOption(o)}
                  className="w-full flex items-center text-left active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded-lg"
                  style={{ gap: cl(12, 4, 20), paddingBlock: cl(10, 3.2, 16) }}
                >
                  <o.icon strokeWidth={1.5} className="shrink-0" style={{ color: C.blue, width: cl(28, 8.6, 40), height: cl(28, 8.6, 40) }} />
                  <span className="flex-1 min-w-0 block">
                    <span className="block font-semibold leading-snug" style={{ color: C.label, fontSize: cl(13, 3.9, 17) }}>{o.title}</span>
                    <span className="block leading-snug" style={{ color: C.muted, fontSize: cl(11, 3.3, 14), marginTop: cl(2, 0.8, 6) }}>{o.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- note ---- */}
        <div className="flex items-center rounded-lg" style={{ background: '#f1f8f3', border: '1px solid #dcebe0', marginTop: gap, padding: cl(8, 3, 14), gap: cl(8, 2.6, 14), minHeight: cl(40, 11.5, 54) }}>
          <span className="rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green, width: cl(20, 6, 28), height: cl(20, 6, 28) }}>
            <Info style={{ width: '62%', height: '62%' }} />
          </span>
          <p className="font-medium" style={{ color: C.text, fontSize: cl(11, 3.3, 14.5) }}>{NOTE}</p>
        </div>

        <p className="text-center font-semibold mt-4" style={{ color: C.green, fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>
    </div>
  )
}

/* ====================== desktop helper ====================== */

function ActionCard({ bg, border, icon: Icon, iconColor, titleColor, title, sub, desc, btn, btnBg, onClick }) {
  return (
    <div
      className="rounded-xl flex flex-col items-center text-center px-8 pt-6 pb-9 min-h-[440px]"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <span
        className="w-[112px] h-[112px] rounded-full bg-white flex items-center justify-center shrink-0"
        style={{ border: '1px solid #e8ecf3' }}
      >
        <Icon size={56} strokeWidth={1.4} style={{ color: iconColor }} />
      </span>

      <h3 className="text-[22px] font-bold mt-7 leading-snug" style={{ color: titleColor }}>{title}</h3>
      <p className="text-[18px] font-semibold mt-3 leading-snug" style={{ color: titleColor }}>{sub}</p>

      <div className="w-4/5 my-7" style={{ borderTop: '1px solid #dfe3ea' }} />

      <p className="text-[15px]" style={{ color: C.text }}>{desc}</p>

      <button
        type="button"
        onClick={onClick}
        className="mt-auto inline-flex items-center justify-center gap-3 h-[52px] px-8 min-w-[275px] rounded-md text-[19px] font-semibold text-white"
        style={{ background: btnBg }}
      >
        {btn} <ArrowRight size={22} />
      </button>
    </div>
  )
}