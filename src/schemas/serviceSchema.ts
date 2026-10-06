import { z } from 'zod'
import { PRICING_TYPES } from '../types/service'

export const serviceSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z
    .string()
    .trim()
    .max(300, 'Description must contain at most 300 characters')
    .optional(),
  price: z
    .number({ error: 'Price is required and must be a number' })
    .min(0, 'Price must be 0 or greater'),
  pricingType: z.enum(PRICING_TYPES, {
    error: 'Select a pricing type',
  }),
  turnaroundDays: z
    .number({ error: 'Turnaround days is required and must be a number' })
    .min(0, 'Turnaround days must be 0 or greater')
    .max(14, 'Turnaround days must be 14 or less'),
  isActive: z.boolean(),
})

export type ServiceFormValues = z.infer<typeof serviceSchema>
