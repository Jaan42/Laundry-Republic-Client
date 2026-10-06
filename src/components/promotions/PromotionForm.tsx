import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import FeedbackBanner from '../ui/FeedbackBanner'
import Input from '../ui/Input'
import { promotionSchema } from '../../schemas/promotionSchema'
import type { PromotionFormValues } from '../../schemas/promotionSchema'
import { getPromotionApiErrorDetails } from '../../services/promotionService'

interface PromotionFormProps {
  defaultValues: PromotionFormValues
  onSubmit: (values: PromotionFormValues) => Promise<void>
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

function PromotionForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: PromotionFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  })

  async function submitPromotion(values: PromotionFormValues) {
    setApiError(null)

    try {
      await onSubmit(values)
    } catch (error) {
      const details = getPromotionApiErrorDetails(error)

      for (const [field, message] of Object.entries(details.fieldErrors)) {
        if (message) {
          setError(field as keyof PromotionFormValues, {
            type: 'server',
            message,
          })
        }
      }

      setApiError(details.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPromotion)} noValidate className="space-y-6">
      {apiError && (
        <FeedbackBanner
          message={apiError}
          onDismiss={() => setApiError(null)}
          tone="error"
        />
      )}

      <div>
        <label htmlFor="code" className="text-sm font-bold text-slate-800">
          Promotion Code <span className="text-rose-600">*</span>
        </label>
        <Input
          id="code"
          autoCapitalize="characters"
          className="mt-2 uppercase"
          disabled={isSubmitting}
          aria-invalid={Boolean(errors.code)}
          aria-describedby={errors.code ? 'code-error' : undefined}
          {...register('code')}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Codes are saved in uppercase.
        </p>
        <FieldError id="code-error" message={errors.code?.message} />
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
          <label
            htmlFor="discountPercentage"
            className="text-sm font-bold text-slate-800"
          >
            Discount Percentage <span className="text-rose-600">*</span>
          </label>
          <Input
            id="discountPercentage"
            type="number"
            min="1"
            max="100"
            step="any"
            inputMode="decimal"
            className="mt-2"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.discountPercentage)}
            aria-describedby={
              errors.discountPercentage ? 'discount-percentage-error' : undefined
            }
            {...register('discountPercentage', { valueAsNumber: true })}
          />
          <FieldError
            id="discount-percentage-error"
            message={errors.discountPercentage?.message}
          />
        </div>

        <div>
          <label htmlFor="minimumAmount" className="text-sm font-bold text-slate-800">
            Minimum Amount (PHP)
          </label>
          <Input
            id="minimumAmount"
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            className="mt-2"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.minimumAmount)}
            aria-describedby={errors.minimumAmount ? 'minimum-amount-error' : undefined}
            {...register('minimumAmount', {
              setValueAs: (value: string) => (value === '' ? 0 : Number(value)),
            })}
          />
          <FieldError
            id="minimum-amount-error"
            message={errors.minimumAmount?.message}
          />
        </div>

        <div>
          <label htmlFor="startDate" className="text-sm font-bold text-slate-800">
            Start Date <span className="text-rose-600">*</span>
          </label>
          <Input
            id="startDate"
            type="date"
            className="mt-2"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.startDate)}
            aria-describedby={errors.startDate ? 'start-date-error' : undefined}
            {...register('startDate')}
          />
          <FieldError id="start-date-error" message={errors.startDate?.message} />
        </div>

        <div>
          <label htmlFor="endDate" className="text-sm font-bold text-slate-800">
            End Date <span className="text-rose-600">*</span>
          </label>
          <Input
            id="endDate"
            type="date"
            className="mt-2"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.endDate)}
            aria-describedby={errors.endDate ? 'end-date-error' : undefined}
            {...register('endDate')}
          />
          <FieldError id="end-date-error" message={errors.endDate?.message} />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:max-w-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          disabled={isSubmitting}
          {...register('isActive')}
        />
        <span>
          <span className="block text-sm font-bold text-slate-800">Active promotion</span>
          <span className="mt-0.5 block text-xs leading-5 text-slate-500">
            Available during its scheduled date range.
          </span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link
          to="/promotions"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving promotion…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default PromotionForm
