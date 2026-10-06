import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import {
  getReportApiErrorMessage,
  getReportPopularServices,
  getRevenueSummary,
} from '../services/reportService'
import type { PopularService } from '../types/dashboard'
import type { ReportDateRange, RevenueSummary } from '../types/report'

interface RevenueState {
  data: RevenueSummary | null
  error: string | null
  loadedRequestKey: string | null
}

interface PopularServicesState {
  data: PopularService[] | null
  error: string | null
  isLoading: boolean
}

const initialRevenueState: RevenueState = {
  data: null,
  error: null,
  loadedRequestKey: null,
}

const initialPopularServicesState: PopularServicesState = {
  data: null,
  error: null,
  isLoading: true,
}

export function useRevenueReport(range: ReportDateRange) {
  const [state, setState] = useState<RevenueState>(initialRevenueState)
  const [requestNumber, setRequestNumber] = useState(0)
  const { startDate, endDate } = range
  const requestKey = `${requestNumber}:${startDate}:${endDate}`

  useEffect(() => {
    const controller = new AbortController()

    getRevenueSummary({ startDate, endDate }, controller.signal)
      .then((data) => {
        setState({ data, error: null, loadedRequestKey: requestKey })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          data: null,
          error: getReportApiErrorMessage(error),
          loadedRequestKey: requestKey,
        })
      })

    return () => controller.abort()
  }, [endDate, requestKey, startDate])

  const retry = useCallback(() => {
    setState(initialRevenueState)
    setRequestNumber((current) => current + 1)
  }, [])

  return {
    data: state.data,
    error: state.error,
    isLoading: state.loadedRequestKey !== requestKey,
    retry,
  }
}

export function usePopularServicesReport() {
  const [state, setState] = useState<PopularServicesState>(
    initialPopularServicesState,
  )
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getReportPopularServices(controller.signal)
      .then((data) => {
        setState({ data, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) return

        setState({
          data: null,
          error: getReportApiErrorMessage(error),
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [requestNumber])

  const retry = useCallback(() => {
    setState(initialPopularServicesState)
    setRequestNumber((current) => current + 1)
  }, [])

  return { ...state, retry }
}
