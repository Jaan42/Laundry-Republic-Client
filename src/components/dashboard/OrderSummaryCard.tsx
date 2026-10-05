import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'
import type { DashboardOrder } from '../../types/dashboard'

interface OrderSummaryCardProps {
  order: DashboardOrder
  showExpectedCompletion?: boolean
}

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

function formatCurrency(value?: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? currencyFormatter.format(value)
    : '—'
}

function formatDate(value?: string) {
  if (!value) {
    return 'Date unavailable'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : dateFormatter.format(date)
}

function OrderSummaryCard({ order, showExpectedCompletion = false }: OrderSummaryCardProps) {
  return (
    <li className="min-w-0">
      <Card className="h-full border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/orders/${order._id}`}
              className="break-words text-base font-black text-slate-950 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              {order.orderNumber || 'Order number unavailable'}
            </Link>
            <p className="mt-1 truncate text-sm text-slate-500">
              {order.customer?.name || 'Customer unavailable'}
            </p>
          </div>
          <p className="shrink-0 text-sm font-black text-slate-900">
            {formatCurrency(order.grandTotal)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status={order.dueStatus} type="due" />
          <StatusBadge status={order.status} type="operational" />
        </div>

        {showExpectedCompletion && (
          <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
            Expected completion: {formatDate(order.expectedCompletionDate)}
          </p>
        )}
      </Card>
    </li>
  )
}

export default OrderSummaryCard
