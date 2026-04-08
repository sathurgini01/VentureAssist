function Spinner() {
  return (
    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
  )
}

function ActionButton({ label, onClick }) {
  if (!label || !onClick) {
    return null
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,var(--teal-mid),var(--teal-deep))] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(26,74,69,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(26,74,69,0.26)]"
    >
      {label}
    </button>
  )
}

export function LoadingState({
  title = 'Loading workspace',
  description = 'Please wait while we bring everything together.',
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/85 p-8 shadow-sm">
      <div className="flex items-center gap-3">
        <Spinner />
        <p className="text-lg font-semibold text-slate-900">{title}</p>
      </div>
      <p className="mt-3 max-w-2xl text-sm text-slate-600">{description}</p>
    </div>
  )
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 shadow-sm">
      <p className="text-lg font-semibold text-rose-950">{title}</p>
      <p className="mt-3 max-w-2xl text-sm text-rose-800">{message}</p>
      <div className="mt-5">
        <ActionButton label={actionLabel} onClick={onAction} />
      </div>
    </div>
  )
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'Add your first item to get started.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-3 text-sm text-slate-600">{message}</p>
      <div className="mt-5">
        <ActionButton label={actionLabel} onClick={onAction} />
      </div>
    </div>
  )
}
