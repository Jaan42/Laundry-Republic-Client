import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DeleteOrderDialog from '../components/orders/DeleteOrderDialog'
import OrderFilters from '../components/orders/OrderFilters'
import OrderList from '../components/orders/OrderList'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOrders from '../hooks/useOrders'
import { deleteOrder, getOrderApiErrorDetails } from '../services/orderService'
import type { Order, OrderFilters as AppliedOrderFilters } from '../types/order'

interface OrdersNavigationState {
  successMessage?: string
}

const defaultFilters: AppliedOrderFilters = { sort: 'newest' }

function hasActiveFilters(filters: AppliedOrderFilters) {
  return Boolean(
    filters.search ||
      filters.status ||
      filters.startDate ||
      filters.endDate ||
      filters.minTotal !== undefined ||
      filters.maxTotal !== undefined ||
      (filters.sort && filters.sort !== 'newest'),
  )
}

function OrderListSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading orders">
      {['order-one', 'order-two', 'order-three'].map((key) => (
        <Card key={key} className="animate-pulse border-slate-200 p-5">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-56 max-w-full rounded bg-slate-100" />
          <div className="mt-5 h-9 rounded bg-slate-100" />
        </Card>
      ))}
      <span className="sr-only">Loading order records.</span>
    </div>
  )
}

function OrdersPage() {
  const location = useLocation()
  const navigationState = location.state as OrdersNavigationState | null
  const [filters, setFilters] = useState<AppliedOrderFilters>(defaultFilters)
  const { error, isLoading, orders, removeOrder, retry } = useOrders(filters)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(
    navigationState?.successMessage || null,
  )

  useDocumentTitle('Orders')

  function applyFilters(nextFilters: AppliedOrderFilters) {
    setSuccessMessage(null)
    setFilters(nextFilters)
  }

  function requestDelete(order: Order) {
    setDeleteError(null)
    setOrderToDelete(order)
  }

  function cancelDelete() {
    if (isDeleting) return
    setDeleteError(null)
    setOrderToDelete(null)
  }

  async function confirmDelete() {
    if (!orderToDelete) return

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const response = await deleteOrder(orderToDelete._id)
      removeOrder(orderToDelete._id)
      setOrderToDelete(null)
      setSuccessMessage(
        response.message || `Order ${orderToDelete.orderNumber} deleted successfully.`,
      )
    } catch (requestError) {
      setDeleteError(getOrderApiErrorDetails(requestError).message)
    } finally {
      setIsDeleting(false)
    }
  }

  const filtered = hasActiveFilters(filters)

  return (
    <PageContainer>
      <PageHeader
        title="Orders"
        description="Track laundry orders, filter operational work, and manage each order through completion."
        actions={
          <Link
            to="/orders/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Create Order
          </Link>
        }
      />

      {successMessage && (
        <FeedbackBanner
          className="mb-6"
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      <OrderFilters isLoading={isLoading} onApply={applyFilters} />

      {!isLoading && !error && orders.length > 0 && (
        <p className="mb-4 text-sm font-semibold text-slate-500">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </p>
      )}

      {isLoading ? (
        <OrderListSkeleton />
      ) : error ? (
        <ApiErrorState label="Orders unavailable" message={error} onRetry={retry} />
      ) : orders.length === 0 ? (
        <EmptyState
          title={filtered ? 'No matching orders' : 'No orders yet'}
          description={
            filtered
              ? 'Try clearing or adjusting the current search and filters.'
              : 'Orders will appear here after the first laundry order is created.'
          }
        />
      ) : (
        <OrderList orders={orders} onDelete={requestDelete} />
      )}

      {orderToDelete && (
        <DeleteOrderDialog
          order={orderToDelete}
          error={deleteError}
          isDeleting={isDeleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </PageContainer>
  )
}

export default OrdersPage
