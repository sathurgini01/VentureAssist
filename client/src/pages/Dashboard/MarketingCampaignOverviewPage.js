import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import Table from '../../components/Table'
import '../../styles/MarketingDashboard.css'
import '../../styles/Cards.css'
import '../../styles/Buttons.css'
import '../../styles/Tables.css'

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/admin/campaign-overview', label: 'Campaign Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/mentor-applications', label: 'Mentor Apps' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/settings', label: 'Settings' },
]

const overviewStats = [
  { title: 'Active Campaigns', value: '28', trend: '+4 this week' },
  { title: 'Paused / Draft', value: '11', trend: '6 paused, 5 draft' },
  { title: 'Total Spend', value: '$128,400', trend: '+9.8%' },
  { title: 'Average ROI', value: '3.4x', trend: '+0.6x' },
]

const topCampaigns = [
  {
    name: 'Startup Launch Sprint',
    owner: 'Ayesha Fernando',
    platform: 'Instagram',
    status: 'Active',
    impressions: '410,000',
    spend: '$12,400',
    roi: '4.2x',
  },
  {
    name: 'Mentor Discovery Week',
    owner: 'Nadia Perera',
    platform: 'LinkedIn',
    status: 'Active',
    impressions: '238,000',
    spend: '$8,100',
    roi: '3.6x',
  },
  {
    name: 'Template Conversion Push',
    owner: 'Liam Santos',
    platform: 'Email',
    status: 'Draft',
    impressions: '92,000',
    spend: '$2,950',
    roi: '2.8x',
  },
  {
    name: 'Founder Visibility Drive',
    owner: 'Amina Rahman',
    platform: 'Google',
    status: 'Paused',
    impressions: '186,000',
    spend: '$6,700',
    roi: '2.4x',
  },
]

function CampaignOverview() {
  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <p className="page-kicker">Admin Overview</p>
              <h1 className="page-title">Platform Campaign Overview</h1>
              <p className="page-subtitle">
                Review platform-wide campaign health, spend efficiency, and top performers.
              </p>
            </div>

            <div className="inline-actions">
              <Button variant="secondary" onClick={() => console.log('Open filters')}>
                Filters
              </Button>
              <Button onClick={() => console.log('Open report builder')}>
                Generate Report
              </Button>
            </div>
          </div>

          <div className="stats-grid">
            {overviewStats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
              />
            ))}
          </div>

          <Card title="Top Performing Campaigns" subtitle="Mock ranking of campaigns across the platform.">
            <Table
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'owner', label: 'Owner' },
                { key: 'platform', label: 'Platform' },
                { key: 'status', label: 'Status' },
                { key: 'impressions', label: 'Impressions' },
                { key: 'spend', label: 'Spend' },
                { key: 'roi', label: 'ROI' },
              ]}
              rows={topCampaigns}
            />
          </Card>

          <div className="page-grid analytics-grid">
            <Card title="Platform Distribution" subtitle="Mock visualization of campaign mix by channel.">
              <div className="chart-placeholder">
                <div className="bar-chart">
                  <span className="bar-item bar-item-one" />
                  <span className="bar-item bar-item-two" />
                  <span className="bar-item bar-item-three" />
                  <span className="bar-item bar-item-four" />
                </div>
                <p className="card-muted">
                  Placeholder for campaign distribution across Instagram, LinkedIn, Email, and Google.
                </p>
              </div>
            </Card>

            <Card title="Status Breakdown" subtitle="Mock summary of active, paused, and draft campaign mix.">
              <div className="chart-placeholder">
                <div className="activity-log">
                  <div className="activity-item">
                    <strong>Active</strong>
                    <p className="card-muted">28 campaigns currently running.</p>
                  </div>
                  <div className="activity-item">
                    <strong>Paused</strong>
                    <p className="card-muted">6 campaigns temporarily paused.</p>
                  </div>
                  <div className="activity-item">
                    <strong>Draft</strong>
                    <p className="card-muted">5 campaigns waiting for launch.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignOverview

