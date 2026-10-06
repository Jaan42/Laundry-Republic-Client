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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasStableId(value: unknown) {
  return (
    isRecord(value) &&
    typeof value._id === 'string' &&
    value._id.trim().length > 0
  )
}

function isDashboardOrder(value: unknown): value is DashboardOrder {
  return hasStableId(value)
}

function isDashboardStatistics(value: unknown): value is DashboardStatistics {
  return isRecord(value)
}

function isPopularService(value: unknown): value is PopularService {
  return isRecord(value) && hasStableId(value.service)
}

export async function getDashboardData(signal?: AbortSignal): Promise<DashboardData> {
  const [statisticsResponse, ordersResponse, popularServicesResponse] = await Promise.all([
    api.get<unknown>('/orders/statistics', { signal }),
    api.get<unknown>('/orders', {
      params: { sort: 'newest' },
      signal,
    }),
    api.get<unknown>('/orders/popular-services', { signal }),
  ])

  if (!isDashboardStatistics(statisticsResponse.data)) {
    throw new Error('The statistics response was not valid.')
  }

  if (!Array.isArray(ordersResponse.data) || !ordersResponse.data.every(isDashboardOrder)) {
    throw new Error('The orders response was not valid.')
  }

  if (
    !Array.isArray(popularServicesResponse.data) ||
    !popularServicesResponse.data.every(isPopularService)
  ) {
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
