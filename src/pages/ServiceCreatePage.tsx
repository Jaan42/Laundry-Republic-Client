import { useNavigate } from 'react-router-dom'
import ServiceForm from '../components/services/ServiceForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { createService } from '../services/serviceService'
import type { ServiceFormValues } from '../schemas/serviceSchema'

const emptyService: ServiceFormValues = {
  name: '',
  description: '',
  price: 0,
  pricingType: 'perKg',
  turnaroundDays: 0,
  isActive: true,
}

function ServiceCreatePage() {
  const navigate = useNavigate()

  useDocumentTitle('Add Service')

  async function submitService(values: ServiceFormValues) {
    await createService(values)
    navigate('/services', {
      state: { successMessage: 'Service created successfully.' },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Service"
        description="Create a laundry service with its price, unit, and expected turnaround."
      />
      <Card className="max-w-3xl border-slate-200 p-5 sm:p-7">
        <ServiceForm
          defaultValues={emptyService}
          onSubmit={submitService}
          submitLabel="Create Service"
        />
      </Card>
    </PageContainer>
  )
}

export default ServiceCreatePage
