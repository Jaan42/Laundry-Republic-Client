import { useNavigate } from 'react-router-dom'
import CustomerForm from '../components/customers/CustomerForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { createCustomer } from '../services/customerService'
import type { CustomerFormValues } from '../schemas/customerSchema'

const emptyCustomer: CustomerFormValues = {
  name: '',
  contactNumber: '',
  email: '',
  address: '',
}

function CustomerCreatePage() {
  const navigate = useNavigate()

  useDocumentTitle('Add Customer')

  async function submitCustomer(values: CustomerFormValues) {
    const customer = await createCustomer(values)

    navigate(`/customers/${customer._id}`, {
      state: { successMessage: 'Customer created successfully.' },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Customer"
        description="Create a customer record that can be selected when preparing laundry orders."
      />
      <Card className="max-w-3xl border-slate-200 p-5 sm:p-7">
        <CustomerForm
          defaultValues={emptyCustomer}
          onSubmit={submitCustomer}
          submitLabel="Create Customer"
        />
      </Card>
    </PageContainer>
  )
}

export default CustomerCreatePage
