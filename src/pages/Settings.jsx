import React from 'react'
import { ChevronRight, Store, FileText, Landmark, User, Lock, CloudUpload, Headset, Info } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { useApp } from '../context/AppContext'

/* ---------- Design tokens (same family as the other SCR pages) ---------- */
const C = {
  green: '#14612e',
  label: '#1e3a8a',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#e5e8ed',
}

/* tile = soft background of the big icon square, ink = icon colour */
const TONES = {
  blue: { tile: '#eaf1ff', ink: '#2563eb' },
  green: { tile: '#e6f4ea', ink: '#15803d' },
  orange: { tile: '#fff3dc', ink: '#f59e0b' },
  purple: { tile: '#f0e9fd', ink: '#7c3aed' },
  teal: { tile: '#e3f4f2', ink: '#0d9488' },
  red: { tile: '#fff0e8', ink: '#f97316' },
}

const SETTINGS = [
  { n: 1, kind: 'store', title: 'व्यवसाय की जानकारी', desc: 'नाम, पता, GST नंबर और अन्य जानकारी', tone: 'blue' },
  { n: 2, kind: 'bill', title: 'बिल सेटिंग', desc: 'बिल लेआउट, लोगो, बिल प्रीफ़िक्स, प्रिंट सेटिंग', tone: 'green' },
  { n: 3, kind: 'bank', title: 'बैंक खाते', desc: 'बैंक खाता जोड़ें, डिफॉल्ट बैंक, UPI QR कोड', tone: 'orange' },
  { n: 4, kind: 'user', title: 'उपयोगकर्ता एवं सुरक्षा', desc: 'पासवर्ड बदलें, PIN सेट करें, फिंगरप्रिंट लॉगिन, उपयोगकर्ता जोड़ें', tone: 'purple' },
  { n: 5, kind: 'backup', title: 'Backup & Restore', desc: 'डेटा बैंकअप लें, रिस्टोर करें, डेटा एक्सपोर्ट करें', tone: 'teal' },
  { n: 6, kind: 'help', title: 'सहायता एवं जानकारी', desc: 'संपर्क करें, ऐप संस्करण, गोपनीयता नीति, हमारे बारे में', tone: 'red' },
]

function TileIcon({ kind, ink }) {
  const p = { size: 40, strokeWidth: 1.6, style: { color: ink } }
  switch (kind) {
    case 'store': return <Store {...p} />
    case 'bill':
      return (
        <span className="relative inline-flex">
          <FileText {...p} />
          <span className="absolute inset-0 flex items-center justify-center text-[15px] font-bold pt-2" style={{ color: ink }}>₹</span>
        </span>
      )
    case 'bank': return <Landmark {...p} />
    case 'user':
      return (
        <span className="relative inline-flex">
          <User {...p} />
          <Lock size={16} strokeWidth={2.4} className="absolute -right-1.5 -bottom-0.5 rounded-sm" style={{ color: ink, background: '#f0e9fd' }} />
        </span>
      )
    case 'backup': return <CloudUpload {...p} />
    default: return <Headset {...p} />
  }
}

export default function Settings() {
  const { pushToast } = useApp()

  return (
    <Layout title="सेटिंग्स" subtitle="अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें">
      {/* ---------------- Page title ---------------- */}
      <div className="pb-5 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
        <h1 className="text-[28px] font-bold leading-tight" style={{ color: C.label }}>सेटिंग्स (Settings)</h1>
        <p className="text-[14.5px] mt-2" style={{ color: C.muted }}>अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें</p>
      </div>

      {/* ---------------- Settings list ---------------- */}
      <div className="space-y-4">
        {SETTINGS.map((s) => {
          const t = TONES[s.tone]
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => pushToast(`${s.title} खुल रही है`, 'info')}
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

      {/* ---------------- Note ---------------- */}
      <div
        className="flex items-center gap-3 rounded-lg px-4 h-[50px] mt-5"
        style={{ background: '#eef7f0', border: '1px solid #d7ebdc' }}
      >
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: C.green }}>
          <Info size={15} />
        </span>
        <p className="text-[13px] font-medium" style={{ color: C.text }}>
          किसी भी सेटिंग में बदलाव करने के बाद ऐप को दोबारा खोलने की आवश्यकता नहीं है। बदलाव तुरंत लागू हो जाते हैं।
        </p>
      </div>
    </Layout>
  )
}