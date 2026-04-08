import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import { useAppContext } from '../../context/AppContext'
import { CAMPAIGN_METRIC_FIELDS, INSTAGRAM_TWO_WEEK_PLAN } from '../../data/instagramCampaignPlan'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const getTaskWeek = (task) => {
  const match = String(task?.title || '').match(/W(\d+)-D(\d+)/i)
  return match ? Number(match[1]) : 1
}

const getTaskDay = (task) => {
  const match = String(task?.title || '').match(/W(\d+)-D(\d+)/i)
  return match ? Number(match[2]) : 1
}

function CampaignDetails() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, updateCampaign, addToast } = useAppContext()
  const campaign = campaigns.find((item) => item.id === campaignId) ?? campaigns[0]
  const [activeWeek, setActiveWeek] = useState(1)

  const metricMap = useMemo(() => {
    const fromMetricValues = (campaign?.metricValues || []).reduce((acc, item) => {
      acc[item.name] = Number(item.value || 0)
      return acc
    }, {})
    return fromMetricValues
  }, [campaign])

  const [metricValues, setMetricValues] = useState(
    CAMPAIGN_METRIC_FIELDS.reduce((acc, field) => {
      acc[field.key] = Number(metricMap[field.label] || 0)
      return acc
    }, {}),
  )

  if (!campaign) return null

  const tasks = Array.isArray(campaign.tasks) ? campaign.tasks : []
  const weekTasks = tasks.filter((task) => getTaskWeek(task) === activeWeek)
  const groupedByDay = weekTasks.reduce((acc, task) => {
    const day = getTaskDay(task)
    if (!acc[day]) acc[day] = []
    acc[day].push(task)
    return acc
  }, {})

  const doneCount = tasks.filter((task) => task.isDone).length
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0
  const weekData = INSTAGRAM_TWO_WEEK_PLAN.find((item) => item.week === activeWeek)

  const summaryStats = [
    { title: 'Campaign Progress', value: `${progress}%`, trend: progress > 60 ? 'good' : progress > 30 ? 'average' : 'poor' },
    { title: 'Tasks Completed', value: `${doneCount}/${tasks.length || 0}`, trend: 'average' },
    { title: 'Leads', value: String(Number(campaign.metrics?.leads || 0)), trend: 'average' },
    { title: 'Budget Spent', value: `LKR ${Number(campaign.metrics?.budgetSpentLKR || 0).toLocaleString()}`, trend: 'average' },
  ]

  const saveTasks = async (nextTasks) => {
    const nextDone = nextTasks.filter((task) => task.isDone).length
    const nextProgress = nextTasks.length > 0 ? Math.round((nextDone / nextTasks.length) * 100) : 0
    await updateCampaign(campaign.id, { tasks: nextTasks, progress: nextProgress })
  }

  const toggleTask = (targetTask) => {
    const nextTasks = tasks.map((task) => {
      if (task.title !== targetTask.title) return task
      const nextDone = !task.isDone
      return {
        ...task,
        isDone: nextDone,
        completedAt: nextDone ? new Date().toISOString() : null,
      }
    })
    saveTasks(nextTasks)
  }

  const saveWeekMetrics = async () => {
    try {
      const metricValuesPayload = CAMPAIGN_METRIC_FIELDS.map((field) => ({
        name: field.label,
        type: field.key === 'ctr' ? 'percentage' : field.key === 'budgetSpentLKR' || field.key === 'cpc' || field.key === 'cpm' ? 'currency' : 'number',
        value: Number(metricValues[field.key] || 0),
      }))

      await updateCampaign(campaign.id, {
        metricValues: metricValuesPayload,
        metrics: {
          ...campaign.metrics,
          impressions: Number(metricValues.impressions || 0),
          leads: Number(metricValues.leads || 0),
          budgetSpentLKR: Number(metricValues.budgetSpentLKR || 0),
          clicks: Number(campaign.metrics?.clicks || 0),
        },
      })
      addToast(`Week ${activeWeek} metrics saved.`, 'success')
    } catch (error) {
      addToast(error?.message || 'Failed to save metrics.', 'warning')
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="toolbar-row">
            <div>
              <h1 className="page-title">{campaign.name}</h1>
              <p className="page-subtitle">2-week Instagram execution board with daily tasks and weekly metrics.</p>
            </div>
            <div className="inline-actions">
              <Button variant="secondary" onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/edit`)}>Edit Plan</Button>
              <Button onClick={() => navigate(`/dashboard/analytics?campaign=${campaign.id}`)}>View Analytics</Button>
            </div>
          </div>

          <div className="stats-grid">
            {summaryStats.map((stat) => (
              <StatsCard key={stat.title} title={stat.title} value={stat.value} trend={stat.trend} />
            ))}
          </div>

          <Card title="Campaign Header" subtitle="Professional execution overview.">
            <div className="mentor-highlight-metrics">
              <div className="mentor-highlight-stat"><strong>{campaign.status}</strong><span>Status</span></div>
              <div className="mentor-highlight-stat"><strong>{progress}%</strong><span>Completion</span></div>
              <div className="mentor-highlight-stat"><strong>2 Weeks</strong><span>Execution Window</span></div>
            </div>
          </Card>

          <div className="filter-tabs">
            <button type="button" className={`filter-tab ${activeWeek === 1 ? 'active' : ''}`} onClick={() => setActiveWeek(1)}>Week 1</button>
            <button type="button" className={`filter-tab ${activeWeek === 2 ? 'active' : ''}`} onClick={() => setActiveWeek(2)}>Week 2</button>
          </div>

          <div className="mentor-layout">
            <Card title={`Week ${activeWeek}: ${weekData?.title || ''}`} subtitle="Daily professional tasks. Multiple tasks allowed per day.">
              <div className="section-stack">
                {Object.keys(groupedByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
                  <div key={day} className="review-item">
                    <strong>Day {day}</strong>
                    <div className="activity-log">
                      {groupedByDay[day].map((task) => (
                        <label key={task.title} className="checkbox-item activity-item">
                          <input type="checkbox" checked={Boolean(task.isDone)} onChange={() => toggleTask(task)} />
                          <span>{task.title.split('| ')[1] || task.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="AI Suggested Content Box" subtitle="Guidance only (manual execution outside platform).">
              <div className="activity-log">
                <div className="activity-item"><p className="card-muted">Suggested Hook: Stop wasting money on ads until you see this…</p></div>
                <div className="activity-item"><p className="card-muted">Suggested hashtags: #StartupGrowth #DigitalMarketingTips #EntrepreneurLife</p></div>
                <div className="activity-item"><p className="card-muted">Caption style: Problem → Solution → CTA</p></div>
                <div className="activity-item"><p className="card-muted">Thumbnail: Bold text overlay + high contrast background.</p></div>
              </div>
            </Card>
          </div>

          <Card title={`Week ${activeWeek} Metrics Input`} subtitle="Save real-world Instagram results weekly.">
            <div className="form-grid">
              {CAMPAIGN_METRIC_FIELDS.map((field) => (
                <label key={field.key} className="form-label">
                  {field.label}
                  <input
                    type="number"
                    className="form-control"
                    value={metricValues[field.key]}
                    onChange={(event) => setMetricValues((current) => ({ ...current, [field.key]: Number(event.target.value || 0) }))}
                  />
                  <small className="card-muted">{field.description}</small>
                </label>
              ))}
            </div>
            <div className="inline-actions">
              <Button onClick={saveWeekMetrics}>{activeWeek === 1 ? 'Save Week 1 Data' : 'Save Week 2 Data'}</Button>
              {activeWeek === 1 ? (
                <Button variant="secondary" onClick={() => setActiveWeek(2)}>Proceed to Week 2</Button>
              ) : (
                <Button onClick={() => navigate(`/dashboard/analytics?campaign=${campaign.id}`)}>View Analysis</Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
