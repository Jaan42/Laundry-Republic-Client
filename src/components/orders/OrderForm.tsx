import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import Button from '../ui/Button'
import Card from '../ui/Card'
import FeedbackBanner from '../ui/FeedbackBanner'
import Input from '../ui/Input'
import OrderSummary from './OrderSummary'
import ServiceLine from './ServiceLine'
import { createOrderSchema } from '../../schemas/orderSchema'
import type { CreateOrderFormValues } from '../../schemas/orderSchema'
import {
  calculateOrder,
  getOrderApiErrorMessage,
  validatePromotion,
} from '../../services/orderService'
import type { Customer } from '../../types/customer'
import type {
  CreateOrderPayload,
  OrderCalculation,
  OrderCalculationPayload,
} from '../../types/order'
import type { LaundryService } from '../../types/service'

interface OrderFormProps {
  customers: Customer[]
  services: LaundryService[]
  onCreate: (payload: CreateOrderPayload) => Promise<void>
}

interface PromotionFeedback {
  code: string
  fingerprint: string
  message: string
  valid: boolean
}

const initialValues: CreateOrderFormValues = {
  customerId: '',
  items: [{ serviceId: '', quantity: 1 }],
  promotionCode: '',
  additionalCharge: 0,
  notes: '',
}

function normalizePromotionCode(value?: string) {
  return value?.trim().toUpperCase() || ''
}

function createOrderFingerprint(
  items: CreateOrderFormValues['items'],
  additionalCharge: number,
) {
  return JSON.stringify({
    items: items.map((item) => ({
      serviceId: item.serviceId,
      quantity: Number.isFinite(item.quantity) ? item.quantity : null,
    })),
    additionalCharge: Number.isFinite(additionalCharge) ? additionalCharge : null,
  })
}

function toCalculationPayload(
  values: CreateOrderFormValues,
  promotionCode?: string,
): OrderCalculationPayload {
  return {
    items: values.items.map(({ serviceId, quantity }) => ({ serviceId, quantity })),
    ...(promotionCode ? { promotionCode } : {}),
    additionalCharge: values.additionalCharge,
  }
}

function customerLabel(customer: Customer) {
  const name = customer.name || 'Unnamed customer'
  return customer.contactNumber ? `${name} — ${customer.contactNumber}` : name
}

function OrderForm({ customers, services, onCreate }: OrderFormProps) {
  const [calculation, setCalculation] = useState<OrderCalculation | null>(null)
  const [calculationError, setCalculationError] = useState<string | null>(null)
  const [calculationFingerprint, setCalculationFingerprint] = useState<string | null>(null)
  const [appliedPromotionCode, setAppliedPromotionCode] = useState('')
  const [promotionFeedback, setPromotionFeedback] =
    useState<PromotionFeedback | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isValidatingPromotion, setIsValidatingPromotion] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const {
    control,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: initialValues,
  })
  const { append, fields, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = useWatch({ control, name: 'items' }) || []
  const watchedAdditionalCharge = useWatch({ control, name: 'additionalCharge' })
  const watchedPromotionCode = useWatch({ control, name: 'promotionCode' })
  const currentFingerprint = createOrderFingerprint(
    watchedItems,
    watchedAdditionalCharge,
  )
  const normalizedPromotionCode = normalizePromotionCode(watchedPromotionCode)
  const matchingPromotionFeedback =
    promotionFeedback?.code === normalizedPromotionCode &&
    promotionFeedback.fingerprint === currentFingerprint
      ? promotionFeedback
      : null
  const expectedAppliedPromotionCode = normalizedPromotionCode
    ? matchingPromotionFeedback
      ? matchingPromotionFeedback.valid
        ? normalizedPromotionCode
        : ''
      : normalizedPromotionCode
    : ''
  const isSummaryStale = Boolean(
    calculation &&
      (calculationFingerprint !== currentFingerprint ||
        appliedPromotionCode !== expectedAppliedPromotionCode),
  )
  const isBusy =
    isSubmitting || isCalculating || isValidatingPromotion

  async function requestCalculation(
    values: CreateOrderFormValues,
    promotionCode?: string,
  ) {
    const fingerprint = createOrderFingerprint(values.items, values.additionalCharge)
    setCalculationError(null)
    setIsCalculating(true)

    try {
      const response = await calculateOrder(
        toCalculationPayload(values, promotionCode),
      )
      setCalculation(response)
      setCalculationFingerprint(fingerprint)
      setAppliedPromotionCode(promotionCode || '')
      return response
    } catch (error) {
      setCalculation(null)
      setCalculationFingerprint(null)
      setAppliedPromotionCode('')
      setCalculationError(getOrderApiErrorMessage(error))
      return null
    } finally {
      setIsCalculating(false)
    }
  }

  async function refreshSummary() {
    setSubmissionError(null)
    const isValid = await trigger(['items', 'additionalCharge'])
    if (!isValid) {
      setCalculationError('Fix the service items and additional charge before calculating.')
      return
    }

    const values = getValues()
    const code = normalizePromotionCode(values.promotionCode)

    if (code) {
      await checkPromotion()
      return
    }

    await requestCalculation(values)
  }

  async function checkPromotion() {
    setSubmissionError(null)
    const values = getValues()
    const code = normalizePromotionCode(values.promotionCode)

    if (!code) {
      setPromotionFeedback({
        code: '',
        fingerprint: currentFingerprint,
        message: 'Enter a promotion code to validate.',
        valid: false,
      })
      return
    }

    const isValid = await trigger(['items', 'additionalCharge'])
    if (!isValid) {
      setPromotionFeedback({
        code,
        fingerprint: currentFingerprint,
        message: 'Fix the service items and additional charge before validating a promotion.',
        valid: false,
      })
      return
    }

    const fingerprint = createOrderFingerprint(values.items, values.additionalCharge)
    setIsValidatingPromotion(true)

    try {
      let baseCalculation =
        calculation && calculationFingerprint === fingerprint
          ? calculation
          : null

      if (!baseCalculation) {
        baseCalculation = await requestCalculation(values)
      }

      if (!baseCalculation) return

      const validation = await validatePromotion(code, baseCalculation.baseTotal)
      const feedback: PromotionFeedback = {
        code: validation.code,
        fingerprint,
        message: validation.message,
        valid: validation.valid,
      }
      setPromotionFeedback(feedback)
      setValue('promotionCode', validation.code, { shouldValidate: true })

      if (validation.valid) {
        await requestCalculation(values, validation.code)
      } else {
        setCalculation(baseCalculation)
        setCalculationFingerprint(fingerprint)
        setAppliedPromotionCode('')
      }
    } catch (error) {
      setPromotionFeedback({
        code,
        fingerprint,
        message: getOrderApiErrorMessage(error),
        valid: false,
      })
    } finally {
      setIsValidatingPromotion(false)
    }
  }

  async function submitOrder(values: CreateOrderFormValues) {
    setSubmissionError(null)
    const code = normalizePromotionCode(values.promotionCode)
    const fingerprint = createOrderFingerprint(values.items, values.additionalCharge)
    const validPromotion =
      code &&
      promotionFeedback?.valid &&
      promotionFeedback.code === code &&
      promotionFeedback.fingerprint === fingerprint
        ? code
        : ''

    if (code && !validPromotion) {
      setSubmissionError(
        'Validate the promotion for the current order, or remove the code before creating the order.',
      )
      return
    }

    const currentCalculation = await requestCalculation(
      values,
      validPromotion || undefined,
    )
    if (!currentCalculation) return

    const payload: CreateOrderPayload = {
      customerId: values.customerId,
      items: values.items.map(({ serviceId, quantity }) => ({ serviceId, quantity })),
      ...(validPromotion ? { promotionCode: validPromotion } : {}),
      additionalCharge: values.additionalCharge,
      ...(values.notes ? { notes: values.notes } : {}),
    }

    try {
      await onCreate(payload)
    } catch (error) {
      setSubmissionError(getOrderApiErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(submitOrder)} noValidate>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-start">
        <Card className="min-w-0 border-slate-200 p-5 sm:p-7">
          {submissionError && (
            <FeedbackBanner
              className="mb-6"
              message={submissionError}
              onDismiss={() => setSubmissionError(null)}
              tone="error"
            />
          )}

          <section>
            <h2 className="text-lg font-bold text-slate-950">Customer</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select the customer placing this laundry order.
            </p>
            <label htmlFor="customerId" className="mt-4 block text-sm font-bold text-slate-800">
              Customer <span className="text-rose-600">*</span>
            </label>
            <select
              id="customerId"
              disabled={isBusy}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              aria-invalid={Boolean(errors.customerId)}
              aria-describedby={errors.customerId ? 'customer-error' : undefined}
              {...register('customerId')}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customerLabel(customer)}
                </option>
              ))}
            </select>
            {errors.customerId?.message && (
              <p id="customer-error" className="mt-1.5 text-sm font-medium text-rose-600">
                {errors.customerId.message}
              </p>
            )}
          </section>

          <section className="mt-8 border-t border-slate-100 pt-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Laundry Services</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add each service and enter its quantity.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => append({ serviceId: '', quantity: 1 })}
                disabled={isBusy}
                className="w-full sm:w-auto"
              >
                Add Service Line
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {fields.map((field, index) => {
                const selectedService = services.find(
                  (service) => service._id === watchedItems[index]?.serviceId,
                )

                return (
                  <ServiceLine
                    key={field.id}
                    index={index}
                    services={services}
                    selectedService={selectedService}
                    errors={errors.items?.[index]}
                    register={register}
                    canRemove={fields.length > 1}
                    disabled={isBusy}
                    onRemove={() => remove(index)}
                  />
                )
              })}
            </div>
            {errors.items?.root?.message && (
              <p className="mt-2 text-sm font-medium text-rose-600">
                {errors.items.root.message}
              </p>
            )}
          </section>

          <section className="mt-8 grid gap-6 border-t border-slate-100 pt-7 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h2 className="text-lg font-bold text-slate-950">Promotion</h2>
              <p className="mt-1 text-sm text-slate-500">
                Optional. The server checks eligibility for the current order amount.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <label htmlFor="promotionCode" className="sr-only">
                    Promotion Code
                  </label>
                  <Input
                    id="promotionCode"
                    autoCapitalize="characters"
                    className="uppercase"
                    placeholder="Enter promotion code"
                    disabled={isBusy}
                    {...register('promotionCode')}
                  />
                </div>
                <Button
                  type="button"
                  onClick={checkPromotion}
                  disabled={isBusy}
                  className="sm:shrink-0"
                >
                  {isValidatingPromotion ? 'Validating…' : 'Validate Promotion'}
                </Button>
              </div>
              {normalizedPromotionCode && promotionFeedback && !matchingPromotionFeedback && (
                <p className="mt-2 text-sm font-semibold text-amber-700">
                  Order details or the code changed. Validate the promotion again.
                </p>
              )}
              {matchingPromotionFeedback && (
                <FeedbackBanner
                  className="mt-3"
                  message={matchingPromotionFeedback.message}
                  tone={matchingPromotionFeedback.valid ? 'success' : 'error'}
                />
              )}
            </div>

            <div>
              <label htmlFor="additionalCharge" className="text-sm font-bold text-slate-800">
                Additional Charge (PHP)
              </label>
              <Input
                id="additionalCharge"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                className="mt-2"
                disabled={isBusy}
                aria-invalid={Boolean(errors.additionalCharge)}
                aria-describedby={errors.additionalCharge ? 'additional-charge-error' : undefined}
                {...register('additionalCharge', {
                  setValueAs: (value: string) => (value === '' ? 0 : Number(value)),
                })}
              />
              {errors.additionalCharge?.message && (
                <p id="additional-charge-error" className="mt-1.5 text-sm font-medium text-rose-600">
                  {errors.additionalCharge.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="text-sm font-bold text-slate-800">
                Notes <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={4}
                disabled={isBusy}
                className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={errors.notes ? 'notes-error' : undefined}
                {...register('notes')}
              />
              <div className="mt-1.5 flex items-start justify-between gap-4">
                {errors.notes?.message && (
                  <p id="notes-error" className="text-sm font-medium text-rose-600">
                    {errors.notes.message}
                  </p>
                )}
                <p className="ml-auto text-xs text-slate-400">Maximum 500 characters</p>
              </div>
            </div>
          </section>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <Button type="submit" disabled={isBusy} className="w-full sm:w-auto">
              {isSubmitting ? 'Creating order…' : 'Create Order'}
            </Button>
          </div>
        </Card>

        <OrderSummary
          calculation={calculation}
          error={calculationError}
          isCalculating={isCalculating}
          isDisabled={isSubmitting || isValidatingPromotion}
          isStale={isSummaryStale}
          onCalculate={refreshSummary}
        />
      </div>
    </form>
  )
}

export default OrderForm
