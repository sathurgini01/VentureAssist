import { useMemo, useState } from 'react'
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
  const { campaigns, filters, setFilters, deleteCampaign } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const sortedCampaigns = useMemo(() => {
    const filtered = campaigns
      .filter((campaign) =>
        `${campaign.name} ${campaign.status}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      )
      .filter((campaign) =>
        filters.status === 'all' ? true : campaign.status === filters.status,
      )

    return [...filtered].sort((left, right) => left.name.localeCompare(right.name))
  }, [campaigns, searchTerm, filters.status])

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <h1 className="page-title">Campaigns</h1>
              <p className="page-subtitle">View campaign progress and update execution progress.</p>
            </div>
            <NavLink to="/dashboard/campaigns/new">
              <Button>New Campaign</Button>
            </NavLink>
          </div>

          <div className="toolbar-row">
            <input className="search-input" placeholder="Search campaigns" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            <select
              className="form-control"
              value={filters.status}
              onChange={(event) =>
                setFilters((current) => ({ ...current, status: event.target.value }))
              }
            >
              <option value="all">All statuses</option>
              <option value="planned">Planned</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
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
              {
                key: 'progress',
                label: 'Progress',
                render: (value) => `${Number(value || 0)}%`,
              },
              { key: 'clicks', label: 'Clicks' },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <div className="inline-actions">
                    <Button variant="secondary" onClick={() => navigate(`/dashboard/campaigns/${row.id}?mode=view`)}>
                      View
                    </Button>
                    <Button variant="ghost" onClick={() => navigate(`/dashboard/campaigns/${row.id}`)}>
                      Update 
                    </Button>
                    <Button variant="secondary" onClick={() => deleteCampaign(row.id)}>
                      Delete
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





