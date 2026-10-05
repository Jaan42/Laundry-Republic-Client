import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Brand from './Brand'
import MobileNavigation from './MobileNavigation'
import Sidebar from './Sidebar'

function AppLayout() {
  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false)
  const closeMobileNavigation = useCallback(() => setIsMobileNavigationOpen(false), [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <Sidebar />

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setIsMobileNavigationOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          aria-label="Open navigation menu"
          aria-expanded={isMobileNavigationOpen}
        >
          <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="h-0.5 w-full rounded bg-current" />
          </span>
        </button>
      </header>

      <MobileNavigation
        isOpen={isMobileNavigationOpen}
        onClose={closeMobileNavigation}
      />

      <div className="lg:pl-72">
        <main id="main-content" className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
