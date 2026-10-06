import { Link } from 'react-router-dom'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton'
import KpiCard from '../components/dashboard/KpiCard'
import OrderSummaryCard from '../components/dashboard/OrderSummaryCard'
import PopularServicesList from '../components/dashboard/PopularServicesList'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import EmptyState from '../components/ui/EmptyState'
import useDashboard from '../hooks/useDashboard'
import useDocumentTitle from '../hooks/useDocumentTitle'
import type { DashboardOrder, DashboardStatistics } from '../types/dashboard'

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
})

function formatCount(value?: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toLocaleString('en-PH')
    : '—'
}

function formatCurrency(value?: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? currencyFormatter.format(value)
    : '—'
}

function buildKpis(statistics: DashboardStatistics) {
  return [
    { label: "Today's Orders", value: formatCount(statistics.todayOrders), tone: 'blue' as const },
    { label: 'Pending', value: formatCount(statistics.pendingOrders), tone: 'amber' as const },
    {
      label: 'In Progress',
      value: formatCount(statistics.inProgressOrders),
      tone: 'sky' as const,
    },
    {
      label: 'Ready for Pickup',
      value: formatCount(statistics.readyForPickup),
      tone: 'emerald' as const,
    },
    { label: 'Overdue', value: formatCount(statistics.overdueOrders), tone: 'rose' as const },
    {
      label: 'Completed',
      value: formatCount(statistics.completedOrders),
      tone: 'slate' as const,
    },
    {
      label: 'Total Customers',
      value: formatCount(statistics.totalCustomers),
      tone: 'blue' as const,
    },
    {
      label: 'Average Order Value',
      value: formatCurrency(statistics.averageOrderValue),
      tone: 'sky' as const,
    },
  ]
}

function attentionPriority(order: DashboardOrder) {
  if (order.dueStatus === 'Overdue') return 0
  if (order.dueStatus === 'Due Today') return 1
  if (order.status === 'Ready for Pickup') return 2
  return 3
}

function DashboardPage() {
  const { data, error, isLoading, retry } = useDashboard()

  useDocumentTitle('Dashboard')

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="A live view of orders, customer activity, and service demand."
        />
        <DashboardSkeleton />
      </PageContainer>
    )
  }

  if (error || !data) {
    return (
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="A live view of orders, customer activity, and service demand."
        />
        <ApiErrorState
          label="Dashboard unavailable"
          title="We could not load the latest business information."
          message={error || 'The dashboard response was empty.'}
          onRetry={retry}
        />
      </PageContainer>
    )
  }

  const kpis = buildKpis(data.statistics)
  const attentionOrders = data.orders
    .filter(
      (order) =>
        order.dueStatus === 'Overdue' ||
        order.dueStatus === 'Due Today' ||
        order.status === 'Ready for Pickup',
    )
    .sort((first, second) => attentionPriority(first) - attentionPriority(second))
    .slice(0, 6)
  const recentOrders = data.orders.slice(0, 6)

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="A live view of orders, customer activity, and service demand."
        actions={
          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            View all orders
          </Link>
        }
      />

      <section aria-labelledby="dashboard-kpis">
        <h2 id="dashboard-kpis" className="sr-only">
          Business overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      </section>

      <div className="mt-9 grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
        <section className="min-w-0" aria-labelledby="attention-orders-title">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600">
              Priority queue
            </p>
            <h2 id="attention-orders-title" className="mt-1 text-xl font-bold text-slate-950">
              Orders requiring attention
            </h2>
          </div>

          {attentionOrders.length === 0 ? (
            <EmptyState
              title="No orders need attention"
              description="Overdue, due-today, and ready-for-pickup orders will appear here."
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {attentionOrders.map((order) => (
                <OrderSummaryCard key={order._id} order={order} showExpectedCompletion />
              ))}
            </ul>
          )}
        </section>

        <section className="min-w-0" aria-labelledby="popular-services-title">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Service demand
            </p>
            <h2 id="popular-services-title" className="mt-1 text-xl font-bold text-slate-950">
              Popular services
            </h2>
          </div>
          <PopularServicesList services={data.popularServices} />
        </section>
      </div>

      <section className="mt-9 min-w-0" aria-labelledby="recent-orders-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Latest activity
            </p>
            <h2 id="recent-orders-title" className="mt-1 text-xl font-bold text-slate-950">
              Recent orders
            </h2>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Recent orders will appear here after the first laundry order is created."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentOrders.map((order) => (
              <OrderSummaryCard key={order._id} order={order} />
            ))}
          </ul>
        )}
      </section>
    </PageContainer>
  )
}

export default DashboardPage
