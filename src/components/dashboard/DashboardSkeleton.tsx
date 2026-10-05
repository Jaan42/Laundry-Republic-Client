import Card from '../ui/Card'

const kpiSkeletons = [
  'today',
  'pending',
  'progress',
  'ready',
  'overdue',
  'completed',
  'customers',
  'average',
]

function DashboardSkeleton() {
  return (
    <div className="space-y-8" role="status" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiSkeletons.map((key) => (
          <Card key={key} className="animate-pulse border-slate-200 p-5">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-4 h-9 w-20 rounded bg-slate-200" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
        <Card className="h-72 animate-pulse border-slate-200 bg-slate-100" />
        <Card className="h-72 animate-pulse border-slate-200 bg-slate-100" />
      </div>
      <span className="sr-only">Loading dashboard information.</span>
    </div>
  )
}

export default DashboardSkeleton
