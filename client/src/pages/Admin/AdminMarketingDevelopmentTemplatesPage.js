import { NavLink } from 'react-router-dom'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

function AdminMarketingDevelopmentTemplatesPage() {
  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack">
          <div>
            <p className="page-kicker">Admin Module</p>
            <h1 className="page-title">Marketing & Development</h1>
            <p className="page-subtitle">Manage marketing content module pages.</p>
          </div>

          <div className="filter-tabs">
            <NavLink to="/admin/marketing-development/articles" className="filter-tab">
              Articles
            </NavLink>
            <NavLink to="/admin/marketing-development/templates" className="filter-tab active">
              Templates
            </NavLink>
          </div>

          <Card
            title="Templates"
            subtitle="Marketing template management area (separate page)."
          />
        </div>
      </div>
    </div>
  )
}

export default AdminMarketingDevelopmentTemplatesPage
