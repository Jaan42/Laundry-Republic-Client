import type { ReactNode } from 'react'
import Button from './Button'
import Card from './Card'

interface ApiErrorStateProps {
  secondaryAction?: ReactNode
  label: string
  message: string
  onRetry: () => void
  className?: string
  title?: string
}

function ApiErrorState({
  secondaryAction,
  label,
  message,
  onRetry,
  className = '',
  title,
}: ApiErrorStateProps) {
  return (
    <Card
      className={`border-rose-200 bg-rose-50/60 p-6 ${className}`}
      role="alert"
    >
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-700">
        {label}
      </p>
      {title && <h2 className="mt-2 text-xl font-bold text-slate-950">{title}</h2>}
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{message}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={onRetry}>Try again</Button>
        {secondaryAction}
      </div>
    </Card>
  )
}

export default ApiErrorState
