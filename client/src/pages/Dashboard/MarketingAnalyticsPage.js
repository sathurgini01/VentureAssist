import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'
import { CAMPAIGN_METRIC_FIELDS } from '../../data/instagramCampaignPlan'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function Analytics() {
  const { campaigns } = useAppContext()
  const [searchParams] = useSearchParams()
  const requestedCampaignId = searchParams.get('campaign')
  const defaultCampaignId = campaigns[0]?.id || ''
  const [selectedCampaignId, setSelectedCampaignId] = useState(requestedCampaignId || defaultCampaignId)

  const selectedCampaign = campaigns.find((item) => item.id === selectedCampaignId) || campaigns[0]
  const metrics = selectedCampaign?.metrics || {}

  const impressions = Number(metrics.impressions || 0)
  const clicks = Number(metrics.clicks || 0)
  const leads = Number(metrics.leads || 0)
  const sales = Number(metrics.sales || 0)
  const budget = Number(metrics.budgetSpentLKR || 0)
  const revenue = Number(metrics.revenue || 0)
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const conversionRate = clicks > 0 ? (leads / clicks) * 100 : 0
  const cpl = leads > 0 ? budget / leads : 0
  const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0

  const summaryStats = [
    { title: 'Engagement Rate', value: `${ctr.toFixed(2)}%`, trend: ctr > 2 ? 'good' : ctr > 1 ? 'average' : 'poor' },
    { title: 'Lead Conversion', value: `${conversionRate.toFixed(2)}%`, trend: conversionRate > 5 ? 'good' : conversionRate > 2 ? 'average' : 'poor' },
    { title: 'Cost per Lead', value: `LKR ${cpl.toFixed(2)}`, trend: cpl > 0 && cpl < 700 ? 'good' : cpl < 1300 ? 'average' : 'poor' },
    { title: 'Campaign ROI', value: `${roi.toFixed(2)}%`, trend: roi > 20 ? 'good' : roi > 0 ? 'average' : 'poor' },
  ]

  const aiSummary = useMemo(() => {
    const lines = []
    if (ctr < 1.5) lines.push('Reels and hooks need stronger first 3 seconds to improve attention and clicks.')
    if (conversionRate < 3) lines.push('Lead conversion is low. Tighten CTA and offer clarity in captions + stories.')
    if (cpl > 1200) lines.push('CPL is high. Narrow audience targeting and pause weak post boosts.')
    if (lines.length === 0) lines.push('Campaign is stable. Scale top-performing post formats by 20-30%.')
    return lines
  }, [ctr, conversionRate, cpl])

  const weekMetricRows = CAMPAIGN_METRIC_FIELDS.map((field) => ({
    metric: field.label,
    value: Number((selectedCampaign?.metricValues || []).find((item) => item.name === field.label)?.value || 0).toLocaleString(),
    meaning: field.description,
  }))

  const comparisonRows = campaigns.map((campaign) => {
    const m = campaign.metrics || {}
    const imp = Number(m.impressions || 0)
    const clk = Number(m.clicks || 0)
    const lds = Number(m.leads || 0)
    const bgt = Number(m.budgetSpentLKR || 0)
    const rev = Number(m.revenue || 0)
    const campaignRoi = bgt > 0 ? ((rev - bgt) / bgt) * 100 : 0
    return {
      campaign: campaign.name,
      status: campaign.status,
      impressions: imp.toLocaleString(),
      clicks: clk.toLocaleString(),
      leads: lds.toLocaleString(),
      roi: `${campaignRoi.toFixed(2)}%`,
    }
  })

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Campaign Analytics</h1>
            <p className="page-subtitle">Week-by-week summary with AI-style optimization guidance (UI phase).</p>
          </div>

          <Card title="Select Campaign" subtitle="Review one campaign at a time.">
            <select className="form-control" value={selectedCampaignId} onChange={(event) => setSelectedCampaignId(event.target.value)}>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
          </Card>

          <div className="stats-grid">
            {summaryStats.map((item) => (
              <StatsCard key={item.title} title={item.title} value={item.value} trend={item.trend} />
            ))}
          </div>

          <div className="page-grid analytics-grid">
            <Card title="AI Suggestion Box" subtitle="Optimization guidance generated from current KPI values.">
              <div className="activity-log">
                {aiSummary.map((item) => (
                  <div key={item} className="activity-item">
                    <p className="card-muted">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Campaign Score" subtitle="Simple weighted view of campaign health.">
              <p className="page-title" style={{ margin: 0 }}>{Math.max(0, Math.min(100, Math.round((ctr * 10 + conversionRate * 8 + Math.max(0, 20 - cpl / 100)))))}</p>
              <p className="card-muted">Score combines engagement, conversion, and efficiency.</p>
            </Card>
          </div>

          <Card title="Weekly Metrics + Definitions" subtitle="Each metric includes clear explanation.">
            <Table
              columns={[
                { key: 'metric', label: 'Metric' },
                { key: 'value', label: 'Current Value' },
                { key: 'meaning', label: 'What this means' },
              ]}
              rows={weekMetricRows}
            />
          </Card>

          <Card title="Campaign Comparison" subtitle="Compare key outcomes across campaigns.">
            <Table
              columns={[
                { key: 'campaign', label: 'Campaign' },
                { key: 'status', label: 'Status' },
                { key: 'impressions', label: 'Impressions' },
                { key: 'clicks', label: 'Clicks' },
                { key: 'leads', label: 'Leads' },
                { key: 'roi', label: 'ROI' },
              ]}
              rows={comparisonRows}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Analytics
