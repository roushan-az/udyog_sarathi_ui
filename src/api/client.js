import axios from 'axios'

// Base URL resolves to the Vite dev proxy (/api -> http://localhost:8000) in development,
// and to VITE_API_URL in production builds.
const baseURL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('us_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Centralised error handling; UI pages surface these via pushToast.
    return Promise.reject(err)
  }
)

export default api

// --- Endpoint helpers (implemented once the FastAPI backend is wired in the next step) ---
export const endpoints = {
  dashboard: '/dashboard',
  products: '/products',
  parties: '/parties',
  salesBills: '/sales-bills',
  purchaseBills: '/purchase-bills',
  expenses: '/expenses',
  receipts: '/receipts',
  payments: '/payments',
  cashBankTransfers: '/cash-bank-transfers',
  stockSummary: '/stock-summary',
  reports: '/reports',
  settings: '/settings',
  auth: { login: '/auth/login', register: '/auth/register', me: '/auth/me' },
}
