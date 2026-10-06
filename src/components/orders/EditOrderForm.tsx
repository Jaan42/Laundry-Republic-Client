import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import Button from '../ui/Button'
import Card from '../ui/Card'
import FeedbackBanner from '../ui/FeedbackBanner'
import Input from '../ui/Input'
import ServiceLine from './ServiceLine'
import { editOrderSchema } from '../../schemas/orderSchema'
import type { EditOrderFormValues } from '../../schemas/orderSchema'
import { getOrderApiErrorDetails } from '../../services/orderService'
import type { Customer } from '../../types/customer'
import type { Order, UpdateOrderPayload } from '../../types/order'
import type { LaundryService } from '../../types/service'
import {
  formatOrderCurrency,
  formatOrderDate,
  toDateInputValue,
} from '../../utils/orderFormatting'

interface EditOrderFormProps {
  customers: Customer[]
  order: Order
  services: LaundryService[]
  onUpdate: (payload: UpdateOrderPayload) => Promise<void>
}

function customerLabel(customer: Customer) {
  const name = customer.name || 'Unnamed customer'
  return customer.contactNumber ? `${name} - ${customer.contactNumber}` : name
}

function EditOrderForm({ customers, order, services, onUpdate }: EditOrderFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<EditOrderFormValues>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      customerId: order.customerId || '',
      orderDate: toDateInputValue(order.orderDate),
      items: order.items.map((item) => ({
        serviceId: item.serviceId || '',
        quantity: item.quantity,
      })),
      promotionCode: order.promotion?.code || '',
      additionalCharge: order.additionalCharge,
      notes: order.notes || '',
    },
  })
  const { append, fields, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = useWatch({ control, name: 'items' }) || []

  async function submitOrder(values: EditOrderFormValues) {
    setSubmissionError(null)

    const payload: UpdateOrderPayload = {
      customerId: values.customerId,
      orderDate: values.orderDate,
      items: values.items.map(({ serviceId, quantity }) => ({ serviceId, quantity })),
      promotionCode: values.promotionCode?.trim().toUpperCase() || '',
      additionalCharge: values.additionalCharge,
      notes: values.notes || '',
    }

    try {
      await onUpdate(payload)
    } catch (error) {
      setSubmissionError(getOrderApiErrorDetails(error).message)
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
            <h2 className="text-lg font-bold text-slate-950">Order Information</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Edit only the source information accepted by the server.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-customerId" className="text-sm font-bold text-slate-800">
                  Customer <span className="text-rose-600">*</span>
                </label>
                <select
                  id="edit-customerId"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  aria-invalid={Boolean(errors.customerId)}
                  aria-describedby={errors.customerId ? 'edit-customer-error' : undefined}
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
                  <p id="edit-customer-error" className="mt-1.5 text-sm font-medium text-rose-600">
                    {errors.customerId.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="edit-order-date" className="text-sm font-bold text-slate-800">
                  Order Date <span className="text-rose-600">*</span>
                </label>
                <Input
                  id="edit-order-date"
                  type="date"
                  className="mt-2"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.orderDate)}
                  aria-describedby={errors.orderDate ? 'edit-order-date-error' : undefined}
                  {...register('orderDate')}
                />
                {errors.orderDate?.message && (
                  <p id="edit-order-date-error" className="mt-1.5 text-sm font-medium text-rose-600">
                    {errors.orderDate.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-slate-100 pt-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Laundry Services</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Changing a service or quantity causes the server to recalculate the order.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => append({ serviceId: '', quantity: 1 })}
                disabled={isSubmitting}
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
                    serviceError={errors.items?.[index]?.serviceId?.message}
                    serviceRegistration={register(`items.${index}.serviceId`)}
                    quantityError={errors.items?.[index]?.quantity?.message}
                    quantityRegistration={register(`items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    canRemove={fields.length > 1}
                    disabled={isSubmitting}
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
            <div>
              <label htmlFor="edit-promotion-code" className="text-sm font-bold text-slate-800">
                Promotion Code <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <Input
                id="edit-promotion-code"
                autoCapitalize="characters"
                className="mt-2 uppercase"
                disabled={isSubmitting}
                placeholder="No promotion"
                {...register('promotionCode')}
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Leave blank to remove the promotion. Eligibility is checked when saved.
              </p>
            </div>

            <div>
              <label htmlFor="edit-additional-charge" className="text-sm font-bold text-slate-800">
                Additional Charge (PHP)
              </label>
              <Input
                id="edit-additional-charge"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                className="mt-2"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.additionalCharge)}
                aria-describedby={errors.additionalCharge ? 'edit-additional-charge-error' : undefined}
                {...register('additionalCharge', {
                  setValueAs: (value: string) => (value === '' ? 0 : Number(value)),
                })}
              />
              {errors.additionalCharge?.message && (
                <p id="edit-additional-charge-error" className="mt-1.5 text-sm font-medium text-rose-600">
                  {errors.additionalCharge.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="edit-notes" className="text-sm font-bold text-slate-800">
                Notes <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="edit-notes"
                rows={4}
                disabled={isSubmitting}
                className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                aria-invalid={Boolean(errors.notes)}
                aria-describedby={errors.notes ? 'edit-notes-error' : undefined}
                {...register('notes')}
              />
              <div className="mt-1.5 flex items-start justify-between gap-4">
                {errors.notes?.message && (
                  <p id="edit-notes-error" className="text-sm font-medium text-rose-600">
                    {errors.notes.message}
                  </p>
                )}
                <p className="ml-auto text-xs text-slate-400">Maximum 500 characters</p>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Saving changes...' : 'Save Changes'}
            </Button>
          </div>
        </Card>

        <Card className="border-slate-200 p-5 sm:p-6 xl:sticky xl:top-6">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-blue-600">
            Server-calculated
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-950">Current Totals</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            These trusted values are read-only and will be recalculated by the server after saving.
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Subtotal</dt>
              <dd className="font-semibold text-slate-900">{formatOrderCurrency(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Discount</dt>
              <dd className="font-semibold text-slate-900">-{formatOrderCurrency(order.discountAmount)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
              <dt className="font-bold text-slate-900">Grand Total</dt>
              <dd className="font-bold text-blue-700">{formatOrderCurrency(order.grandTotal)}</dd>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <dt className="text-slate-500">Expected Completion</dt>
              <dd className="mt-1 font-semibold text-slate-900">
                {formatOrderDate(order.expectedCompletionDate)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </form>
  )
}

export default EditOrderForm
