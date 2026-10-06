import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import FeedbackBanner from '../ui/FeedbackBanner'
import Input from '../ui/Input'
import { ORDER_STATUSES } from '../../types/order'
import type { OrderFilters as AppliedOrderFilters, OrderSort } from '../../types/order'

interface OrderFiltersProps {
  isLoading: boolean
  onApply: (filters: AppliedOrderFilters) => void
}

interface FilterValues {
  search: string
  status: string
  startDate: string
  endDate: string
  minTotal: string
  maxTotal: string
  sort: OrderSort
}

const initialValues: FilterValues = {
  search: '',
  status: '',
  startDate: '',
  endDate: '',
  minTotal: '',
  maxTotal: '',
  sort: 'newest',
}

const selectClassName =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100'

function parseTotal(value: string, label: string) {
  if (!value.trim()) return { value: undefined }
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return { error: `${label} must be a non-negative number.` }
  }

  return { value: parsed }
}

function OrderFilters({ isLoading, onApply }: OrderFiltersProps) {
  const [values, setValues] = useState<FilterValues>(initialValues)
  const [error, setError] = useState<string | null>(null)

  function updateValue(field: keyof FilterValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const minimum = parseTotal(values.minTotal, 'Minimum total')
    const maximum = parseTotal(values.maxTotal, 'Maximum total')

    if (minimum.error || maximum.error) {
      setError(minimum.error || maximum.error || 'Enter valid total filters.')
      return
    }

    if (values.startDate && values.endDate && values.startDate > values.endDate) {
      setError('Start date cannot be after end date.')
      return
    }

    if (
      minimum.value !== undefined &&
      maximum.value !== undefined &&
      minimum.value > maximum.value
    ) {
      setError('Minimum total cannot be greater than maximum total.')
      return
    }

    const status = ORDER_STATUSES.find((item) => item === values.status)

    onApply({
      ...(values.search.trim() ? { search: values.search.trim() } : {}),
      ...(status ? { status } : {}),
      ...(values.startDate ? { startDate: values.startDate } : {}),
      ...(values.endDate ? { endDate: values.endDate } : {}),
      ...(minimum.value === undefined ? {} : { minTotal: minimum.value }),
      ...(maximum.value === undefined ? {} : { maxTotal: maximum.value }),
      sort: values.sort,
    })
  }

  function clearFilters() {
    setValues(initialValues)
    setError(null)
    onApply({ sort: 'newest' })
  }

  return (
    <Card className="mb-6 border-slate-200 p-4 sm:p-5">
      {error && (
        <FeedbackBanner
          className="mb-5"
          message={error}
          onDismiss={() => setError(null)}
          tone="error"
        />
      )}

      <form onSubmit={submitFilters} noValidate>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="order-search" className="text-sm font-bold text-slate-800">
              Search
            </label>
            <Input
              id="order-search"
              type="search"
              className="mt-2"
              value={values.search}
              onChange={(event) => updateValue('search', event.target.value)}
              placeholder="Order number or customer details"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="order-status-filter" className="text-sm font-bold text-slate-800">
              Operational Status
            </label>
            <select
              id="order-status-filter"
              className={selectClassName}
              value={values.status}
              onChange={(event) => updateValue('status', event.target.value)}
              disabled={isLoading}
            >
              <option value="">All statuses</option>
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="order-sort" className="text-sm font-bold text-slate-800">
              Sort
            </label>
            <select
              id="order-sort"
              className={selectClassName}
              value={values.sort}
              onChange={(event) => updateValue('sort', event.target.value)}
              disabled={isLoading}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highestTotal">Highest total</option>
              <option value="lowestTotal">Lowest total</option>
            </select>
          </div>

          <div>
            <label htmlFor="order-start-date" className="text-sm font-bold text-slate-800">
              Start Date
            </label>
            <Input
              id="order-start-date"
              type="date"
              className="mt-2"
              value={values.startDate}
              onChange={(event) => updateValue('startDate', event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="order-end-date" className="text-sm font-bold text-slate-800">
              End Date
            </label>
            <Input
              id="order-end-date"
              type="date"
              className="mt-2"
              value={values.endDate}
              onChange={(event) => updateValue('endDate', event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="order-min-total" className="text-sm font-bold text-slate-800">
              Minimum Total
            </label>
            <Input
              id="order-min-total"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className="mt-2"
              value={values.minTotal}
              onChange={(event) => updateValue('minTotal', event.target.value)}
              disabled={isLoading}
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="order-max-total" className="text-sm font-bold text-slate-800">
              Maximum Total
            </label>
            <Input
              id="order-max-total"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className="mt-2"
              value={values.maxTotal}
              onChange={(event) => updateValue('maxTotal', event.target.value)}
              disabled={isLoading}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Loading orders...' : 'Apply Filters'}
          </Button>
          <button
            type="button"
            onClick={clearFilters}
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Card>
  )
}

export default OrderFilters
