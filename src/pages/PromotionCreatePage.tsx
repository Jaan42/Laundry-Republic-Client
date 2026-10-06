import { useNavigate } from 'react-router-dom'
import PromotionForm from '../components/promotions/PromotionForm'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { createPromotion } from '../services/promotionService'
import type { PromotionFormValues } from '../schemas/promotionSchema'

const emptyPromotion: PromotionFormValues = {
  code: '',
  description: '',
  discountPercentage: 1,
  minimumAmount: 0,
  startDate: '',
  endDate: '',
  isActive: true,
}

function PromotionCreatePage() {
  const navigate = useNavigate()

  useDocumentTitle('Add Promotion')

  async function submitPromotion(values: PromotionFormValues) {
    await createPromotion(values)
    navigate('/promotions', {
      state: { successMessage: 'Promotion created successfully.' },
    })
  }

  return (
    <PageContainer>
      <PageHeader
        title="Add Promotion"
        description="Create a promotional discount with an amount threshold and active date range."
      />
      <Card className="max-w-3xl border-slate-200 p-5 sm:p-7">
        <PromotionForm
          defaultValues={emptyPromotion}
          onSubmit={submitPromotion}
          submitLabel="Create Promotion"
        />
      </Card>
    </PageContainer>
  )
}

export default PromotionCreatePage
