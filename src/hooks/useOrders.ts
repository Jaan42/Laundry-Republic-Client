import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getOrderApiErrorDetails, getOrders } from '../services/orderService'
import type { Order, OrderFilters } from '../types/order'

interface OrdersState {
  orders: Order[]
  error: string | null
  loadedRequestKey: string | null
}

const initialState: OrdersState = {
  orders: [],
  error: null,
  loadedRequestKey: null,
}

function useOrders(filters: OrderFilters) {
  const [state, setState] = useState<OrdersState>(initialState)
  const [requestNumber, setRequestNumber] = useState(0)
  const filterKey = JSON.stringify(filters)
  const requestKey = `${requestNumber}:${filterKey}`

  useEffect(() => {
    const controller = new AbortController()

    getOrders(filters, controller.signal)
      .then((orders) => {
        setState({ orders, error: null, loadedRequestKey: requestKey })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          orders: [],
          error: getOrderApiErrorDetails(error).message,
          loadedRequestKey: requestKey,
        })
      })

    return () => controller.abort()
  }, [filterKey, filters, requestKey])

  const retry = useCallback(() => {
    setState(initialState)
    setRequestNumber((current) => current + 1)
  }, [])

  const removeOrder = useCallback((orderId: string) => {
    setState((current) => ({
      ...current,
      orders: current.orders.filter((order) => order._id !== orderId),
    }))
  }, [])

  return {
    ...state,
    isLoading: state.loadedRequestKey !== requestKey,
    removeOrder,
    retry,
  }
}

export default useOrders
