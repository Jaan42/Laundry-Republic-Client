import Button from '../ui/Button'
import Card from '../ui/Card'
import FeedbackBanner from '../ui/FeedbackBanner'
import type { OrderCalculation } from '../../types/order'

interface OrderSummaryProps {
  calculation: OrderCalculation | null
  error: string | null
  isCalculating: boolean
  isDisabled: boolean
  isStale: boolean
  onCalculate: () => void
}

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : dateFormatter.format(date)
}

function OrderSummary({
  calculation,
  error,
  isCalculating,
  isDisabled,
  isStale,
  onCalculate,
}: OrderSummaryProps) {
  const showTotals = calculation && !isStale

  return (
    <Card className="border-slate-200 p-5 xl:sticky xl:top-24">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
        Trusted server preview
      </p>
      <h2 className="mt-2 text-xl font-bold text-slate-950">Order Summary</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Totals shown here come from the Laundry Republic server.
      </p>

      {error && <FeedbackBanner className="mt-4" message={error} tone="error" />}

      {isStale && (
        <FeedbackBanner
          className="mt-4"
          message="Order details changed. Refresh the summary before creating the order."
          tone="error"
        />
      )}

      {isCalculating ? (
        <div className="mt-6 space-y-4 animate-pulse" role="status">
          {[1, 2, 3, 4].map((key) => (
            <div key={key} className="flex justify-between gap-4">
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-200" />
            </div>
          ))}
          <span className="sr-only">Calculating order summary.</span>
        </div>
      ) : showTotals ? (
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="font-semibold text-slate-900">
              {currencyFormatter.format(calculation.subtotal)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">Additional Charge</dt>
            <dd className="font-semibold text-slate-900">
              {currencyFormatter.format(calculation.additionalCharge)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">Discount</dt>
            <dd className="font-semibold text-slate-900">
              {calculation.discountPercentage}%
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-500">Discount Amount</dt>
            <dd className="font-semibold text-emerald-700">
              -{currencyFormatter.format(calculation.discountAmount)}
            </dd>
          </div>
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-end justify-between gap-4">
              <dt className="font-bold text-slate-900">Grand Total</dt>
              <dd className="text-2xl font-bold text-blue-700">
                {currencyFormatter.format(calculation.grandTotal)}
              </dd>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Expected Completion
            </dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {formatDate(calculation.expectedCompletionDate)}
            </dd>
          </div>
        </dl>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-slate-700">No current summary</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Select services and calculate to preview trusted totals.
          </p>
        </div>
      )}

      <Button
        type="button"
        onClick={onCalculate}
        disabled={isCalculating || isDisabled}
        className="mt-5 w-full"
      >
        {isCalculating
          ? 'Calculating…'
          : calculation
            ? 'Refresh Summary'
            : 'Calculate Summary'}
      </Button>
    </Card>
  )
}

export default OrderSummary
