import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import type { LaundryService, PricingType } from '../../types/service'

interface ServiceListProps {
  services: LaundryService[]
  onDelete: (service: LaundryService) => void
}

interface ServiceActionsProps {
  service: LaundryService
  onDelete: (service: LaundryService) => void
  compact?: boolean
}

const pricingTypeLabels: Record<PricingType, string> = {
  perKg: 'Per Kilogram',
  perPiece: 'Per Piece',
  perPair: 'Per Pair',
}

const priceUnitLabels: Record<PricingType, string> = {
  perKg: 'kg',
  perPiece: 'piece',
  perPair: 'pair',
}

const priceFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function formatPrice(service: LaundryService) {
  return `${priceFormatter.format(service.price)} / ${priceUnitLabels[service.pricingType]}`
}

function formatTurnaround(days: number) {
  return `${days} ${days === 1 ? 'day' : 'days'}`
}

function ServiceStatus({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${
        isActive
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-slate-100 text-slate-600'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

function ServiceActions({ service, onDelete, compact = false }: ServiceActionsProps) {
  const baseClass = compact ? 'flex-1 justify-center px-3 py-2.5' : 'px-2.5 py-1.5'

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'w-full' : 'justify-end'}`}>
      <Link
        to={`/services/${service._id}/edit`}
        className={`inline-flex items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${baseClass}`}
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(service)}
        className={`inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${baseClass}`}
      >
        Delete
      </button>
    </div>
  )
}

function ServiceList({ services, onDelete }: ServiceListProps) {
  return (
    <>
      <Card className="hidden overflow-hidden border-slate-200 p-0 lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.1em] text-slate-500">
            <tr>
              <th className="w-[27%] px-4 py-4 font-bold">Service</th>
              <th className="w-[16%] px-4 py-4 font-bold">Price</th>
              <th className="w-[15%] px-4 py-4 font-bold">Pricing Type</th>
              <th className="w-[14%] px-4 py-4 font-bold">Turnaround</th>
              <th className="w-[12%] px-4 py-4 font-bold">Status</th>
              <th className="w-[16%] px-4 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {services.map((service) => (
              <tr key={service._id} className="transition hover:bg-blue-50/40">
                <td className="px-4 py-4">
                  <p className="break-words text-sm font-bold text-slate-900">{service.name}</p>
                  {service.description && (
                    <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-slate-500">
                      {service.description}
                    </p>
                  )}
                </td>
                <td className="break-words px-4 py-4 text-sm font-semibold text-slate-800">
                  {formatPrice(service)}
                </td>
                <td className="break-words px-4 py-4 text-sm text-slate-600">
                  {pricingTypeLabels[service.pricingType]}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatTurnaround(service.turnaroundDays)}
                </td>
                <td className="px-4 py-4">
                  <ServiceStatus isActive={service.isActive} />
                </td>
                <td className="px-4 py-4">
                  <ServiceActions service={service} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-4 lg:hidden">
        {services.map((service) => (
          <li key={service._id}>
            <Card className="border-slate-200 p-5">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <h2 className="min-w-0 break-words text-lg font-bold text-slate-950">
                  {service.name}
                </h2>
                <ServiceStatus isActive={service.isActive} />
              </div>
              {service.description && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
              )}
              <dl className="mt-4 grid gap-4 border-t border-slate-100 pt-4 min-[430px]:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Price
                  </dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {formatPrice(service)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Pricing Type
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {pricingTypeLabels[service.pricingType]}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Turnaround
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {formatTurnaround(service.turnaroundDays)}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <ServiceActions service={service} onDelete={onDelete} compact />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ServiceList
