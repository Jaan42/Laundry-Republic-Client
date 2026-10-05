import { Route, Routes } from 'react-router-dom'
import PlaceholderPage from './pages/PlaceholderPage'
import type { AppRouteDefinition } from './types/routes'

const appRoutes = [
  {
    path: '/',
    title: 'Landing Page',
    description: 'The public introduction to Laundry Republic.',
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Business activity and key operational information.',
  },
  {
    path: '/customers',
    title: 'Customers',
    description: 'Customer records will be managed here.',
  },
  {
    path: '/customers/new',
    title: 'New Customer',
    description: 'The customer creation form will be built here.',
  },
  {
    path: '/customers/:id',
    title: 'Customer Details',
    description: 'A selected customer record will be displayed here.',
  },
  {
    path: '/customers/:id/edit',
    title: 'Edit Customer',
    description: 'The customer editing form will be built here.',
  },
  {
    path: '/services',
    title: 'Services',
    description: 'Laundry services will be managed here.',
  },
  {
    path: '/services/new',
    title: 'New Service',
    description: 'The service creation form will be built here.',
  },
  {
    path: '/services/:id/edit',
    title: 'Edit Service',
    description: 'The service editing form will be built here.',
  },
  {
    path: '/orders',
    title: 'Orders',
    description: 'Laundry orders will be managed here.',
  },
  {
    path: '/orders/new',
    title: 'Create Order',
    description: 'The order builder will be created here.',
  },
  {
    path: '/orders/:id',
    title: 'Order Details',
    description: 'A selected order will be displayed here.',
  },
  {
    path: '/orders/:id/edit',
    title: 'Edit Order',
    description: 'The order editing experience will be built here.',
  },
  {
    path: '/promotions',
    title: 'Promotions',
    description: 'Promotions will be managed here.',
  },
  {
    path: '/reports',
    title: 'Reports',
    description: 'Business reports will be displayed here.',
  },
] satisfies AppRouteDefinition[]

function App() {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PlaceholderPage
              title={route.title}
              description={route.description}
            />
          }
        />
      ))}
    </Routes>
  )
}

export default App
