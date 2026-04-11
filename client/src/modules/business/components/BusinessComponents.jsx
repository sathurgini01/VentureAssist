import { Link, useNavigate } from 'react-router-dom'

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

const badgeTones = {
  teal: 'bg-teal-100 text-teal-800 border-teal-200',
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  rose: 'bg-rose-100 text-rose-800 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
}

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-[linear-gradient(135deg,var(--teal-mid),var(--teal-deep))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(26,74,69,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(26,74,69,0.26)] active:translate-y-0 active:shadow-[0_14px_26px_rgba(26,74,69,0.2)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none'

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(45,107,100,0.14)] bg-white/85 px-4 py-2.5 text-sm font-semibold text-[var(--teal-deep)] shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(61,139,128,0.24)] hover:bg-white hover:shadow-md active:translate-y-0 active:shadow-sm disabled:cursor-not-allowed disabled:opacity-60'

const bannerButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/80 bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(5,150,105,0.3)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:brightness-105 hover:shadow-[0_24px_44px_rgba(5,150,105,0.34)] active:translate-y-0 active:shadow-[0_14px_28px_rgba(5,150,105,0.24)] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none'

const bannerSecondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-emerald-300/35 bg-[rgba(9,54,48,0.72)] px-5 py-2.5 text-sm font-semibold text-emerald-50 shadow-[0_14px_28px_rgba(15,118,110,0.24)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200/55 hover:bg-[rgba(8,64,57,0.84)] hover:shadow-[0_20px_38px_rgba(15,118,110,0.3)] active:translate-y-0 active:shadow-[0_12px_22px_rgba(15,118,110,0.22)] disabled:cursor-not-allowed disabled:opacity-60'

const dangerButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-50 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60'

const pageHeaderVariants = {
  overview:
    'border-emerald-300/30 bg-[linear-gradient(135deg,var(--teal-mid)_0%,var(--teal-deep)_58%,#163f3b_100%)] text-white shadow-[0_24px_60px_rgba(16,185,129,0.18)]',
  ideas:
    'border-emerald-300/30 bg-[linear-gradient(135deg,var(--teal-mid)_0%,var(--teal-deep)_58%,#163f3b_100%)] text-white shadow-[0_24px_60px_rgba(16,185,129,0.18)]',
  toolkits:
    'border-emerald-300/30 bg-[linear-gradient(135deg,#14463f_0%,#0f766e_55%,#123b37_100%)] text-white shadow-[0_24px_60px_rgba(16,185,129,0.18)]',
  mentors:
    'border-emerald-300/30 bg-[linear-gradient(135deg,#103f3a_0%,#0f766e_55%,#0b2f2b_100%)] text-white shadow-[0_24px_60px_rgba(16,185,129,0.18)]',
  requests:
    'border-emerald-300/30 bg-[linear-gradient(135deg,#143d38_0%,#115e59_55%,#0f2f2c_100%)] text-white shadow-[0_24px_60px_rgba(16,185,129,0.18)]',
}

const pageHeaderImages = {
  overview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80',
  ideas: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
  toolkits: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
  mentors: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80',
  requests: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M3 12h18" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.5 2.5-3-3Z" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="m7 14 3-3 3 2 4-6" />
    </svg>
  )
}

function IconWrapper({ children, tone = 'teal' }) {
  const toneClass =
    tone === 'emerald'
      ? 'bg-emerald-100 text-emerald-700'
      : tone === 'amber'
        ? 'bg-amber-100 text-amber-700'
        : tone === 'sky'
          ? 'bg-sky-100 text-sky-700'
          : 'bg-teal-100 text-teal-700'

  return (
    <span className={cx('inline-flex h-11 w-11 items-center justify-center rounded-2xl', toneClass)}>
      {children}
    </span>
  )
}

export function BusinessPageHeader({ eyebrow, title, description, actions, variant = 'overview' }) {
  const headerClass = pageHeaderVariants[variant] ?? pageHeaderVariants.overview
  const headerImage = pageHeaderImages[variant] ?? pageHeaderImages.overview
  const overlay = 'linear-gradient(118deg, rgba(12, 58, 53, 0.9) 0%, rgba(15, 118, 110, 0.72) 42%, rgba(6, 23, 30, 0.64) 100%)'

  return (
    <div
      className={cx('rounded-[32px] border bg-cover bg-center p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]', headerClass)}
      style={{ backgroundImage: `${overlay}, url(${headerImage})` }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <span
              className={cx(
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em]',
                'border border-white/15 bg-white/10 text-white/90 backdrop-blur-sm',
              )}
            >
              {eyebrow}
            </span>
          ) : null}
          <h1
            className="mt-4 text-3xl font-semibold tracking-tight text-white [text-shadow:0_3px_16px_rgba(0,0,0,0.5)] sm:text-4xl"
          >
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)] sm:text-base">
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  )
}

export function ActionLink({ to, children, variant = 'primary' }) {
  return (
    <Link
      to={to}
      className={cx(
        variant === 'secondary'
          ? secondaryButtonClass
          : variant === 'banner'
            ? bannerButtonClass
            : variant === 'bannerSecondary'
              ? bannerSecondaryButtonClass
            : primaryButtonClass,
      )}
    >
      {children}
    </Link>
  )
}

export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}) {
  const variantClass =
    variant === 'secondary'
      ? secondaryButtonClass
      : variant === 'banner'
        ? bannerButtonClass
        : variant === 'bannerSecondary'
          ? bannerSecondaryButtonClass
      : variant === 'danger'
        ? dangerButtonClass
        : primaryButtonClass

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cx(variantClass, className)}>
      {children}
    </button>
  )
}

export function StatusBadge({ children, tone = 'slate' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        badgeTones[tone] ?? badgeTones.slate,
      )}
    >
      {children}
    </span>
  )
}

export function ProgressBar({ value, centered = false }) {
  const safeValue = Math.min(100, Math.max(0, value))

  return (
    <div className={cx('space-y-3', centered ? 'mx-auto w-full max-w-xl text-center' : '')}>
      <div className={cx('flex items-center', centered ? 'justify-center' : 'justify-between')}>
        {centered ? null : <p className="text-sm font-semibold text-slate-800">Progress</p>}
        <p className="text-sm font-semibold text-[var(--teal-deep)]">{safeValue}%</p>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-200/90 shadow-inner">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--teal-light)_0%,var(--teal-mid)_45%,var(--teal-deep)_100%)] transition-[width] duration-500 ease-out"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  )
}

export function SectionCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section
      className={cx(
        'rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_36px_rgba(28,43,42,0.08)]',
        className,
      )}
    >
      {title || actions ? (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? <h2 className="text-xl font-bold text-[var(--teal-deep)]">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function SummaryCard({ title, value, caption, to, tone = 'teal' }) {
  const toneClasses = {
    teal: 'from-teal-500/15 to-cyan-500/5',
    blue: 'from-blue-500/15 to-indigo-500/5',
    amber: 'from-amber-400/20 to-orange-400/10',
    rose: 'from-rose-400/15 to-pink-400/10',
  }

  return (
    <Link
      to={to}
      className={cx(
        'group block rounded-[24px] border border-slate-200 bg-gradient-to-br p-5 shadow-sm transition duration-200 hover:scale-[1.01] hover:border-slate-300 hover:shadow-[0_24px_45px_rgba(26,74,69,0.12)]',
        toneClasses[tone] ?? toneClasses.teal,
      )}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{caption}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--teal-deep)]">
        <span>Explore</span>
        <ArrowUpRightIcon />
      </div>
    </Link>
  )
}

export function PreviewCard({ title, subtitle, description, meta, to, icon }) {
  const content = (
    <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm transition duration-200 hover:scale-[1.01] hover:border-slate-300 hover:bg-white hover:shadow-[0_24px_45px_rgba(26,74,69,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {icon || null}
          <div>
            <h3 className="text-base font-bold text-[var(--teal-deep)]">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        {meta ? <StatusBadge tone="slate">{meta}</StatusBadge> : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--teal-deep)]">
        <span>Explore</span>
        <ArrowUpRightIcon />
      </div>
    </article>
  )

  if (!to) {
    return content
  }

  return (
    <Link to={to} className="block cursor-pointer">
      {content}
    </Link>
  )
}

export function IdeaCard({ idea, onEdit, onDelete, onGenerateSwot }) {
  const navigate = useNavigate()
  const stageTone = idea.stage === 'Ready to validate' ? 'emerald' : idea.stage === 'Refining' ? 'amber' : 'slate'
  const swotTone = idea.swotStatus === 'Generated' ? 'teal' : 'rose'

  return (
    <article
      onClick={() => navigate(`/business/ideas/${idea._id}`)}
      className="cursor-pointer rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:scale-[1.01] hover:border-slate-300 hover:shadow-[0_24px_45px_rgba(26,74,69,0.12)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={stageTone}>{idea.stage}</StatusBadge>
            <StatusBadge tone={swotTone}>SWOT {idea.swotStatus}</StatusBadge>
          </div>
          <div className="mt-4 flex items-start gap-3">
            <IconWrapper tone="teal">
              <BriefcaseIcon />
            </IconWrapper>
            <div>
              <h3 className="text-xl font-bold text-[var(--teal-deep)]">{idea.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{idea.shortSummary}</p>
            </div>
          </div>
          <div className="mt-5 max-w-md">
            <ProgressBar value={idea.progress} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
          <ActionButton onClick={() => onEdit(idea)} variant="secondary">
            Edit
          </ActionButton>
          <ActionButton onClick={() => onDelete(idea)} variant="danger">
            Delete
          </ActionButton>
          <ActionButton onClick={() => onGenerateSwot(idea)}>Generate SWOT</ActionButton>
        </div>
      </div>
    </article>
  )
}

export function MentorProfileCard({ mentor, isSelected, onSelect, onExplore }) {
  const assignedIdeas = mentor.assignedBusinessIdeaTitles || []

  return (
    <article
      className={cx(
        'w-full rounded-[24px] border p-5 text-left shadow-sm transition duration-200 hover:scale-[1.01] hover:shadow-[0_24px_45px_rgba(26,74,69,0.12)]',
        isSelected
          ? 'border-[rgba(61,139,128,0.35)] bg-white shadow-[0_18px_36px_rgba(26,74,69,0.12)]'
          : 'border-slate-200 bg-white hover:border-slate-300',
      )}
    >
      <div className="flex items-center gap-4">
        <img src={mentor.imageUrl} alt={mentor.name} className="h-16 w-16 rounded-2xl object-cover shadow-sm" />
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[var(--teal-deep)]">{mentor.name}</h3>
          <p className="text-sm text-slate-500">{mentor.expertise}</p>
        </div>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <IconWrapper tone="emerald">
          <UsersIcon />
        </IconWrapper>
        <div className="space-y-2">
          <p className="text-sm leading-6 text-slate-600">{mentor.bio}</p>
          <p className="text-sm text-slate-500">
            Assigned business ideas: {assignedIdeas.length ? assignedIdeas.join(', ') : 'General support'}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <ActionButton onClick={() => onSelect(mentor._id)}>
          {isSelected ? 'Selected for request' : 'Request mentor'}
        </ActionButton>
        <ActionButton onClick={() => onExplore?.(mentor)} variant="secondary">
          Explore mentor
        </ActionButton>
      </div>
    </article>
  )
}

export function DetailItem({ label, value }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value || 'Not provided yet.'}</p>
    </div>
  )
}

export function SwotQuadrant({ title, items, tone }) {
  const toneClasses = {
    Strengths: 'from-emerald-100 to-white border-emerald-200',
    Weaknesses: 'from-rose-100 to-white border-rose-200',
    Opportunities: 'from-sky-100 to-white border-sky-200',
    Threats: 'from-amber-100 to-white border-amber-200',
  }

  return (
    <div
      className={cx(
        'rounded-[24px] border bg-gradient-to-br p-5 shadow-sm',
        toneClasses[tone] ?? 'from-slate-100 to-white border-slate-200',
      )}
    >
      <h3 className="text-lg font-bold text-[var(--teal-deep)]">{title}</h3>
      <ul className="mt-4 space-y-3">
        {(items?.length ? items : ['No items yet.']).map((item) => (
          <li key={`${title}-${item}`} className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MentorRequestCard({ request, actions }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-base font-bold text-[var(--teal-deep)]">{request.ideaId?.title || 'General business support'}</p>
          <p className="mt-1 text-sm text-slate-500">Mentor: {request.mentorId?.name || 'Mentor not available'}</p>
          <p className="mt-3 text-sm font-semibold text-slate-700">Request message</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{request.message}</p>
          <p className="mt-3 text-sm font-semibold text-slate-700">Preferred time</p>
          <p className="mt-1 text-sm text-slate-500">{request.preferredTime}</p>
          {request.mentorNote ? (
            <>
              <p className="mt-3 text-sm font-semibold text-slate-700">Mentor response</p>
              <p className="mt-1 text-sm text-slate-500">{request.mentorNote}</p>
            </>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <StatusBadge
            tone={request.status === 'Accepted' ? 'emerald' : request.status === 'Rejected' ? 'rose' : 'amber'}
          >
            {request.status}
          </StatusBadge>
          {actions}
        </div>
      </div>
    </article>
  )
}

export function ToolkitIcon() {
  return (
    <IconWrapper tone="amber">
      <WrenchIcon />
    </IconWrapper>
  )
}

export function MentorIcon() {
  return (
    <IconWrapper tone="emerald">
      <UsersIcon />
    </IconWrapper>
  )
}

export function TrackerIcon() {
  return (
    <IconWrapper tone="sky">
      <ChartIcon />
    </IconWrapper>
  )
}
