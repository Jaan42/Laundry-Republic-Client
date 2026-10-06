import { Link } from 'react-router-dom'
import KpiCard from '../dashboard/KpiCard'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import type { RevenueOrderSummary, RevenueSummary } from '../../types/report'
import {
  formatOrderCurrency,
  formatOrderDate,
} from '../../utils/orderFormatting'

interface RevenueSummaryCardsProps {
  summary: RevenueSummary
}

interface OrderValueCardProps {
  label: string
  order: RevenueOrderSummary | null
  tone: 'emerald' | 'sky'
}

const toneStyles = {
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
}

function formatCount(value: number) {
  return value.toLocaleString('en-PH')
}

function OrderValueCard({ label, order, tone }: OrderValueCardProps) {
  return (
    <Card className="relative min-w-0 overflow-hidden border-slate-200 p-5">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${toneStyles[tone]}`}
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      {order ? (
        <div className="mt-3 min-w-0">
          <p className="break-words text-3xl font-black tracking-tight text-slate-950">
            {formatOrderCurrency(order.grandTotal)}
          </p>
          <Link
            to={`/orders/${order._id}`}
            className="mt-3 inline-flex break-all text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline"
          >
            {order.orderNumber}
          </Link>
          <p className="mt-1 break-words text-xs leading-5 text-slate-500">
            {order.customer?.name || 'Customer unavailable'} &middot;{' '}
            {formatOrderDate(order.orderDate)}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-base font-bold text-slate-500">
          No completed order
        </p>
      )}
    </Card>
  )
}

function RevenueSummaryCards({ summary }: RevenueSummaryCardsProps) {
  return (
    <>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label="Total Orders" value={formatCount(summary.totalOrders)} tone="blue" />
        <KpiCard
          label="Completed Orders"
          value={formatCount(summary.completedOrders)}
          tone="emerald"
        />
        <KpiCard
          label="Total Revenue"
          value={formatOrderCurrency(summary.totalRevenue)}
          tone="blue"
        />
        <KpiCard
          label="Average Order Value"
          value={formatOrderCurrency(summary.averageOrderValue)}
          tone="sky"
        />
        <OrderValueCard label="Highest Order" order={summary.highestOrder} tone="emerald" />
        <OrderValueCard label="Lowest Order" order={summary.lowestOrder} tone="sky" />
      </div>

      {summary.totalOrders === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No orders in this period"
            description="Choose another report period to review order and revenue activity."
          />
        </div>
      ) : summary.completedOrders === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No completed-order revenue"
            description="Orders exist in this period, but none are completed yet."
          />
        </div>
      ) : null}
    </>
  )
}

export default RevenueSummaryCards
