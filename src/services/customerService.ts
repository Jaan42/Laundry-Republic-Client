import { isAxiosError } from 'axios'
import api from './api'
import type {
  Customer,
  CustomerApiErrorDetails,
  CustomerField,
  CustomerPayload,
  DeleteCustomerResponse,
} from '../types/customer'

interface CustomerErrorResponse {
  message?: string
  errors?: Record<string, string>
}

const customerFields = new Set<CustomerField>([
  'name',
  'contactNumber',
  'email',
  'address',
])

function isCustomer(value: unknown): value is Customer {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    typeof value._id === 'string' &&
    value._id.trim().length > 0
  )
}

function parseCustomer(value: unknown, errorMessage: string) {
  if (!isCustomer(value)) {
    throw new Error(errorMessage)
  }

  return value
}

export async function getCustomers(search = '', signal?: AbortSignal) {
  const normalizedSearch = search.trim()
  const response = await api.get<unknown>('/customers', {
    params: normalizedSearch ? { search: normalizedSearch } : undefined,
    signal,
  })

  if (!Array.isArray(response.data) || !response.data.every(isCustomer)) {
    throw new Error('The customer list response was not valid.')
  }

  return response.data
}

export async function getCustomer(customerId: string, signal?: AbortSignal) {
  const response = await api.get<unknown>(`/customers/${customerId}`, { signal })
  return parseCustomer(response.data, 'The customer response was not valid.')
}

export async function createCustomer(payload: CustomerPayload) {
  const response = await api.post<unknown>('/customers', payload)
  return parseCustomer(response.data, 'The created customer response was not valid.')
}

export async function updateCustomer(customerId: string, payload: CustomerPayload) {
  const response = await api.put<unknown>(`/customers/${customerId}`, payload)
  return parseCustomer(response.data, 'The updated customer response was not valid.')
}

export async function deleteCustomer(customerId: string) {
  const response = await api.delete<DeleteCustomerResponse>(`/customers/${customerId}`)
  return response.data
}

export function getCustomerApiErrorDetails(error: unknown): CustomerApiErrorDetails {
  if (isAxiosError<CustomerErrorResponse>(error)) {
    const fieldErrors: CustomerApiErrorDetails['fieldErrors'] = {}

    for (const [field, message] of Object.entries(error.response?.data?.errors || {})) {
      if (customerFields.has(field as CustomerField) && typeof message === 'string') {
        fieldErrors[field as CustomerField] = message
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
    message: 'The customer request could not be completed. Please try again.',
    fieldErrors: {},
  }
}
