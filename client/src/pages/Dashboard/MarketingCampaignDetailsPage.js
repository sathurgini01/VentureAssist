import { useMemo, useState } from 'react'
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
  { to: '/dashboard/articles', label: 'Articles' },
]

function CampaignDetails() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, updateCampaign } = useAppContext()
  const [activeTab, setActiveTab] = useState('overview')
  const campaign =
    campaigns.find((item) => item.id === campaignId) ?? campaigns[0]
  const [metricValues, setMetricValues] = useState(campaign?.metricValues || [])

  const metrics = useMemo(() => {
    if (!campaign) return []
    return [
      { label: 'Progress', value: `${campaign.progress}%`, helper: campaign.status },
      { label: 'Tasks', value: `${campaign.tasks?.length || 0}`, helper: 'Timeline items' },
      { label: 'Clicks', value: `${campaign.metrics?.clicks || 0}`, helper: 'Base metric' },
      { label: 'Sales', value: `${campaign.metrics?.sales || 0}`, helper: 'Base metric' },
    ]
  }, [campaign])

  if (!campaign) {
    return null
  }

  const saveTimeline = async (tasks) => {
    const doneCount = tasks.filter((task) => task.isDone).length
    const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0
    await updateCampaign(campaign.id, { tasks, progress })
  }

  const toggleTask = (index) => {
    const tasks = (campaign.tasks || []).map((task, idx) =>
      idx === index ? { ...task, isDone: !task.isDone } : task,
    )
    saveTimeline(tasks)
  }

  const saveMetrics = async () => {
    const mappedMetrics = metricValues.reduce((acc, item) => {
      acc[item.name] = Number(item.value || 0)
      return acc
    }, {})

    await updateCampaign(campaign.id, {
      metricValues,
      metrics: {
        ...campaign.metrics,
        ...mappedMetrics,
        budgetSpentLKR: Number(mappedMetrics['Budget Spent'] || campaign.metrics?.budgetSpentLKR || 0),
        revenue: Number(mappedMetrics['Revenue'] || campaign.metrics?.revenue || 0),
      },
    })
  }

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
              <Button variant="secondary" onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/edit`)}>
                Edit
              </Button>
              <Button onClick={() => navigate('/dashboard/analytics')}>View Analytics</Button>
            </div>
          </div>

          <div className="filter-tabs">
            {['overview', 'timeline', 'metrics'].map((tab) => (
              <button key={tab} type="button" className={`filter-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <Card title={campaign.name} subtitle="Live campaign data">
            <span className={`status-badge status-${campaign.status}`}>{campaign.status}</span>
          </Card>

          {activeTab === 'overview' ? (
            <div className="page-grid">
              {metrics.map((metric) => (
                <StatsCard key={metric.label} label={metric.label} value={metric.value} helper={metric.helper} />
              ))}
            </div>
          ) : null}

          {activeTab === 'timeline' ? (
            <Card title="Timeline" subtitle="Mark tasks complete and auto-track progress.">
              <div className="activity-log">
                {(campaign.tasks || []).map((task, index) => (
                  <div key={`${task.title}-${index}`} className="activity-item">
                    <label className="checkbox-item">
                      <input type="checkbox" checked={task.isDone} onChange={() => toggleTask(index)} />
                      <span>{task.title}</span>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {activeTab === 'metrics' ? (
            <Card title="Dynamic Metrics" subtitle="Update campaign KPI values.">
              <div className="section-stack">
                {metricValues.map((metric, index) => (
                  <label key={`${metric.name}-${index}`} className="form-label">
                    {metric.name} ({metric.type})
                    <input
                      type="number"
                      className="form-control"
                      value={metric.value}
                      onChange={(event) => {
                        const next = [...metricValues]
                        next[index] = { ...metric, value: Number(event.target.value || 0) }
                        setMetricValues(next)
                      }}
                    />
                  </label>
                ))}
                <Button onClick={saveMetrics}>Save Metrics</Button>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails



