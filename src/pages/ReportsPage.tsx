import { useState } from 'react'
import PopularServicesList from '../components/dashboard/PopularServicesList'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ReportDateControls from '../components/reports/ReportDateControls'
import RevenueSummaryCards from '../components/reports/RevenueSummaryCards'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
  usePopularServicesReport,
  useRevenueReport,
} from '../hooks/useReports'
import type { ReportDateRange, ReportPeriod } from '../types/report'
import {
  formatReportRange,
  getPresetReportRange,
} from '../utils/reportDates'

interface ReportSelection {
  period: ReportPeriod
  range: ReportDateRange
}

const initialSelection: ReportSelection = {
  period: 'thisMonth',
  range: getPresetReportRange('thisMonth'),
}

function RevenueSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status">
      {[
        'total-orders',
        'completed-orders',
        'total-revenue',
        'average-value',
        'highest-order',
        'lowest-order',
      ].map((key) => (
        <Card key={key} className="h-36 animate-pulse border-slate-200 p-5">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-5 h-9 w-40 max-w-full rounded bg-slate-100" />
        </Card>
      ))}
      <span className="sr-only">Loading revenue report.</span>
    </div>
  )
}

function PopularServicesSkeleton() {
  return (
    <Card className="animate-pulse border-slate-200 p-5 sm:p-6" role="status">
      {['service-one', 'service-two', 'service-three'].map((key) => (
        <div key={key} className="mb-6 last:mb-0">
          <div className="h-4 w-48 max-w-full rounded bg-slate-200" />
          <div className="mt-3 h-2 rounded-full bg-slate-100" />
          <div className="mt-3 h-3 w-24 rounded bg-slate-100" />
        </div>
      ))}
      <span className="sr-only">Loading popular services.</span>
    </Card>
  )
}

function ReportsPage() {
  const [selection, setSelection] = useState<ReportSelection>(initialSelection)
  const revenue = useRevenueReport(selection.range)
  const popularServices = usePopularServicesReport()

  useDocumentTitle('Reports')

  function applyDateRange(period: ReportPeriod, range: ReportDateRange) {
    setSelection({ period, range })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        description="Review completed-order revenue and service demand using server-authoritative business data."
      />

      <ReportDateControls
        activePeriod={selection.period}
        activeRange={selection.range}
        onApply={applyDateRange}
      />

      <section className="mt-9 min-w-0" aria-labelledby="revenue-summary-title">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            {formatReportRange(selection.range)}
          </p>
          <h2 id="revenue-summary-title" className="mt-1 text-xl font-bold text-slate-950">
            Revenue Summary
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Revenue figures include completed orders only; total orders includes every status.
          </p>
        </div>

        {revenue.isLoading ? (
          <RevenueSkeleton />
        ) : revenue.error || !revenue.data ? (
          <ApiErrorState
            label="Revenue report unavailable"
            message={revenue.error || 'The revenue summary response was empty.'}
            onRetry={revenue.retry}
          />
        ) : (
          <RevenueSummaryCards summary={revenue.data} />
        )}
      </section>

      <section className="mt-10 min-w-0" aria-labelledby="report-popular-services-title">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            All recorded orders
          </p>
          <h2 id="report-popular-services-title" className="mt-1 text-xl font-bold text-slate-950">
            Popular Services
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Ranked by total quantity using the server&apos;s all-time service summary.
          </p>
        </div>

        {popularServices.isLoading ? (
          <PopularServicesSkeleton />
        ) : popularServices.error || !popularServices.data ? (
          <ApiErrorState
            label="Popular services unavailable"
            message={popularServices.error || 'The popular services response was empty.'}
            onRetry={popularServices.retry}
          />
        ) : (
          <PopularServicesList services={popularServices.data} />
        )}
      </section>
    </PageContainer>
  )
}

export default ReportsPage
