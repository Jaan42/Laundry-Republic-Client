import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getCustomerApiErrorDetails, getCustomers } from '../services/customerService'
import type { Customer } from '../types/customer'

interface CustomersState {
  customers: Customer[]
  error: string | null
  isLoading: boolean
}

const initialState: CustomersState = {
  customers: [],
  error: null,
  isLoading: true,
}

function useCustomers() {
  const [state, setState] = useState<CustomersState>(initialState)
  const [activeSearch, setActiveSearch] = useState('')
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getCustomers(activeSearch, controller.signal)
      .then((customers) => {
        setState({ customers, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) {
          return
        }

        setState({
          customers: [],
          error: getCustomerApiErrorDetails(error).message,
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [activeSearch, requestNumber])

  const searchCustomers = useCallback((search: string) => {
    setState(initialState)
    setActiveSearch(search.trim())
    setRequestNumber((current) => current + 1)
  }, [])

  const retry = useCallback(() => {
    setState(initialState)
    setRequestNumber((current) => current + 1)
  }, [])

  const removeCustomer = useCallback((customerId: string) => {
    setState((current) => ({
      ...current,
      customers: current.customers.filter((customer) => customer._id !== customerId),
    }))
  }, [])

  return {
    ...state,
    activeSearch,
    removeCustomer,
    retry,
    searchCustomers,
  }
}

export default useCustomers
