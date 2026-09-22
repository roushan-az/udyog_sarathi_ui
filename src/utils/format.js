export function formatINR(value, { decimals = 0 } = {}) {
  const n = Number(value) || 0
  return '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function formatNumber(value) {
  const n = Number(value) || 0
  return n.toLocaleString('en-IN')
}

export function formatDateDMY(date = new Date()) {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

// Converts a number into words (simplified Indian numbering, Hindi context "रुपये मात्र")
export function numberToWordsINR(value) {
  const n = Math.round(Number(value) || 0)
  if (n === 0) return 'शून्य रुपये मात्र'
  const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
    'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस']
  const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे']

  function twoDigits(num) {
    if (num < 20) return ones[num]
    return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '')
  }
  function threeDigits(num) {
    if (num >= 100) {
      return ones[Math.floor(num / 100)] + ' सौ' + (num % 100 ? ' ' + twoDigits(num % 100) : '')
    }
    return twoDigits(num)
  }

  let remaining = n
  const crore = Math.floor(remaining / 10000000); remaining %= 10000000
  const lakh = Math.floor(remaining / 100000); remaining %= 100000
  const thousand = Math.floor(remaining / 1000); remaining %= 1000
  const hundred = remaining

  let parts = []
  if (crore) parts.push(threeDigits(crore) + ' करोड़')
  if (lakh) parts.push(threeDigits(lakh) + ' लाख')
  if (thousand) parts.push(threeDigits(thousand) + ' हज़ार')
  if (hundred) parts.push(threeDigits(hundred))

  return parts.join(' ') + ' रुपये मात्र'
}
