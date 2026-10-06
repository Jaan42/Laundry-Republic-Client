import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import OrderStatusActions from '../components/orders/OrderStatusActions'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import StatusBadge from '../components/ui/StatusBadge'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOrder from '../hooks/useOrder'
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderUnitLabel,
} from '../utils/orderFormatting'

interface OrderNavigationState {
  successMessage?: string
}

function OrderDetailsSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]" role="status">
      <Card className="animate-pulse border-slate-200 p-6">
        <div className="h-6 w-40 rounded bg-slate-200" />
        <div className="mt-6 h-40 rounded bg-slate-100" />
        <div className="mt-6 h-52 rounded bg-slate-100" />
      </Card>
      <Card className="h-72 animate-pulse border-slate-200 p-6">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="mt-6 h-36 rounded bg-slate-100" />
      </Card>
      <span className="sr-only">Loading order details.</span>
    </div>
  )
}

function OrderDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigationState = location.state as OrderNavigationState | null
  const [successMessage, setSuccessMessage] = useState(
    navigationState?.successMessage || null,
  )
  const { error, errorStatus, isLoading, order, replaceOrder, retry } = useOrder(id)

  useDocumentTitle(order?.orderNumber || 'Order Details')

  return (
    <PageContainer>
      <PageHeader
        title={order?.orderNumber || 'Order Details'}
        description={
          isLoading
            ? 'Loading the order record.'
            : 'Review customer, service, pricing, due-date, and workflow information.'
        }
        actions={
          order ? (
            <div className="flex flex-wrap gap-2">
              <Link
                to="/orders"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Back to Orders
              </Link>
              <Link
                to={`/orders/${order._id}/edit`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Edit Order
              </Link>
            </div>
          ) : undefined
        }
      />

      {successMessage && (
        <FeedbackBanner
          className="mb-6"
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      {isLoading ? (
        <OrderDetailsSkeleton />
      ) : errorStatus === 404 ? (
        <Card className="max-w-3xl border-slate-200 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            Order not found
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-950">This order does not exist.</h2>
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
      ) : (
        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
          <div className="min-w-0 space-y-6">
            <Card className="border-slate-200 p-5 sm:p-7">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={order.status} type="operational" />
                <StatusBadge status={order.dueStatus} type="due" />
              </div>

              <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Customer
                  </dt>
                  <dd className="mt-2 break-words text-base font-semibold text-slate-900">
                    {order.customer?.name || 'Unavailable'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Contact Number
                  </dt>
                  <dd className="mt-2 break-words text-base text-slate-700">
                    {order.customer?.contactNumber || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-2 break-words text-base text-slate-700">
                    {order.customer?.email || 'Not provided'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Order Date
                  </dt>
                  <dd className="mt-2 text-base text-slate-700">
                    {formatOrderDate(order.orderDate)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Expected Completion
                  </dt>
                  <dd className="mt-2 text-base text-slate-700">
                    {formatOrderDate(order.expectedCompletionDate)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Notes
                  </dt>
                  <dd className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-slate-700">
                    {order.notes || 'No notes provided.'}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="min-w-0 border-slate-200 p-5 sm:p-7">
              <h2 className="text-lg font-bold text-slate-950">Service Line Items</h2>
              <p className="mt-1 text-sm text-slate-500">
                Prices are the trusted snapshots saved with this order.
              </p>

              <div className="mt-5 hidden overflow-hidden rounded-xl border border-slate-200 sm:block">
                <table className="w-full table-fixed border-collapse text-left">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                      <th className="w-[38%] px-4 py-3 font-bold">Service</th>
                      <th className="w-[20%] px-4 py-3 font-bold">Quantity</th>
                      <th className="w-[20%] px-4 py-3 font-bold">Price</th>
                      <th className="w-[22%] px-4 py-3 text-right font-bold">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item) => (
                      <tr key={item._id}>
                        <td className="break-words px-4 py-4 text-sm font-semibold text-slate-900">
                          {item.service?.name || 'Service unavailable'}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {item.quantity} {getOrderUnitLabel(item.service?.pricingType)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          {formatOrderCurrency(item.priceAtOrder)}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-bold text-slate-900">
                          {formatOrderCurrency(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="mt-5 space-y-3 sm:hidden">
                {order.items.map((item) => (
                  <li key={item._id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="break-words font-bold text-slate-900">
                      {item.service?.name || 'Service unavailable'}
                    </p>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-slate-500">Quantity</dt>
                        <dd className="mt-1 font-semibold text-slate-800">
                          {item.quantity} {getOrderUnitLabel(item.service?.pricingType)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-500">Unit Price</dt>
                        <dd className="mt-1 font-semibold text-slate-800">
                          {formatOrderCurrency(item.priceAtOrder)}
                        </dd>
                      </div>
                      <div className="col-span-2 border-t border-slate-200 pt-3">
                        <dt className="text-slate-500">Line Total</dt>
                        <dd className="mt-1 font-bold text-slate-950">
                          {formatOrderCurrency(item.lineTotal)}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            </Card>

            <OrderStatusActions order={order} onUpdated={replaceOrder} />
          </div>

          <div className="space-y-6 xl:sticky xl:top-6">
            <Card className="border-slate-200 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-950">Order Totals</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Subtotal</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatOrderCurrency(order.subtotal)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Additional Charge</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatOrderCurrency(order.additionalCharge)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Base Total</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatOrderCurrency(order.baseTotal)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">
                    Discount{order.discountPercentage > 0 ? ` (${order.discountPercentage}%)` : ''}
                  </dt>
                  <dd className="font-semibold text-emerald-700">
                    -{formatOrderCurrency(order.discountAmount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-slate-200 pt-4">
                  <dt className="text-base font-bold text-slate-950">Grand Total</dt>
                  <dd className="text-lg font-bold text-blue-700">
                    {formatOrderCurrency(order.grandTotal)}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="border-slate-200 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-950">Promotion</h2>
              {order.promotion ? (
                <div className="mt-4">
                  <p className="font-bold text-blue-700">{order.promotion.code}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {order.promotion.description || 'No promotion description provided.'}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {order.discountPercentage}% discount
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No promotion applied.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default OrderDetailsPage
