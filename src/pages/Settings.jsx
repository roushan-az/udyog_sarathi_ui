import React from 'react'
import { ChevronRight, Store, FileText, Landmark, User, Lock, CloudUpload, Headset, Info } from 'lucide-react'
import Layout from '../components/layout/Layout'
import MobileHeader from '../components/layout/MobileHeader'
import { useApp } from '../context/AppContext'

/* ---------- Design tokens (same family as SalesBill / CashBankTransfer) ---------- */
const C = {
  green: '#14612e',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e8ed',
}
const cl = (min, vw, max) => `clamp(${min}px, ${vw}vw, ${max}px)`
const PAD = 'clamp(12px, 4vw, 28px)' // same side padding as SalesBill mobile

/* tile = soft background of the big icon square, ink = icon colour */
const TONES = {
  blue: { tile: '#eaf1ff', ink: '#2563eb' },
  green: { tile: '#e6f4ea', ink: '#15803d' },
  orange: { tile: '#fff3dc', ink: '#f59e0b' },
  purple: { tile: '#f0e9fd', ink: '#7c3aed' },
  teal: { tile: '#e3f4f2', ink: '#0d9488' },
  red: { tile: '#fff0e8', ink: '#f97316' },
}

/* descM = the shorter description used on the mobile screen */
const SETTINGS = [
  { n: 1, kind: 'store', title: 'व्यवसाय की जानकारी', desc: 'नाम, पता, GST नंबर और अन्य जानकारी', descM: 'नाम, पता, GST नंबर, संपर्क जानकारी', tone: 'blue' },
  { n: 2, kind: 'bill', title: 'बिल सेटिंग', desc: 'बिल लेआउट, लोगो, बिल प्रीफ़िक्स, प्रिंट सेटिंग', descM: 'बिल लेआउट, लोगो, बिल प्रीफिक्स, प्रिंट सेटिंग', tone: 'green' },
  { n: 3, kind: 'bank', title: 'बैंक खाते', desc: 'बैंक खाता जोड़ें, डिफॉल्ट बैंक, UPI QR कोड', descM: 'बैंक खाता जोड़ें, डिफॉल्ट बैंक, UPI QR', tone: 'orange' },
  { n: 4, kind: 'user', title: 'उपयोगकर्ता एवं सुरक्षा', desc: 'पासवर्ड बदलें, PIN सेट करें, फिंगरप्रिंट लॉगिन, उपयोगकर्ता जोड़ें', descM: 'पासवर्ड, PIN, फिंगरप्रिंट लॉगिन, उपयोगकर्ता जोड़ें', tone: 'purple' },
  { n: 5, kind: 'backup', title: 'Backup & Restore', desc: 'डेटा बैंकअप लें, रिस्टोर करें, डेटा एक्सपोर्ट करें', descM: 'डेटा बैकअप लें, रिस्टोर करें, डेटा एक्सपोर्ट करें', tone: 'teal' },
  { n: 6, kind: 'help', title: 'सहायता एवं जानकारी', desc: 'संपर्क करें, ऐप संस्करण, गोपनीयता नीति, हमारे बारे में', descM: 'संपर्क करें, ऐप संस्करण, गोपनीयता नीति, हमारे बारे में', tone: 'red' },
]

const NOTE = 'किसी भी सेटिंग में बदलाव करने के बाद ऐप को दोबारा खोलने की आवश्यकता नहीं है। बदलाव तुरंत लागू हो जाते हैं।'
const NOTE_M = 'किसी भी सेटिंग में बदलाव करने के बाद ऐप को दोबारा खोलने की आवश्यकता नहीं है।'

/* `size` is a number (px) or any CSS length, so the icon can scale with clamp() on mobile */
function TileIcon({ kind, ink, size = 40, rupee = '15px' }) {
  const p = { strokeWidth: 1.6, style: { color: ink, width: size, height: size } }
  switch (kind) {
    case 'store': return <Store {...p} />
    case 'bill':
      return (
        <span className="relative inline-flex">
          <FileText {...p} />
          <span className="absolute inset-0 flex items-center justify-center font-bold" style={{ color: ink, fontSize: rupee, paddingTop: '18%' }}>₹</span>
        </span>
      )
    case 'bank': return <Landmark {...p} />
    case 'user':
      return (
        <span className="relative inline-flex">
          <User {...p} />
          <Lock strokeWidth={2.4} className="absolute -right-1.5 -bottom-0.5 rounded-sm" style={{ color: ink, background: '#f0e9fd', width: '40%', height: '40%' }} />
        </span>
      )
    case 'backup': return <CloudUpload {...p} />
    default: return <Headset {...p} />
  }
}

export default function Settings() {
  const { pushToast } = useApp()
  const open = (s) => pushToast(`${s.title} खुल रही है`, 'info')

  return (
    <Layout title="सेटिंग्स" subtitle="अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें">
      {/* ===================== DESKTOP (lg and up) ===================== */}
      <div className="hidden lg:block">
        {/* Page title */}
        <div className="pb-5 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
          <h1 className="text-[28px] font-bold leading-tight" style={{ color: C.label }}>सेटिंग्स (Settings)</h1>
          <p className="text-[14.5px] mt-2" style={{ color: C.muted }}>अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें</p>
        </div>

        {/* Settings list */}
        <div className="space-y-4">
          {SETTINGS.map((s) => {
            const t = TONES[s.tone]
            return (
              <button
                key={s.n}
                type="button"
                onClick={() => open(s)}
                className="w-full flex items-center gap-8 rounded-xl bg-white p-3 pr-7 text-left transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                style={{ border: `1px solid ${C.border}`, minHeight: 104 }}
              >
                <span className="w-20 h-20 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.tile }}>
                  <TileIcon kind={s.kind} ink={t.ink} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[18px] font-semibold leading-snug" style={{ color: C.label }}>
                    <span className="mr-3">{s.n}.</span>{s.title}
                  </p>
                  <p className="text-[14px] mt-2 leading-snug" style={{ color: C.muted }}>{s.desc}</p>
                </div>
                <ChevronRight size={24} className="shrink-0" style={{ color: C.text }} />
              </button>
            )
          })}
        </div>

        {/* Note */}
        <div className="flex items-center gap-3 rounded-lg px-4 min-h-[50px] py-2 mt-5" style={{ background: '#eef7f0', border: '1px solid #d7ebdc' }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
            <Info size={15} />
          </span>
          <p className="text-[13px] font-medium" style={{ color: C.text }}>{NOTE}</p>
        </div>

        <p className="text-center text-xs font-semibold text-green-800 mt-5">Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </div>

      {/* ===================== MOBILE (< lg) ===================== */}
      <SettingsMobile onOpen={open} />
    </Layout>
  )
}

/* =====================================================================
   MOBILE VIEW (phone / small tablet, < lg)
   Same shell as SalesBillMobile / CashBankTransferMobile: MobileHeader on
   top, scrolling body, Layout's bottom nav below. Every size is clamp()-
   based so tiles, icons, fonts and gaps scale with the screen width, and
   the gap between the cards equals the side padding feel of the page.
   ===================================================================== */
function SettingsMobile({ onOpen }) {
  const gap = cl(10, 3.2, 18)
  const tile = cl(48, 14, 84)
  const icon = cl(26, 8, 46)

  return (
    <div className="lg:hidden fixed inset-x-0 top-0 bottom-[56px] z-30 mx-auto w-full max-w-[900px] bg-white flex flex-col overflow-hidden">
      <MobileHeader />

      <main className="flex-1 overflow-y-auto overscroll-contain pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ paddingInline: PAD }}>
        {/* ---- title block ---- */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-md px-3 py-1 font-bold text-white leading-none" style={{ background: C.green, fontSize: cl(11, 3.4, 15) }}>SCR-014</span>
          <h1 className="font-bold leading-tight mt-2" style={{ color: C.label, fontSize: cl(20, 6.2, 30) }}>सेटिंग्स (Settings)</h1>
          <p className="font-medium mt-1 px-2" style={{ color: C.text, fontSize: cl(11, 3.2, 15) }}>अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें</p>
        </div>

        {/* ---- settings list ---- */}
        <ul className="flex flex-col mt-4" style={{ gap }}>
          {SETTINGS.map((s) => {
            const t = TONES[s.tone]
            return (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => onOpen(s)}
                  className="w-full flex items-center rounded-xl bg-white text-left active:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                  style={{ border: `1px solid ${C.border}`, padding: cl(8, 3.2, 16), gap: cl(12, 4.2, 22), minHeight: cl(72, 22, 112) }}
                >
                  <span className="rounded-xl flex items-center justify-center shrink-0" style={{ background: t.tile, width: tile, height: tile }}>
                    <TileIcon kind={s.kind} ink={t.ink} size={icon} rupee={cl(9, 2.8, 15)} />
                  </span>
                  <span className="flex-1 min-w-0 block">
                    <span className="block font-semibold leading-snug" style={{ color: C.label, fontSize: cl(14, 4.4, 20) }}>
                      <span style={{ marginRight: cl(6, 2, 12) }}>{s.n}.</span>{s.title}
                    </span>
                    <span className="block leading-snug" style={{ color: C.muted, fontSize: cl(11, 3.3, 15), marginTop: cl(3, 1, 8) }}>{s.descM}</span>
                  </span>
                  <ChevronRight className="shrink-0" style={{ color: C.text, width: cl(18, 5.4, 26), height: cl(18, 5.4, 26) }} />
                </button>
              </li>
            )
          })}
        </ul>

        {/* ---- note ---- */}
        <div className="flex items-center rounded-lg" style={{ background: '#eef7f0', border: '1px solid #d7ebdc', marginTop: gap, padding: cl(8, 3, 14), gap: cl(8, 2.6, 14), minHeight: cl(40, 11.5, 54) }}>
          <span className="rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green, width: cl(20, 6, 28), height: cl(20, 6, 28) }}>
            <Info style={{ width: '62%', height: '62%' }} />
          </span>
          <p className="font-medium" style={{ color: C.text, fontSize: cl(10.5, 3.2, 14) }}>{NOTE_M}</p>
        </div>

        <p className="text-center font-semibold mt-4" style={{ color: C.green, fontSize: cl(11, 3.3, 14) }}>Version 1.0 &nbsp;|&nbsp; © Udyog Sarthi</p>
      </main>
    </div>
  )
}