import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'

const mentorLinks = [
  { to: '/mentor-hub/businessIdea', label: 'Business Idea' },
  { to: '/mentor-hub/marketingDevelopment', label: 'Marketing and Development' },
  { to: '/mentor-hub/law', label: 'Law' },
]

function MentorHub() {
  const { domain = 'businessIdea' } = useParams()
  const { mentorRequests, updateMentorRequest } = useAppContext()
  const [responseState, setResponseState] = useState({})

  const domainRequests = useMemo(
    () => mentorRequests.filter((request) => request.domain === domain),
    [mentorRequests, domain],
  )

  const updateField = (requestId, key, value) => {
    setResponseState((current) => ({
      ...current,
      [requestId]: { ...(current[requestId] || {}), [key]: value },
    }))
  }

  const handleResponse = async (request, status) => {
    const draft = responseState[request.id] || {}
    await updateMentorRequest(request.id, {
      status,
      reply: draft.reply || '',
      scheduledDateTime: draft.scheduledDateTime || null,
      meetingUrl: draft.meetingUrl || '',
    })
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

          {domainRequests.length > 0 ? domainRequests.map((request) => (
            <Card key={request.id} title={request.topic} subtitle={`Requested by ${request.userName}`}>
              <p className="card-muted">Preferred: {request.preferredTime || 'N/A'}</p>
              <p className="card-muted">Message: {request.message}</p>
              <p className="card-muted">Status: {request.status}</p>

              <div className="section-stack">
                <label className="form-label">
                  Meeting Date & Time
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={responseState[request.id]?.scheduledDateTime || ''}
                    onChange={(event) => updateField(request.id, 'scheduledDateTime', event.target.value)}
                  />
                </label>

                <label className="form-label">
                  Meeting URL
                  <input
                    className="form-control"
                    placeholder="https://meet.google.com/..."
                    value={responseState[request.id]?.meetingUrl || ''}
                    onChange={(event) => updateField(request.id, 'meetingUrl', event.target.value)}
                  />
                </label>

                <label className="form-label">
                  Description / Reply
                  <textarea
                    className="form-control"
                    rows={3}
                    value={responseState[request.id]?.reply || ''}
                    onChange={(event) => updateField(request.id, 'reply', event.target.value)}
                  />
                </label>

                <div className="inline-actions">
                  <Button onClick={() => handleResponse(request, 'accepted')}>Approve & Send Details</Button>
                  <Button variant="secondary" onClick={() => handleResponse(request, 'rejected')}>Reject</Button>
                </div>
              </div>
            </Card>
          )) : (
            <Card title="No Requests" subtitle="No mentoring requests in this category yet." />
          )}
        </div>
      </div>
    </div>
  )
}

export default MentorHub
