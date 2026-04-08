import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import { useAppContext } from '../../context/AppContext'
import { FINAL_EXPECTED_OUTCOME, INSTAGRAM_PACKAGE, WEEKLY_PLAN } from '../../data/instagramCampaignPlan'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const parseWeekDay = (taskTitle = '') => {
  const match = String(taskTitle).match(/W(\d+)-D(\d+)/i)
  return {
    week: match ? Number(match[1]) : 1,
    day: match ? Number(match[2]) : 1,
  }
}

const getMarkerValue = (metricValues, name) => {
  return Number(metricValues.find((item) => item.name === name)?.value || 0)
}

function CampaignDetails() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [searchParams] = useSearchParams()
  const { campaigns, updateCampaign, addToast } = useAppContext()
  const campaign = campaigns.find((item) => item.id === campaignId) ?? campaigns[0]
  const [activeWeek, setActiveWeek] = useState(1)
  const isReadOnly = searchParams.get('mode') === 'view'

  if (!campaign) return null

  const tasks = Array.isArray(campaign.tasks) ? campaign.tasks : []
  const metricValues = Array.isArray(campaign.metricValues) ? campaign.metricValues : []

  const week1Saved = getMarkerValue(metricValues, '__week1_saved__') === 1
  const week2Saved = getMarkerValue(metricValues, '__week2_saved__') === 1
  const campaignEnded = getMarkerValue(metricValues, '__campaign_ended__') === 1

  const doneCount = tasks.filter((item) => item.isDone).length
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0

  const activeWeekData = WEEKLY_PLAN.find((item) => item.week === activeWeek) || WEEKLY_PLAN[0]
  const activeWeekTasks = tasks.filter((task) => parseWeekDay(task.title).week === activeWeek)

  const taskMapByDay = activeWeekTasks.reduce((acc, task) => {
    const { day } = parseWeekDay(task.title)
    if (!acc[day]) acc[day] = []
    acc[day].push(task)
    return acc
  }, {})

  const dayDoneMap = activeWeekData.dayTasks.reduce((acc, dayData) => {
    const dayTasks = taskMapByDay[dayData.day] || []
    acc[dayData.day] = dayTasks.length > 0 && dayTasks.every((task) => task.isDone)
    return acc
  }, {})

  const isDayEnabled = (day) => {
    if (campaignEnded) return false
    const dayIndex = activeWeekData.dayTasks.findIndex((item) => item.day === day)
    if (dayIndex <= 0) return true
    const previousDay = activeWeekData.dayTasks[dayIndex - 1].day
    return Boolean(dayDoneMap[previousDay])
  }

  const [weekMetricInput, setWeekMetricInput] = useState(() => {
    const next = {}
    WEEKLY_PLAN.forEach((week) => {
      week.requiredMetrics.forEach((metric) => {
        const existing =
          metricValues.find((item) => item.name === metric.key) ||
          metricValues.find((item) => item.name === metric.label)
        next[metric.key] = Number(existing?.value || 0)
      })
    })
    return next
  })

  const toggleTask = async (targetTask) => {
    if (campaignEnded || isReadOnly) return
    const { day } = parseWeekDay(targetTask.title)
    if (!isDayEnabled(day)) return

    const nextTasks = tasks.map((task) => {
      if (task.title !== targetTask.title) return task
      const nextDone = !task.isDone
      return {
        ...task,
        isDone: nextDone,
        completedAt: nextDone ? new Date().toISOString() : null,
      }
    })

    const nextDone = nextTasks.filter((item) => item.isDone).length
    const nextProgress = nextTasks.length ? Math.round((nextDone / nextTasks.length) * 100) : 0
    await updateCampaign(campaign.id, { tasks: nextTasks, progress: nextProgress })
  }

  const saveWeekMetrics = async () => {
    try {
      const nextMetricValues = [...metricValues]
      activeWeekData.requiredMetrics.forEach((metric) => {
        const idx = nextMetricValues.findIndex(
          (item) => item.name === metric.key || item.name === metric.label,
        )
        if (idx >= 0) {
          nextMetricValues[idx] = { ...nextMetricValues[idx], value: Number(weekMetricInput[metric.key] || 0) }
        }
      })

      const markerName = activeWeek === 1 ? '__week1_saved__' : '__week2_saved__'
      const markerIdx = nextMetricValues.findIndex((item) => item.name === markerName)
      if (markerIdx >= 0) {
        nextMetricValues[markerIdx] = { ...nextMetricValues[markerIdx], value: 1 }
      }

      await updateCampaign(campaign.id, {
        metricValues: nextMetricValues,
        metrics: {
          ...campaign.metrics,
          impressions: Number(weekMetricInput.week1Reach || weekMetricInput.week2Reach || 0),
          leads: Number(weekMetricInput.week2LeadsGenerated || 0),
          budgetSpentLKR: Number(weekMetricInput.week1AdSpend || 0) + Number(weekMetricInput.week2AdSpend || 0),
          engagement: Number(weekMetricInput.week1Engagement || 0),
        },
      })

      addToast(`Week ${activeWeek} metrics saved.`, 'success')
    } catch (error) {
      addToast(error?.message || 'Failed to save weekly metrics.', 'warning')
    }
  }

  const endCampaign = async () => {
    if (!week1Saved || !week2Saved) {
      addToast('Please save Week 1 and Week 2 metrics first.', 'warning')
      return
    }

    const nextMetricValues = [...metricValues]
    const idx = nextMetricValues.findIndex((item) => item.name === '__campaign_ended__')
    if (idx >= 0) nextMetricValues[idx] = { ...nextMetricValues[idx], value: 1 }

    await updateCampaign(campaign.id, {
      status: 'completed',
      progress: 100,
      metricValues: nextMetricValues,
      metrics: {
        ...campaign.metrics,
        notes: `${campaign.metrics?.notes || ''}\nCampaign Ended: Yes`,
      },
    })
    addToast('Campaign ended successfully.', 'success')
  }

  const summaryStats = [
    { title: 'Package', value: INSTAGRAM_PACKAGE.title, trend: 'average' },
    { title: 'Progress', value: `${campaignEnded ? 100 : progress}%`, trend: campaignEnded ? 'good' : 'average' },
    { title: 'Tasks Done', value: `${doneCount}/${tasks.length}`, trend: doneCount === tasks.length ? 'good' : 'average' },
    { title: 'Status', value: campaignEnded ? 'Completed' : campaign.status, trend: campaignEnded ? 'good' : 'average' },
  ]

  const week2Unlocked = week1Saved || campaignEnded

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">{INSTAGRAM_PACKAGE.title}</h1>
            <p className="page-subtitle">Ongoing execution workspace with day-by-day task unlocking.</p>
          </div>

          <div className="stats-grid">
            {summaryStats.map((item) => (
              <StatsCard key={item.title} title={item.title} value={item.value} trend={item.trend} />
            ))}
          </div>

          <div className="filter-tabs">
            <button type="button" className={`filter-tab ${activeWeek === 1 ? 'active' : ''}`} onClick={() => setActiveWeek(1)}>
              Week 1
            </button>
            <button
              type="button"
              className={`filter-tab ${activeWeek === 2 ? 'active' : ''}`}
              onClick={() => week2Unlocked && setActiveWeek(2)}
              disabled={!week2Unlocked}
            >
              Week 2
            </button>
          </div>

          <Card title={`Week ${activeWeek} Progress`} subtitle={activeWeekData.objective}>
            <div className="section-stack">
              {activeWeekData.dayTasks.map((dayData) => {
                const dayTasks = taskMapByDay[dayData.day] || []
                const enabled = isDayEnabled(dayData.day)
                return (
                  <div key={dayData.day} className="review-item">
                    <div className="toolbar-row">
                      <strong>Day {dayData.day} – {dayData.title}</strong>
                      <span className="card-muted">{enabled ? 'Enabled' : 'Locked until previous day completes'}</span>
                    </div>
                    <div className="activity-log">
                      {dayTasks.map((task) => (
                        <label key={task.title} className="checkbox-item activity-item">
                          <input
                            type="checkbox"
                            checked={Boolean(task.isDone)}
                            onChange={() => toggleTask(task)}
                            disabled={!enabled || campaignEnded || isReadOnly}
                          />
                          <span>{task.title.split('| ')[1] || task.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card title={`Week ${activeWeek} Metrics`} subtitle="Enter and save required metrics for this week.">
            <div className="form-grid">
              {activeWeekData.requiredMetrics.map((metric) => (
                <label key={metric.key} className="form-label">
                  {metric.label}
                  <input
                    type="number"
                    className="form-control"
                    value={weekMetricInput[metric.key] || 0}
                    onChange={(event) => setWeekMetricInput((current) => ({ ...current, [metric.key]: Number(event.target.value || 0) }))}
                    disabled={campaignEnded || isReadOnly}
                  />
                  <small className="card-muted">{metric.description}</small>
                </label>
              ))}
            </div>
            <div className="inline-actions">
              <Button onClick={saveWeekMetrics} disabled={campaignEnded || isReadOnly}>Save Week {activeWeek} Metrics</Button>
              {activeWeek === 1 ? (
                <Button variant="secondary" disabled={!week1Saved} onClick={() => setActiveWeek(2)}>
                  Go to Week 2
                </Button>
              ) : null}
            </div>
          </Card>

          {!campaignEnded && !isReadOnly ? (
            <Card title="End Campaign" subtitle="Available after saving both week metric sections.">
              <div className="inline-actions">
                <Button onClick={endCampaign} disabled={!week1Saved || !week2Saved}>End Campaign</Button>
              </div>
            </Card>
          ) : null}

          {campaignEnded ? (
            <Card title="Final Campaign Summary" subtitle="Complete report after 2-week completion.">
              <div className="section-stack">
                <p className="card-muted"><strong>Tasks Completed:</strong> {doneCount}/{tasks.length}</p>
                <p className="card-muted"><strong>Week 1 Reach:</strong> {Number(weekMetricInput.week1Reach || 0).toLocaleString()}</p>
                <p className="card-muted"><strong>Week 2 Leads Generated:</strong> {Number(weekMetricInput.week2LeadsGenerated || 0).toLocaleString()}</p>
                <p className="card-muted"><strong>Total Ad Spend:</strong> LKR {(Number(weekMetricInput.week1AdSpend || 0) + Number(weekMetricInput.week2AdSpend || 0)).toLocaleString()}</p>

                <strong>Expected Outcomes Recap</strong>
                <ul>
                  {FINAL_EXPECTED_OUTCOME.map((item) => <li key={item}>{item}</li>)}
                </ul>

                <div className="inline-actions">
                  <Button onClick={() => navigate(`/dashboard/analytics?campaign=${campaign.id}`)}>Analysis</Button>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
