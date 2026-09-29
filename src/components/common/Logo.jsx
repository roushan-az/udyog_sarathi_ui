import React from 'react'
import splashLogo from '../../assets/logo-splash.png'       // mark + name + orange-dot line + tagline (desktop splash)
import headerLogo from '../../assets/logo-header.png'       // mark + name + tagline (sidebar / headers)
import plainLogo from '../../assets/logo-mark-text.png'     // mark + name only
import stackedLogo from '../../assets/logo-hindi-tagline.png' // stacked lockup (mobile splash / setup)

const WIDTHS = { xs: 'w-28', sm: 'w-40', md: 'w-56', lg: 'w-72', xl: 'w-[26rem]' }

/**
 * Real brand logo (from the supplied logo files, transparent background).
 * variant: 'header' (default) | 'splash' | 'stacked'
 */
export default function Logo({ withTagline = true, size = 'md', variant = 'header', className = '' }) {
  let src = withTagline ? headerLogo : plainLogo
  if (variant === 'splash') src = splashLogo
  if (variant === 'stacked') src = stackedLogo
  return (
    <img
      src={src}
      alt="उद्योग सारथी"
      draggable={false}
      className={`${WIDTHS[size] || WIDTHS.md} h-auto select-none ${className}`}
    />
  )
}
