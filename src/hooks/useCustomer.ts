import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getCustomer, getCustomerApiErrorDetails } from '../services/customerService'
import type { Customer } from '../types/customer'

interface CustomerState {
  customer: Customer | null
  error: string | null
  isLoading: boolean
}

function useCustomer(customerId?: string) {
  const [state, setState] = useState<CustomerState>(() =>
    customerId
      ? { customer: null, error: null, isLoading: true }
      : { customer: null, error: 'Customer ID is missing.', isLoading: false },
  )
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    if (!customerId) {
      return
    }

    const controller = new AbortController()

    getCustomer(customerId, controller.signal)
      .then((customer) => {
        setState({ customer, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) {
          return
        }

        setState({
          customer: null,
          error: getCustomerApiErrorDetails(error).message,
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [customerId, requestNumber])

  const retry = useCallback(() => {
    if (!customerId) {
      return
    }

    setState({ customer: null, error: null, isLoading: true })
    setRequestNumber((current) => current + 1)
  }, [customerId])

  return { ...state, retry }
}

export default useCustomer
