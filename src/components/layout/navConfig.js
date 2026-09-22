import {
  Home, ShoppingBag, ShoppingCart, Grid3x3, Users, Wallet, Download, Upload,
  ArrowLeftRight, Boxes, BarChart3, Settings, Headset, Undo2, RotateCcw,
} from 'lucide-react'

export const navItems = [
  { to: '/', label: 'होम', icon: Home, end: true },
  { to: '/sales-bill', label: 'बिक्री', icon: ShoppingBag },
  { to: '/sales-return', label: 'बिक्री वापसी', icon: Undo2 },
  { to: '/purchase-bill', label: 'खरीद', icon: ShoppingCart },
  { to: '/purchase-return', label: 'खरीद वापसी', icon: RotateCcw },
  { to: '/products', label: 'उत्पाद मास्टर', icon: Grid3x3 },
  { to: '/parties', label: 'पार्टी मास्टर', icon: Users },
  { to: '/expense', label: 'खर्च', icon: Wallet },
  { to: '/receipt', label: 'प्राप्ति', icon: Download },
  { to: '/payment', label: 'भुगतान', icon: Upload },
  { to: '/cash-bank-transfer', label: 'नकद / बैंक स्थानांतरण', icon: ArrowLeftRight },
  { to: '/stock-summary', label: 'स्टॉक सारांश', icon: Boxes },
  { to: '/reports', label: 'रिपोर्ट्स', icon: BarChart3 },
  { to: '/settings', label: 'सेटिंग्स', icon: Settings },
  { to: '/support', label: 'सपोर्ट / हेल्प', icon: Headset },
]

// Reduced set for the bottom nav bar on mobile
export const mobileNavItems = [
  { to: '/', label: 'होम', icon: Home, end: true },
  { to: '/sales-bill', label: 'बिल', icon: ShoppingBag },
  { to: '/products', label: 'प्रोडक्ट', icon: Grid3x3 },
  { to: '/reports', label: 'रिपोर्ट', icon: BarChart3 },
  { to: '/more', label: 'अधिक', icon: Settings },
]
