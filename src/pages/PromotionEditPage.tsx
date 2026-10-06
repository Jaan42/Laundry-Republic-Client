import { Link, useNavigate, useParams } from 'react-router-dom'
import PromotionForm from '../components/promotions/PromotionForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import usePromotion from '../hooks/usePromotion'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { updatePromotion } from '../services/promotionService'
import type { PromotionFormValues } from '../schemas/promotionSchema'

function toDateInputValue(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}

function PromotionEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { promotion, error, isLoading, retry } = usePromotion(id)

  useDocumentTitle('Edit Promotion')

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader title="Edit Promotion" description="Loading the promotion form." />
        <Card className="max-w-3xl animate-pulse border-slate-200 p-6" role="status">
          <div className="h-10 rounded bg-slate-100" />
          <div className="mt-5 h-28 rounded bg-slate-100" />
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="h-10 rounded bg-slate-100" />
            <div className="h-10 rounded bg-slate-100" />
          </div>
          <span className="sr-only">Loading promotion form.</span>
        </Card>
      </PageContainer>
    )
  }

  if (error || !promotion) {
    return (
      <PageContainer>
        <PageHeader title="Edit Promotion" description="Update a promotional offer." />
        <ApiErrorState
          className="max-w-3xl"
          label="Promotion unavailable"
          message={error || 'The promotion response was empty.'}
          onRetry={retry}
          secondaryAction={
            <Link
              to="/promotions"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Promotions
            </Link>
          }
        />
      </PageContainer>
    )
  }

  const defaultValues: PromotionFormValues = {
    code: promotion.code,
    description: promotion.description || '',
    discountPercentage: promotion.discountPercentage,
    minimumAmount: promotion.minimumAmount,
    startDate: toDateInputValue(promotion.startDate),
    endDate: toDateInputValue(promotion.endDate),
    isActive: promotion.isActive,
  }

  async function submitPromotion(values: PromotionFormValues) {
    if (!id) return

    await updatePromotion(id, values)
    navigate('/promotions', {
      state: { successMessage: 'Promotion updated successfully.' },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Edit Promotion"
        description={`Update the discount, dates, and availability for ${promotion.code}.`}
      />
      <Card className="max-w-3xl border-slate-200 p-5 sm:p-7">
        <PromotionForm
          defaultValues={defaultValues}
          onSubmit={submitPromotion}
          submitLabel="Save Changes"
        />
      </Card>
    </PageContainer>
  )
}

export default PromotionEditPage
