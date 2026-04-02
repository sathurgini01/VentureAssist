import { useMemo } from 'react'
import Button from '../../components/Button'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/mentor-requests', label: 'Mentor Requests', roles: ['mentor', 'admin'] },
  { to: '/dashboard/articles', label: 'Articles' },
]

function MentorRequests() {
  const { user } = useAuth()
  const { mentorRequests, updateMentorRequest } = useAppContext()

  const requests = useMemo(
    () =>
      mentorRequests.filter(
        (request) =>
          request.status === 'pending' &&
          (!user?.name || request.mentorName === user.name || user.role?.toLowerCase() === 'admin'),
      ),
    [mentorRequests, user],
  )

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Mentor Requests</h1>
            <p className="page-subtitle">Review incoming mentoring requests and confirm sessions for founders.</p>
          </div>

          <Table
            columns={[
              { key: 'userName', label: 'User' },
              { key: 'topic', label: 'Topic' },
              { key: 'preferredTime', label: 'Requested Date/Time' },
              { key: 'message', label: 'Message' },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <div className="inline-actions">
                    <Button onClick={() => updateMentorRequest(row.id, 'accepted')}>Accept</Button>
                    <Button variant="secondary" onClick={() => updateMentorRequest(row.id, 'declined')}>
                      Decline
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={requests}
            emptyMessage="No pending requests yet."
          />
        </div>
      </div>
    </div>
  )
}

export default MentorRequests

