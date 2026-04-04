import { useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function Campaigns() {
  const navigate = useNavigate()
  const { campaigns, searchQuery, filters, setFilters } = useAppContext()
  const sortedCampaigns = useMemo(() => {
    const filtered = campaigns
      .filter((campaign) =>
        `${campaign.name} ${campaign.platform} ${campaign.status}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      )
      .filter((campaign) =>
        filters.status === 'all' ? true : campaign.status === filters.status,
      )

    return [...filtered].sort((left, right) => left.name.localeCompare(right.name))
  }, [campaigns, searchQuery, filters.status])

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <h1 className="page-title">Campaigns</h1>
              <p className="page-subtitle">Campaign listing and status placeholders.</p>
            </div>
            <NavLink to="/dashboard/campaigns/new">
              <Button>New Campaign</Button>
            </NavLink>
          </div>

          <div className="toolbar-row">
            <input className="search-input" placeholder="Search campaigns" value={searchQuery} readOnly />
            <select
              className="form-control"
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({ ...current, status: event.target.value }))
              }
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <Table
            columns={[
              { key: 'name', label: 'Name' },
              {
                key: 'status',
                label: 'Status',
                render: (value) => (
                  <span className={`status-badge status-${value}`}>{value}</span>
                ),
              },
              { key: 'platform', label: 'Platform' },
              { key: 'impressions', label: 'Impressions' },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <div className="inline-actions">
                    <Button variant="secondary" onClick={() => navigate(`/dashboard/campaigns/${row.id}`)}>
                      View
                    </Button>
                    <Button variant="ghost" onClick={() => navigate(`/dashboard/campaigns/${row.id}/edit`)}>
                      Edit
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={sortedCampaigns}
          />
        </div>
      </div>
    </div>
  )
}

export default Campaigns

