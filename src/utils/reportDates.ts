import type { ReportDateRange, ReportPeriod } from '../types/report'

type PresetReportPeriod = Exclude<ReportPeriod, 'custom'>

const displayFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getPresetReportRange(period: PresetReportPeriod): ReportDateRange {
  const today = new Date()
  const startDate = new Date(today)

  if (period === 'last7Days') {
    startDate.setDate(today.getDate() - 6)
  } else if (period === 'thisMonth') {
    startDate.setDate(1)
  }

  return {
    startDate: toDateInputValue(startDate),
    endDate: toDateInputValue(today),
  }
}

export function formatReportRange(range: ReportDateRange) {
  const startDate = new Date(`${range.startDate}T00:00:00`)
  const endDate = new Date(`${range.endDate}T00:00:00`)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Selected period'
  }

  if (range.startDate === range.endDate) {
    return displayFormatter.format(startDate)
  }

  return `${displayFormatter.format(startDate)} - ${displayFormatter.format(endDate)}`
}
