import Button from '../ui/Button'
import FeedbackBanner from '../ui/FeedbackBanner'
import type { Customer } from '../../types/customer'

interface DeleteCustomerDialogProps {
  customer: Customer
  error: string | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

function DeleteCustomerDialog({
  customer,
  error,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteCustomerDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-customer-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-[2px]"
        onClick={onCancel}
        disabled={isDeleting}
        aria-label="Cancel customer deletion"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-rose-600">
          Confirm deletion
        </p>
        <h2 id="delete-customer-title" className="mt-2 text-xl font-bold text-slate-950">
          Delete {customer.name || 'this customer'}?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This removes the customer record. This action cannot be undone.
        </p>

        {error && (
          <FeedbackBanner className="mt-4" message={error} tone="error" />
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="!bg-rose-600 hover:!bg-rose-700 focus-visible:!outline-rose-600"
          >
            {isDeleting ? 'Deleting…' : 'Delete customer'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DeleteCustomerDialog
