import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import useCustomer from '../hooks/useCustomer'
import useDocumentTitle from '../hooks/useDocumentTitle'

interface CustomerNavigationState {
  successMessage?: string
}

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function formatDate(value?: string) {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not available' : dateFormatter.format(date)
}

function CustomerDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigationState = location.state as CustomerNavigationState | null
  const [successMessage, setSuccessMessage] = useState(
    navigationState?.successMessage || null,
  )
  const { customer, error, isLoading, retry } = useCustomer(id)

  useDocumentTitle(customer?.name || 'Customer Details')

  return (
    <PageContainer>
      <PageHeader
        title={customer?.name || 'Customer Details'}
        description={
          isLoading
            ? 'Loading the customer record.'
            : 'Review the contact and address information saved for this customer.'
        }
        actions={
          customer ? (
            <div className="flex flex-wrap gap-2">
              <Link
                to="/customers"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Back to Customers
              </Link>
              <Link
                to={`/customers/${customer._id}/edit`}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
              >
                Edit Customer
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
        <Card className="max-w-3xl animate-pulse border-slate-200 p-6" role="status">
          <div className="h-7 w-52 max-w-full rounded bg-slate-200" />
          <div className="mt-6 h-28 rounded bg-slate-100" />
          <span className="sr-only">Loading customer details.</span>
        </Card>
      ) : error || !customer ? (
        <ApiErrorState
          className="max-w-3xl"
          label="Customer unavailable"
          message={error || 'The customer response was empty.'}
          onRetry={retry}
          secondaryAction={
            <Link
              to="/customers"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Customers
            </Link>
          }
        />
      ) : (
        <Card className="max-w-4xl border-slate-200 p-5 sm:p-7">
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Name
              </dt>
              <dd className="mt-2 break-words text-base font-semibold text-slate-900">
                {customer.name || 'Not available'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Contact Number
              </dt>
              <dd className="mt-2 break-words text-base text-slate-700">
                {customer.contactNumber || 'Not available'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Email
              </dt>
              <dd className="mt-2 break-words text-base text-slate-700">
                {customer.email || 'Not provided'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Date Created
              </dt>
              <dd className="mt-2 text-base text-slate-700">
                {formatDate(customer.createdAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                Address
              </dt>
              <dd className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-slate-700">
                {customer.address || 'Not provided'}
              </dd>
            </div>
          </dl>
        </Card>
      )}
    </PageContainer>
  )
}

export default CustomerDetailsPage
