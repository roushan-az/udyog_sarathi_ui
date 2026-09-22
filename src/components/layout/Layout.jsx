import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileBottomNav from './MobileBottomNav'
import Toaster from '../common/Toaster'

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 px-4 py-5 lg:px-6 lg:py-6 pb-24 lg:pb-6">{children}</main>
      </div>
      <MobileBottomNav />
      <Toaster />
    </div>
  )
}
