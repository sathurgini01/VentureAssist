import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionButton, ActionLink, BusinessPageHeader, ProgressBar, SectionCard, TrackerIcon } from '../components/BusinessComponents'
import { getIdeaById, getIdeaTracker, updateTrackerItem } from '../services/businessService'

function BusinessTrackerPage() {
  const { id } = useParams()
  const { addToast } = useAppContext()
  const [idea, setIdea] = useState(null)
  const [trackerState, setTrackerState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingItemId, setSavingItemId] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTracker() {
      try {
        setLoading(true)
        setError('')
        const [ideaData, trackerData] = await Promise.all([getIdeaById(id), getIdeaTracker(id)])

        if (isMounted) {
          setIdea(ideaData)
          setTrackerState(trackerData)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTracker()

    return () => {
      isMounted = false
    }
  }, [id])

  async function handleItemUpdate(itemId, payload) {
    if (!trackerState?.tracker?._id) {
      return
    }

    try {
      setSavingItemId(itemId)
      const nextTrackerState = await updateTrackerItem(trackerState.tracker._id, itemId, payload)
      setTrackerState(nextTrackerState)
      addToast('Tracker updated.', 'success')
    } catch (updateError) {
      addToast(updateError.message, 'error')
    } finally {
      setSavingItemId('')
    }
  }

  function updateLocalNote(itemId, notes) {
    setTrackerState((current) => ({
      ...current,
      tracker: {
        ...current.tracker,
        items: current.tracker.items.map((item) => (item._id === itemId ? { ...item, notes } : item)),
      },
    }))
  }

  if (loading) {
    return <LoadingState title="Loading tracker" description="Preparing the checklist and progress snapshot for this idea." />
  }

  if (error || !idea || !trackerState) {
    return <ErrorState title="Tracker unavailable" message={error || 'The tracker for this idea could not be loaded.'} />
  }

  const trackerItems = trackerState?.tracker?.items ?? []

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Execution tracker"
        title={`Progress tracker for ${idea.title}`}
        description="Use the checklist to keep validation work visible and attach notes to each milestone as you learn."
        variant="ideas"
        actions={
          <>
            <ActionLink to={`/business/ideas/${id}`} variant="bannerSecondary">
              Back to idea
            </ActionLink>
            <ActionLink to={`/business/ideas/${id}/swot`} variant="banner">
              Open SWOT
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Progress snapshot" subtitle="Completion updates as checklist items are toggled.">
        <div className="flex flex-col items-center justify-center gap-5 rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,rgba(214,248,238,0.72)_0%,rgba(236,253,245,0.92)_48%,rgba(209,250,229,0.78)_100%)] p-7 text-center shadow-[0_18px_40px_rgba(16,185,129,0.12)] sm:flex-row">
          <div className="rounded-[22px] bg-[rgba(255,255,255,0.42)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-sm">
            <TrackerIcon />
          </div>
          <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-[24px] border border-emerald-100/80 bg-[rgba(255,255,255,0.52)] px-8 py-7 shadow-[0_18px_34px_rgba(15,118,110,0.14)] backdrop-blur-sm">
            <ProgressBar value={trackerState.progressPercent} centered />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Checklist" subtitle="Track milestone completion and save notes for each item.">
        {trackerItems.length ? (
          <div className="space-y-4">
            {trackerItems.map((item) => (
              <article key={item._id} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={(event) => handleItemUpdate(item._id, { done: event.target.checked })}
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.done ? 'Completed' : 'Still in progress'}</p>
                    </div>
                  </div>
                  {savingItemId === item._id ? <span className="text-sm font-semibold text-slate-500">Saving...</span> : null}
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Notes</span>
                  <textarea
                    rows={4}
                    value={item.notes}
                    onChange={(event) => updateLocalNote(item._id, event.target.value)}
                    className="min-h-[120px] w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                    placeholder="Add context, decisions, evidence, or next actions for this item."
                  />
                </label>

                <ActionButton
                  onClick={() => handleItemUpdate(item._id, { notes: item.notes })}
                  variant="secondary"
                  className="mt-4"
                >
                  Save notes
                </ActionButton>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
            <p className="text-lg font-semibold text-[var(--teal-deep)]">No tracker data yet</p>
            <p className="mt-2 text-sm text-slate-600">Create or refresh the tracker to start tracking business validation steps.</p>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

export default BusinessTrackerPage
