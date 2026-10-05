import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import type { Customer } from '../../types/customer'

interface CustomerListProps {
  customers: Customer[]
  onDelete: (customer: Customer) => void
}

interface CustomerActionsProps {
  customer: Customer
  onDelete: (customer: Customer) => void
  compact?: boolean
}

function CustomerActions({ customer, onDelete, compact = false }: CustomerActionsProps) {
  const baseClass = compact
    ? 'flex-1 justify-center px-3 py-2.5'
    : 'px-2.5 py-1.5'

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? 'w-full' : 'justify-end'}`}>
      <Link
        to={`/customers/${customer._id}`}
        className={`inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${baseClass}`}
      >
        View
      </Link>
      <Link
        to={`/customers/${customer._id}/edit`}
        className={`inline-flex items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${baseClass}`}
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={() => onDelete(customer)}
        className={`inline-flex items-center rounded-lg border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${baseClass}`}
      >
        Delete
      </button>
    </div>
  )
}

function CustomerList({ customers, onDelete }: CustomerListProps) {
  return (
    <>
      <Card className="hidden overflow-hidden border-slate-200 p-0 md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.1em] text-slate-500">
            <tr>
              <th className="w-[24%] px-5 py-4 font-bold">Name</th>
              <th className="w-[22%] px-5 py-4 font-bold">Contact Number</th>
              <th className="w-[28%] px-5 py-4 font-bold">Email</th>
              <th className="w-[26%] px-5 py-4 text-right font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer._id} className="transition hover:bg-blue-50/40">
                <td className="break-words px-5 py-4 text-sm font-bold text-slate-900">
                  {customer.name || 'Name unavailable'}
                </td>
                <td className="break-words px-5 py-4 text-sm text-slate-600">
                  {customer.contactNumber || '—'}
                </td>
                <td className="break-words px-5 py-4 text-sm text-slate-600">
                  {customer.email || '—'}
                </td>
                <td className="px-5 py-4">
                  <CustomerActions customer={customer} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <ul className="space-y-4 md:hidden">
        {customers.map((customer) => (
          <li key={customer._id}>
            <Card className="border-slate-200 p-5">
              <h2 className="break-words text-lg font-bold text-slate-950">
                {customer.name || 'Name unavailable'}
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-500">Contact Number</dt>
                  <dd className="mt-1 break-words text-slate-800">
                    {customer.contactNumber || '—'}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Email</dt>
                  <dd className="mt-1 break-words text-slate-800">{customer.email || '—'}</dd>
                </div>
              </dl>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <CustomerActions customer={customer} onDelete={onDelete} compact />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}

export default CustomerList
