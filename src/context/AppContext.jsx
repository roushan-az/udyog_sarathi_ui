import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { company as seedCompany } from '../data/mockData'

const AppContext = createContext(null)

const ONBOARDING_KEY = 'us_onboarding_completed'

export function AppProvider({ children }) {
  const [company] = useState(seedCompany)
  const [sidebarOpen, setSidebarOpen] = useState(false) // mobile drawer
  const [toasts, setToasts] = useState([])
  const [language, setLanguage] = useState('hi')
  const [onboardingCompleted, setOnboardingCompletedState] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true'
  )

  const setOnboardingCompleted = useCallback((value) => {
    localStorage.setItem(ONBOARDING_KEY, value ? 'true' : 'false')
    setOnboardingCompletedState(value)
  }, [])

  const pushToast = useCallback((message, tone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }, [])

  const value = useMemo(
    () => ({
      company, sidebarOpen, setSidebarOpen, toasts, pushToast, language, setLanguage,
      onboardingCompleted, setOnboardingCompleted,
    }),
    [company, sidebarOpen, toasts, pushToast, language, onboardingCompleted, setOnboardingCompleted]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
