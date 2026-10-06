import { Link, useNavigate, useParams } from 'react-router-dom'
import EditOrderForm from '../components/orders/EditOrderForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOrder from '../hooks/useOrder'
import useOrderOptions from '../hooks/useOrderOptions'
import { updateOrder } from '../services/orderService'
import type { UpdateOrderPayload } from '../types/order'

function EditOrderSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" role="status">
      <Card className="animate-pulse border-slate-200 p-6">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="h-10 rounded bg-slate-100" />
          <div className="h-10 rounded bg-slate-100" />
        </div>
        <div className="mt-7 h-40 rounded bg-slate-100" />
      </Card>
      <Card className="h-64 animate-pulse border-slate-200 p-6">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="mt-6 h-32 rounded bg-slate-100" />
      </Card>
      <span className="sr-only">Loading the order edit form.</span>
    </div>
  )
}

function OrderEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { error, errorStatus, isLoading, order, retry } = useOrder(id)
  const {
    customers,
    customerError,
    isLoadingCustomers,
    isLoadingServices,
    retryCustomers,
    retryServices,
    serviceError,
    services,
  } = useOrderOptions(false)

  useDocumentTitle('Edit Order')

  async function submitOrder(payload: UpdateOrderPayload) {
    if (!id) return
    const updatedOrder = await updateOrder(id, payload)
    navigate(`/orders/${updatedOrder._id}`, {
      state: { successMessage: `Order ${updatedOrder.orderNumber} updated successfully.` },
    })
  }

  const loading = isLoading || isLoadingCustomers || isLoadingServices

  return (
    <PageContainer>
      <PageHeader
        title={order ? `Edit ${order.orderNumber}` : 'Edit Order'}
        description="Update accepted order inputs while server-calculated values remain protected."
        actions={
          order ? (
            <Link
              to={`/orders/${order._id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Back to Order
            </Link>
          ) : undefined
        }
      />

      {loading ? (
        <EditOrderSkeleton />
      ) : errorStatus === 404 ? (
        <Card className="max-w-3xl border-slate-200 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            Order not found
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">This order cannot be edited.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            It may have been deleted, or the link may no longer be valid.
          </p>
          <Link
            to="/orders"
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Orders
          </Link>
        </Card>
      ) : error || !order ? (
        <ApiErrorState
          className="max-w-3xl"
          label="Order unavailable"
          message={error || 'The order response was empty.'}
          onRetry={retry}
          secondaryAction={
            <Link
              to="/orders"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Orders
            </Link>
          }
        />
      ) : customerError || serviceError ? (
        <div className="space-y-4">
          {customerError && (
            <ApiErrorState
              label="Customers unavailable"
              message={customerError}
              onRetry={retryCustomers}
            />
          )}
          {serviceError && (
            <ApiErrorState
              label="Services unavailable"
              message={serviceError}
              onRetry={retryServices}
            />
          )}
        </div>
      ) : (
        <EditOrderForm
          customers={customers}
          order={order}
          services={services}
          onUpdate={submitOrder}
        />
      )}
    </PageContainer>
  )
}

export default OrderEditPage
