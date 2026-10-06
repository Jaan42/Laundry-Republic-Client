interface FeedbackBannerProps {
  message: string
  onDismiss?: () => void
  tone?: 'success' | 'error'
  className?: string
}

const toneStyles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    dismiss:
      'text-emerald-700 hover:bg-emerald-100 focus-visible:outline-emerald-600',
  },
  error: {
    container: 'border-rose-200 bg-rose-50 text-rose-800',
    dismiss: 'text-rose-700 hover:bg-rose-100 focus-visible:outline-rose-600',
  },
}

function FeedbackBanner({
  message,
  onDismiss,
  tone = 'success',
  className = '',
}: FeedbackBannerProps) {
  const styles = toneStyles[tone]

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${styles.container} ${className}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <p className="font-semibold leading-6">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`shrink-0 rounded-md px-1.5 text-lg leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.dismiss}`}
          aria-label="Dismiss message"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  )
}

export default FeedbackBanner
