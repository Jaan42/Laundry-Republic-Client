import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import CreateOrderPage from './pages/CreateOrderPage'
import CustomerCreatePage from './pages/CustomerCreatePage'
import CustomerDetailsPage from './pages/CustomerDetailsPage'
import CustomerEditPage from './pages/CustomerEditPage'
import CustomersPage from './pages/CustomersPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import OrderEditPage from './pages/OrderEditPage'
import OrdersPage from './pages/OrdersPage'
import PromotionCreatePage from './pages/PromotionCreatePage'
import PromotionEditPage from './pages/PromotionEditPage'
import PromotionsPage from './pages/PromotionsPage'
import ReportsPage from './pages/ReportsPage'
import ServiceCreatePage from './pages/ServiceCreatePage'
import ServiceEditPage from './pages/ServiceEditPage'
import ServicesPage from './pages/ServicesPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/new" element={<CustomerCreatePage />} />
        <Route path="/customers/:id" element={<CustomerDetailsPage />} />
        <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/new" element={<ServiceCreatePage />} />
        <Route path="/services/:id/edit" element={<ServiceEditPage />} />
        <Route path="/promotions" element={<PromotionsPage />} />
        <Route path="/promotions/new" element={<PromotionCreatePage />} />
        <Route path="/promotions/:id/edit" element={<PromotionEditPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<CreateOrderPage />} />
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/orders/:id/edit" element={<OrderEditPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  )
}

export default App
