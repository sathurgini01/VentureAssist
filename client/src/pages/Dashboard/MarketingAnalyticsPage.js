import { useMemo, useState } from 'react'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'
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
  { to: '/dashboard/articles', label: 'Articles' },
]

function Analytics() {
  const { campaigns } = useAppContext()
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || '')
  const selectedCampaign = campaigns.find((item) => item.id === selectedCampaignId) || campaigns[0]

  const metrics = selectedCampaign?.metrics || {}
  const impressions = Number(metrics.impressions || 0)
  const clicks = Number(metrics.clicks || 0)
  const sales = Number(metrics.sales || 0)
  const leads = Number(metrics.leads || 0)
  const budget = Number(metrics.budgetSpentLKR || 0)
  const revenue = Number(metrics.revenue || 0)

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
  const conversionRate = clicks > 0 ? (sales / clicks) * 100 : 0
  const roi = budget > 0 ? ((revenue - budget) / budget) * 100 : 0
  const costPerLead = leads > 0 ? budget / leads : 0

  const suggestions = useMemo(() => {
    const list = []
    if (ctr > 0 && ctr < 1.5) list.push('Low CTR: Improve creatives, headline, and CTA clarity.')
    if (clicks > 0 && conversionRate < 2) list.push('High clicks but low sales: Optimize landing page and offer.')
    if (budget > 0 && roi < 0) list.push('Negative ROI: Refine targeting and reduce low-performing spend.')
    if (leads > 0 && costPerLead > 1000) list.push('High cost per lead: Improve channel mix and audience quality.')
    if (list.length === 0) list.push('Performance is stable. Scale winning channels gradually.')
    return list
  }, [ctr, clicks, conversionRate, budget, roi, leads, costPerLead])

  const summaryStats = [
    { title: 'CTR', value: `${ctr.toFixed(2)}%`, change: ctr >= 2 ? 'good' : ctr >= 1 ? 'average' : 'poor' },
    { title: 'Conversion Rate', value: `${conversionRate.toFixed(2)}%`, change: conversionRate >= 3 ? 'good' : conversionRate >= 1.5 ? 'average' : 'poor' },
    { title: 'ROI', value: `${roi.toFixed(2)}%`, change: roi > 20 ? 'good' : roi >= 0 ? 'average' : 'poor' },
    { title: 'Cost per Lead', value: `LKR ${costPerLead.toFixed(2)}`, change: costPerLead > 0 && costPerLead < 500 ? 'good' : costPerLead < 1000 ? 'average' : 'poor' },
  ]

  const comparisonRows = campaigns.map((campaign) => {
    const m = campaign.metrics || {}
    const imp = Number(m.impressions || 0)
    const clk = Number(m.clicks || 0)
    const rev = Number(m.revenue || 0)
    const bgt = Number(m.budgetSpentLKR || 0)
    const campaignRoi = bgt > 0 ? ((rev - bgt) / bgt) * 100 : 0
    return {
      name: campaign.name,
      status: campaign.status,
      impressions: imp.toLocaleString(),
      clicks: clk.toLocaleString(),
      leads: Number(m.leads || 0).toLocaleString(),
      roi: `${campaignRoi.toFixed(2)}%`,
    }
  })

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <h1 className="page-title">Campaign Analytics</h1>
              <p className="page-subtitle">
                Dynamic KPI calculations based on entered campaign metrics.
              </p>
            </div>
          </div>

          <Card title="Select Campaign" subtitle="Analytics evaluates currently selected campaign.">
            <select
              className="form-control"
              value={selectedCampaignId}
              onChange={(event) => setSelectedCampaignId(event.target.value)}
            >
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </Card>

          <div className="stats-grid">
            {summaryStats.map((stat) => (
              <StatsCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                trend={stat.change}
              />
            ))}
          </div>

          <div className="page-grid analytics-grid">
            <Card title="AI Suggestions" subtitle="Rule-based smart recommendations.">
              <div className="activity-log">
                {suggestions.map((suggestion) => (
                  <div key={suggestion} className="activity-item">
                    <p className="card-muted">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="KPI Inputs Snapshot" subtitle="Current base metric values used for calculations.">
              <p className="card-muted">Impressions: {impressions.toLocaleString()}</p>
              <p className="card-muted">Clicks: {clicks.toLocaleString()}</p>
              <p className="card-muted">Leads: {leads.toLocaleString()}</p>
              <p className="card-muted">Sales: {sales.toLocaleString()}</p>
              <p className="card-muted">Budget: LKR {budget.toLocaleString()}</p>
              <p className="card-muted">Revenue: LKR {revenue.toLocaleString()}</p>
            </Card>
          </div>

          <Card title="Campaign Comparison" subtitle="Dynamic comparison across user campaigns.">
            <Table
              columns={[
                { key: 'name', label: 'Campaign' },
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



