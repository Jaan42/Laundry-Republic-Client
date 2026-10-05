import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'
import type { PopularService } from '../../types/dashboard'

interface PopularServicesListProps {
  services: PopularService[]
}

const quantityUnits = {
  perKg: 'kg',
  perPiece: 'pieces',
  perPair: 'pairs',
}

function formatNumber(value?: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toLocaleString('en-PH', { maximumFractionDigits: 2 })
    : '—'
}

function PopularServicesList({ services }: PopularServicesListProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        title="No popular services yet"
        description="Service rankings will appear after orders contain laundry services."
      />
    )
  }

  const largestQuantity = Math.max(
    ...services.map((service) =>
      typeof service.totalQuantity === 'number' ? service.totalQuantity : 0,
    ),
    1,
  )

  return (
    <Card className="border-slate-200 p-5 sm:p-6">
      <ol className="space-y-6">
        {services.map((item, index) => {
          const quantity =
            typeof item.totalQuantity === 'number' && Number.isFinite(item.totalQuantity)
              ? item.totalQuantity
              : 0
          const width = Math.max((quantity / largestQuantity) * 100, quantity > 0 ? 6 : 0)
          const unit = item.service.pricingType
            ? quantityUnits[item.service.pricingType]
            : 'units'

          return (
            <li key={item.service._id}>
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-700">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 break-words text-sm font-bold text-slate-900">
                      {item.service.name || 'Service unavailable'}
                    </p>
                    <p className="shrink-0 text-xs font-semibold text-slate-500">
                      {formatNumber(item.totalOrders)} orders
                    </p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatNumber(item.totalQuantity)} {unit}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

export default PopularServicesList
