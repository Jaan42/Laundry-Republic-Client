import { isAxiosError } from 'axios'
import api from './api'
import type {
  DashboardData,
  DashboardOrder,
  DashboardStatistics,
  PopularService,
} from '../types/dashboard'

interface ApiErrorResponse {
  message?: string
}

export async function getDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  const [statisticsResponse, ordersResponse, popularServicesResponse] = await Promise.all([
    api.get<DashboardStatistics>('/orders/statistics', { signal }),
    api.get<DashboardOrder[]>('/orders', {
      params: { sort: 'newest' },
      signal,
    }),
    api.get<PopularService[]>('/orders/popular-services', { signal }),
  ])

  if (!statisticsResponse.data || typeof statisticsResponse.data !== 'object') {
    throw new Error('The statistics response was not valid.')
  }

  if (!Array.isArray(ordersResponse.data)) {
    throw new Error('The orders response was not valid.')
  }

  if (!Array.isArray(popularServicesResponse.data)) {
    throw new Error('The popular services response was not valid.')
  }

  return {
    statistics: statisticsResponse.data,
    orders: ordersResponse.data,
    popularServices: popularServicesResponse.data,
  }
}

export function getDashboardErrorMessage(error: unknown) {
  if (isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    if (!error.response) {
      return 'Unable to reach the Laundry Republic server. Check that it is running and try again.'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Dashboard data could not be loaded. Please try again.'
}
