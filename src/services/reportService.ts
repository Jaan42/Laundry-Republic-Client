import { isAxiosError } from 'axios'
import api from './api'
import type { PopularService } from '../types/dashboard'
import type {
  ReportDateRange,
  RevenueOrderSummary,
  RevenueSummary,
} from '../types/report'
import { PRICING_TYPES } from '../types/service'

interface ReportErrorResponse {
  message?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isRevenueOrderSummary(value: unknown): value is RevenueOrderSummary {
  if (!isRecord(value)) return false

  return (
    typeof value._id === 'string' &&
    value._id.trim().length > 0 &&
    typeof value.orderNumber === 'string' &&
    typeof value.orderDate === 'string' &&
    isFiniteNumber(value.grandTotal) &&
    (value.customer === null ||
      (isRecord(value.customer) &&
        typeof value.customer._id === 'string' &&
        (value.customer.name === undefined ||
          typeof value.customer.name === 'string')))
  )
}

function isRevenueSummary(value: unknown): value is RevenueSummary {
  if (!isRecord(value)) return false

  return (
    isFiniteNumber(value.totalOrders) &&
    isFiniteNumber(value.completedOrders) &&
    isFiniteNumber(value.totalRevenue) &&
    isFiniteNumber(value.averageOrderValue) &&
    (value.highestOrder === null || isRevenueOrderSummary(value.highestOrder)) &&
    (value.lowestOrder === null || isRevenueOrderSummary(value.lowestOrder))
  )
}

function isPopularService(value: unknown): value is PopularService {
  if (!isRecord(value) || !isRecord(value.service)) return false
  const service = value.service

  return (
    typeof service._id === 'string' &&
    service._id.trim().length > 0 &&
    typeof service.name === 'string' &&
    (service.pricingType === undefined ||
      PRICING_TYPES.some(
        (pricingType) => pricingType === service.pricingType,
      )) &&
    isFiniteNumber(value.totalOrders) &&
    isFiniteNumber(value.totalQuantity)
  )
}

export async function getRevenueSummary(
  range: ReportDateRange,
  signal?: AbortSignal,
) {
  const response = await api.get<unknown>('/orders/revenue-summary', {
    params: {
      startDate: range.startDate,
      endDate: range.endDate,
    },
    signal,
  })

  if (!isRevenueSummary(response.data)) {
    throw new Error('The revenue summary response was not valid.')
  }

  return response.data
}

export async function getReportPopularServices(signal?: AbortSignal) {
  const response = await api.get<unknown>('/orders/popular-services', { signal })

  if (
    !Array.isArray(response.data) ||
    !response.data.every(isPopularService)
  ) {
    throw new Error('The popular services response was not valid.')
  }

  return response.data
}

export function getReportApiErrorMessage(error: unknown) {
  if (isAxiosError<ReportErrorResponse>(error)) {
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

  return 'Report data could not be loaded. Please try again.'
}
