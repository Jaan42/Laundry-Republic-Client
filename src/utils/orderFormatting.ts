import type { PricingType } from '../types/service'

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const unitLabels: Record<PricingType, string> = {
  perKg: 'kg',
  perPiece: 'piece(s)',
  perPair: 'pair(s)',
}

export function formatOrderCurrency(value: number) {
  return currencyFormatter.format(value)
}

export function formatOrderDate(value?: string) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : dateFormatter.format(date)
}

export function toDateInputValue(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

export function getOrderUnitLabel(pricingType?: PricingType) {
  return pricingType ? unitLabels[pricingType] : 'unit(s)'
}
