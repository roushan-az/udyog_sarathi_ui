import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users2, TrendingUp } from 'lucide-react'
import Logo from '../components/common/Logo'

const SLIDES = [
  {
    key: 'slide1',
    render: () => (
      <div className="flex flex-col items-center text-center gap-4">
        <Logo size="lg" />
      </div>
    ),
  },
  {
    key: 'slide2',
    render: () => (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-brandGreen-50 flex items-center justify-center">
          <Users2 size={40} className="text-brandGreen-700" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">हम आपके व्यवसाय के साथी हैं</h2>
        <p className="text-sm text-slate-500 max-w-xs">
          व्यवसाय को समझने, सीखने, सुझाव पाने, रिपोर्ट देखने और अपने व्यवसाय को बेहतर जानने में हम आपका साथ देते हैं।
        </p>
      </div>
    ),
  },
  {
    key: 'slide3',
    render: () => (
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center">
          <TrendingUp size={40} className="text-brandOrange-500" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">हर बड़ा व्यवसाय एक छोटे कदम से शुरू होता है।</h2>
        <p className="text-sm text-slate-500 max-w-xs">सीखते रहिए, बढ़ते रहिए, सफल होते रहिए।</p>
      </div>
    ),
  },
]

export default function Splash({ firstTime = true }) {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < SLIDES.length - 1) {
        setIndex((i) => i + 1)
      } else {
        navigate(firstTime ? '/company-setup' : '/', { replace: true })
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [index, navigate, firstTime])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <div className="min-h-[220px] flex items-center justify-center">{SLIDES[index].render()}</div>

        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, i) => (
            <span key={s.key} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-brandGreen-600' : 'w-1.5 bg-slate-200'}`} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-brandGreen-600 animate-spin" />
          <p className="text-xs text-slate-400">Loading...</p>
        </div>

        <p className="text-xs text-slate-300">Version 1.0</p>
      </div>
    </div>
  )
}
