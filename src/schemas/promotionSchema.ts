import { z } from 'zod'

export const promotionSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, 'Code is required')
      .transform((value) => value.toUpperCase()),
    description: z
      .string()
      .trim()
      .max(300, 'Description must contain at most 300 characters')
      .optional(),
    discountPercentage: z
      .number({ error: 'Discount percentage is required and must be a number' })
      .min(1, 'Discount percentage must be at least 1')
      .max(100, 'Discount percentage must be 100 or less'),
    minimumAmount: z
      .number({ error: 'Minimum amount is required and must be a number' })
      .min(0, 'Minimum amount must be 0 or greater'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    isActive: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before start date',
      })
    }
  })

export type PromotionFormValues = z.infer<typeof promotionSchema>
