import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import DeletePromotionDialog from '../components/promotions/DeletePromotionDialog'
import PromotionList from '../components/promotions/PromotionList'
import PageContainer from '../components/layout/PageContainer'
import PageHeader from '../components/layout/PageHeader'
import ApiErrorState from '../components/ui/ApiErrorState'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import FeedbackBanner from '../components/ui/FeedbackBanner'
import usePromotions from '../hooks/usePromotions'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
  deletePromotion,
  getPromotionApiErrorDetails,
} from '../services/promotionService'
import type { Promotion } from '../types/promotion'

interface PromotionNavigationState {
  successMessage?: string
}

function PromotionListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading promotions">
      {['promotion-one', 'promotion-two', 'promotion-three'].map((key) => (
        <Card key={key} className="animate-pulse border-slate-200 p-5">
          <div className="h-5 w-36 max-w-full rounded bg-slate-200" />
          <div className="mt-4 h-4 w-64 max-w-full rounded bg-slate-100" />
        </Card>
      ))}
      <span className="sr-only">Loading promotions.</span>
    </div>
  )
}

function PromotionsPage() {
  const location = useLocation()
  const navigationState = location.state as PromotionNavigationState | null
  const { promotions, error, isLoading, removePromotion, retry } = usePromotions()
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(
    navigationState?.successMessage || null,
  )

  useDocumentTitle('Promotions')

  function requestDelete(promotion: Promotion) {
    setDeleteError(null)
    setPromotionToDelete(promotion)
  }

  function cancelDelete() {
    if (isDeleting) return
    setDeleteError(null)
    setPromotionToDelete(null)
  }

  async function confirmDelete() {
    if (!promotionToDelete) return

    setDeleteError(null)
    setIsDeleting(true)

    try {
      const response = await deletePromotion(promotionToDelete._id)
      removePromotion(promotionToDelete._id)
      setPromotionToDelete(null)
      setSuccessMessage(response.message || 'Promotion deleted successfully.')
    } catch (deleteRequestError) {
      setDeleteError(getPromotionApiErrorDetails(deleteRequestError).message)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Promotions"
        description="Manage promotional discounts, eligibility amounts, and active dates."
        actions={
          <Link
            to="/promotions/new"
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto"
          >
            Add Promotion
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

      {isLoading ? (
        <PromotionListSkeleton />
      ) : error ? (
        <ApiErrorState label="Promotions unavailable" message={error} onRetry={retry} />
      ) : promotions.length === 0 ? (
        <EmptyState
          title="No promotions yet"
          description="Promotions will appear here after the first promotional offer is added."
        />
      ) : (
        <PromotionList promotions={promotions} onDelete={requestDelete} />
      )}

      {promotionToDelete && (
        <DeletePromotionDialog
          promotion={promotionToDelete}
          error={deleteError}
          isDeleting={isDeleting}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </PageContainer>
  )
}

export default PromotionsPage
