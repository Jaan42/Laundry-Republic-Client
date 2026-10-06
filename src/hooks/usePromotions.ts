import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import {
  getPromotionApiErrorDetails,
  getPromotions,
} from '../services/promotionService'
import type { Promotion } from '../types/promotion'

interface PromotionsState {
  promotions: Promotion[]
  error: string | null
  isLoading: boolean
}

const initialState: PromotionsState = {
  promotions: [],
  error: null,
  isLoading: true,
}

function usePromotions() {
  const [state, setState] = useState<PromotionsState>(initialState)
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getPromotions(controller.signal)
      .then((promotions) => {
        setState({ promotions, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          promotions: [],
          error: getPromotionApiErrorDetails(error).message,
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [requestNumber])

  const retry = useCallback(() => {
    setState(initialState)
    setRequestNumber((current) => current + 1)
  }, [])

  const removePromotion = useCallback((promotionId: string) => {
    setState((current) => ({
      ...current,
      promotions: current.promotions.filter(
        (promotion) => promotion._id !== promotionId,
      ),
    }))
  }, [])

  return { ...state, removePromotion, retry }
}

export default usePromotions
