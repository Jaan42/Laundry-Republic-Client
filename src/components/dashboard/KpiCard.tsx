import Card from '../ui/Card'

type KpiTone = 'blue' | 'sky' | 'amber' | 'rose' | 'emerald' | 'slate'

interface KpiCardProps {
  label: string
  value: string
  tone?: KpiTone
}

const toneStyles: Record<KpiTone, string> = {
  blue: 'bg-blue-600',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  slate: 'bg-slate-500',
}

function KpiCard({ label, value, tone = 'blue' }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden border-slate-200 p-5">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${toneStyles[tone]}`}
        aria-hidden="true"
      />
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 break-words text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </Card>
  )
}

export default KpiCard
