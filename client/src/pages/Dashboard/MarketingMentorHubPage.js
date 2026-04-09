import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext.jsx'
import { deleteMentorRequest, getMentorRequests as getBusinessMentorRequests, getMentors as getBusinessMentors, updateMentorRequestStatus } from '../../modules/business/services/businessService'

const mentorLinks = [
  { to: '/mentor-hub/businessIdea', label: 'Business Idea' },
  { to: '/mentor-hub/marketingDevelopment', label: 'Marketing and Development' },
  { to: '/mentor-hub/law', label: 'Law' },
]

function MentorHub() {
  const { domain = 'businessIdea' } = useParams()
  const { mentorRequests, updateMentorRequest, addToast } = useAppContext()
  const { user } = useAuth()
  const [responseState, setResponseState] = useState({})
  const [businessRequests, setBusinessRequests] = useState([])
  const compactButtonStyle = {
    minHeight: '32px',
    padding: '0.4rem 0.8rem',
    fontSize: '0.8rem',
    boxShadow: 'none',
  }

  useEffect(() => {
    if (domain !== 'businessIdea' || !user?.email) {
      setBusinessRequests([])
      return
    }

    let isMounted = true

    async function loadBusinessRequests() {
      try {
        const [mentorData, requestData] = await Promise.all([getBusinessMentors(), getBusinessMentorRequests()])
        const matchedMentorIds = mentorData
          .filter((mentor) => String(mentor.email || '').toLowerCase() === String(user.email || '').toLowerCase())
          .map((mentor) => mentor._id)

        if (isMounted) {
          setBusinessRequests(requestData.filter((request) => matchedMentorIds.includes(request.mentorId?._id || request.mentorId)))
        }
      } catch (error) {
        if (isMounted) {
          addToast(error.message || 'Unable to load business mentor requests.', 'error')
        }
      }
    }

    loadBusinessRequests()

    return () => {
      isMounted = false
    }
  }, [domain, user?.email])

  const domainRequests = useMemo(() => {
    if (domain === 'businessIdea') {
      return businessRequests
    }

    return mentorRequests.filter((request) => request.domain === domain)
  }, [mentorRequests, domain, businessRequests])

  const updateField = (requestId, key, value) => {
    setResponseState((current) => ({
      ...current,
      [requestId]: { ...(current[requestId] || {}), [key]: value },
    }))
  }

  const handleResponse = async (request, status) => {
    const draft = responseState[request.id || request._id] || {}

    if (domain === 'businessIdea') {
      try {
        await updateMentorRequestStatus(request._id, {
          status: status === 'accepted' ? 'Accepted' : 'Rejected',
          mentorNote: draft.reply || '',
        })
        setBusinessRequests((current) =>
          current.map((item) =>
            item._id === request._id
              ? { ...item, status: status === 'accepted' ? 'Accepted' : 'Rejected', mentorNote: draft.reply || '' }
              : item,
          ),
        )
        addToast(`Business mentor request ${status}.`, 'success')
      } catch (error) {
        addToast(error.message || 'Unable to update business mentor request.', 'error')
      }
      return
    }

    await updateMentorRequest(request.id, {
      status,
      reply: draft.reply || '',
      scheduledDateTime: draft.scheduledDateTime || null,
      meetingUrl: draft.meetingUrl || '',
    })
  }

  const handleBusinessDelete = async (requestId) => {
    try {
      await deleteMentorRequest(requestId)
      setBusinessRequests((current) => current.filter((item) => item._id !== requestId))
      addToast('Business mentor request deleted.', 'success')
    } catch (error) {
      addToast(error.message || 'Unable to delete business mentor request.', 'error')
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={mentorLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack">
          <div>
            <h1 className="page-title">Mentor Hub</h1>
            <p className="page-subtitle">Review and respond to mentoring requests by category.</p>
          </div>

          {domainRequests.length > 0 ? domainRequests.map((request) => {
            const requestId = request.id || request._id
            const requestStatus = request.status || 'Pending'
            const requestTitle = domain === 'businessIdea' ? (request.ideaId?.title || 'General business support') : request.topic
            const requestSubtitle = domain === 'businessIdea'
              ? `Mentor request for ${request.mentorId?.name || 'assigned mentor'}`
              : `Requested by ${request.userName}`

            return (
              <Card key={requestId} title={requestTitle} subtitle={requestSubtitle}>
                <div className="section-stack">
                  {domain === 'businessIdea' ? (
                    <>
                      <p className="card-muted"><strong>Sent by:</strong> {request.userName || 'User not available'}</p>
                      <p className="card-muted"><strong>User email:</strong> {request.userEmail || 'Not provided'}</p>
                      <p className="card-muted"><strong>Mentor:</strong> {request.mentorId?.name || 'Mentor not available'}</p>
                      <p className="card-muted"><strong>Preferred time:</strong> {request.preferredTime || 'N/A'}</p>
                      <p className="card-muted"><strong>Message:</strong> {request.message || 'No message provided'}</p>
                      <p className="card-muted"><strong>Status:</strong> {requestStatus}</p>
                      {request.mentorNote ? <p className="card-muted"><strong>Mentor note:</strong> {request.mentorNote}</p> : null}
                    </>
                  ) : (
                    <>
                      <p className="card-muted">Preferred: {request.preferredTime || 'N/A'}</p>
                      <p className="card-muted">Message: {request.message}</p>
                      <p className="card-muted">Status: {requestStatus}</p>
                    </>
                  )}

                  <label className="form-label">
                    {domain === 'businessIdea' ? 'Reply / Mentor Note' : 'Description / Reply'}
                    <textarea
                      className="form-control"
                      rows={3}
                      value={responseState[requestId]?.reply || ''}
                      onChange={(event) => updateField(requestId, 'reply', event.target.value)}
                    />
                  </label>

                  {domain !== 'businessIdea' ? (
                    <>
                      <label className="form-label">
                        Meeting Date & Time
                        <input
                          type="datetime-local"
                          className="form-control"
                          value={responseState[requestId]?.scheduledDateTime || ''}
                          onChange={(event) => updateField(requestId, 'scheduledDateTime', event.target.value)}
                        />
                      </label>

                      <label className="form-label">
                        Meeting URL
                        <input
                          className="form-control"
                          placeholder="https://meet.google.com/..."
                          value={responseState[requestId]?.meetingUrl || ''}
                          onChange={(event) => updateField(requestId, 'meetingUrl', event.target.value)}
                        />
                      </label>
                    </>
                  ) : null}

                  <div className="inline-actions">
                    {domain === 'businessIdea' && requestStatus !== 'Pending' ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleBusinessDelete(request._id)}
                        style={{ ...compactButtonStyle, background: '#dc2626', color: '#fff' }}
                      >
                        Delete
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleResponse(request, 'accepted')}
                          style={{ ...compactButtonStyle, background: '#16a34a', color: '#fff' }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleResponse(request, 'rejected')}
                          style={{ ...compactButtonStyle, background: '#dc2626', color: '#fff' }}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            )
          }) : (
            <Card title="No Requests" subtitle="No mentoring requests in this category yet." />
          )}
        </div>
      </div>
    </div>
  )
}

export default MentorHub
