import { isAxiosError } from 'axios'
import api from './api'
import type {
  DeletePromotionResponse,
  Promotion,
  PromotionApiErrorDetails,
  PromotionField,
  PromotionPayload,
} from '../types/promotion'

interface PromotionErrorResponse {
  message?: string
  errors?: Record<string, string>
}

const promotionFields = new Set<PromotionField>([
  'code',
  'description',
  'discountPercentage',
  'minimumAmount',
  'startDate',
  'endDate',
  'isActive',
])

function isPromotion(value: unknown): value is Promotion {
  if (typeof value !== 'object' || value === null) return false

  const promotion = value as Partial<Promotion>

  return (
    typeof promotion._id === 'string' &&
    promotion._id.trim().length > 0 &&
    typeof promotion.code === 'string' &&
    typeof promotion.discountPercentage === 'number' &&
    typeof promotion.minimumAmount === 'number' &&
    typeof promotion.startDate === 'string' &&
    typeof promotion.endDate === 'string' &&
    typeof promotion.isActive === 'boolean'
  )
}

function parsePromotion(value: unknown, errorMessage: string) {
  if (!isPromotion(value)) {
    throw new Error(errorMessage)
  }

  return value
}

export async function getPromotions(signal?: AbortSignal) {
  const response = await api.get<unknown>('/promotions', { signal })

  if (!Array.isArray(response.data) || !response.data.every(isPromotion)) {
    throw new Error('The promotion list response was not valid.')
  }

  return response.data
}

export async function getPromotion(promotionId: string, signal?: AbortSignal) {
  const response = await api.get<unknown>(`/promotions/${promotionId}`, { signal })
  return parsePromotion(response.data, 'The promotion response was not valid.')
}

export async function createPromotion(payload: PromotionPayload) {
  const response = await api.post<unknown>('/promotions', payload)
  return parsePromotion(response.data, 'The created promotion response was not valid.')
}

export async function updatePromotion(
  promotionId: string,
  payload: PromotionPayload,
) {
  const response = await api.put<unknown>(`/promotions/${promotionId}`, payload)
  return parsePromotion(response.data, 'The updated promotion response was not valid.')
}

export async function deletePromotion(promotionId: string) {
  const response = await api.delete<DeletePromotionResponse>(
    `/promotions/${promotionId}`,
  )
  return response.data
}

export function getPromotionApiErrorDetails(
  error: unknown,
): PromotionApiErrorDetails {
  if (isAxiosError<PromotionErrorResponse>(error)) {
    const fieldErrors: PromotionApiErrorDetails['fieldErrors'] = {}

    for (const [field, message] of Object.entries(error.response?.data?.errors || {})) {
      if (promotionFields.has(field as PromotionField) && typeof message === 'string') {
        fieldErrors[field as PromotionField] = message
      }
    }

    if (error.response?.data?.message) {
      return { message: error.response.data.message, fieldErrors }
    }

    if (!error.response) {
      return {
        message:
          'Unable to reach the Laundry Republic server. Check that it is running and try again.',
        fieldErrors,
      }
    }
  }

  if (error instanceof Error && error.message) {
    return { message: error.message, fieldErrors: {} }
  }

  return {
    message: 'The promotion request could not be completed. Please try again.',
    fieldErrors: {},
  }
}
