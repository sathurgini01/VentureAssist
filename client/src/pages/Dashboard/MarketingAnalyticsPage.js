import { useState } from 'react'
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
import '../../styles/Forms.css'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/mentor-requests', label: 'Mentor Requests', roles: ['mentor', 'admin'] },
  { to: '/dashboard/articles', label: 'Articles' },
  { to: '/profile', label: 'Profile' },
]

const dateRanges = ['7d', '30d', '90d', 'Custom']

const stats = [
  { title: 'Total Impressions', value: '1.24M', change: '+12.4%' },
  { title: 'Clicks', value: '48.2K', change: '+8.1%' },
  { title: 'Conversions', value: '3,480', change: '+6.7%' },
  { title: 'Revenue', value: '$42,860', change: '+14.2%' },
]

const comparisonRows = [
  {
    name: 'Spring Launch Push',
    platform: 'Instagram',
    impressions: '320,000',
    clicks: '12,400',
    conversions: '820',
    roi: '3.8x',
  },
  {
    name: 'Mentor Match Drive',
    platform: 'LinkedIn',
    impressions: '184,000',
    clicks: '8,950',
    conversions: '510',
    roi: '2.9x',
  },
  {
    name: 'Template Promo Series',
    platform: 'Email',
    impressions: '96,000',
    clicks: '5,120',
    conversions: '390',
    roi: '4.1x',
  },
]

function Analytics() {
  const [activeRange, setActiveRange] = useState('30d')

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <p className="page-kicker">Performance Tracking</p>
              <h1 className="page-title">Campaign Analytics</h1>
              <p className="page-subtitle">
                Monitor campaign outcomes, compare channels, and export mock reports.
              </p>
            </div>

            <div className="inline-actions">
              <Button variant="secondary" onClick={() => console.log('Export CSV')}>
                Export CSV
              </Button>
              <Button onClick={() => console.log('Export PDF')}>Export PDF</Button>
            </div>
          </div>

          <Card title="Date Range" subtitle="Preset filters for campaign performance views.">
            <div className="filter-tabs">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  type="button"
                  className={`filter-tab ${activeRange === range ? 'active' : ''}`.trim()}
                  onClick={() => setActiveRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </Card>

          <div className="stats-grid">
            {stats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                trend={stat.change}
              />
            ))}
          </div>

          <div className="page-grid analytics-grid">
            <Card title="Performance Trend" subtitle={`Mock line chart placeholder for ${activeRange} range.`}>
              <div className="chart-placeholder chart-large">
                <div className="chart-lines">
                  <span className="line-segment" />
                  <span className="line-segment line-segment-alt" />
                </div>
                <p className="card-muted">Line chart placeholder: impressions, clicks, conversions over time.</p>
              </div>
            </Card>

            <Card title="Platform Breakdown" subtitle="Mock bar chart for top-performing channels.">
              <div className="chart-placeholder">
                <div className="bar-chart">
                  <span className="bar-item bar-item-one" />
                  <span className="bar-item bar-item-two" />
                  <span className="bar-item bar-item-three" />
                  <span className="bar-item bar-item-four" />
                </div>
                <p className="card-muted">Bar chart placeholder: Instagram, LinkedIn, Email, Google.</p>
              </div>
            </Card>
          </div>

          <Card title="Campaign Comparison" subtitle="Compare campaign efficiency with mock tracking data.">
            <Table
              columns={[
                { key: 'name', label: 'Campaign' },
                { key: 'platform', label: 'Platform' },
                { key: 'impressions', label: 'Impressions' },
                { key: 'clicks', label: 'Clicks' },
                { key: 'conversions', label: 'Conversions' },
                { key: 'roi', label: 'ROI' },
              ]}
              rows={comparisonRows}
            />
          </Card>

          <Card title="Geographic Heatmap" subtitle="Regional campaign response placeholder for future mapping APIs.">
            <div className="chart-placeholder heatmap-placeholder">
              <p className="card-muted">
                Geographic heatmap placeholder with top locations, engagement density, and campaign reach.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Analytics

