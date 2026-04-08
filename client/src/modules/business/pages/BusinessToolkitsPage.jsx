import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionLink, BusinessPageHeader, PreviewCard, SectionCard, ToolkitIcon } from '../components/BusinessComponents'
import { getToolkits } from '../services/businessService'

function BusinessToolkitsPage() {
  const navigate = useNavigate()
  const [toolkits, setToolkits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let isMounted = true

    async function loadToolkits() {
      try {
        setLoading(true)
        setError('')
        const data = await getToolkits()

        if (isMounted) {
          startTransition(() => {
            setToolkits(data)
          })
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

    loadToolkits()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleToolkits = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase()

    return toolkits.filter((toolkit) => {
      return (
        !search ||
        toolkit.title.toLowerCase().includes(search) ||
        toolkit.category.toLowerCase().includes(search) ||
        toolkit.description.toLowerCase().includes(search)
      )
    })
  }, [deferredQuery, toolkits])

  if (loading) {
    return <LoadingState title="Loading toolkits" description="Gathering the planning and validation resources available to founders." />
  }

  if (error) {
    return <ErrorState title="Toolkit library unavailable" message={error} actionLabel="Retry" onAction={() => window.location.reload()} />
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Toolkit library"
        title="Templates and guides for sharper validation work"
        description="Browse practical toolkits for market research, planning, customer understanding, and structured business analysis."
        variant="toolkits"
        actions={
          <>
            <ActionLink to="/business" variant="bannerSecondary">
              Back to dashboard
            </ActionLink>
            <ActionLink to="/business/ideas" variant="banner">
              Open ideas
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Search toolkits" subtitle="Filter the library by title, category, or description.">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search toolkits"
          className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
      </SectionCard>

      {visibleToolkits.length ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {visibleToolkits.map((toolkit) => (
            <PreviewCard
              key={toolkit._id}
              title={toolkit.title}
              subtitle={toolkit.category}
              description={toolkit.description}
              meta="Toolkit"
              to={`/business/toolkits/${toolkit._id}`}
              icon={<ToolkitIcon />}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No toolkits match that search"
          message="Try a broader search term or revisit the library later."
          actionLabel="Reset search"
          onAction={() => {
            setQuery('')
            navigate('/business/toolkits')
          }}
        />
      )}
    </div>
  )
}

export default BusinessToolkitsPage
