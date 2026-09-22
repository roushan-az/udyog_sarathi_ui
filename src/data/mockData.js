// Seed / demo data — mirrors the screen designs (SCR-001 to SCR-015).
// This will be replaced by live API calls to the Python backend (see src/api/*).

export const company = {
  name: 'श्री कृष्णा ट्रेडर्स',
  ownerName: 'विकास जी',
  licenseValid: true,
  licenseExpiry: '17 मई 2025',
  fy: 'FY: 2025-26',
}

export const dashboardStats = {
  todaySales: { amount: 28450, count: 3 },
  todayPurchase: { amount: 18720, count: 2 },
  todayExpense: { amount: 2350, count: 5 },
  todayProfit: { amount: 7380, label: 'इस माह' },
}

export const todayActivity = [
  { type: 'बिक्री', desc: 'बिक्री बिल बनाया', ref: 'INV-00045', amount: 12500, time: '02:15 PM', color: 'blue' },
  { type: 'खरीद', desc: 'खरीद बिल बनाया', ref: 'PUR-00012', amount: 8400, time: '11:30 AM', color: 'green' },
  { type: 'खर्च', desc: 'खर्च जोड़ा', ref: 'EXP-00015', amount: 450, time: '10:05 AM', color: 'orange' },
  { type: 'रसीद', desc: 'ग्राहक से रसीद प्राप्त', ref: 'REC-00008', amount: 5000, time: '09:20 AM', color: 'purple' },
  { type: 'भुगतान', desc: 'आपूर्तिकर्ता को भुगतान', ref: 'PAY-00006', amount: 7500, time: '09:00 AM', color: 'sky' },
]

export const monthSummary = {
  totalSales: 245600,
  totalPurchase: 165250,
  totalExpense: 18450,
  totalProfit: 61900,
}

export const salesVsPurchase = [
  { date: '01/05', sales: 60000, purchase: 40000 },
  { date: '08/05', sales: 120000, purchase: 90000 },
  { date: '15/05', sales: 95000, purchase: 110000 },
  { date: '22/05', sales: 150000, purchase: 100000 },
  { date: '29/05', sales: 130000, purchase: 95000 },
]

export const reminders = [
  { text: '3 बिल भुगतान शेष हैं', sub: 'कुल राशि: ₹ 15,750', tone: 'warn' },
  { text: '2 खरीद बिल भुगतान शेष हैं', sub: 'कुल राशि: ₹ 22,300', tone: 'warn' },
  { text: 'License 17 मई 2025 तक वैध है', sub: 'समय पर नवीनीकरण करें', tone: 'info' },
]

export const products = [
  { id: 1, name: 'सीमेंट 50kg', hsn: '2523', category: 'Building Material', unit: 'BAG', saleRate: 350, purchaseRate: 310, stock: 152, stockValue: 47120, status: 'सक्रिय' },
  { id: 2, name: 'सरिया 10mm', hsn: '7214', category: 'Iron & Steel', unit: 'KG', saleRate: 60, purchaseRate: 52, stock: 420, stockValue: 21840, status: 'सक्रिय' },
  { id: 3, name: 'ईंट (Bricks)', hsn: '6904', category: 'Building Material', unit: 'PCS', saleRate: 7, purchaseRate: 5.5, stock: 1250, stockValue: 6875, status: 'सक्रिय' },
  { id: 4, name: 'पेंट 20L', hsn: '3208', category: 'Paints', unit: 'PCS', saleRate: 1450, purchaseRate: 1250, stock: 5, stockValue: 6250, status: 'कम स्टॉक' },
  { id: 5, name: 'वायर 1.5mm', hsn: '8544', category: 'Electrical', unit: 'MTR', saleRate: 12, purchaseRate: 9.5, stock: 85, stockValue: 807.5, status: 'सक्रिय' },
  { id: 6, name: 'पाइप 1 inch', hsn: '3917', category: 'Plumbing', unit: 'MTR', saleRate: 85, purchaseRate: 65, stock: 60, stockValue: 3900, status: 'सक्रिय' },
  { id: 7, name: 'सेंड/वालू', hsn: '2505', category: 'Raw Material', unit: 'CFT', saleRate: 45, purchaseRate: 30, stock: 320, stockValue: 9600, status: 'सक्रिय' },
  { id: 8, name: 'ग्रेनाइट टाइल 2x2', hsn: '6907', category: 'Tiles', unit: 'PCS', saleRate: 110, purchaseRate: 85, stock: 150, stockValue: 12750, status: 'सक्रिय' },
]

export const productSummary = { total: 124, active: 118, inactive: 6, lowStock: 8, totalStockValue: 245680 }

export const parties = [
  { id: 1, name: 'Shiv Traders', type: 'ग्राहक', mobile: '9876543210', place: 'Patna, Bihar', gstin: '10ABCDE1234F1Z5', ledger: 'वकाया', balance: 125680, status: 'सक्रिय' },
  { id: 2, name: 'Rohit Kumar', type: 'ग्राहक', mobile: '7001234567', place: 'Ara, Bihar', gstin: '-', ledger: 'वकाया', balance: 85250, status: 'सक्रिय' },
  { id: 3, name: 'Kumar & Sons', type: 'ग्राहक', mobile: '9955667788', place: 'Gaya, Bihar', gstin: '10KUMAR1234F1Z2', ledger: 'वकाया', balance: 215300, status: 'सक्रिय' },
  { id: 4, name: 'Ganesh Supply Co.', type: 'सप्लायर', mobile: '9123456780', place: 'Gaya, Bihar', gstin: '10FGHJK5678K1Z3', ledger: 'देय', balance: 145600, status: 'सक्रिय' },
  { id: 5, name: 'Bharat Steel Works', type: 'सप्लायर', mobile: '9933445566', place: 'Muzaffarpur, Bihar', gstin: '10BSWPS1234L1Z8', ledger: 'देय', balance: 98450, status: 'सक्रिय' },
  { id: 6, name: 'Shree Krishna Traders', type: 'सप्लायर', mobile: '8210445566', place: 'Patna, Bihar', gstin: '10SKTPS9876M1Z1', ledger: 'देय', balance: 112310, status: 'सक्रिय' },
  { id: 7, name: 'Maa Durga Agency', type: 'सप्लायर', mobile: '9199334455', place: 'Bhagalpur, Bihar', gstin: '10MDAPS4567N1Z9', ledger: 'देय', balance: 75800, status: 'निष्क्रिय' },
  { id: 8, name: 'Suresh Enterprises', type: 'ग्राहक', mobile: '9544332211', place: 'Begusarai, Bihar', gstin: '-', ledger: 'वकाया', balance: 23150, status: 'सक्रिय' },
]

export const partySummary = { total: 156, customers: 98, suppliers: 52, inactive: 6, totalReceivable: 567890, totalPayable: 432160 }

export const stockSummary = [
  { name: 'सरसों तेल 1 लीटर', code: 'P001', category: 'तेल', opening: 150, purchase: 220, sale: 180, returns: 10, transfer: 0, available: 190, value: 360500, status: 'उपलब्ध' },
  { name: 'गेहूँ आटा 10 Kg', code: 'P002', category: 'आटा', opening: 80, purchase: 150, sale: 170, returns: 0, transfer: 0, available: 60, value: 120000, status: 'लो स्टॉक' },
  { name: 'चीनी 1 Kg', code: 'P003', category: 'किराना', opening: 50, purchase: 80, sale: 90, returns: 0, transfer: 0, available: 0, value: 0, status: 'आउट ऑफ स्टॉक' },
  { name: 'चाय पत्ती 250 gm', code: 'P004', category: 'किराना', opening: 120, purchase: 100, sale: 110, returns: 0, transfer: 10, available: 110, value: 55000, status: 'उपलब्ध' },
  { name: 'हल्दी पाउडर 100 gm', code: 'P005', category: 'मसाले', opening: 60, purchase: 90, sale: 40, returns: 0, transfer: 0, available: 110, value: 22000, status: 'उपलब्ध' },
  { name: 'नमक 1 Kg', code: 'P006', category: 'किराना', opening: 100, purchase: 50, sale: 30, returns: 0, transfer: 0, available: 120, value: 6000, status: 'उपलब्ध' },
  { name: 'दाल अरहर 1 Kg', code: 'P007', category: 'दाल', opening: 70, purchase: 40, sale: 60, returns: 0, transfer: 0, available: 50, value: 5500, status: 'लो स्टॉक' },
  { name: 'मसूर दाल 1 Kg', code: 'P008', category: 'दाल', opening: 60, purchase: 30, sale: 40, returns: 0, transfer: 0, available: 50, value: 4500, status: 'लो स्टॉक' },
]

export const stockQuickStats = { totalProducts: 126, totalAvailable: 4856, totalValue: 1875430, lowStock: 12, outOfStock: 5, todaySaleQty: 236 }

export const stockCategoryValue = [
  { name: 'तेल', value: 720500, color: '#1a3a8f' },
  { name: 'आटा', value: 120000, color: '#1e7e34' },
  { name: 'किराना', value: 301000, color: '#f97316' },
  { name: 'मसाले', value: 433930, color: '#8b5cf6' },
]

export const reportsSummary = {
  totalSales: 1245800, totalPurchase: 785600, totalProfit: 1120300, totalPayment: 695400, totalExpense: 235600, netProfit: 234200,
  deltas: { sales: 15.6, purchase: 10.2, profit: 18.4, payment: 12.7, expense: 8.3, netProfit: 22.1 },
}

export const reportCards = [
  { key: 'sales', title: 'बिक्री रिपोर्ट', desc: 'सभी बिक्री बिल की पूरी जानकारी', color: 'blue' },
  { key: 'purchase', title: 'खरीद रिपोर्ट', desc: 'सभी खरीद बिल की पूरी जानकारी', color: 'blue' },
  { key: 'stock', title: 'स्टॉक रिपोर्ट', desc: 'स्टॉक स्थिति एवं मूल्य की जानकारी', color: 'orange' },
  { key: 'lowstock', title: 'लो स्टॉक रिपोर्ट', desc: 'कम स्टॉक वाले प्रोडक्ट्स की सूची', color: 'red' },
  { key: 'cashbook', title: 'नकद बही (Cash Book)', desc: 'सभी नकद लेन-देन की जानकारी', color: 'green' },
  { key: 'bankbook', title: 'बैंक बही (Bank Book)', desc: 'सभी बैंक लेन-देन की जानकारी', color: 'blue' },
  { key: 'receipt', title: 'प्राप्ति रिपोर्ट', desc: 'सभी प्राप्ति (Receipts) की जानकारी', color: 'purple' },
  { key: 'payment', title: 'भुगतान रिपोर्ट', desc: 'सभी भुगतान (Payments) की जानकारी', color: 'sky' },
  { key: 'expense', title: 'खर्च रिपोर्ट', desc: 'सभी खर्चों की पूरी जानकारी', color: 'orange' },
  { key: 'pnl', title: 'व्यवसाय लाभ (P&L)', desc: 'लाभ एवं हानि की पूरी रिपोर्ट', color: 'green' },
  { key: 'balancesheet', title: 'बैलेंस शीट', desc: 'व्यवसाय की वित्तीय स्थिति की पूरी रिपोर्ट', color: 'blue' },
  { key: 'trend', title: 'ट्रेंड रिपोर्ट', desc: 'मासिक बिक्री, खरीद, खर्च का ट्रेंड देखें', color: 'purple' },
  { key: 'party', title: 'पार्टी रिपोर्ट', desc: 'ग्राहक और सप्लायर का लेन-देन विवरण', color: 'orange' },
  { key: 'product', title: 'प्रोडक्ट रिपोर्ट', desc: 'प्रोडक्ट अनुसार बिक्री, खरीद और स्टॉक', color: 'blue' },
  { key: 'top', title: 'टॉप रिपोर्ट', desc: 'टॉप ग्राहक, टॉप प्रोडक्ट, टॉप खर्च आदि', color: 'red' },
  { key: 'others', title: 'अन्य रिपोर्ट्स', desc: 'अन्य उपयोगी रिपोर्ट्स देखें', color: 'slate' },
]

export const expenseCategoryBreakup = [
  { name: 'ऑपरेशनल खर्च', value: 60, color: '#1a3a8f' },
  { name: 'पूंजीगत खर्च', value: 20, color: '#1e7e34' },
  { name: 'व्यक्तिगत निकासी', value: 15, color: '#f97316' },
  { name: 'अन्य खर्च', value: 5, color: '#94a3b8' },
]

export const netProfitTrend = [
  { label: 'कुल बिक्री', value: 1245800, color: '#1e7e34' },
  { label: 'कुल खर्च', value: 695400, color: '#dc2626' },
  { label: 'शुद्ध लाभ', value: 234200, color: '#1a3a8f' },
]

export const quickViewSummary = { salesBills: 125, purchaseBills: 85, customers: 68, suppliers: 52, products: 142 }

export const bankAccount = { label: 'SBI Current A/c - 12345678901', balance: 125780 }
