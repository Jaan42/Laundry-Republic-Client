import Brand from './Brand'
import NavigationLinks from './NavigationLinks'

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-100 px-6 py-5">
        <Brand />
      </div>

      <nav className="flex-1 px-4 py-6" aria-label="Management navigation">
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
        <NavigationLinks />
      </nav>

      <div className="border-t border-slate-100 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          Staff workspace
        </p>
        <p className="mt-1 text-sm leading-5 text-slate-500">
          Keep every laundry order organized.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
