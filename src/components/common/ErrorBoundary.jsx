import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surfaces in the browser console so it's easy to spot during development.
    console.error('Udyog Sarthi crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-card p-6 text-center">
            <span className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
              <AlertTriangle size={24} />
            </span>
            <h1 className="text-lg font-bold text-slate-800 mb-1">कुछ गलत हो गया</h1>
            <p className="text-sm text-slate-500 mb-4">
              पेज लोड करने में समस्या हुई। कृपया पेज को रीलोड करें। समस्या बनी रहे तो नीचे दिया गया तकनीकी विवरण डेवलपर के साथ साझा करें।
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-600 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-700 focus-ring"
            >
              <RefreshCw size={15} /> पेज रीलोड करें
            </button>
            <pre className="mt-4 text-left text-xs text-red-500 bg-red-50 rounded-lg p-3 overflow-auto max-h-40 whitespace-pre-wrap">
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
