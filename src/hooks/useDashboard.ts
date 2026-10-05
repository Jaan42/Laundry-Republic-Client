import { useCallback, useEffect, useState } from 'react'
import { isCancel } from 'axios'
import {
  getDashboardData,
  getDashboardErrorMessage,
} from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

interface DashboardState {
  data: DashboardData | null
  error: string | null
  isLoading: boolean
}

const initialState: DashboardState = {
  data: null,
  error: null,
  isLoading: true,
}

function useDashboard() {
  const [state, setState] = useState<DashboardState>(initialState)
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getDashboardData(controller.signal)
      .then((data) => {
        setState({ data, error: null, isLoading: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isCancel(error)) {
          return
        }

        setState({
          data: null,
          error: getDashboardErrorMessage(error),
          isLoading: false,
        })
      })

    return () => controller.abort()
  }, [requestNumber])

  const retry = useCallback(() => {
    setState(initialState)
    setRequestNumber((current) => current + 1)
  }, [])

  return { ...state, retry }
}

export default useDashboard
