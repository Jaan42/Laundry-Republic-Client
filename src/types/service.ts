export const PRICING_TYPES = ['perKg', 'perPiece', 'perPair'] as const

export type PricingType = (typeof PRICING_TYPES)[number]

export interface LaundryService {
  _id: string
  name: string
  description?: string
  price: number
  pricingType: PricingType
  turnaroundDays: number
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ServicePayload {
  name: string
  description?: string
  price: number
  pricingType: PricingType
  turnaroundDays: number
  isActive: boolean
}

export type ServiceField = keyof ServicePayload

export interface ServiceApiErrorDetails {
  message: string
  fieldErrors: Partial<Record<ServiceField, string>>
}

export interface DeleteServiceResponse {
  message?: string
}

export interface ServiceFilters {
  active?: boolean
  pricingType?: PricingType
}
