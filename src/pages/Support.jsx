import React from 'react'
import { ClipboardEdit, Lightbulb, HelpCircle, PlayCircle, MessageCircle, PhoneCall } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import Button from '../components/common/Button'
import { NoteBanner } from '../components/common/Misc'
import { useApp } from '../context/AppContext'

const OPTIONS = [
  { icon: HelpCircle, title: 'सहायता लेख', desc: 'उपयोग गाइड और FAQ' },
  { icon: PlayCircle, title: 'वीडियो ट्यूटोरियल', desc: 'वीडियो देखकर सीखें' },
  { icon: MessageCircle, title: 'लाइव चैट', desc: 'हमसे बात करें' },
  { icon: PhoneCall, title: 'कॉल करें', desc: 'सहायता से सीधे बात करें' },
]

export default function Support() {
  const { pushToast } = useApp()

  return (
    <Layout title="सपोर्ट / हेल्प" subtitle="हम आपकी सहायता के लिए हमेशा तैयार हैं">
      <PageHeader code="SCR-015" title="सपोर्ट / हेल्प (Support & Help)" subtitle="हम आपकी सहायता के लिए हमेशा तैयार हैं" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
        <Card className="p-6 bg-blue-50 border-blue-100 text-center flex flex-col items-center">
          <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-navy-600 mb-3"><ClipboardEdit size={26} /></span>
          <h3 className="font-bold text-navy-700">A) शिकायत दर्ज करें</h3>
          <p className="text-sm text-navy-500 mb-1">(Shikayat Darj Kare)</p>
          <p className="text-sm text-slate-500 mb-4">ऐप या किसी समस्या के बारे में अपनी शिकायत हमें भेजें।</p>
          <Button variant="navy" onClick={() => pushToast('शिकायत फॉर्म खुलेगा', 'info')}>शिकायत दर्ज करें →</Button>
        </Card>

        <Card className="p-6 bg-emerald-50 border-emerald-100 text-center flex flex-col items-center">
          <span className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-brandGreen-700 mb-3"><Lightbulb size={26} /></span>
          <h3 className="font-bold text-brandGreen-700">B) गुणवत्ता सुधार का सुझाव दें</h3>
          <p className="text-sm text-brandGreen-600 mb-1">(Gunwatta Sudhar Ka Sujhao De)</p>
          <p className="text-sm text-slate-500 mb-4">ऐप को और बेहतर बनाने के लिए अपना सुझाव हमें भेजें।</p>
          <Button variant="primary" onClick={() => pushToast('सुझाव फॉर्म खुलेगा', 'info')}>सुझाव भेजें →</Button>
        </Card>
      </div>

      <Card className="p-5 mt-5 max-w-4xl">
        <h3 className="font-bold text-slate-800 mb-4">अन्य सहायता विकल्प</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {OPTIONS.map((o) => (
            <button key={o.title} onClick={() => pushToast(`${o.title} खोला जा रहा है`, 'info')} className="flex flex-col items-center gap-2 text-center focus-ring rounded-lg p-2 hover:bg-slate-50">
              <span className="w-11 h-11 rounded-full bg-slate-100 text-navy-600 flex items-center justify-center"><o.icon size={20} /></span>
              <div>
                <p className="text-sm font-semibold text-slate-700">{o.title}</p>
                <p className="text-xs text-slate-400">{o.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <div className="max-w-4xl mt-5">
        <NoteBanner>हमारी टीम जल्द से जल्द आपके साथ संपर्क करेगी।</NoteBanner>
      </div>
    </Layout>
  )
}
