import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getOrder, getOrderApiErrorDetails } from '../services/orderService'
import type { Order } from '../types/order'

interface OrderState {
  order: Order | null
  error: string | null
  errorStatus?: number
  loadedRequestKey: string | null
}

function createInitialState(orderId?: string): OrderState {
  return orderId
    ? { order: null, error: null, loadedRequestKey: null }
    : {
        order: null,
        error: 'Order ID is missing.',
        errorStatus: 400,
        loadedRequestKey: 'missing',
      }
}

function useOrder(orderId?: string) {
  const [state, setState] = useState<OrderState>(() => createInitialState(orderId))
  const [requestNumber, setRequestNumber] = useState(0)
  const requestKey = `${orderId || 'missing'}:${requestNumber}`

  useEffect(() => {
    if (!orderId) return

    const controller = new AbortController()

    getOrder(orderId, controller.signal)
      .then((order) => {
        setState({ order, error: null, loadedRequestKey: requestKey })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        const details = getOrderApiErrorDetails(error)
        setState({
          order: null,
          error: details.message,
          errorStatus: details.status,
          loadedRequestKey: requestKey,
        })
      })

    return () => controller.abort()
  }, [orderId, requestKey])

  const retry = useCallback(() => {
    if (!orderId) return
    setState({ order: null, error: null, loadedRequestKey: null })
    setRequestNumber((current) => current + 1)
  }, [orderId])

  const replaceOrder = useCallback((order: Order) => {
    setState({ order, error: null, loadedRequestKey: requestKey })
  }, [requestKey])

  return {
    ...state,
    isLoading: Boolean(orderId) && state.loadedRequestKey !== requestKey,
    replaceOrder,
    retry,
  }
}

export default useOrder
