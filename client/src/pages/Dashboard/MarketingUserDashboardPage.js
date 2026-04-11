import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import Table from '../../components/Table'
import VentureGreetingBanner from '../../components/VentureGreetingBanner'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext.jsx'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function UserDashboard() {
  const { user } = useAuth()
  const { campaigns, mentorRequests, addToast } = useAppContext()
  const [showActionModal, setShowActionModal] = useState(false)

  const pendingRequests = useMemo(
    () => mentorRequests.filter((item) => item.status === 'pending'),
    [mentorRequests],
  )

  const confirmedSessions = useMemo(
    () => mentorRequests.filter((item) => item.status === 'accepted'),
    [mentorRequests],
  )

  const stats = useMemo(
    () => [
      {
        label: 'Total Campaigns',
        value: campaigns.length,
        helper: 'All campaign records in your workspace.',
      },
      {
        label: 'Pending Requests',
        value: pendingRequests.length,
        helper: 'Mentor requests waiting for responses.',
      },
      {
        label: 'Confirmed Sessions',
        value: confirmedSessions.length,
        helper: 'Approved sessions with mentors.',
      },
    ],
    [campaigns.length, pendingRequests.length, confirmedSessions.length],
  )

  const recentCampaigns = useMemo(
    () => [...campaigns].slice(0, 5),
    [campaigns],
  )

  const scrollToSessions = () => {
    const target = document.getElementById('my-sessions-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content dashboard-panel">
          <VentureGreetingBanner />

          <section className="hero-layout">
            <Card>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">
                Track campaign activity, mentor engagement, and your next actions.
              </p>

              <div className="workspace-focus-card">
                <span className="workspace-focus-label">Workspace Focus</span>
                <div className="workspace-focus-tags">
                  <span>Launch Smarter</span>
                  <span>Track Progress</span>
                  <span>Book Mentors</span>
                </div>
              </div>

              <p className="dashboard-intro-copy">
                Everything in this workspace is aligned around execution: create campaigns,
                monitor traction, connect with mentors, and keep your next steps visible.
              </p>

              <div className="section-stack compact-stack">
                <div className="inline-actions action-row-primary">
                  <NavLink to="/dashboard/templates">
                    <Button>New Campaign</Button>
                  </NavLink>
                  <NavLink to="/dashboard/templates">
                    <Button variant="secondary">Browse Templates</Button>
                  </NavLink>
                  <NavLink to="/dashboard/mentors">
                    <Button variant="secondary">Find Mentor</Button>
                  </NavLink>
                </div>

                <div className="inline-actions action-row-secondary">
                  <NavLink to="/dashboard/analytics">
                    <Button variant="ghost">View Analytics</Button>
                  </NavLink>
                  <Button variant="ghost" onClick={scrollToSessions}>My Sessions</Button>
                  <NavLink to="/dashboard/become-mentor">
                    <Button variant="secondary">Become a Mentor</Button>
                  </NavLink>
                  {String(user?.role || '').toLowerCase() === 'mentor' ? (
                    <NavLink to="/mentor-hub/businessIdea">
                      <Button variant="secondary">Mentor Hub</Button>
                    </NavLink>
                  ) : null}
                </div>
              </div>
            </Card>
          </section>

          <section className="page-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-stat-card">
                <StatsCard label={stat.label} value={stat.value} helper={stat.helper} />
              </div>
            ))}
          </section>

          <section className="dashboard-split">
            <Card title="Recent Campaigns" subtitle="Latest campaign records in your account.">
              <Table
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'status', label: 'Status' },
                  { key: 'platform', label: 'Platform' },
                  { key: 'impressions', label: 'Impressions' },
                  {
                    key: 'actions',
                    label: 'Actions',
                    render: (_, row) => (
                      <Button variant="secondary" onClick={() => addToast(`Viewing ${row.name}`)}>
                        View
                      </Button>
                    ),
                  },
                ]}
                rows={recentCampaigns}
              />
            </Card>

            <Card title="Pending Requests" subtitle="Mentor session requests waiting for review.">
              <div className="session-list">
                {pendingRequests.length > 0 ? pendingRequests.map((request) => (
                  <div key={request.id} className="session-item">
                    <strong>{request.mentorName}</strong>
                    <span className="session-meta">{request.topic}</span>
                    <span className="session-meta">{request.preferredDateTime || request.preferredTime || 'To be confirmed'}</span>
                    <span className="badge">Pending</span>
                  </div>
                )) : (
                  <div className="session-item">
                    <strong>No pending requests</strong>
                    <span className="session-meta">Book a mentor session to see it here.</span>
                  </div>
                )}
              </div>
            </Card>
          </section>

          <section id="my-sessions-section" className="dashboard-split">
            <Card title="Confirmed Sessions" subtitle="Accepted sessions and meeting details.">
              <div className="session-list">
                {confirmedSessions.length > 0 ? confirmedSessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <strong>{session.mentorName}</strong>
                    <span className="session-meta">{session.topic}</span>
                    <span className="session-meta">{session.confirmedDateTime || session.preferredDateTime || 'Time pending'}</span>
                    <span className="badge">{session.medium || 'Online'}</span>
                  </div>
                )) : (
                  <div className="session-item">
                    <strong>No confirmed sessions</strong>
                    <span className="session-meta">Accepted mentor sessions will appear here.</span>
                  </div>
                )}
              </div>
            </Card>

            <Card title="Quick Actions" subtitle="Shortcuts for your next step.">
              <div className="inline-actions">
                <Button onClick={() => setShowActionModal(true)}>Open Action Center</Button>
                <NavLink to="/dashboard/become-mentor">
                  <Button variant="secondary">Open Mentor Application</Button>
                </NavLink>
              </div>
            </Card>
          </section>

          <Card title="Workspace Navigation" subtitle="Quick links for the founder workflow.">
            <div className="quick-actions">
              {dashboardLinks.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  <Button variant="ghost">{link.label}</Button>
                </NavLink>
              ))}
              <NavLink to="/dashboard/become-mentor">
                <Button variant="ghost">Become a Mentor</Button>
              </NavLink>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showActionModal} title="Quick Action Placeholder">
        <p className="card-muted">
          This modal is a placeholder for campaign creation shortcuts, AI prompts, or mentor booking actions.
        </p>
        <div className="inline-actions">
          <Button onClick={() => setShowActionModal(false)}>Close</Button>
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Keep Exploring
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default UserDashboard