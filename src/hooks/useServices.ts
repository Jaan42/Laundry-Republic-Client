import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getServiceApiErrorDetails, getServices } from '../services/serviceService'
import type { LaundryService, PricingType, ServiceFilters } from '../types/service'

export type ActiveServiceFilter = 'all' | 'true' | 'false'
export type PricingTypeFilter = 'all' | PricingType

interface ServicesState {
  services: LaundryService[]
  error: string | null
  isLoading: boolean
}

interface ServiceFilterState {
  active: ActiveServiceFilter
  pricingType: PricingTypeFilter
}

const initialState: ServicesState = {
  services: [],
  error: null,
  isLoading: true,
}

const initialFilters: ServiceFilterState = {
  active: 'all',
  pricingType: 'all',
}

function toApiFilters(filters: ServiceFilterState): ServiceFilters {
  return {
    active: filters.active === 'all' ? undefined : filters.active === 'true',
    pricingType: filters.pricingType === 'all' ? undefined : filters.pricingType,
  }
}

function useServices() {
  const [state, setState] = useState<ServicesState>(initialState)
  const [filters, setFilters] = useState<ServiceFilterState>(initialFilters)
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getServices(toApiFilters(filters), controller.signal)
      .then((services) => {
        setState({ services, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          services: [],
          error: getServiceApiErrorDetails(error).message,
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [filters, requestNumber])

  const changeFilters = useCallback((nextFilters: ServiceFilterState) => {
    setState(initialState)
    setFilters(nextFilters)
  }, [])

  const retry = useCallback(() => {
    setState(initialState)
    setRequestNumber((current) => current + 1)
  }, [])

  const removeService = useCallback((serviceId: string) => {
    setState((current) => ({
      ...current,
      services: current.services.filter((service) => service._id !== serviceId),
    }))
  }, [])

  return {
    ...state,
    filters,
    changeFilters,
    removeService,
    retry,
  }
}

export default useServices
