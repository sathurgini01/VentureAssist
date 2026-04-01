import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import { useAppContext } from '../../context/AppContext'

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

function CampaignDetails() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, createCampaign, addToast } = useAppContext()
  const campaign =
    campaigns.find((item) => item.id === campaignId) ?? campaigns[0]
  const metrics = useMemo(
    () => [
      { label: 'Impressions', value: '64.8K', helper: 'Trend up 12%' },
      { label: 'Clicks', value: '3,420', helper: 'CTR placeholder' },
      { label: 'Conversions', value: '214', helper: 'Goal actions' },
      { label: 'Spend', value: '$860', helper: 'Mock spend' },
    ],
    [],
  )

  const activity = useMemo(
    () => [
      'Creative assets uploaded to the campaign workspace.',
      'Audience segment refined for startup founders in Colombo.',
      'Campaign paused for copy review and re-approval.',
    ],
    [],
  )

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <h1 className="page-title">Campaign Details</h1>
              <p className="page-subtitle">Viewing mock analytics for campaign ID: {campaignId}</p>
            </div>
            <div className="inline-actions">
              <Button variant="secondary" onClick={() => navigate(`/dashboard/campaigns/${campaign?.id ?? campaignId}/edit`)}>
                Edit
              </Button>
              <Button
                onClick={() =>
                  createCampaign({
                    campaignName: `${campaign?.name ?? 'Campaign'} Copy`,
                    description: campaign?.description ?? '',
                    platform: campaign?.platform ?? 'Instagram',
                    startDate: campaign?.startDate ?? '2026-04-01',
                    endDate: campaign?.endDate ?? '2026-04-15',
                    budget: campaign?.budget ?? '$1000',
                    cta: campaign?.cta ?? 'Learn more',
                    headline: campaign?.name ?? 'Campaign Copy',
                    body: campaign?.description ?? '',
                    interests: ['Startups'],
                  })
                }
              >
                Duplicate
              </Button>
            </div>
          </div>

          <Card title={campaign?.name ?? 'Campaign'} subtitle={campaign?.description ?? 'Performance overview with mock placeholders.'}>
            <span className={`status-badge status-${campaign?.status ?? 'active'}`}>{campaign?.status ?? 'active'}</span>
          </Card>

          <div className="page-grid">
            {metrics.map((metric) => (
              <StatsCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
                helper={metric.helper}
              />
            ))}
          </div>

          <div className="chart-grid">
            <Card title="Impressions Over Time" subtitle="Line chart placeholder">
              <div className="chart-placeholder">Line chart placeholder</div>
            </Card>
            <Card title="Audience Breakdown" subtitle="Pie chart placeholder">
              <div className="chart-placeholder">Pie chart placeholder</div>
            </Card>
          </div>

          <Card title="Activity Log" subtitle="Recent campaign events and changes.">
            <div className="activity-log">
              {activity.map((item) => (
                <div key={item} className="activity-item">
                  <p className="card-muted">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails

