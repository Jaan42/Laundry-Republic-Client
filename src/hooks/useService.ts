import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import { getService, getServiceApiErrorDetails } from '../services/serviceService'
import type { LaundryService } from '../types/service'

interface ServiceState {
  service: LaundryService | null
  error: string | null
  isLoading: boolean
}

function useService(serviceId?: string) {
  const [state, setState] = useState<ServiceState>(() =>
    serviceId
      ? { service: null, error: null, isLoading: true }
      : { service: null, error: 'Service ID is missing.', isLoading: false },
  )
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    if (!serviceId) return

    const controller = new AbortController()

    getService(serviceId, controller.signal)
      .then((service) => {
        setState({ service, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          service: null,
          error: getServiceApiErrorDetails(error).message,
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [serviceId, requestNumber])

  const retry = useCallback(() => {
    if (!serviceId) return

    setState({ service: null, error: null, isLoading: true })
    setRequestNumber((current) => current + 1)
  }, [serviceId])

  return { ...state, retry }
}

export default useService
