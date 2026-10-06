import type { Customer } from './customer'
import type { DueStatus, OperationalStatus } from './dashboard'
import type { Promotion } from './promotion'
import type { LaundryService } from './service'

export const ORDER_STATUSES = [
  'Pending',
  'Washing',
  'Drying',
  'Ready for Pickup',
  'Completed',
  'Cancelled',
] as const satisfies readonly OperationalStatus[]

export const ORDER_SORTS = [
  'newest',
  'oldest',
  'highestTotal',
  'lowestTotal',
] as const

export type OrderSort = (typeof ORDER_SORTS)[number]

export interface OrderItemPayload {
  serviceId: string
  quantity: number
}

export interface OrderCalculationPayload {
  items: OrderItemPayload[]
  promotionCode?: string
  additionalCharge: number
}

export interface CreateOrderPayload extends OrderCalculationPayload {
  customerId: string
  notes?: string
}

export interface CalculatedOrderItem {
  serviceId: string
  quantity: number
  priceAtOrder: number
  lineTotal: number
}

export interface OrderCalculation {
  items: CalculatedOrderItem[]
  subtotal: number
  additionalCharge: number
  baseTotal: number
  discountPercentage: number
  discountAmount: number
  grandTotal: number
  expectedCompletionDate: string
}

export interface PromotionValidation {
  valid: boolean
  code: string
  discountPercentage: number
  message: string
}

export interface CreatedOrder {
  _id: string
  orderNumber: string
}

export interface OrderItem {
  _id: string
  serviceId: string | null
  service: LaundryService | null
  quantity: number
  priceAtOrder: number
  lineTotal: number
}

export interface Order {
  _id: string
  orderNumber: string
  customerId: string | null
  customer: Customer | null
  status: OperationalStatus
  orderDate: string
  expectedCompletionDate: string
  dueStatus: DueStatus
  promotionId: string | null
  promotion: Promotion | null
  items: OrderItem[]
  subtotal: number
  additionalCharge: number
  baseTotal: number
  discountPercentage: number
  discountAmount: number
  grandTotal: number
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface OrderFilters {
  search?: string
  status?: OperationalStatus
  startDate?: string
  endDate?: string
  minTotal?: number
  maxTotal?: number
  sort?: OrderSort
}

export interface UpdateOrderPayload extends OrderCalculationPayload {
  customerId: string
  orderDate: string
  promotionCode?: string
  notes?: string
}

export interface DeleteOrderResponse {
  message?: string
}

export interface OrderApiErrorDetails {
  message: string
  status?: number
}
