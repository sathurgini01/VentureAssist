import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

const adminModules = [
  {
    title: 'Business Idea Management',
    subtitle: 'Open mentor and toolkit management for the business module.',
    to: '/admin/business-idea-management',
  },
  {
    title: 'Marketing & Development',
    subtitle: 'Open module pages for Articles and Templates.',
    to: '/admin/marketing-development/articles',
  },
  {
    title: 'Law Management',
    subtitle: 'Will be linked later.',
    disabled: true,
  },
  {
    title: 'Finance Management',
    subtitle: 'Will be linked later.',
    disabled: true,
  },
]

function AdminDashboardPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack admin-dashboard-surface">
          <Card className="admin-dashboard-hero" title="Admin Dashboard" subtitle="Manage platform modules from one clean workspace.">
            <div className="admin-dashboard-hero-meta">
              <span className="admin-status-pill">Admin Control Center</span>
              <p className="card-muted">Use the module cards below. Marketing & Development is active, other modules are staged for later linking.</p>
            </div>
          </Card>

          <div>
            <p className="page-kicker">Modules</p>
            <h2 className="page-title">Management Areas</h2>
            <p className="page-subtitle">Simple, professional, and ready for expansion.</p>
          </div>

          <div className="page-grid admin-module-grid">
            {adminModules.map((module) => (
              <Card key={module.title} className="admin-module-card" title={module.title} subtitle={module.subtitle}>
                <div className="admin-module-footer">
                {module.to ? (
                  <NavLink to={module.to}>
                    <Button>Open</Button>
                  </NavLink>
                ) : (
                  <Button variant="secondary" disabled>
                    Coming Soon
                  </Button>
                )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
