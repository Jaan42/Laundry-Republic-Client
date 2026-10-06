import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import type { Promotion } from '../../types/promotion'

interface PromotionListProps {
  promotions: Promotion[]
  onDelete: (promotion: Promotion) => void
}

interface PromotionActionsProps {
  promotion: Promotion
  onDelete: (promotion: Promotion) => void
  compact?: boolean
}

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : dateFormatter.format(date)
}

function PromotionStatus({ isActive }: { isActive: boolean }) {
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

function PromotionActions({
  promotion,
  onDelete,
  compact = false,
}: PromotionActionsProps) {
  const baseClass = compact ? 'flex-1 justify-center px-3 py-2.5' : 'px-2.5 py-1.5'

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'w-full' : 'justify-end'}`}>
      <Link
        to={`/promotions/${promotion._id}/edit`}
        className={`inline-flex items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${baseClass}`}
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(promotion)}
        className={`inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${baseClass}`}
      >
        Delete
      </button>
    </div>
  )
}

function PromotionList({ promotions, onDelete }: PromotionListProps) {
  return (
    <>
      <Card className="hidden overflow-hidden border-slate-200 p-0 xl:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="w-[24%] px-4 py-4 font-bold">Promotion</th>
              <th className="w-[10%] px-3 py-4 font-bold">Discount</th>
              <th className="w-[14%] px-3 py-4 font-bold">Minimum</th>
              <th className="w-[13%] px-3 py-4 font-bold">Start Date</th>
              <th className="w-[13%] px-3 py-4 font-bold">End Date</th>
              <th className="w-[10%] px-3 py-4 font-bold">Status</th>
              <th className="w-[16%] px-4 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {promotions.map((promotion) => (
              <tr key={promotion._id} className="transition hover:bg-blue-50/40">
                <td className="px-4 py-4">
                  <p className="break-words text-sm font-bold text-slate-900">
                    {promotion.code}
                  </p>
                  {promotion.description && (
                    <p className="mt-1 line-clamp-2 break-words text-xs leading-5 text-slate-500">
                      {promotion.description}
                    </p>
                  )}
                </td>
                <td className="px-3 py-4 text-sm font-semibold text-slate-800">
                  {promotion.discountPercentage}%
                </td>
                <td className="break-words px-3 py-4 text-sm text-slate-600">
                  {currencyFormatter.format(promotion.minimumAmount)}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {formatDate(promotion.startDate)}
                </td>
                <td className="px-3 py-4 text-sm text-slate-600">
                  {formatDate(promotion.endDate)}
                </td>
                <td className="px-3 py-4">
                  <PromotionStatus isActive={promotion.isActive} />
                </td>
                <td className="px-4 py-4">
                  <PromotionActions promotion={promotion} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-4 xl:hidden">
        {promotions.map((promotion) => (
          <li key={promotion._id}>
            <Card className="border-slate-200 p-5">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <h2 className="min-w-0 break-words text-lg font-bold text-slate-950">
                  {promotion.code}
                </h2>
                <PromotionStatus isActive={promotion.isActive} />
              </div>
              {promotion.description && (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                  {promotion.description}
                </p>
              )}
              <dl className="mt-4 grid gap-4 border-t border-slate-100 pt-4 min-[430px]:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Discount
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800">
                    {promotion.discountPercentage}%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Minimum Amount
                  </dt>
                  <dd className="mt-1 break-words text-sm text-slate-700">
                    {currencyFormatter.format(promotion.minimumAmount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Start Date
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {formatDate(promotion.startDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    End Date
                  </dt>
                  <dd className="mt-1 text-sm text-slate-700">
                    {formatDate(promotion.endDate)}
                  </dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <PromotionActions promotion={promotion} onDelete={onDelete} compact />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

export default PromotionList
