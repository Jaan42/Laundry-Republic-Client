import Card from './Card'

interface EmptyStateProps {
  title: string
  description: string
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-slate-300 py-10 text-center shadow-none">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-lg text-blue-600">
        <span aria-hidden="true">&ndash;</span>
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
    </Card>
  )
}

export default EmptyState
