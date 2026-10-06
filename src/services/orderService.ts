import { isAxiosError } from 'axios'
import api from './api'
import type {
  CreateOrderPayload,
  DeleteOrderResponse,
  Order,
  OrderApiErrorDetails,
  OrderCalculation,
  OrderCalculationPayload,
  OrderFilters,
  PromotionValidation,
  UpdateOrderPayload,
} from '../types/order'
import { ORDER_SORTS, ORDER_STATUSES } from '../types/order'
import type { DueStatus } from '../types/dashboard'
import { PRICING_TYPES } from '../types/service'

interface OrderErrorResponse {
  message?: string
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isOrderCalculation(value: unknown): value is OrderCalculation {
  if (typeof value !== 'object' || value === null) return false

  const calculation = value as Partial<OrderCalculation>

  return (
    Array.isArray(calculation.items) &&
    isFiniteNumber(calculation.subtotal) &&
    isFiniteNumber(calculation.additionalCharge) &&
    isFiniteNumber(calculation.baseTotal) &&
    isFiniteNumber(calculation.discountPercentage) &&
    isFiniteNumber(calculation.discountAmount) &&
    isFiniteNumber(calculation.grandTotal) &&
    typeof calculation.expectedCompletionDate === 'string'
  )
}

function isPromotionValidation(value: unknown): value is PromotionValidation {
  if (typeof value !== 'object' || value === null) return false

  const validation = value as Partial<PromotionValidation>

  return (
    typeof validation.valid === 'boolean' &&
    typeof validation.code === 'string' &&
    isFiniteNumber(validation.discountPercentage) &&
    typeof validation.message === 'string'
  )
}

const dueStatuses: DueStatus[] = ['Upcoming', 'Due Today', 'Overdue', 'Completed']

function isNullableId(value: unknown) {
  return value === null || (typeof value === 'string' && value.trim().length > 0)
}

function isOrder(value: unknown): value is Order {
  if (typeof value !== 'object' || value === null) return false

  const order = value as Partial<Order>

  return (
    typeof order._id === 'string' &&
    order._id.trim().length > 0 &&
    typeof order.orderNumber === 'string' &&
    order.orderNumber.trim().length > 0 &&
    isNullableId(order.customerId) &&
    (order.customer === null ||
      (typeof order.customer === 'object' &&
        typeof order.customer?._id === 'string')) &&
    ORDER_STATUSES.some((status) => status === order.status) &&
    typeof order.orderDate === 'string' &&
    typeof order.expectedCompletionDate === 'string' &&
    dueStatuses.some((status) => status === order.dueStatus) &&
    isNullableId(order.promotionId) &&
    (order.promotion === null ||
      (typeof order.promotion === 'object' &&
        typeof order.promotion?._id === 'string')) &&
    Array.isArray(order.items) &&
    order.items.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        typeof item._id === 'string' &&
        isNullableId(item.serviceId) &&
        (item.service === null ||
          (typeof item.service === 'object' &&
            typeof item.service?._id === 'string' &&
            typeof item.service.name === 'string' &&
            isFiniteNumber(item.service.price) &&
            PRICING_TYPES.some(
              (pricingType) => pricingType === item.service?.pricingType,
            ))) &&
        isFiniteNumber(item.quantity) &&
        isFiniteNumber(item.priceAtOrder) &&
        isFiniteNumber(item.lineTotal),
    ) &&
    isFiniteNumber(order.subtotal) &&
    isFiniteNumber(order.additionalCharge) &&
    isFiniteNumber(order.baseTotal) &&
    isFiniteNumber(order.discountPercentage) &&
    isFiniteNumber(order.discountAmount) &&
    isFiniteNumber(order.grandTotal)
  )
}

function parseOrder(value: unknown, errorMessage: string) {
  if (!isOrder(value)) {
    throw new Error(errorMessage)
  }

  return value
}

export async function calculateOrder(payload: OrderCalculationPayload) {
  const response = await api.post<unknown>('/orders/calculate', payload)

  if (!isOrderCalculation(response.data)) {
    throw new Error('The order calculation response was not valid.')
  }

  return response.data
}

export async function validatePromotion(code: string, subtotal: number) {
  const response = await api.post<unknown>('/promotions/validate', {
    code,
    subtotal,
  })

  if (!isPromotionValidation(response.data)) {
    throw new Error('The promotion validation response was not valid.')
  }

  return response.data
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await api.post<unknown>('/orders', payload)
  return parseOrder(response.data, 'The created order response was not valid.')
}

export async function getOrders(filters: OrderFilters, signal?: AbortSignal) {
  const response = await api.get<unknown>('/orders', {
    params: {
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.startDate ? { startDate: filters.startDate } : {}),
      ...(filters.endDate ? { endDate: filters.endDate } : {}),
      ...(filters.minTotal === undefined ? {} : { minTotal: filters.minTotal }),
      ...(filters.maxTotal === undefined ? {} : { maxTotal: filters.maxTotal }),
      ...(filters.sort && ORDER_SORTS.includes(filters.sort)
        ? { sort: filters.sort }
        : {}),
    },
    signal,
  })

  if (!Array.isArray(response.data) || !response.data.every(isOrder)) {
    throw new Error('The order list response was not valid.')
  }

  return response.data
}

export async function getOrder(orderId: string, signal?: AbortSignal) {
  const response = await api.get<unknown>(`/orders/${orderId}`, { signal })
  return parseOrder(response.data, 'The order response was not valid.')
}

export async function updateOrder(orderId: string, payload: UpdateOrderPayload) {
  const response = await api.put<unknown>(`/orders/${orderId}`, payload)
  return parseOrder(response.data, 'The updated order response was not valid.')
}

export async function deleteOrder(orderId: string) {
  const response = await api.delete<DeleteOrderResponse>(`/orders/${orderId}`)
  return response.data
}

export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
) {
  const response = await api.patch<unknown>(`/orders/${orderId}/status`, {
    status,
  })
  return parseOrder(response.data, 'The updated order response was not valid.')
}

export function getOrderApiErrorDetails(error: unknown): OrderApiErrorDetails {
  if (isAxiosError<OrderErrorResponse>(error)) {
    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        status: error.response.status,
      }
    }

    if (!error.response) {
      return {
        message:
          'Unable to reach the Laundry Republic server. Check that it is running and try again.',
      }
    }
  }

  if (error instanceof Error && error.message) {
    return { message: error.message }
  }

  return { message: 'The order request could not be completed. Please try again.' }
}

export function getOrderApiErrorMessage(error: unknown) {
  return getOrderApiErrorDetails(error).message
}
