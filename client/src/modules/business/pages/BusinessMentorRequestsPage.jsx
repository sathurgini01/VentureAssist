import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionLink, BusinessPageHeader, MentorRequestCard, SectionCard } from '../components/BusinessComponents'
import { getMentorRequests } from '../services/businessService'

function BusinessMentorRequestsPage() {
  const navigate = useNavigate()
  const { mentorApplications } = useAppContext()
  const [activeTab, setActiveTab] = useState('mine')
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadRequests() {
      try {
        setLoading(true)
        setError('')
        const requestData = await getMentorRequests()

        if (isMounted) {
          setRequests(requestData)
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

  if (loading) {
    return <LoadingState title="Loading mentor requests" description="Collecting both outgoing requests and mentor-facing inbox items." />
  }

  if (error) {
    return <ErrorState title="Mentor requests unavailable" message={error} actionLabel="Retry" onAction={() => window.location.reload()} />
  }

  const myRequests = requests
  const activeRequests = activeTab === 'mine' ? myRequests : mentorApplications

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Mentor requests"
        title="Track outgoing requests and mentor-side decisions"
        description="Track your mentor requests and the admin approval status of your become mentor application in one place."
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
            Admin Approval Status
          </button>
        </div>
      </SectionCard>

      {activeRequests.length ? (
        <div className="space-y-4">
          {activeTab === 'mine'
            ? activeRequests.map((request) => (
                <MentorRequestCard
                  key={request._id}
                  request={request}
                  actions={null}
                />
              ))
            : activeRequests.map((application) => (
                <article key={application.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-bold text-[var(--teal-deep)]">{application.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{application.email}</p>
                      <p className="mt-1 text-sm text-slate-500">Phone: {application.phoneNumber || 'Not provided'}</p>
                      <p className="mt-3 text-sm font-semibold text-slate-700">Application Status</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {application.status === 'approved'
                          ? 'Admin accepted your mentor request.'
                          : application.status === 'rejected'
                            ? 'Admin rejected your mentor request.'
                            : 'Your mentor request is still pending admin review.'}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-slate-700">Expertise / Skills</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{application.expertise || 'Not provided'}</p>
                      <p className="mt-3 text-sm font-semibold text-slate-700">Short Bio / About</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{application.bio || 'Not provided'}</p>
                      <p className="mt-3 text-sm text-slate-500">Applied Date: {application.appliedDate}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Admin message: {application.adminNote || 'Waiting for admin response.'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">
                        {application.status}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      ) : (
        <EmptyState
          title="No requests in this tab yet"
          message={
            activeTab === 'mine'
              ? 'Send a mentor request to populate this view.'
              : 'Submit the become mentor form to track admin approval status here.'
          }
          actionLabel={activeTab === 'mine' ? 'Request a mentor' : 'Become mentor'}
          onAction={() => navigate(activeTab === 'mine' ? '/business/mentors' : '/business/become-mentor')}
        />
      )}
    </div>
  )
}

export default BusinessMentorRequestsPage
