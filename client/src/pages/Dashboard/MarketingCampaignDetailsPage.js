import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import { useAppContext } from '../../context/AppContext'
import {
  getCampaignPlanByKey,
  inferPlanKeyFromTemplateTitle,
  parsePlanKeyFromNotes,
} from '../../data/instagramCampaignPlan'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const parsePhaseDay = (taskTitle = '') => {
  const match = String(taskTitle).match(/[WP](\d+)-D(\d+)/i)
  return {
    phase: match ? Number(match[1]) : 1,
    day: match ? Number(match[2]) : 1,
  }
}

const getMarkerValue = (metricValues, name) => Number(metricValues.find((item) => item.name === name)?.value || 0)

const formatMetricValue = (type, value) => {
  if (type === 'currency') return `LKR ${Number(value || 0).toLocaleString()}`
  if (type === 'percentage') return `${Number(value || 0).toLocaleString()}%`
  return Number(value || 0).toLocaleString()
}

const normalizeMetricInput = (value) => {
  if (value === '' || value === null || value === undefined) return ''
  return String(value)
}

function CampaignDetails() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const [searchParams] = useSearchParams()
  const { campaigns, updateCampaign, addToast } = useAppContext()
  const campaign = campaigns.find((item) => item.id === campaignId) ?? campaigns[0]
  const [activePhase, setActivePhase] = useState(1)
  const isReadOnly = searchParams.get('mode') === 'view'

  if (!campaign) return null

  const template = campaign.template || null
  const templateExecutionPlan = Array.isArray(template?.executionPlan) ? template.executionPlan : []
  const usesTemplateFlow = templateExecutionPlan.length > 0

  const inferredPlanKey = parsePlanKeyFromNotes(campaign.metrics?.notes) || inferPlanKeyFromTemplateTitle(campaign.title)
  const activePlan = getCampaignPlanByKey(inferredPlanKey)

  const tasks = Array.isArray(campaign.tasks) ? campaign.tasks : []
  const metricValues = Array.isArray(campaign.metricValues) ? campaign.metricValues : []
  const metricDefinitions = Array.isArray(campaign.metricDefinitions) ? campaign.metricDefinitions : []

  const campaignEnded = getMarkerValue(metricValues, '__campaign_ended__') === 1
  const doneCount = tasks.filter((item) => item.isDone).length
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0

  const templateDays = useMemo(
    () => [...templateExecutionPlan].sort((a, b) => Number(a.day || 0) - Number(b.day || 0)),
    [templateExecutionPlan],
  )

  const templateTasksByDay = useMemo(() => (
    templateDays.reduce((acc, dayData) => {
      acc[dayData.day] = tasks.filter((task) => parsePhaseDay(task.title).day === Number(dayData.day))
      return acc
    }, {})
  ), [templateDays, tasks])

  const templateDayDoneMap = useMemo(() => (
    templateDays.reduce((acc, dayData) => {
      const dayTasks = templateTasksByDay[dayData.day] || []
      acc[dayData.day] = dayTasks.length > 0 && dayTasks.every((task) => task.isDone)
      return acc
    }, {})
  ), [templateDays, templateTasksByDay])

  const isTemplateDayEnabled = (day) => {
    if (campaignEnded) return false
    const dayIndex = templateDays.findIndex((item) => item.day === day)
    if (dayIndex <= 0) return true
    const previousDay = templateDays[dayIndex - 1]?.day
    return Boolean(templateDayDoneMap[previousDay])
  }

  const [templateMetricInput, setTemplateMetricInput] = useState(() => {
    const next = {}
    metricDefinitions.forEach((metric) => {
      next[metric.name] = normalizeMetricInput(metricValues.find((item) => item.name === metric.name)?.value ?? 0)
    })
    return next
  })

  const phaseSavedMap = activePlan.phases.reduce((acc, phase) => {
    const modern = getMarkerValue(metricValues, `__phase${phase.phase}_saved__`) === 1
    const legacy = getMarkerValue(metricValues, `__week${phase.phase}_saved__`) === 1
    acc[phase.phase] = modern || legacy
    return acc
  }, {})

  const activePhaseData = activePlan.phases.find((item) => item.phase === activePhase) || activePlan.phases[0]
  const activePhaseTasks = tasks.filter((task) => parsePhaseDay(task.title).phase === activePhase)

  const taskMapByDay = activePhaseTasks.reduce((acc, task) => {
    const { day } = parsePhaseDay(task.title)
    if (!acc[day]) acc[day] = []
    acc[day].push(task)
    return acc
  }, {})

  const dayDoneMap = activePhaseData.dayTasks.reduce((acc, dayData) => {
    const dayTasks = taskMapByDay[dayData.day] || []
    acc[dayData.day] = dayTasks.length > 0 && dayTasks.every((task) => task.isDone)
    return acc
  }, {})

  const isDayEnabled = (day) => {
    if (campaignEnded) return false
    const dayIndex = activePhaseData.dayTasks.findIndex((item) => item.day === day)
    if (dayIndex <= 0) return true
    const previousDay = activePhaseData.dayTasks[dayIndex - 1].day
    return Boolean(dayDoneMap[previousDay])
  }

  const [phaseMetricInput, setPhaseMetricInput] = useState(() => {
    const next = {}
    activePlan.phases.forEach((phase) => {
      phase.requiredMetrics.forEach((metric) => {
        const existing =
          metricValues.find((item) => item.name === metric.key) ||
          metricValues.find((item) => item.name === metric.label)
        next[metric.key] = normalizeMetricInput(existing?.value ?? 0)
      })
    })
    return next
  })

  const toggleTask = async (targetTask) => {
    if (campaignEnded || isReadOnly) return

    const { day, phase } = parsePhaseDay(targetTask.title)
    if (usesTemplateFlow) {
      if (!isTemplateDayEnabled(day)) return
    } else if (!isDayEnabled(day) || phase !== activePhase) {
      return
    }

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

  const saveTemplateMetrics = async () => {
    try {
      const nonMarkerValues = metricValues.filter((item) => !String(item.name || '').startsWith('__'))
      const nextMetricValues = metricDefinitions.map((metric) => {
        const existing = nonMarkerValues.find((item) => item.name === metric.name)
        return {
          name: metric.name,
          type: metric.type || existing?.type || 'number',
          value: Number(templateMetricInput[metric.name] || 0),
        }
      })

      const savedMarker = metricValues.find((item) => item.name === '__phase1_saved__')
      nextMetricValues.push({
        name: '__phase1_saved__',
        type: 'number',
        value: 1,
      })
      nextMetricValues.push({
        name: '__campaign_ended__',
        type: 'number',
        value: (getMarkerValue(metricValues, '__campaign_ended__') === 1 || savedMarker?.value === 1) ? 1 : 0,
      })

      await updateCampaign(campaign.id, {
        metricValues: nextMetricValues,
      })

      addToast('Campaign metrics saved.', 'success')
    } catch (error) {
      addToast(error?.message || 'Failed to save metrics.', 'warning')
    }
  }

  const savePhaseMetrics = async () => {
    try {
      const nextMetricValues = [...metricValues]
      activePhaseData.requiredMetrics.forEach((metric) => {
        const idx = nextMetricValues.findIndex(
          (item) => item.name === metric.key || item.name === metric.label,
        )
        if (idx >= 0) {
          nextMetricValues[idx] = { ...nextMetricValues[idx], value: Number(phaseMetricInput[metric.key] || 0) }
        }
      })

      const markerName = `__phase${activePhase}_saved__`
      const markerIdx = nextMetricValues.findIndex((item) => item.name === markerName)
      if (markerIdx >= 0) {
        nextMetricValues[markerIdx] = { ...nextMetricValues[markerIdx], value: 1 }
      } else {
        nextMetricValues.push({ name: markerName, type: 'number', value: 1 })
      }

      await updateCampaign(campaign.id, {
        metricValues: nextMetricValues,
        metrics: {
          ...campaign.metrics,
          impressions: Number(phaseMetricInput.week1Reach || phaseMetricInput.fbDay1Impressions || campaign.metrics?.impressions || 0),
          leads: Number(phaseMetricInput.week2LeadsGenerated || phaseMetricInput.fbDay7TotalLeads || campaign.metrics?.leads || 0),
          budgetSpentLKR: Number(phaseMetricInput.week1AdSpend || 0)
            + Number(phaseMetricInput.week2AdSpend || 0)
            + Number(phaseMetricInput.fbDay7TotalAdSpend || 0),
          engagement: Number(phaseMetricInput.week1Engagement || phaseMetricInput.fbDay2Engagement || campaign.metrics?.engagement || 0),
        },
      })

      addToast(`Phase ${activePhase} metrics saved.`, 'success')
    } catch (error) {
      addToast(error?.message || 'Failed to save metrics.', 'warning')
    }
  }

  const endCampaign = async () => {
    if (usesTemplateFlow) {
      const allTasksComplete = tasks.every((task) => task.isDone)
      if (!allTasksComplete) {
        addToast('Please complete all task checkboxes first.', 'warning')
        return
      }

      const requiredMetricsFilled = metricDefinitions
        .filter((metric) => metric.required)
        .every((metric) => Number(templateMetricInput[metric.name] || 0) > 0)

      if (!requiredMetricsFilled) {
        addToast('Please save all required metrics first.', 'warning')
        return
      }

      const nextMetricValues = metricValues.filter((item) => item.name !== '__campaign_ended__')
      nextMetricValues.push({ name: '__campaign_ended__', type: 'number', value: 1 })

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
      return
    }

    const allPhaseSaved = activePlan.phases.every((phase) => Boolean(phaseSavedMap[phase.phase]))
    if (!allPhaseSaved) {
      addToast('Please save all phase metrics first.', 'warning')
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

  const summaryStats = usesTemplateFlow
    ? [
      { title: 'Campaign', value: campaign.title, trend: 'average' },
      { title: 'Progress', value: `${campaignEnded ? 100 : progress}%`, trend: campaignEnded ? 'good' : 'average' },
      { title: 'Tasks Done', value: `${doneCount}/${tasks.length}`, trend: doneCount === tasks.length ? 'good' : 'average' },
      { title: 'Status', value: campaignEnded ? 'Completed' : campaign.status, trend: campaignEnded ? 'good' : 'average' },
    ]
    : [
      { title: 'Package', value: activePlan.package.title, trend: 'average' },
      { title: 'Progress', value: `${campaignEnded ? 100 : progress}%`, trend: campaignEnded ? 'good' : 'average' },
      { title: 'Tasks Done', value: `${doneCount}/${tasks.length}`, trend: doneCount === tasks.length ? 'good' : 'average' },
      { title: 'Status', value: campaignEnded ? 'Completed' : campaign.status, trend: campaignEnded ? 'good' : 'average' },
    ]

  const templateSummaryRows = (template?.finalOutputItems || []).map((item) => {
    const matchedMetric = metricDefinitions.find((metric) => (
      String(metric.name || '').toLowerCase() === String(item).toLowerCase()
    )) || metricDefinitions.find((metric) => (
      String(item).toLowerCase().includes(String(metric.name || '').toLowerCase())
      || String(metric.name || '').toLowerCase().includes(String(item).toLowerCase())
    ))

    if (!matchedMetric) {
      return { label: item, value: 'Tracked in analytics' }
    }

    return {
      label: item,
      value: formatMetricValue(matchedMetric.type, templateMetricInput[matchedMetric.name] || 0),
    }
  })

  const activePhaseIndex = activePlan.phases.findIndex((item) => item.phase === activePhase)
  const isPhaseUnlocked = (phase) => {
    if (campaignEnded) return true
    const index = activePlan.phases.findIndex((item) => item.phase === phase)
    if (index <= 0) return true
    const previousPhase = activePlan.phases[index - 1]
    return Boolean(phaseSavedMap[previousPhase.phase])
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">{usesTemplateFlow ? campaign.title : activePlan.package.title}</h1>
            <p className="page-subtitle">
              {usesTemplateFlow ? 'Ongoing execution workspace for your launched campaign template.' : 'Ongoing execution workspace with day-by-day task unlocking.'}
            </p>
          </div>

          <div className="stats-grid">
            {summaryStats.map((item) => (
              <StatsCard key={item.title} title={item.title} value={item.value} trend={item.trend} />
            ))}
          </div>

          {usesTemplateFlow ? (
            <>
              <Card title="Campaign Checklist" subtitle="Each task entered by admin is now shown here as a campaign checkbox.">
                <div className="section-stack">
                  {templateDays.map((dayData) => {
                    const dayTasks = templateTasksByDay[dayData.day] || []
                    const enabled = isTemplateDayEnabled(dayData.day)
                    return (
                      <div key={dayData.day} className="review-item">
                        <div className="toolbar-row">
                          <strong>Day {dayData.day} - {dayData.title}</strong>
                          <span className="card-muted">{enabled ? 'Enabled' : 'Locked until previous day completes'}</span>
                        </div>
                        {dayData.focus ? <p className="card-muted">Focus: {dayData.focus}</p> : null}
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

              <Card title="Campaign Metrics" subtitle="Fill the required metrics below the checklist, then save before ending the campaign.">
                <div className="form-grid">
                  {metricDefinitions.map((metric) => (
                    <label key={metric.name} className="form-label">
                      {metric.name}
                              <input
                                type="number"
                                className="form-control"
                                value={templateMetricInput[metric.name] ?? ''}
                                onChange={(event) => setTemplateMetricInput((current) => ({ ...current, [metric.name]: event.target.value }))}
                                disabled={campaignEnded || isReadOnly}
                              />
                      <small className="card-muted">
                        {metric.type} {metric.required ? '- required' : '- optional'}
                      </small>
                    </label>
                  ))}
                </div>
                <div className="inline-actions">
                  <Button onClick={saveTemplateMetrics} disabled={campaignEnded || isReadOnly}>Save Metrics</Button>
                </div>
              </Card>

              {!campaignEnded && !isReadOnly ? (
                <Card title="End Campaign" subtitle="Available after all checklist items are completed and required metrics are saved.">
                  <div className="inline-actions">
                    <Button
                      onClick={endCampaign}
                      disabled={tasks.some((task) => !task.isDone)}
                    >
                      End Campaign
                    </Button>
                  </div>
                </Card>
              ) : null}

              {campaignEnded ? (
                <Card title="Final Campaign Summary" subtitle="Complete report after campaign completion.">
                  <div className="section-stack">
                    <p className="card-muted"><strong>Tasks Completed:</strong> {doneCount}/{tasks.length}</p>

                    {(templateSummaryRows || []).length ? (
                      <>
                        <strong>Summary</strong>
                        <ul>
                          {templateSummaryRows.map((item) => (
                            <li key={item.label}>
                              <strong>{item.label}:</strong> {item.value}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {(template?.expectedResults || []).length ? (
                      <>
                        <strong>Expected Outcomes Recap</strong>
                        <ul>
                          {(template.expectedResults || []).map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </>
                    ) : null}

                    <div className="inline-actions">
                      <Button onClick={() => navigate(`/dashboard/analytics?campaign=${campaign.id}`)}>Analysis</Button>
                    </div>
                  </div>
                </Card>
              ) : null}
            </>
          ) : (
            <>
              <div className="filter-tabs">
                {activePlan.phases.map((phase) => {
                  const unlocked = isPhaseUnlocked(phase.phase)
                  return (
                    <button
                      key={phase.phase}
                      type="button"
                      className={`filter-tab ${activePhase === phase.phase ? 'active' : ''}`}
                      onClick={() => unlocked && setActivePhase(phase.phase)}
                      disabled={!unlocked}
                    >
                      Phase {phase.phase}
                    </button>
                  )
                })}
              </div>

              <Card title={`Phase ${activePhase} Progress`} subtitle={activePhaseData.objective}>
                <div className="section-stack">
                  {activePhaseData.dayTasks.map((dayData) => {
                    const dayTasks = taskMapByDay[dayData.day] || []
                    const enabled = isDayEnabled(dayData.day)
                    return (
                      <div key={dayData.day} className="review-item">
                        <div className="toolbar-row">
                          <strong>Day {dayData.day} - {dayData.title}</strong>
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

              <Card title={`Phase ${activePhase} Metrics`} subtitle="Enter and save required metrics for this phase.">
                <div className="form-grid">
                  {activePhaseData.requiredMetrics.map((metric) => (
                    <label key={metric.key} className="form-label">
                      {metric.label}
                      <input
                        type="number"
                        className="form-control"
                        value={phaseMetricInput[metric.key] ?? ''}
                        onChange={(event) => setPhaseMetricInput((current) => ({ ...current, [metric.key]: event.target.value }))}
                        disabled={campaignEnded || isReadOnly}
                      />
                      <small className="card-muted">{metric.description}</small>
                    </label>
                  ))}
                </div>
                <div className="inline-actions">
                  <Button onClick={savePhaseMetrics} disabled={campaignEnded || isReadOnly}>Save Phase {activePhase} Metrics</Button>
                  {activePhaseIndex < activePlan.phases.length - 1 ? (
                    <Button
                      variant="secondary"
                      disabled={!phaseSavedMap[activePhase]}
                      onClick={() => setActivePhase(activePlan.phases[activePhaseIndex + 1].phase)}
                    >
                      Go to Next Phase
                    </Button>
                  ) : null}
                </div>
              </Card>

              {!campaignEnded && !isReadOnly ? (
                <Card title="End Campaign" subtitle="Available after saving all phase metric sections.">
                  <div className="inline-actions">
                    <Button onClick={endCampaign} disabled={!activePlan.phases.every((phase) => phaseSavedMap[phase.phase])}>End Campaign</Button>
                  </div>
                </Card>
              ) : null}

              {campaignEnded ? (
                <Card title="Final Campaign Summary" subtitle="Complete report after campaign completion.">
                  <div className="section-stack">
                    <p className="card-muted"><strong>Tasks Completed:</strong> {doneCount}/{tasks.length}</p>
                    <p className="card-muted"><strong>Total Reach:</strong> {Number(phaseMetricInput.week1Reach || phaseMetricInput.fbDay7TotalReach || 0).toLocaleString()}</p>
                    <p className="card-muted"><strong>Total Leads:</strong> {Number(phaseMetricInput.week2LeadsGenerated || phaseMetricInput.fbDay7TotalLeads || 0).toLocaleString()}</p>
                    <p className="card-muted"><strong>Total Ad Spend:</strong> LKR {(
                      Number(phaseMetricInput.week1AdSpend || 0)
                      + Number(phaseMetricInput.week2AdSpend || 0)
                      + Number(phaseMetricInput.fbDay7TotalAdSpend || 0)
                    ).toLocaleString()}</p>

                    <strong>Expected Outcomes Recap</strong>
                    <ul>
                      {activePlan.finalExpectedOutcome.map((item) => <li key={item}>{item}</li>)}
                    </ul>

                    <div className="inline-actions">
                      <Button onClick={() => navigate(`/dashboard/analytics?campaign=${campaign.id}`)}>Analysis</Button>
                    </div>
                  </div>
                </Card>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
