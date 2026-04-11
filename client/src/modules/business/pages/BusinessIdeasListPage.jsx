import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionLink, BusinessPageHeader, IdeaCard, SectionCard } from '../components/BusinessComponents'
import { deleteIdea, getIdeasWithInsights } from '../services/businessService'

function BusinessIdeasListPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [swotFilter, setSwotFilter] = useState('All')
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    let isMounted = true

    async function loadIdeas() {
      try {
        setLoading(true)
        setError('')
        const data = await getIdeasWithInsights()

        if (isMounted) {
          setIdeas(data)
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

    loadIdeas()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const query = deferredSearch.trim().toLowerCase()
      const matchesQuery =
        !query ||
        idea.title.toLowerCase().includes(query) ||
        idea.shortSummary.toLowerCase().includes(query)

      const matchesStage = stageFilter === 'All' || idea.stage === stageFilter
      const matchesSwot = swotFilter === 'All' || idea.swotStatus === swotFilter

      return matchesQuery && matchesStage && matchesSwot
    })
  }, [deferredSearch, ideas, stageFilter, swotFilter])

  async function refreshIdeas() {
    const data = await getIdeasWithInsights()
    startTransition(() => {
      setIdeas(data)
    })
  }

  async function handleDelete(idea) {
    const shouldDelete = window.confirm(`Delete "${idea.title}"? This will also remove its tracker.`)

    if (!shouldDelete) {
      return
    }

    try {
      await deleteIdea(idea._id)
      await refreshIdeas()
      addToast('Idea deleted successfully.', 'success')
    } catch (deleteError) {
      addToast(deleteError.message, 'error')
    }
  }

  if (loading) {
    return <LoadingState title="Loading ideas" description="Bringing in your business ideas and SWOT status." />
  }

  if (error) {
    return <ErrorState title="Ideas unavailable" message={error} actionLabel="Retry" onAction={() => window.location.reload()} />
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Idea pipeline"
        title="Review, search, and prioritize your business ideas"
        description="Scan your idea list, filter by stage or SWOT status, and jump straight into the next workflow for each concept."
        variant="ideas"
        actions={
          <>
            <ActionLink to="/business/ideas/new" variant="banner">+ Create Idea</ActionLink>
            <ActionLink to="/business/ideas" variant="bannerSecondary">
              View Ideas
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Filters" subtitle="Use quick filters to focus on the ideas that need attention now.">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title or summary"
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Stage</span>
            <select
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value)}
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option>All</option>
              <option>Draft</option>
              <option>Refining</option>
              <option>Ready to validate</option>
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">SWOT status</span>
            <select
              value={swotFilter}
              onChange={(event) => setSwotFilter(event.target.value)}
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option>All</option>
              <option>Generated</option>
              <option>Pending</option>
            </select>
          </label>
        </div>
      </SectionCard>

      {visibleIdeas.length ? (
        <div className="space-y-4">
          {visibleIdeas.map((idea) => (
            <IdeaCard
              key={idea._id}
              idea={idea}
              onEdit={() => navigate(`/business/ideas/new?edit=${idea._id}`)}
              onDelete={handleDelete}
              onGenerateSwot={() => navigate(`/business/ideas/${idea._id}/swot`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No ideas match these filters"
          message="Try a different search or create a new idea to start building your pipeline."
          actionLabel="Create idea"
          onAction={() => navigate('/business/ideas/new')}
        />
      )}
    </div>
  )
}

export default BusinessIdeasListPage
