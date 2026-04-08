import { NavLink, Outlet } from 'react-router-dom'

const businessNavItems = [
  { to: '/business', label: 'Overview', end: true },
  { to: '/business/ideas', label: 'Ideas' },
  { to: '/business/toolkits', label: 'Toolkits' },
  { to: '/business/mentors', label: 'Mentors' },
  { to: '/business/mentor-requests', label: 'Requests' },
]

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 11 9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  )
}

function BusinessLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ccfbf1_0%,#eff6ff_40%,#fff7ed_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-white/70 bg-white/75 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <NavLink
                to="/"
                aria-label="Back to home"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(61,139,128,0.24)] bg-white text-[var(--teal-bright)] transition hover:-translate-y-0.5 hover:border-[rgba(61,139,128,0.34)] hover:text-[var(--teal-mid)] hover:shadow-sm"
              >
                <HomeIcon />
              </NavLink>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Business Support Module
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Shape your idea, study the risks, line up mentors, and keep your next milestones visible in one workspace.
              </p>
            </div>
            <nav className="flex flex-wrap gap-2">
              {businessNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'rounded-full border px-4 py-2 text-sm font-semibold transition duration-200',
                      isActive
                        ? 'border-[rgba(122,191,184,0.8)] bg-[rgba(200,232,228,0.95)] text-slate-950 shadow-[0_10px_20px_rgba(26,74,69,0.12)] hover:bg-[rgba(184,224,219,0.98)]'
                        : 'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mt-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default BusinessLayout
