import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomerForm from '../components/customers/CustomerForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import useCustomer from '../hooks/useCustomer'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { updateCustomer } from '../services/customerService'
import type { CustomerFormValues } from '../schemas/customerSchema'

function CustomerEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customer, error, isLoading, retry } = useCustomer(id)

  useDocumentTitle('Edit Customer')

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Edit Customer" description="Loading the customer form." />
        <Card className="max-w-3xl animate-pulse border-slate-200 p-6" role="status">
          <div className="h-10 rounded bg-slate-100" />
          <div className="mt-5 h-10 rounded bg-slate-100" />
          <div className="mt-5 h-28 rounded bg-slate-100" />
          <span className="sr-only">Loading customer form.</span>
        </Card>
      </PageContainer>
    )
  }

  if (error || !customer) {
    return (
      <PageContainer>
        <PageHeader title="Edit Customer" description="Update a customer record." />
        <Card className="max-w-3xl border-rose-200 bg-rose-50/60 p-6" role="alert">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-rose-700">
            Customer unavailable
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error || 'The customer response was empty.'}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={retry}>Try again</Button>
            <Link
              to="/customers"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Customers
            </Link>
          </div>
        </Card>
      </PageContainer>
    )
  }

  const defaultValues: CustomerFormValues = {
    name: customer.name || '',
    contactNumber: customer.contactNumber || '',
    email: customer.email || '',
    address: customer.address || '',
  }

  async function submitCustomer(values: CustomerFormValues) {
    if (!id) return
    const updatedCustomer = await updateCustomer(id, values)

    navigate(`/customers/${updatedCustomer._id}`, {
      state: { successMessage: 'Customer updated successfully.' },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Customer"
        description={`Update the saved information for ${customer.name || 'this customer'}.`}
      />
      <Card className="max-w-3xl border-slate-200 p-5 sm:p-7">
        <CustomerForm
          defaultValues={defaultValues}
          onSubmit={submitCustomer}
          submitLabel="Save Changes"
        />
      </Card>
    </PageContainer>
  )
}

export default CustomerEditPage
