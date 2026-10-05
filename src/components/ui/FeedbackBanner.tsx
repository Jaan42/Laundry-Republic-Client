interface FeedbackBannerProps {
  message: string
  onDismiss?: () => void
}

function FeedbackBanner({ message, onDismiss }: FeedbackBannerProps) {
  return (
    <div
      className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      role="status"
    >
      <p className="font-semibold leading-6">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-1.5 text-lg leading-6 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          aria-label="Dismiss message"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  )
}

export default FeedbackBanner
