import { useEffect, useRef } from 'react'
import Brand from './Brand'
import NavigationLinks from './NavigationLinks'

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Management navigation menu"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close navigation"
      />

      <div className="relative flex h-full w-[min(20rem,calc(100%-3rem))] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <Brand onNavigate={onClose} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-2xl leading-none text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Close navigation menu"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile management navigation">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <NavigationLinks onNavigate={onClose} />
        </nav>
      </div>
    </div>
  )
}

export default MobileNavigation
