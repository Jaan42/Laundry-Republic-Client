export type OperationalStatus =
  | 'Pending'
  | 'Washing'
  | 'Drying'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Cancelled'

export type DueStatus = 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed'

export interface DashboardStatistics {
  totalOrders?: number
  todayOrders?: number
  pendingOrders?: number
  inProgressOrders?: number
  readyForPickup?: number
  completedOrders?: number
  overdueOrders?: number
  totalCustomers?: number
  averageOrderValue?: number
}

export interface DashboardOrder {
  _id: string
  orderNumber?: string
  customer?: {
    _id?: string
    name?: string
  } | null
  status?: OperationalStatus
  orderDate?: string
  expectedCompletionDate?: string
  dueStatus?: DueStatus
  grandTotal?: number
}

export interface PopularService {
  service: {
    _id: string
    name?: string
    pricingType?: 'perKg' | 'perPiece' | 'perPair'
  }
  totalOrders?: number
  totalQuantity?: number
}

export interface DashboardData {
  statistics: DashboardStatistics
  orders: DashboardOrder[]
  popularServices: PopularService[]
}
