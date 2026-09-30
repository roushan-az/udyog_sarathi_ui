import React from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import Toaster from '../common/Toaster'

/* Header (language, bell, user chip) shows only on the Dashboard route.
   All other pages (SalesBill etc.) get no header.
   A page can still force it with showHeader / hide it with showHeader={false}. */
const HEADER_ROUTES = ['/', '/dashboard']

export default function Layout({ title, subtitle, showHeader, children }) {
  const { pathname } = useLocation()
  const display = showHeader ?? HEADER_ROUTES.includes(pathname)

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {display && <Header title={title} subtitle={subtitle} />}
        <main className="flex-1 px-4 py-5 lg:px-6 lg:py-6 pb-24 lg:pb-6">{children}</main>
      </div>
      <MobileBottomNav />
      <Toaster />
    </div>
  )
}