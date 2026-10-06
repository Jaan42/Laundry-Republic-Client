import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import {
  getPromotion,
  getPromotionApiErrorDetails,
} from '../services/promotionService'
import type { Promotion } from '../types/promotion'

interface PromotionState {
  promotion: Promotion | null
  error: string | null
  isLoading: boolean
}

function usePromotion(promotionId?: string) {
  const [state, setState] = useState<PromotionState>(() =>
    promotionId
      ? { promotion: null, error: null, isLoading: true }
      : { promotion: null, error: 'Promotion ID is missing.', isLoading: false },
  )
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    if (!promotionId) return

    const controller = new AbortController()

    getPromotion(promotionId, controller.signal)
      .then((promotion) => {
        setState({ promotion, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          promotion: null,
          error: getPromotionApiErrorDetails(error).message,
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [promotionId, requestNumber])

  const retry = useCallback(() => {
    if (!promotionId) return

    setState({ promotion: null, error: null, isLoading: true })
    setRequestNumber((current) => current + 1)
  }, [promotionId])

  return { ...state, retry }
}

export default usePromotion
