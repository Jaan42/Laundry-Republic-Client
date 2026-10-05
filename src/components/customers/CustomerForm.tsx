import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { customerSchema } from '../../schemas/customerSchema'
import type { CustomerFormValues } from '../../schemas/customerSchema'
import { getCustomerApiErrorDetails } from '../../services/customerService'

interface CustomerFormProps {
  defaultValues: CustomerFormValues
  onSubmit: (values: CustomerFormValues) => Promise<void>
  submitLabel: string
}

interface FieldErrorProps {
  id: string
  message?: string
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null

  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-rose-600">
      {message}
    </p>
  )
}

function CustomerForm({ defaultValues, onSubmit, submitLabel }: CustomerFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  })

  async function submitCustomer(values: CustomerFormValues) {
    setApiError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      const details = getCustomerApiErrorDetails(error)

      for (const [field, message] of Object.entries(details.fieldErrors)) {
        if (message) {
          setError(field as keyof CustomerFormValues, {
            type: 'server',
            message,
          })
        }
      }

      setApiError(details.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitCustomer)} noValidate className="space-y-6">
      {apiError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3" role="alert">
          <p className="text-sm font-semibold text-rose-700">{apiError}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-bold text-slate-800">
            Name <span className="text-rose-600">*</span>
          </label>
          <Input
            id="name"
            autoComplete="name"
            className="mt-2"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

        <div>
          <label htmlFor="contactNumber" className="text-sm font-bold text-slate-800">
            Contact Number <span className="text-rose-600">*</span>
          </label>
          <Input
            id="contactNumber"
            type="tel"
            autoComplete="tel"
            className="mt-2"
            aria-invalid={Boolean(errors.contactNumber)}
            aria-describedby={errors.contactNumber ? 'contact-number-error' : undefined}
            {...register('contactNumber')}
          />
          <FieldError id="contact-number-error" message={errors.contactNumber?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-bold text-slate-800">
          Email <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-2"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          {...register('email')}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <div>
        <label htmlFor="address" className="text-sm font-bold text-slate-800">
          Address <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="address"
          rows={4}
          autoComplete="street-address"
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? 'address-error' : undefined}
          {...register('address')}
        />
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <FieldError id="address-error" message={errors.address?.message} />
          <p className="ml-auto text-xs text-slate-400">Maximum 200 characters</p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          to="/customers"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving customer…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default CustomerForm
