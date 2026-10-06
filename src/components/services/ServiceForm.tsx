import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import FeedbackBanner from '../ui/FeedbackBanner'
import Input from '../ui/Input'
import { serviceSchema } from '../../schemas/serviceSchema'
import type { ServiceFormValues } from '../../schemas/serviceSchema'
import { getServiceApiErrorDetails } from '../../services/serviceService'

interface ServiceFormProps {
  defaultValues: ServiceFormValues
  onSubmit: (values: ServiceFormValues) => Promise<void>
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

const selectClassName =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100'

function ServiceForm({ defaultValues, onSubmit, submitLabel }: ServiceFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  })

  async function submitService(values: ServiceFormValues) {
    setApiError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      const details = getServiceApiErrorDetails(error)

      for (const [field, message] of Object.entries(details.fieldErrors)) {
        if (message) {
          setError(field as keyof ServiceFormValues, {
            type: 'server',
            message,
          })
        }
      }

      setApiError(details.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitService)} noValidate className="space-y-6">
      {apiError && (
        <FeedbackBanner
          message={apiError}
          onDismiss={() => setApiError(null)}
          tone="error"
        />
      )}

      <div>
        <label htmlFor="name" className="text-sm font-bold text-slate-800">
          Service Name <span className="text-rose-600">*</span>
        </label>
        <Input
          id="name"
          className="mt-2"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          {...register('name')}
        />
        <FieldError id="name-error" message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-bold text-slate-800">
          Description <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={4}
          className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'description-error' : undefined}
          {...register('description')}
        />
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <FieldError id="description-error" message={errors.description?.message} />
          <p className="ml-auto text-xs text-slate-400">Maximum 300 characters</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="text-sm font-bold text-slate-800">
            Price (PHP) <span className="text-rose-600">*</span>
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            className="mt-2"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? 'price-error' : undefined}
            {...register('price', { valueAsNumber: true })}
          />
          <FieldError id="price-error" message={errors.price?.message} />
        </div>

        <div>
          <label htmlFor="pricingType" className="text-sm font-bold text-slate-800">
            Pricing Type <span className="text-rose-600">*</span>
          </label>
          <select
            id="pricingType"
            className={selectClassName}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.pricingType)}
            aria-describedby={errors.pricingType ? 'pricing-type-error' : undefined}
            {...register('pricingType')}
          >
            <option value="perKg">Per Kilogram</option>
            <option value="perPiece">Per Piece</option>
            <option value="perPair">Per Pair</option>
          </select>
          <FieldError id="pricing-type-error" message={errors.pricingType?.message} />
        </div>

        <div>
          <label htmlFor="turnaroundDays" className="text-sm font-bold text-slate-800">
            Turnaround Days <span className="text-rose-600">*</span>
          </label>
          <Input
            id="turnaroundDays"
            type="number"
            min="0"
            max="14"
            step="1"
            inputMode="numeric"
            className="mt-2"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.turnaroundDays)}
            aria-describedby={errors.turnaroundDays ? 'turnaround-days-error' : undefined}
            {...register('turnaroundDays', { valueAsNumber: true })}
          />
          <FieldError id="turnaround-days-error" message={errors.turnaroundDays?.message} />
        </div>

        <div className="flex items-end">
          <label className="flex w-full cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              disabled={isSubmitting}
              {...register('isActive')}
            />
            <span>
              <span className="block text-sm font-bold text-slate-800">Active service</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                Available for use in laundry orders.
              </span>
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          to="/services"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving service…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ServiceForm
