import { NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Orders', to: '/orders' },
  { label: 'Customers', to: '/customers' },
  { label: 'Services', to: '/services' },
  { label: 'Promotions', to: '/promotions' },
  { label: 'Reports', to: '/reports' },
]

interface NavigationLinksProps {
  onNavigate?: () => void
}

function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  return (
    <ul className="space-y-1.5">
      {navigationItems.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-2.5 w-2.5 rounded-full border-2 transition ${
                    isActive
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-slate-300 bg-white group-hover:border-blue-400'
                  }`}
                  aria-hidden="true"
                />
                {item.label}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export default NavigationLinks
