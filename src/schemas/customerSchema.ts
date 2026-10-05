import { z } from 'zod'

const emailSchema = z.email()

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .min(2, 'Name must contain at least 2 characters')
    .max(80, 'Name must contain at most 80 characters'),
  contactNumber: z
    .string()
    .trim()
    .min(1, 'Contact number is required')
    .min(7, 'Contact number must contain at least 7 characters')
    .max(20, 'Contact number must contain at most 20 characters'),
  email: z
    .string()
    .trim()
    .refine((value) => value === '' || emailSchema.safeParse(value).success, {
      message: 'Enter a valid email address',
    }),
  address: z
    .string()
    .trim()
    .max(200, 'Address must contain at most 200 characters'),
})

export type CustomerFormValues = z.infer<typeof customerSchema>
