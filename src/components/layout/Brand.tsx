import { Link } from 'react-router-dom'

interface BrandProps {
  onNavigate?: () => void
  inverted?: boolean
}

function Brand({ onNavigate, inverted = false }: BrandProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
      aria-label="Laundry Republic home"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
          inverted ? 'bg-white' : 'bg-blue-600'
        }`}
        aria-hidden="true"
      >
        <span
          className={`h-5 w-5 rounded-full border-[3px] ${
            inverted ? 'border-blue-600' : 'border-white'
          }`}
        />
      </span>
      <span
        className={`truncate text-base font-extrabold tracking-tight ${
          inverted ? 'text-white' : 'text-slate-950'
        }`}
      >
        Laundry Republic
      </span>
    </Link>
  )
}

export default Brand
