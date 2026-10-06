import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'
import type { Order } from '../../types/order'
import { formatOrderCurrency, formatOrderDate } from '../../utils/orderFormatting'

interface OrderListProps {
  orders: Order[]
  onDelete: (order: Order) => void
}

interface OrderActionsProps {
  order: Order
  onDelete: (order: Order) => void
  compact?: boolean
}

function OrderActions({ order, onDelete, compact = false }: OrderActionsProps) {
  const baseClass = compact ? 'flex-1 justify-center px-3 py-2.5' : 'px-2.5 py-1.5'

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'w-full' : 'justify-end'}`}>
      <Link
        to={`/orders/${order._id}`}
        className={`inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${baseClass}`}
      >
        View
      </Link>
      <Link
        to={`/orders/${order._id}/edit`}
        className={`inline-flex items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${baseClass}`}
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(order)}
        className={`inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${baseClass}`}
      >
        Delete
      </button>
    </div>
  )
}

function OrderList({ orders, onDelete }: OrderListProps) {
  return (
    <>
      <Card className="hidden overflow-hidden border-slate-200 p-0 lg:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="w-[12%] px-4 py-4 font-bold">Order</th>
              <th className="w-[15%] px-4 py-4 font-bold">Customer</th>
              <th className="w-[13%] px-4 py-4 font-bold">Order Date</th>
              <th className="w-[18%] px-4 py-4 font-bold">Due</th>
              <th className="w-[12%] px-4 py-4 font-bold">Total</th>
              <th className="w-[15%] px-4 py-4 font-bold">Status</th>
              <th className="w-[15%] px-4 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order._id} className="align-top transition hover:bg-blue-50/40">
                <td className="break-words px-4 py-4 text-sm font-bold text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="break-words px-4 py-4 text-sm text-slate-700">
                  {order.customer?.name || 'Unavailable'}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {formatOrderDate(order.orderDate)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  <p>{formatOrderDate(order.expectedCompletionDate)}</p>
                  <div className="mt-2">
                    <StatusBadge status={order.dueStatus} type="due" />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-bold text-slate-900">
                  {formatOrderCurrency(order.grandTotal)}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.status} type="operational" />
                </td>
                <td className="px-4 py-4">
                  <OrderActions order={order} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-4 lg:hidden">
        {orders.map((order) => (
          <li key={order._id}>
            <Card className="min-w-0 border-slate-200 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                    {order.orderNumber}
                  </p>
                  <h2 className="mt-1 break-words text-lg font-bold text-slate-950">
                    {order.customer?.name || 'Customer unavailable'}
                  </h2>
                </div>
                <p className="shrink-0 text-base font-bold text-slate-950">
                  {formatOrderCurrency(order.grandTotal)}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={order.status} type="operational" />
                <StatusBadge status={order.dueStatus} type="due" />
              </div>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Order Date</dt>
                  <dd className="mt-1 text-slate-800">{formatOrderDate(order.orderDate)}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Expected Completion</dt>
                  <dd className="mt-1 text-slate-800">
                    {formatOrderDate(order.expectedCompletionDate)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <OrderActions order={order} onDelete={onDelete} compact />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

export default OrderList
