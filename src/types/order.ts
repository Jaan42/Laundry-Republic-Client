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
