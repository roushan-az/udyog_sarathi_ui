import React from 'react'
import { ChevronRight, Store, Receipt, Landmark, UserCog, CloudUpload, Headset } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import { NoteBanner } from '../components/common/Misc'
import { useApp } from '../context/AppContext'

const SETTINGS = [
  { n: 1, icon: Store, title: 'व्यवसाय की जानकारी', desc: 'नाम, पता, GST नंबर और अन्य जानकारी', tone: 'blue' },
  { n: 2, icon: Receipt, title: 'बिल सेटिंग', desc: 'बिल लेआउट, लोगो, बिल प्रीफ़िक्स, प्रिंट सेटिंग', tone: 'green' },
  { n: 3, icon: Landmark, title: 'बैंक खाते', desc: 'बैंक खाता जोड़ें, डिफॉल्ट बैंक, UPI QR कोड', tone: 'orange' },
  { n: 4, icon: UserCog, title: 'उपयोगकर्ता एवं सुरक्षा', desc: 'पासवर्ड बदलें, PIN सेट करें, फिंगरप्रिंट लॉगिन, उपयोगकर्ता जोड़ें', tone: 'purple' },
  { n: 5, icon: CloudUpload, title: 'Backup & Restore', desc: 'डेटा बैंकअप लें, रिस्टोर करें, डेटा एक्सपोर्ट करें', tone: 'sky' },
  { n: 6, icon: Headset, title: 'सहायता एवं जानकारी', desc: 'संपर्क करें, ऐप संस्करण, गोपनीयता नीति, हमारे बारे में', tone: 'red' },
]

const TONE = {
  blue: 'bg-blue-50 text-navy-700', green: 'bg-emerald-50 text-brandGreen-700', orange: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700', sky: 'bg-sky-50 text-sky-700', red: 'bg-red-50 text-red-600',
}

export default function Settings() {
  const { pushToast } = useApp()

  return (
    <Layout title="सेटिंग्स" subtitle="अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें">
      <PageHeader code="SCR-014" title="सेटिंग्स (Settings)" subtitle="अपने व्यवसाय और ऐप की सेटिंग्स प्रबंधित करें" />

      <div className="space-y-3 max-w-3xl">
        {SETTINGS.map((s) => (
          <Card
            key={s.n}
            as="button"
            onClick={() => pushToast(`${s.title} खुल रही है`, 'info')}
            className="w-full p-4 flex items-center gap-4 text-left hover:shadow-md transition-shadow focus-ring"
          >
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${TONE[s.tone]}`}>
              <s.icon size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800">{s.n}. {s.title}</p>
              <p className="text-sm text-slate-500 truncate">{s.desc}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 shrink-0" />
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mt-5">
        <NoteBanner>किसी भी सेटिंग में बदलाव करने के बाद ऐप को दोबारा खोलने की आवश्यकता नहीं है। बदलाव तुरंत लागू हो जाते हैं।</NoteBanner>
      </div>
    </Layout>
  )
}
