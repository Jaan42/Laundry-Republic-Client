import { useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import FeedbackBanner from '../ui/FeedbackBanner'
import { getOrderApiErrorDetails, updateOrderStatus } from '../../services/orderService'
import type { OperationalStatus } from '../../types/dashboard'
import type { Order } from '../../types/order'

interface OrderStatusActionsProps {
  order: Order
  onUpdated: (order: Order) => void
}

interface StatusTransition {
  label: string
  status: OperationalStatus
  destructive?: boolean
}

const transitions: Record<OperationalStatus, StatusTransition[]> = {
  Pending: [
    { label: 'Start Washing', status: 'Washing' },
    { label: 'Cancel Order', status: 'Cancelled', destructive: true },
  ],
  Washing: [{ label: 'Mark Drying', status: 'Drying' }],
  Drying: [{ label: 'Ready for Pickup', status: 'Ready for Pickup' }],
  'Ready for Pickup': [{ label: 'Complete Order', status: 'Completed' }],
  Completed: [],
  Cancelled: [],
}

function OrderStatusActions({ order, onUpdated }: OrderStatusActionsProps) {
  const [pendingStatus, setPendingStatus] = useState<OperationalStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const availableTransitions = transitions[order.status]

  async function changeStatus(transition: StatusTransition) {
    setError(null)
    setSuccess(null)
    setPendingStatus(transition.status)

    try {
      const updatedOrder = await updateOrderStatus(order._id, transition.status)
      onUpdated(updatedOrder)
      setSuccess(`Order status updated to ${updatedOrder.status}.`)
    } catch (requestError) {
      setError(getOrderApiErrorDetails(requestError).message)
    } finally {
      setPendingStatus(null)
    }
  }

  return (
    <Card className="border-slate-200 p-5 sm:p-6">
      <h2 className="text-lg font-bold text-slate-950">Order Workflow</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        Advance this order through the server-controlled operational workflow.
      </p>

      {success && (
        <FeedbackBanner
          className="mt-4"
          message={success}
          onDismiss={() => setSuccess(null)}
        />
      )}
      {error && (
        <FeedbackBanner
          className="mt-4"
          message={error}
          onDismiss={() => setError(null)}
          tone="error"
        />
      )}

      {availableTransitions.length > 0 ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {availableTransitions.map((transition) => (
            <Button
              key={transition.status}
              onClick={() => changeStatus(transition)}
              disabled={pendingStatus !== null}
              className={`w-full sm:w-auto ${
                transition.destructive
                  ? '!bg-rose-600 hover:!bg-rose-700 focus-visible:!outline-rose-600'
                  : ''
              }`}
            >
              {pendingStatus === transition.status ? 'Updating...' : transition.label}
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          {order.status === 'Completed'
            ? 'This order is complete. No further transitions are available.'
            : 'This order is cancelled. No further transitions are available.'}
        </p>
      )}
    </Card>
  )
}

export default OrderStatusActions
