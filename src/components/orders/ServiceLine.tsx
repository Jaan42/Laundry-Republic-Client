import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import Input from '../ui/Input'
import type { CreateOrderFormValues } from '../../schemas/orderSchema'
import type { LaundryService, PricingType } from '../../types/service'

interface ServiceLineProps {
  index: number
  services: LaundryService[]
  selectedService?: LaundryService
  errors?: FieldErrors<CreateOrderFormValues['items'][number]>
  register: UseFormRegister<CreateOrderFormValues>
  canRemove: boolean
  disabled: boolean
  onRemove: () => void
}

const unitLabels: Record<PricingType, string> = {
  perKg: 'kg',
  perPiece: 'piece(s)',
  perPair: 'pair(s)',
}

const priceFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const selectClassName =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100'

function ServiceLine({
  index,
  services,
  selectedService,
  errors,
  register,
  canRemove,
  disabled,
  onRemove,
}: ServiceLineProps) {
  const unitLabel = selectedService ? unitLabels[selectedService.pricingType] : 'unit(s)'
  const serviceErrorId = `items-${index}-service-error`
  const quantityErrorId = `items-${index}-quantity-error`

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-900">Service {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove || disabled}
          className="rounded-lg px-2 py-1 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-400"
          aria-label={`Remove service ${index + 1}`}
        >
          Remove
        </button>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <div>
          <label htmlFor={`items-${index}-serviceId`} className="text-sm font-bold text-slate-800">
            Service <span className="text-rose-600">*</span>
          </label>
          <select
            id={`items-${index}-serviceId`}
            className={selectClassName}
            disabled={disabled}
            aria-invalid={Boolean(errors?.serviceId)}
            aria-describedby={errors?.serviceId ? serviceErrorId : undefined}
            {...register(`items.${index}.serviceId`)}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors?.serviceId?.message && (
            <p id={serviceErrorId} className="mt-1.5 text-sm font-medium text-rose-600">
              {errors.serviceId.message}
            </p>
          )}
          {selectedService && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {priceFormatter.format(selectedService.price)} / {unitLabels[selectedService.pricingType]}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`items-${index}-quantity`} className="text-sm font-bold text-slate-800">
            Quantity ({unitLabel}) <span className="text-rose-600">*</span>
          </label>
          <Input
            id={`items-${index}-quantity`}
            type="number"
            min="0"
            step="any"
            inputMode="decimal"
            className="mt-2"
            disabled={disabled}
            aria-invalid={Boolean(errors?.quantity)}
            aria-describedby={errors?.quantity ? quantityErrorId : undefined}
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          />
          {errors?.quantity?.message && (
            <p id={quantityErrorId} className="mt-1.5 text-sm font-medium text-rose-600">
              {errors.quantity.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceLine
