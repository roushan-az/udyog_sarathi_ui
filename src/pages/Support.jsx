import React from 'react'
import {
  ClipboardEdit, Lightbulb, HelpCircle, MonitorPlay, MessageCircle, Phone, ArrowRight, Info,
} from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'

/* ---------- Design tokens (same family as the other SCR pages) ---------- */
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

const OPTIONS = [
  { icon: HelpCircle, title: 'सहायता लेख', desc: 'उपयोग गाइड और FAQ' },
  { icon: MonitorPlay, title: 'वीडियो ट्यूटोरियल', desc: 'वीडियो देखकर सीखें' },
  { icon: MessageCircle, title: 'लाइव चैट', desc: 'हमसे बात करें' },
  { icon: Phone, title: 'कॉल करें', desc: 'सहायता से सीधे बात करें' },
]

export default function Support() {
  const { pushToast } = useApp()

  return (
    <Layout title="सपोर्ट / हेल्प" subtitle="हम आपकी सहायता के लिए हमेशा तैयार हैं">
      {/* ---------------- Page title ---------------- */}
      <div className="pb-5 mb-6" style={{ borderBottom: `1px solid ${C.border}` }}>
        <h1 className="text-[28px] font-bold leading-tight" style={{ color: C.label }}>सपोर्ट / हेल्प (Support &amp; Help)</h1>
        <p className="text-[14.5px] mt-2" style={{ color: C.muted }}>हम आपकी सहायता के लिए हमेशा तैयार हैं</p>
      </div>

      <div className="lg:pr-4 space-y-7">
        {/* ---------------- A / B cards ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-9">
          <ActionCard
            bg="#f3f6ff" border="#dfe6f7"
            icon={ClipboardEdit} iconColor={C.blue}
            titleColor={C.label}
            title="A) शिकायत दर्ज करें" sub="(Shikayat Darj Kare)"
            desc="ऐप या किसी समस्या के बारे में अपनी शिकायत हमें भेजें।"
            btn="शिकायत दर्ज करें" btnBg={C.blueBtn}
            onClick={() => pushToast('शिकायत फॉर्म खुलेगा', 'info')}
          />
          <ActionCard
            bg="#f2faf4" border="#d9ecde"
            icon={Lightbulb} iconColor={C.greenInk}
            titleColor={C.greenInk}
            title="B) गुणवत्ता सुधार का सुझाव दें" sub="(Gunwatta Sudhar Ka Sujhao De)"
            desc="ऐप को और बेहतर बनाने के लिए अपना सुझाव हमें भेजें।"
            btn="सुझाव भेजें" btnBg={C.green}
            onClick={() => pushToast('सुझाव फॉर्म खुलेगा', 'info')}
          />
        </div>

        {/* ---------------- Other help options ---------------- */}
        <div className="rounded-xl bg-white px-6 pt-5 pb-6" style={{ border: `1px solid ${C.border}` }}>
          <h3 className="text-[16px] font-bold mb-5" style={{ color: C.label }}>अन्य सहायता विकल्प</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {OPTIONS.map((o, i) => (
              <button
                key={o.title}
                type="button"
                onClick={() => pushToast(`${o.title} खोला जा रहा है`, 'info')}
                className="flex items-center gap-4 px-5 py-2 text-left rounded-lg hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
                style={i > 0 ? { borderLeft: `1px solid ${C.border}`, borderRadius: 0 } : undefined}
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

        {/* ---------------- Note ---------------- */}
        <div className="flex items-center gap-3 rounded-lg px-4 h-14" style={{ background: '#f1f8f3', border: '1px solid #dcebe0' }}>
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
            <Info size={15} />
          </span>
          <p className="text-[14px]" style={{ color: C.text }}>हमारी टीम जल्द से जल्द आपके साथ संपर्क करेगी।</p>
        </div>
      </div>
    </Layout>
  )
}

/* ====================== helpers ====================== */

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