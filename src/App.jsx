import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import CompanySetup from './pages/CompanySetup'
import Dashboard from './pages/Dashboard'
import SalesBill from './pages/SalesBill'
import PurchaseBill from './pages/PurchaseBill'
import ProductMaster from './pages/ProductMaster'
import PartyMaster from './pages/PartyMaster'
import Expense from './pages/Expense'
import Receipt from './pages/Receipt'
import Payment from './pages/Payment'
import CashBankTransfer from './pages/CashBankTransfer'
import StockSummary from './pages/StockSummary'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Support from './pages/Support'
import PlaceholderList from './pages/PlaceholderList'

export default function App() {
  return (
    <Routes>
      <Route path="/splash" element={<Splash firstTime />} />
      <Route path="/company-setup" element={<CompanySetup />} />

      <Route path="/" element={<Dashboard />} />
      <Route path="/sales-bill" element={<SalesBill />} />
      <Route path="/purchase-bill" element={<PurchaseBill />} />
      <Route path="/sales-return" element={<PlaceholderList code="SCR-004R" title="बिक्री वापसी" subtitle="Sales Return / Credit Note की सूची" />} />
      <Route path="/purchase-return" element={<PlaceholderList code="SCR-005R" title="खरीद वापसी" subtitle="Purchase Return / Debit Note की सूची" />} />
      <Route path="/products" element={<ProductMaster />} />
      <Route path="/parties" element={<PartyMaster />} />
      <Route path="/expense" element={<Expense />} />
      <Route path="/receipt" element={<Receipt />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/cash-bank-transfer" element={<CashBankTransfer />} />
      <Route path="/stock-summary" element={<StockSummary />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/support" element={<Support />} />

      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
