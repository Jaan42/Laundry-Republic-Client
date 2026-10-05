import type { DueStatus, OperationalStatus } from '../../types/dashboard'

type BadgeStatus = OperationalStatus | DueStatus | string | null | undefined

interface StatusBadgeProps {
  status: BadgeStatus
  type: 'operational' | 'due'
}

const operationalStyles: Record<OperationalStatus, string> = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Washing: 'border-sky-200 bg-sky-50 text-sky-700',
  Drying: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  'Ready for Pickup': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Completed: 'border-slate-200 bg-slate-100 text-slate-700',
  Cancelled: 'border-rose-200 bg-rose-50 text-rose-700',
}

const dueStyles: Record<DueStatus, string> = {
  Upcoming: 'border-blue-200 bg-blue-50 text-blue-700',
  'Due Today': 'border-amber-200 bg-amber-50 text-amber-700',
  Overdue: 'border-rose-200 bg-rose-50 text-rose-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

function StatusBadge({ status, type }: StatusBadgeProps) {
  const label = status || 'Unknown'
  const styles =
    type === 'operational'
      ? operationalStyles[label as OperationalStatus]
      : dueStyles[label as DueStatus]

  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-bold leading-4 ${
        styles || 'border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
