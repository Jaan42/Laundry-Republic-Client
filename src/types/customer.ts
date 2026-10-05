export interface Customer {
  _id: string
  name?: string
  contactNumber?: string
  email?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

export interface CustomerPayload {
  name: string
  contactNumber: string
  email: string
  address: string
}

export type CustomerField = keyof CustomerPayload

export interface CustomerApiErrorDetails {
  message: string
  fieldErrors: Partial<Record<CustomerField, string>>
}

export interface DeleteCustomerResponse {
  message?: string
}
