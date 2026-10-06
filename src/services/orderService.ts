import { isAxiosError } from 'axios'
import api from './api'
import type {
  CreateOrderPayload,
  CreatedOrder,
  OrderCalculation,
  OrderCalculationPayload,
  PromotionValidation,
} from '../types/order'

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

function isCreatedOrder(value: unknown): value is CreatedOrder {
  if (typeof value !== 'object' || value === null) return false

  const order = value as Partial<CreatedOrder>

  return (
    typeof order._id === 'string' &&
    order._id.trim().length > 0 &&
    typeof order.orderNumber === 'string' &&
    order.orderNumber.trim().length > 0
  )
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

  if (!isCreatedOrder(response.data)) {
    throw new Error('The created order response was not valid.')
  }

  return response.data
}

export function getOrderApiErrorMessage(error: unknown) {
  if (isAxiosError<OrderErrorResponse>(error)) {
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

  return 'The order request could not be completed. Please try again.'
}
