import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderForm from '../components/orders/OrderForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOrderOptions from '../hooks/useOrderOptions'
import { createOrder } from '../services/orderService'
import type { CreateOrderPayload } from '../types/order'

function OrderFormSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" role="status">
      <Card className="animate-pulse border-slate-200 p-6">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-5 h-10 rounded bg-slate-100" />
        <div className="mt-8 h-5 w-44 rounded bg-slate-200" />
        <div className="mt-5 h-36 rounded bg-slate-100" />
      </Card>
      <Card className="h-72 animate-pulse border-slate-200 p-6">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="mt-6 space-y-4">
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
          <div className="h-4 rounded bg-slate-100" />
        </div>
      </Card>
      <span className="sr-only">Loading customers and active services.</span>
    </div>
  )
}

function CreateOrderPage() {
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const {
    customers,
    customerError,
    isLoadingCustomers,
    isLoadingServices,
    retryCustomers,
    retryServices,
    serviceError,
    services,
  } = useOrderOptions()

  useDocumentTitle('Create Order')

  async function submitOrder(payload: CreateOrderPayload) {
    const order = await createOrder(payload)
    const message = `Order ${order.orderNumber} created successfully. Redirecting to Orders…`
    setSuccessMessage(message)
    await new Promise((resolve) => setTimeout(resolve, 1600))
    navigate('/orders', {
      state: { successMessage: `Order ${order.orderNumber} created successfully.` },
    })
  }

  const isLoading = isLoadingCustomers || isLoadingServices

  return (
    <PageContainer>
      <PageHeader
        title="Create Order"
        description="Build a laundry order and confirm server-calculated totals before saving."
      />

      {successMessage && <FeedbackBanner className="mb-6" message={successMessage} />}

      {customerError || serviceError ? (
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
      ) : isLoading ? (
        <OrderFormSkeleton />
      ) : services.length === 0 ? (
        <EmptyState
          title="No active services available"
          description="An active laundry service is required before an order can be created."
        />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers available"
          description="A customer record is required before an order can be created."
        />
      ) : (
        <OrderForm customers={customers} services={services} onCreate={submitOrder} />
      )}
    </PageContainer>
  )
}

export default CreateOrderPage
