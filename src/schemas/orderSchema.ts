import { z } from 'zod'

export const orderItemSchema = z.object({
  serviceId: z.string().min(1, 'Select a service'),
  quantity: z
    .number({ error: 'Quantity is required and must be a number' })
    .gt(0, 'Quantity must be greater than 0'),
})

export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'Select a customer'),
  items: z.array(orderItemSchema).min(1, 'Add at least one service'),
  promotionCode: z.string().trim().optional(),
  additionalCharge: z
    .number({ error: 'Additional charge is required and must be a number' })
    .min(0, 'Additional charge must be 0 or greater'),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must contain at most 500 characters')
    .optional(),
})

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>
