import { isAxiosError } from 'axios'
import api from './api'
import { PRICING_TYPES } from '../types/service'
import type {
  DeleteServiceResponse,
  LaundryService,
  ServiceApiErrorDetails,
  ServiceField,
  ServiceFilters,
  ServicePayload,
} from '../types/service'

interface ServiceErrorResponse {
  message?: string
  errors?: Record<string, string>
}

const serviceFields = new Set<ServiceField>([
  'name',
  'description',
  'price',
  'pricingType',
  'turnaroundDays',
  'isActive',
])

function isLaundryService(value: unknown): value is LaundryService {
  if (typeof value !== 'object' || value === null) return false

  const service = value as Partial<LaundryService>

  return (
    typeof service._id === 'string' &&
    service._id.trim().length > 0 &&
    typeof service.name === 'string' &&
    typeof service.price === 'number' &&
    PRICING_TYPES.some((pricingType) => pricingType === service.pricingType) &&
    typeof service.turnaroundDays === 'number' &&
    typeof service.isActive === 'boolean'
  )
}

function parseService(value: unknown, errorMessage: string) {
  if (!isLaundryService(value)) {
    throw new Error(errorMessage)
  }

  return value
}

export async function getServices(filters: ServiceFilters, signal?: AbortSignal) {
  const response = await api.get<unknown>('/services', {
    params: {
      ...(filters.active === undefined ? {} : { active: filters.active }),
      ...(filters.pricingType ? { pricingType: filters.pricingType } : {}),
    },
    signal,
  })

  if (!Array.isArray(response.data) || !response.data.every(isLaundryService)) {
    throw new Error('The service list response was not valid.')
  }

  return response.data
}

export async function getService(serviceId: string, signal?: AbortSignal) {
  const response = await api.get<unknown>(`/services/${serviceId}`, { signal })
  return parseService(response.data, 'The service response was not valid.')
}

export async function createService(payload: ServicePayload) {
  const response = await api.post<unknown>('/services', payload)
  return parseService(response.data, 'The created service response was not valid.')
}

export async function updateService(serviceId: string, payload: ServicePayload) {
  const response = await api.put<unknown>(`/services/${serviceId}`, payload)
  return parseService(response.data, 'The updated service response was not valid.')
}

export async function deleteService(serviceId: string) {
  const response = await api.delete<DeleteServiceResponse>(`/services/${serviceId}`)
  return response.data
}

export function getServiceApiErrorDetails(error: unknown): ServiceApiErrorDetails {
  if (isAxiosError<ServiceErrorResponse>(error)) {
    const fieldErrors: ServiceApiErrorDetails['fieldErrors'] = {}

    for (const [field, message] of Object.entries(error.response?.data?.errors || {})) {
      if (serviceFields.has(field as ServiceField) && typeof message === 'string') {
        fieldErrors[field as ServiceField] = message
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
    message: 'The service request could not be completed. Please try again.',
    fieldErrors: {},
  }
}
