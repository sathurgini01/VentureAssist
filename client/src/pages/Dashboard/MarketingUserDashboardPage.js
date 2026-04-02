import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import Table from '../../components/Table'
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

function UserDashboard() {
  const { addToast, campaigns, mentorRequests, userInfo } = useAppContext()
  const [showActionModal, setShowActionModal] = useState(false)
  const focusItems = ['Launch Smarter', 'Track Progress', 'Book Mentors']

  const scrollToSessions = () => {
    document.getElementById('my-sessions-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const recentCampaigns = useMemo(
    () => [
      ...campaigns.slice(0, 3).map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        platform: campaign.platform,
        impressions: campaign.impressions,
      })),
    ],
    [campaigns],
  )

  const pendingRequests = useMemo(
    () =>
      mentorRequests.filter(
        (request) =>
          request.status === 'pending' &&
          request.userId === (userInfo?.id ?? 'guest-user'),
      ),
    [mentorRequests, userInfo?.id],
  )

  const confirmedSessions = useMemo(
    () =>
      mentorRequests.filter(
        (request) =>
          request.status === 'accepted' &&
          request.userId === (userInfo?.id ?? 'guest-user'),
      ),
    [mentorRequests, userInfo?.id],
  )

  const stats = useMemo(
    () => [
      { label: 'Active Campaigns', value: String(campaigns.length).padStart(2, '0'), helper: 'Current mock workspace' },
      { label: 'Total Impressions', value: '148K', helper: 'Across all platforms' },
      { label: 'Mentor Sessions', value: String(confirmedSessions.length).padStart(2, '0'), helper: 'Confirmed sessions' },
      { label: 'AI Credits', value: '320', helper: 'Mock balance' },
    ],
    [campaigns.length, confirmedSessions.length],
  )

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <section className="dashboard-hero">
            <div className="hero-primary-panel">
              <Card
                title="Dashboard"
                subtitle="Track campaign activity, mentor engagement, and your next actions."
              >
                <div className="hero-copy">
                  <div className="dashboard-hero-ribbon">
                    <span className="dashboard-hero-kicker">Workspace Focus</span>
                    <div className="dashboard-hero-tags">
                      {focusItems.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <p className="card-muted">
                    Everything in this workspace is aligned around execution: create campaigns, monitor traction,
                    connect with mentors, and keep your next steps visible.
                  </p>
                  <div className="quick-actions">
                    <NavLink to="/dashboard/campaigns/new">
                      <Button>New Campaign</Button>
                    </NavLink>
                    <NavLink to="/dashboard/templates">
                      <Button variant="secondary">Browse Templates</Button>
                    </NavLink>
                    <NavLink to="/dashboard/mentors">
                      <Button variant="secondary">Find Mentor</Button>
                    </NavLink>
                    <NavLink to="/dashboard/analytics">
                      <Button variant="ghost">View Analytics</Button>
                    </NavLink>
                    <Button variant="ghost" onClick={scrollToSessions}>My Sessions</Button>
                    <NavLink to="/dashboard/become-mentor">
                      <Button variant="secondary">Become a Mentor</Button>
                    </NavLink>
                  </div>
                </div>
              </Card>
            </div>

            <div className="hero-secondary-panel">
              <Card
                title="Session Snapshot"
                subtitle="A cleaner overview of your mentorship activity."
              >
                <div className="section-stack compact-stack">
                  <div className="session-stat-row">
                    <div className="session-stat">
                      <strong>{pendingRequests.length}</strong>
                      <span className="card-muted">Pending requests</span>
                    </div>
                    <div className="session-stat">
                      <strong>{confirmedSessions.length}</strong>
                      <span className="card-muted">Confirmed sessions</span>
                    </div>
                  </div>
                  <div className="inline-actions">
                    <Button variant="secondary" onClick={scrollToSessions}>
                      Open My Sessions
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        addToast('Session planner placeholder opened.')
                        setShowActionModal(true)
                      }}
                    >
                      Session Planner
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="page-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-stat-card">
                <StatsCard
                  label={stat.label}
                  value={stat.value}
                  helper={stat.helper}
                />
              </div>
            ))}
          </section>

          <section className="dashboard-split">
            <Card
              title="Recent Campaigns"
              subtitle="Mock table placeholder ready for future API data."
            >
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
                      <Button
                        variant="secondary"
                        onClick={() => addToast(`Viewing ${row.name}`)}
                      >
                        View
                      </Button>
                    ),
                  },
                ]}
                rows={recentCampaigns}
              />
            </Card>

            <Card
              title="Pending Requests"
              subtitle="Mentor session requests waiting for review."
            >
              <div className="session-list">
                {pendingRequests.length > 0 ? pendingRequests.map((request) => (
                  <div key={request.id} className="session-item">
                    <strong>{request.mentorName}</strong>
                    <span className="session-meta">{request.topic}</span>
                    <span className="session-meta">{request.preferredTime}</span>
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
            <Card
              title="Confirmed Sessions"
              subtitle="Accepted sessions and their confirmed meeting details."
            >
              <div className="session-list">
                {confirmedSessions.length > 0 ? confirmedSessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <strong>{session.mentorName}</strong>
                    <span className="session-meta">{session.topic}</span>
                    <span className="session-meta">{session.confirmedDateTime}</span>
                    <span className="badge">{session.medium}</span>
                  </div>
                )) : (
                  <div className="session-item">
                    <strong>No confirmed sessions</strong>
                    <span className="session-meta">Accepted mentor sessions will appear here.</span>
                  </div>
                )}
              </div>
            </Card>

            <Card
              title="Mentor Application"
              subtitle="Interested in mentoring founders on the platform?"
            >
              <p className="card-muted">
                Share your background, expertise, availability, and pricing through the mentor application form.
              </p>
              <div className="inline-actions">
                <NavLink to="/dashboard/become-mentor">
                  <Button>Open Application</Button>
                </NavLink>
              </div>
            </Card>
          </section>

          <Card
            title="Workspace Navigation"
            subtitle="Quick links for the main founder workflow."
          >
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

