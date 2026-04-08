import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionButton, ActionLink, BusinessPageHeader, MentorRequestCard, SectionCard } from '../components/BusinessComponents'
import { getMentorRequests, getMentors, updateMentorRequestStatus } from '../services/businessService'

function BusinessMentorRequestsPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [activeTab, setActiveTab] = useState('mine')
  const [requests, setRequests] = useState([])
  const [mentors, setMentors] = useState([])
  const [mentorFilter, setMentorFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadRequests() {
      try {
        setLoading(true)
        setError('')
        const [requestData, mentorData] = await Promise.all([getMentorRequests(), getMentors().catch(() => [])])

        if (isMounted) {
          setRequests(requestData)
          setMentors(mentorData)
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

    loadRequests()

    return () => {
      isMounted = false
    }
  }, [])

  async function refreshRequests() {
    const requestData = await getMentorRequests()
    setRequests(requestData)
  }

  async function handleStatusUpdate(requestId, status) {
    try {
      await updateMentorRequestStatus(requestId, { status })
      await refreshRequests()
      addToast(`Request marked as ${status.toLowerCase()}.`, 'success')
    } catch (updateError) {
      addToast(updateError.message, 'error')
    }
  }

  if (loading) {
    return <LoadingState title="Loading mentor requests" description="Collecting both outgoing requests and mentor-facing inbox items." />
  }

  if (error) {
    return <ErrorState title="Mentor requests unavailable" message={error} actionLabel="Retry" onAction={() => window.location.reload()} />
  }

  const myRequests = requests
  const requestsToMe = mentorFilter ? requests.filter((request) => request.mentorId?._id === mentorFilter) : requests
  const activeRequests = activeTab === 'mine' ? myRequests : requestsToMe

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Mentor requests"
        title="Track outgoing requests and mentor-side decisions"
        description="Switch between the founder view of sent requests and the mentor-facing view for triage and status updates."
        variant="requests"
        actions={
          <>
            <ActionLink to="/business/mentors" variant="banner">
              Find mentors
            </ActionLink>
            <ActionLink to="/business" variant="bannerSecondary">
              Back to dashboard
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Request inbox" subtitle="Use the tabs to switch perspectives.">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('mine')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'mine'
                ? 'bg-[linear-gradient(135deg,var(--teal-mid),var(--teal-deep))] text-white shadow-[0_12px_24px_rgba(26,74,69,0.18)]'
                : 'border border-[rgba(45,107,100,0.14)] bg-white/80 text-[var(--teal-deep)] hover:bg-white'
            }`}
          >
            My Requests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('toMe')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'toMe'
                ? 'bg-[linear-gradient(135deg,var(--teal-mid),var(--teal-deep))] text-white shadow-[0_12px_24px_rgba(26,74,69,0.18)]'
                : 'border border-[rgba(45,107,100,0.14)] bg-white/80 text-[var(--teal-deep)] hover:bg-white'
            }`}
          >
            Requests to Me
          </button>
          {activeTab === 'toMe' ? (
            <select
              value={mentorFilter}
              onChange={(event) => setMentorFilter(event.target.value)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="">All mentors</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.name}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </SectionCard>

      {activeRequests.length ? (
        <div className="space-y-4">
          {activeRequests.map((request) => (
            <MentorRequestCard
              key={request._id}
              request={request}
              actions={
                activeTab === 'toMe' ? (
                  <div className="flex gap-2">
                    <ActionButton onClick={() => handleStatusUpdate(request._id, 'Accepted')}>
                      Accept
                    </ActionButton>
                    <ActionButton onClick={() => handleStatusUpdate(request._id, 'Rejected')} variant="danger">
                      Reject
                    </ActionButton>
                  </div>
                ) : null
              }
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No requests in this tab yet"
          message="Send a mentor request or adjust the mentor filter to populate this view."
          actionLabel="Request a mentor"
          onAction={() => navigate('/business/mentors')}
        />
      )}
    </div>
  )
}

export default BusinessMentorRequestsPage
