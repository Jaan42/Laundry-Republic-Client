import { Link } from 'react-router-dom'
import Brand from '../components/layout/Brand'
import Card from '../components/ui/Card'
import useDocumentTitle from '../hooks/useDocumentTitle'

const services = [
  {
    number: '01',
    name: 'Wash Only',
    description: 'A straightforward wash service for everyday laundry.',
  },
  {
    number: '02',
    name: 'Wash & Dry',
    description: 'Clean and fully dried laundry prepared for pickup.',
  },
  {
    number: '03',
    name: 'Wash, Dry & Fold',
    description: 'A complete, neatly finished laundry service.',
  },
  {
    number: '04',
    name: 'Comforter Cleaning',
    description: 'Careful cleaning for bulky bedding and comforters.',
  },
  {
    number: '05',
    name: 'Shoe Cleaning',
    description: 'Dedicated cleaning for pairs that need extra care.',
  },
]

const workflowSteps = [
  'Register Customer',
  'Select Services',
  'Calculate Order',
  'Track Laundry',
  'Complete Pickup',
]

const benefits = [
  {
    title: 'Automatic Calculations',
    description: 'Calculate service totals, charges, and valid promotions consistently.',
  },
  {
    title: 'Easy Tracking',
    description: 'Follow each order from pending through washing, drying, and pickup.',
  },
  {
    title: 'Organized Records',
    description: 'Keep customer, service, promotion, and order information in one place.',
  },
  {
    title: 'Simple Reports',
    description: 'Review clear business summaries without adding unnecessary complexity.',
  },
]

function LandingPage() {
  useDocumentTitle('Home')

  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-white">
      <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Brand />

          <nav className="hidden items-center gap-7 md:flex" aria-label="Landing page navigation">
            <a className="text-sm font-semibold text-slate-600 hover:text-blue-700" href="#services">
              Services
            </a>
            <a className="text-sm font-semibold text-slate-600 hover:text-blue-700" href="#process">
              How it works
            </a>
            <a className="text-sm font-semibold text-slate-600 hover:text-blue-700" href="#benefits">
              Benefits
            </a>
          </nav>

          <Link
            to="/dashboard"
            className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="hidden sm:inline">Open </span>Dashboard
          </Link>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
          <div
            className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl"
            aria-hidden="true"
          />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div className="min-w-0">
              <p className="inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 shadow-sm">
                Laundry operations, made clear
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                A cleaner way to manage every laundry order.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Laundry Republic gives staff one organized workspace for customers, services,
                promotions, order totals, due dates, and pickup progress.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Manage Orders
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Open Dashboard
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
                  Staff focused
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" aria-hidden="true" />
                  Clear order flow
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden="true" />
                  Ready for every screen
                </span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
              <div className="absolute -inset-4 rounded-[2.75rem] bg-gradient-to-br from-blue-300/30 to-cyan-200/40 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.25rem] border border-blue-100 bg-white p-5 shadow-[0_30px_80px_-35px_rgba(37,99,235,0.45)] sm:p-7">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                      Laundry Republic
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">Order care cycle</p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  </div>
                </div>

                <div className="flex justify-center py-8 sm:py-10">
                  <div className="flex aspect-square w-52 items-center justify-center rounded-full border-[14px] border-blue-600 bg-blue-50 shadow-inner sm:w-60">
                    <div className="relative h-[78%] w-[78%] overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-blue-300 shadow-inner">
                      <span className="absolute -left-5 top-16 h-24 w-32 rotate-12 rounded-[45%] bg-blue-500/60" />
                      <span className="absolute right-0 top-20 h-24 w-36 -rotate-12 rounded-[50%] bg-blue-600/55" />
                      <span className="absolute left-8 top-7 h-5 w-5 rounded-full bg-white/80" />
                      <span className="absolute right-10 top-11 h-3 w-3 rounded-full bg-white/75" />
                      <span className="absolute right-16 top-4 h-2 w-2 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-3 text-center">
                  {['Received', 'In Care', 'Ready'].map((label, index) => (
                    <div
                      key={label}
                      className={`rounded-xl px-2 py-2 text-[0.68rem] font-bold uppercase tracking-wide sm:text-xs ${
                        index === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-24 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Service-ready
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Built around the work your laundry shop handles.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Keep common laundry services easy to identify while staff creates and manages
                orders.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {services.map((service) => (
                <Card
                  key={service.name}
                  className="group border-slate-200 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <span className="text-xs font-black tracking-[0.16em] text-blue-500">
                    {service.number}
                  </span>
                  <h3 className="mt-8 text-lg font-bold text-slate-950">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="scroll-mt-24 bg-slate-950 py-16 text-white sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                One clear flow from drop-off to pickup.
              </h2>
            </div>

            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {workflowSteps.map((step, index) => (
                <li key={step} className="relative">
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-black">
                      {index + 1}
                    </span>
                    <p className="mt-5 text-sm font-bold leading-6 text-white">{step}</p>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <span
                      className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-xl text-blue-300 lg:block"
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="benefits" className="scroll-mt-24 bg-blue-50/60 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Everyday clarity
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                The essentials for an organized laundry operation.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <Card key={benefit.title} className="border-blue-100 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Brand />
          <p className="text-sm text-slate-500">
            Staff-focused laundry service management, kept simple.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
