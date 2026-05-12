import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAED(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000_000) return `AED ${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `AED ${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `AED ${(value / 1_000).toFixed(0)}K`
    return `AED ${value.toFixed(0)}`
  }
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
    return value.toFixed(0)
  }
  return new Intl.NumberFormat('en-AE').format(value)
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDelta(value: number, unit: 'pct' | 'pp' | 'aed' | 'number' = 'pct'): string {
  const sign = value >= 0 ? '+' : ''
  if (unit === 'pct') return `${sign}${value.toFixed(1)}%`
  if (unit === 'pp') return `${sign}${value.toFixed(1)}pp`
  if (unit === 'aed') return `${sign}${formatAED(value, true)}`
  return `${sign}${value.toFixed(1)}`
}

export function deltaClass(value: number, invertedMetric = false): string {
  const positive = invertedMetric ? value < 0 : value > 0
  return positive ? 'delta-positive' : value === 0 ? 'text-secondary' : 'delta-negative'
}
