export interface Promotion {
  _id: string
  code: string
  description?: string
  discountPercentage: number
  minimumAmount: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PromotionPayload {
  code: string
  description?: string
  discountPercentage: number
  minimumAmount: number
  startDate: string
  endDate: string
  isActive: boolean
}

export type PromotionField = keyof PromotionPayload

export interface PromotionApiErrorDetails {
  message: string
  fieldErrors: Partial<Record<PromotionField, string>>
}

export interface DeletePromotionResponse {
  message?: string
}
