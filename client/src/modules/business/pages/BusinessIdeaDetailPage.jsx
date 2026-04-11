import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionLink, BusinessPageHeader, DetailItem, MentorIcon, PreviewCard, ProgressBar, SectionCard, SwotQuadrant } from '../components/BusinessComponents'
import { decorateIdea, getIdeaById, getIdeaSwot, getIdeaTracker, getMentorRequests } from '../services/businessService'

function BusinessIdeaDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addToast } = useAppContext()
  const [idea, setIdea] = useState(null)
  const [swot, setSwot] = useState(null)
  const [requests, setRequests] = useState([])
  const [trackerState, setTrackerState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDetail() {
      try {
        setLoading(true)
        setError('')
        const [ideaData, swotData, requestData, trackerData] = await Promise.all([
          getIdeaById(id),
          getIdeaSwot(id).catch(() => null),
          getMentorRequests({ ideaId: id }).catch(() => []),
          getIdeaTracker(id).catch(() => null),
        ])

        if (isMounted) {
          setIdea(decorateIdea(ideaData, swotData))
          setSwot(swotData)
          setRequests(requestData)
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

    loadDetail()

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return <LoadingState title="Loading idea details" description="Collecting the idea brief, SWOT preview, and mentor activity." />
  }

  if (error || !idea) {
    return <ErrorState title="Idea not available" message={error || 'This idea could not be found.'} actionLabel="Back to ideas" onAction={() => navigate('/business/ideas')} />
  }

  const trackerProgress = trackerState?.progressPercent ?? idea.progress

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Idea detail"
        title={idea.title}
        description={idea.shortSummary}
        variant="ideas"
        actions={
          <>
            <ActionLink to={`/business/ideas/new?edit=${idea._id}`} variant="bannerSecondary">
              Edit
            </ActionLink>
            <ActionLink to={`/business/ideas/${idea._id}/tracker`} variant="bannerSecondary">
              Tracker
            </ActionLink>
            <ActionLink to={`/business/ideas/${idea._id}/swot`} variant="banner">
              SWOT
            </ActionLink>
            <ActionLink to={`/business/mentors?ideaId=${idea._id}`} variant="bannerSecondary">
              Request mentor
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Idea overview" subtitle="Every field saved for this business concept.">
        <div className="mb-6 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">Tracker progress</p>
          <ProgressBar value={trackerProgress} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Summary" value={idea.summary} />
          <DetailItem label="Problem" value={idea.problem} />
          <DetailItem label="Solution" value={idea.solution} />
          <DetailItem label="Target customer" value={idea.targetCustomer} />
          <DetailItem label="Location" value={idea.location} />
          <DetailItem label="Uniqueness" value={idea.uniqueness} />
          <DetailItem label="Resources" value={idea.resources} />
          <DetailItem label="Challenges" value={idea.challenges} />
          <DetailItem label="Opportunities" value={idea.opportunities} />
          <DetailItem label="Revenue model" value={idea.revenueModel} />
          <DetailItem label="Next month goal" value={idea.nextMonthGoal} />
          <DetailItem label="Current stage" value={`${idea.stage} (${trackerProgress}% complete)`} />
        </div>
      </SectionCard>

      <SectionCard
        title="SWOT preview"
        subtitle="A compact view of the latest strategic analysis."
        actions={<ActionLink to={`/business/ideas/${idea._id}/swot`}>Open SWOT page</ActionLink>}
      >
        {swot ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SwotQuadrant title="Strengths" tone="Strengths" items={swot.strengths.slice(0, 3)} />
            <SwotQuadrant title="Weaknesses" tone="Weaknesses" items={swot.weaknesses.slice(0, 3)} />
            <SwotQuadrant title="Opportunities" tone="Opportunities" items={swot.opportunities.slice(0, 3)} />
            <SwotQuadrant title="Threats" tone="Threats" items={swot.threats.slice(0, 3)} />
          </div>
        ) : (
          <EmptyState
            title="SWOT not generated yet"
            message="Generate one to surface strengths, weaknesses, opportunities, and threats for this idea."
            actionLabel="Generate SWOT"
            onAction={() => navigate(`/business/ideas/${idea._id}/swot`)}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Mentor request preview"
        subtitle="Recent mentor activity linked to this idea."
        actions={<ActionLink to={`/business/mentors?ideaId=${idea._id}`} variant="secondary">Request mentor</ActionLink>}
      >
        {requests.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {requests.slice(0, 2).map((request) => (
              <PreviewCard
                key={request._id}
                title={request.mentorId?.name || 'Mentor'}
                subtitle={request.status}
                description={request.message}
                meta={request.preferredTime}
                to="/business/mentor-requests"
                icon={<MentorIcon />}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No mentor requests yet"
            message="Connect this idea with a mentor when you are ready for feedback on strategy, execution, or validation."
            actionLabel="Find mentors"
            onAction={() => {
              addToast('Opening the mentor directory for this idea.', 'info')
              navigate(`/business/mentors?ideaId=${idea._id}`)
            }}
          />
        )}
      </SectionCard>
    </div>
  )
}

export default BusinessIdeaDetailPage
