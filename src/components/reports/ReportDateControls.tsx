import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import FeedbackBanner from '../ui/FeedbackBanner'
import Input from '../ui/Input'
import type { ReportDateRange, ReportPeriod } from '../../types/report'
import { getPresetReportRange } from '../../utils/reportDates'

interface ReportDateControlsProps {
  activePeriod: ReportPeriod
  activeRange: ReportDateRange
  onApply: (period: ReportPeriod, range: ReportDateRange) => void
}

const presetPeriods = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7Days' },
  { label: 'This Month', value: 'thisMonth' },
] as const

function ReportDateControls({
  activePeriod,
  activeRange,
  onApply,
}: ReportDateControlsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>(activePeriod)
  const [customStartDate, setCustomStartDate] = useState(activeRange.startDate)
  const [customEndDate, setCustomEndDate] = useState(activeRange.endDate)
  const [error, setError] = useState<string | null>(null)

  function applyPreset(period: Exclude<ReportPeriod, 'custom'>) {
    setSelectedPeriod(period)
    setError(null)
    onApply(period, getPresetReportRange(period))
  }

  function showCustomRange() {
    setSelectedPeriod('custom')
    setError(null)
  }

  function applyCustomRange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!customStartDate || !customEndDate) {
      setError('Select both a start date and an end date.')
      return
    }

    if (customEndDate < customStartDate) {
      setError('End date cannot be before start date.')
      return
    }

    onApply('custom', {
      startDate: customStartDate,
      endDate: customEndDate,
    })
  }

  function periodButtonClass(period: ReportPeriod) {
    const isSelected = selectedPeriod === period
    return `inline-flex min-h-11 w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
      isSelected
        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
    }`
  }

  return (
    <Card className="border-slate-200 p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-950">Report Period</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Revenue totals use completed orders from the selected order-date range.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {presetPeriods.map((period) => (
          <button
            key={period.value}
            type="button"
            className={periodButtonClass(period.value)}
            onClick={() => applyPreset(period.value)}
          >
            {period.label}
          </button>
        ))}
        <button
          type="button"
          className={periodButtonClass('custom')}
          onClick={showCustomRange}
        >
          Custom Range
        </button>
      </div>

      {selectedPeriod === 'custom' && (
        <form onSubmit={applyCustomRange} className="mt-5 border-t border-slate-100 pt-5" noValidate>
          {error && (
            <FeedbackBanner
              className="mb-4"
              message={error}
              onDismiss={() => setError(null)}
              tone="error"
            />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="report-start-date" className="text-sm font-bold text-slate-800">
                Start Date
              </label>
              <Input
                id="report-start-date"
                type="date"
                className="mt-2"
                value={customStartDate}
                onChange={(event) => setCustomStartDate(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="report-end-date" className="text-sm font-bold text-slate-800">
                End Date
              </label>
              <Input
                id="report-end-date"
                type="date"
                className="mt-2"
                value={customEndDate}
                onChange={(event) => setCustomEndDate(event.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full sm:w-auto">
            Apply Custom Range
          </Button>
        </form>
      )}
    </Card>
  )
}

export default ReportDateControls
