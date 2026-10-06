import { Link, useNavigate, useParams } from 'react-router-dom'
import ServiceForm from '../components/services/ServiceForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import useService from '../hooks/useService'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { updateService } from '../services/serviceService'
import type { ServiceFormValues } from '../schemas/serviceSchema'

function ServiceEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { service, error, isLoading, retry } = useService(id)

  useDocumentTitle('Edit Service')

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Edit Service" description="Loading the service form." />
        <Card className="max-w-3xl animate-pulse border-slate-200 p-6" role="status">
          <div className="h-10 rounded bg-slate-100" />
          <div className="mt-5 h-28 rounded bg-slate-100" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
          <span className="sr-only">Loading service form.</span>
        </Card>
      </PageContainer>
    )
  }

  if (error || !service) {
    return (
      <PageContainer>
        <PageHeader title="Edit Service" description="Update a laundry service." />
        <ApiErrorState
          className="max-w-3xl"
          label="Service unavailable"
          message={error || 'The service response was empty.'}
          onRetry={retry}
          secondaryAction={
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Services
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const defaultValues: ServiceFormValues = {
    name: service.name,
    description: service.description || '',
    price: service.price,
    pricingType: service.pricingType,
    turnaroundDays: service.turnaroundDays,
    isActive: service.isActive,
  }

  async function submitService(values: ServiceFormValues) {
    if (!id) return

    await updateService(id, values)
    navigate('/services', {
      state: { successMessage: 'Service updated successfully.' },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Service"
        description={`Update the pricing and availability for ${service.name}.`}
      />
      <Card className="max-w-3xl border-slate-200 p-5 sm:p-7">
        <ServiceForm
          defaultValues={defaultValues}
          onSubmit={submitService}
          submitLabel="Save Changes"
        />
      </Card>
    </PageContainer>
  )
}

export default ServiceEditPage
