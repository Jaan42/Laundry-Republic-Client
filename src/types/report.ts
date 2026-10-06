export type ReportPeriod = 'today' | 'last7Days' | 'thisMonth' | 'custom'

export interface ReportDateRange {
  startDate: string
  endDate: string
}

export interface RevenueOrderSummary {
  _id: string
  orderNumber: string
  customer: {
    _id: string
    name?: string
  } | null
  orderDate: string
  grandTotal: number
}

export interface RevenueSummary {
  totalOrders: number
  completedOrders: number
  totalRevenue: number
  averageOrderValue: number
  highestOrder: RevenueOrderSummary | null
  lowestOrder: RevenueOrderSummary | null
}
