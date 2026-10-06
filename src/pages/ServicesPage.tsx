import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DeleteServiceDialog from '../components/services/DeleteServiceDialog'
import ServiceList from '../components/services/ServiceList'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import useServices from '../hooks/useServices'
import type { ActiveServiceFilter, PricingTypeFilter } from '../hooks/useServices'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { deleteService, getServiceApiErrorDetails } from '../services/serviceService'
import type { LaundryService } from '../types/service'

interface ServiceNavigationState {
  successMessage?: string
}

function ServiceListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading services">
      {['service-one', 'service-two', 'service-three'].map((key) => (
        <Card key={key} className="animate-pulse border-slate-200 p-5">
          <div className="h-5 w-44 max-w-full rounded bg-slate-200" />
          <div className="mt-4 h-4 w-64 max-w-full rounded bg-slate-100" />
        </Card>
      ))}
      <span className="sr-only">Loading laundry services.</span>
    </div>
  )
}

const filterClassName =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100'

function ServicesPage() {
  const location = useLocation()
  const navigationState = location.state as ServiceNavigationState | null
  const { services, error, isLoading, filters, changeFilters, removeService, retry } =
    useServices()
  const [serviceToDelete, setServiceToDelete] = useState<LaundryService | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    navigationState?.successMessage || null,
  )

  useDocumentTitle('Services')

  const hasFilters = filters.active !== 'all' || filters.pricingType !== 'all'

  function setActiveFilter(active: ActiveServiceFilter) {
    setSuccessMessage(null)
    changeFilters({ ...filters, active })
  }

  function setPricingTypeFilter(pricingType: PricingTypeFilter) {
    setSuccessMessage(null)
    changeFilters({ ...filters, pricingType })
  }

  function clearFilters() {
    changeFilters({ active: 'all', pricingType: 'all' })
  }

  function requestDelete(service: LaundryService) {
    setDeleteError(null)
    setServiceToDelete(service)
  }

  function cancelDelete() {
    if (isDeleting) return
    setDeleteError(null)
    setServiceToDelete(null)
  }

  async function confirmDelete() {
    if (!serviceToDelete) return

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const response = await deleteService(serviceToDelete._id)
      removeService(serviceToDelete._id)
      setServiceToDelete(null)
      setSuccessMessage(response.message || 'Service deleted successfully.')
    } catch (deleteRequestError) {
      setDeleteError(getServiceApiErrorDetails(deleteRequestError).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Services"
        description="Manage laundry pricing, turnaround times, and service availability."
        actions={
          <Link
            to="/services/new"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
          >
            Add Service
          </Link>
        }
      />

      {successMessage && (
        <FeedbackBanner
          className="mb-6"
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      <Card className="mb-6 border-slate-200 p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div>
            <label htmlFor="active-filter" className="text-sm font-bold text-slate-800">
              Status
            </label>
            <select
              id="active-filter"
              value={filters.active}
              onChange={(event) => setActiveFilter(event.target.value as ActiveServiceFilter)}
              disabled={isLoading}
              className={filterClassName}
            >
              <option value="all">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="pricing-filter" className="text-sm font-bold text-slate-800">
              Pricing Type
            </label>
            <select
              id="pricing-filter"
              value={filters.pricingType}
              onChange={(event) =>
                setPricingTypeFilter(event.target.value as PricingTypeFilter)
              }
              disabled={isLoading}
              className={filterClassName}
            >
              <option value="all">All pricing types</option>
              <option value="perKg">Per Kilogram</option>
              <option value="perPiece">Per Piece</option>
              <option value="perPair">Per Pair</option>
            </select>
          </div>
        </div>
        {hasFilters && !isLoading && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Clear filters
          </button>
        )}
      </Card>

      {isLoading ? (
        <ServiceListSkeleton />
      ) : error ? (
        <ApiErrorState label="Services unavailable" message={error} onRetry={retry} />
      ) : services.length === 0 ? (
        <EmptyState
          title={hasFilters ? 'No services match these filters' : 'No services yet'}
          description={
            hasFilters
              ? 'Try another status or pricing type, or clear the filters to see all services.'
              : 'Laundry services will appear here after the first service is added.'
          }
        />
      ) : (
        <ServiceList services={services} onDelete={requestDelete} />
      )}

      {hasFilters && !isLoading && !error && services.length === 0 && (
        <div className="mt-4 flex justify-center">
          <Button onClick={clearFilters}>Clear filters</Button>
        </div>
      )}

      {serviceToDelete && (
        <DeleteServiceDialog
          service={serviceToDelete}
          error={deleteError}
          isDeleting={isDeleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </PageContainer>
  )
}

export default ServicesPage
