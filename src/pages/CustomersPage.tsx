import { useState } from 'react'
import { Link } from 'react-router-dom'
import CustomerList from '../components/customers/CustomerList'
import DeleteCustomerDialog from '../components/customers/DeleteCustomerDialog'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import Input from '../components/ui/Input'
import useCustomers from '../hooks/useCustomers'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { deleteCustomer, getCustomerApiErrorDetails } from '../services/customerService'
import type { Customer } from '../types/customer'

function CustomerListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading customers">
      {['customer-one', 'customer-two', 'customer-three'].map((key) => (
        <Card key={key} className="animate-pulse border-slate-200 p-5">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-56 max-w-full rounded bg-slate-100" />
        </Card>
      ))}
      <span className="sr-only">Loading customer records.</span>
    </div>
  )
}

function CustomersPage() {
  const {
    activeSearch,
    customers,
    error,
    isLoading,
    removeCustomer,
    retry,
    searchCustomers,
  } = useCustomers()
  const [searchInput, setSearchInput] = useState('')
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useDocumentTitle('Customers')

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage(null)
    searchCustomers(searchInput)
  }

  function clearSearch() {
    setSearchInput('')
    searchCustomers('')
  }

  function requestDelete(customer: Customer) {
    setDeleteError(null)
    setCustomerToDelete(customer)
  }

  function cancelDelete() {
    if (isDeleting) return
    setDeleteError(null)
    setCustomerToDelete(null)
  }

  async function confirmDelete() {
    if (!customerToDelete) return

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const response = await deleteCustomer(customerToDelete._id)
      removeCustomer(customerToDelete._id)
      setCustomerToDelete(null)
      setSuccessMessage(response.message || 'Customer deleted successfully.')
    } catch (deleteRequestError) {
      setDeleteError(getCustomerApiErrorDetails(deleteRequestError).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Customers"
        description="Find and manage the customer records used for laundry orders."
        actions={
          <Link
            to="/customers/new"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Add Customer
          </Link>
        }
      />

      {successMessage && (
        <FeedbackBanner message={successMessage} onDismiss={() => setSuccessMessage(null)} />
      )}

      <Card className="mb-6 border-slate-200 p-4 sm:p-5">
        <form onSubmit={submitSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="min-w-0 flex-1">
            <label htmlFor="customer-search" className="sr-only">
              Search customers
            </label>
            <Input
              id="customer-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, contact number, or email"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
              Search
            </Button>
            {(activeSearch || searchInput) && (
              <button
                type="button"
                onClick={clearSearch}
                disabled={isLoading}
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                Clear
              </button>
            )}
          </div>
        </form>
        {activeSearch && !isLoading && !error && (
          <p className="mt-3 text-sm text-slate-500">
            Results for <span className="font-semibold text-slate-700">“{activeSearch}”</span>
          </p>
        )}
      </Card>

      {isLoading ? (
        <CustomerListSkeleton />
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50/60 p-6" role="alert">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-700">
            Customers unavailable
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{error}</p>
          <Button className="mt-5" onClick={retry}>
            Try again
          </Button>
        </Card>
      ) : customers.length === 0 ? (
        <EmptyState
          title={activeSearch ? 'No search results' : 'No customers yet'}
          description={
            activeSearch
              ? 'Try another name, contact number, or email address.'
              : 'Customer records will appear here after the first customer is added.'
          }
        />
      ) : (
        <CustomerList customers={customers} onDelete={requestDelete} />
      )}

      {customerToDelete && (
        <DeleteCustomerDialog
          customer={customerToDelete}
          error={deleteError}
          isDeleting={isDeleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </PageContainer>
  )
}

export default CustomersPage
