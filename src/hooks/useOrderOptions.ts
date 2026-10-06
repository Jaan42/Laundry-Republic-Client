import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getCustomerApiErrorDetails, getCustomers } from '../services/customerService'
import { getServiceApiErrorDetails, getServices } from '../services/serviceService'
import type { Customer } from '../types/customer'
import type { LaundryService } from '../types/service'

interface CustomerOptionsState {
  customers: Customer[]
  customerError: string | null
  isLoadingCustomers: boolean
}

interface ServiceOptionsState {
  services: LaundryService[]
  serviceError: string | null
  isLoadingServices: boolean
}

const initialCustomerState: CustomerOptionsState = {
  customers: [],
  customerError: null,
  isLoadingCustomers: true,
}

const initialServiceState: ServiceOptionsState = {
  services: [],
  serviceError: null,
  isLoadingServices: true,
}

function useOrderOptions(activeServicesOnly = true) {
  const [customerState, setCustomerState] =
    useState<CustomerOptionsState>(initialCustomerState)
  const [serviceState, setServiceState] =
    useState<ServiceOptionsState>(initialServiceState)
  const [customerRequestNumber, setCustomerRequestNumber] = useState(0)
  const [serviceRequestNumber, setServiceRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getCustomers('', controller.signal)
      .then((customers) => {
        setCustomerState({
          customers,
          customerError: null,
          isLoadingCustomers: false,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setCustomerState({
          customers: [],
          customerError: getCustomerApiErrorDetails(error).message,
          isLoadingCustomers: false,
        })
      })

    return () => controller.abort()
  }, [customerRequestNumber])

  useEffect(() => {
    const controller = new AbortController()

    getServices(activeServicesOnly ? { active: true } : {}, controller.signal)
      .then((services) => {
        setServiceState({
          services,
          serviceError: null,
          isLoadingServices: false,
        })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setServiceState({
          services: [],
          serviceError: getServiceApiErrorDetails(error).message,
          isLoadingServices: false,
        })
      })

    return () => controller.abort()
  }, [activeServicesOnly, serviceRequestNumber])

  const retryCustomers = useCallback(() => {
    setCustomerState(initialCustomerState)
    setCustomerRequestNumber((current) => current + 1)
  }, [])

  const retryServices = useCallback(() => {
    setServiceState(initialServiceState)
    setServiceRequestNumber((current) => current + 1)
  }, [])

  return {
    ...customerState,
    ...serviceState,
    retryCustomers,
    retryServices,
  }
}

export default useOrderOptions
