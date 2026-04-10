import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
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

const inferMetricType = (metric) => {
  if (metric?.type) return metric.type
  const label = String(metric?.label || '').toLowerCase()
  if (label.includes('ctr') || label.includes('rate')) return 'percentage'
  if (label.includes('spend') || label.includes('cpl') || label.includes('cost') || label.includes('budget')) return 'currency'
  return 'number'
}

const createTaskPayload = (plan) => {
  const tasks = []
  plan.phases.forEach((phase) => {
    phase.dayTasks.forEach((dayData) => {
      dayData.tasks.forEach((task, idx) => {
        tasks.push({
          title: `P${phase.phase}-D${dayData.day} | ${task}`,
          description: dayData.title,
          order: phase.phase * 1000 + dayData.day * 10 + idx,
          isDone: false,
          completedAt: null,
        })
      })
    })
  })
  return tasks
}

const createMetricValuePayload = (plan) => {
  const metricEntries = []
  plan.phases.forEach((phase) => {
    phase.requiredMetrics.forEach((metric) => {
      metricEntries.push({
        name: metric.key,
        type: inferMetricType(metric),
        value: 0,
      })
    })

    metricEntries.push({ name: `__phase${phase.phase}_saved__`, type: 'number', value: 0 })
  })

  metricEntries.push({ name: '__campaign_ended__', type: 'number', value: 0 })
  return metricEntries
}

const createTaskPayloadFromTemplate = (template) => {
  const executionPlan = Array.isArray(template?.executionPlan) ? template.executionPlan : []
  if (!executionPlan.length) return []

  const tasks = []
  executionPlan.forEach((dayData) => {
    ;(dayData.tasks || []).forEach((task, index) => {
      tasks.push({
        title: `P1-D${dayData.day} | ${task}`,
        description: dayData.title || '',
        order: Number(dayData.day || 1) * 100 + index + 1,
        isDone: false,
        completedAt: null,
      })
    })
  })
  return tasks
}

const createMetricValuePayloadFromTemplate = (template) => {
  const defs = Array.isArray(template?.metricDefinitions) ? template.metricDefinitions : []
  const values = defs.map((item) => ({
    name: item.name,
    type: item.type || 'number',
    value: 0,
  }))
  values.push({ name: '__phase1_saved__', type: 'number', value: 0 })
  values.push({ name: '__campaign_ended__', type: 'number', value: 0 })
  return values
}

const normalizeTemplateId = (templateId) => {
  const value = String(templateId || '')
  if (!value || value.startsWith('virtual-')) return null
  return value
}

function CreateCampaign() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, selectedTemplate, createCampaign, updateCampaign, setSelectedTemplate, addToast } = useAppContext()
  const [startDate, setStartDate] = useState('')

  const editingCampaign = campaigns.find((item) => item.id === campaignId)
  const activePlanKey = useMemo(() => {
    if (editingCampaign?.metrics?.notes) {
      const parsed = parsePlanKeyFromNotes(editingCampaign.metrics.notes)
      if (parsed) return parsed
      return inferPlanKeyFromTemplateTitle(editingCampaign.title)
    }

    if (selectedTemplate?.planKey) return selectedTemplate.planKey
    if (selectedTemplate?.title || selectedTemplate?.name) {
      return inferPlanKeyFromTemplateTitle(selectedTemplate?.title || selectedTemplate?.name)
    }

    return 'instagram'
  }, [editingCampaign, selectedTemplate])

  const activePlan = useMemo(() => getCampaignPlanByKey(activePlanKey), [activePlanKey])
  const packageTitle = useMemo(
    () => selectedTemplate?.title || selectedTemplate?.name || activePlan.package.title,
    [activePlan, selectedTemplate],
  )
  const selectedTemplateSummary = useMemo(() => {
    if (!selectedTemplate) return null
    return {
      title: selectedTemplate.title || selectedTemplate.name || packageTitle,
      description: selectedTemplate.description || '',
      stage: selectedTemplate.stage || 'earlyStartup',
      category: selectedTemplate.category || 'General',
      durationLabel: selectedTemplate.durationLabel || '',
      objective: selectedTemplate.objective || '',
      campaignOverview: selectedTemplate.campaignOverview || '',
      targetAudience: selectedTemplate.targetAudience || '',
      idealFor: Array.isArray(selectedTemplate.idealFor) ? selectedTemplate.idealFor : [],
      estimatedBudgetLKR: Number(selectedTemplate.estimatedBudgetLKR || 0),
      estimatedDurationDays: Number(selectedTemplate.estimatedDurationDays || 0),
      budgetBreakdown: Array.isArray(selectedTemplate.budgetBreakdown) ? selectedTemplate.budgetBreakdown : [],
      executionPlan: Array.isArray(selectedTemplate.executionPlan) ? selectedTemplate.executionPlan : [],
      expectedResults: Array.isArray(selectedTemplate.expectedResults) ? selectedTemplate.expectedResults : [],
      finalOutputItems: Array.isArray(selectedTemplate.finalOutputItems) ? selectedTemplate.finalOutputItems : [],
      steps: Array.isArray(selectedTemplate.steps) ? selectedTemplate.steps : [],
      metricDefinitions: Array.isArray(selectedTemplate.metricDefinitions)
        ? selectedTemplate.metricDefinitions
        : [],
    }
  }, [selectedTemplate, packageTitle])

  useEffect(() => {
    if (editingCampaign?.metrics?.notes) {
      const match = String(editingCampaign.metrics.notes).match(/Start Date:\s*(\d{4}-\d{2}-\d{2})/)
      if (match) setStartDate(match[1])
    }
  }, [editingCampaign])

  const launchCampaign = async () => {
    if (!startDate) {
      addToast('Please select a start date before launching campaign.', 'warning')
      return
    }

    try {
      const tasks = createTaskPayload(activePlan)
      const metricValues = createMetricValuePayload(activePlan)
      const customTasks = createTaskPayloadFromTemplate(selectedTemplate)
      const customMetricValues = createMetricValuePayloadFromTemplate(selectedTemplate)
      const useTemplateRuntime = customTasks.length > 0
      const runtimeTasks = useTemplateRuntime ? customTasks : tasks
      const runtimeMetricValues = useTemplateRuntime ? customMetricValues : metricValues
      const notes = useTemplateRuntime
        ? `Template Campaign: ${selectedTemplate?.title || selectedTemplate?.name || packageTitle}\nStart Date: ${startDate}`
        : `Plan Key: ${activePlan.key}\nPackage: ${packageTitle}\nStart Date: ${startDate}`

      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, {
          title: packageTitle,
          status: 'running',
          tasks: runtimeTasks,
          metricValues: runtimeMetricValues,
          progress: 0,
          metrics: {
            ...editingCampaign.metrics,
            notes,
          },
        })
        navigate(`/dashboard/campaigns/${editingCampaign.id}`)
        return
      }

      const templateId = normalizeTemplateId(selectedTemplate?.id)
      const created = await createCampaign({
        title: useTemplateRuntime
          ? (selectedTemplate?.title || selectedTemplate?.name || packageTitle)
          : packageTitle,
        ...(templateId ? { templateId } : {}),
      })

      await updateCampaign(created.id, {
        status: 'running',
        tasks: runtimeTasks,
        metricValues: runtimeMetricValues,
        progress: 0,
        metrics: {
          impressions: 0,
          clicks: 0,
          leads: 0,
          engagement: 0,
          sales: 0,
          budgetSpentLKR: 0,
          revenue: 0,
          notes,
        },
      })

      setSelectedTemplate(null)
      navigate(`/dashboard/campaigns/${created.id}`)
    } catch (error) {
      addToast(error?.message || 'Failed to launch campaign.', 'warning')
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">{packageTitle}</h1>
            <p className="page-subtitle">Final preview page with complete execution details before launch.</p>
          </div>

          <Card title="Package Overview" subtitle="Platform campaign package before final launch.">
            <div className="template-preview-summary">
              <div className="template-preview-pill">
                <strong>Duration</strong>
                <span>{selectedTemplateSummary?.durationLabel || activePlan.package.duration}</span>
              </div>
              <div className="template-preview-pill">
                <strong>Budget</strong>
                <span>
                  LKR {(selectedTemplateSummary?.estimatedBudgetLKR || activePlan.package.budget).toLocaleString()}
                </span>
              </div>
              <div className="template-preview-pill">
                <strong>Goal</strong>
                <span>{selectedTemplateSummary?.objective || activePlan.package.goal}</span>
              </div>
            </div>

            {selectedTemplateSummary ? (
              <div className="section-stack" style={{ marginTop: '1rem' }}>
                <strong>Selected Template (Short Preview)</strong>
                <p className="card-muted">{selectedTemplateSummary.description || 'No description available.'}</p>
                <p className="card-muted">Stage: {selectedTemplateSummary.stage} | Category: {selectedTemplateSummary.category}</p>
                {selectedTemplateSummary.campaignOverview ? (
                  <p className="card-muted">Overview: {selectedTemplateSummary.campaignOverview}</p>
                ) : null}
                {selectedTemplateSummary.targetAudience ? (
                  <p className="card-muted">Target Audience: {selectedTemplateSummary.targetAudience}</p>
                ) : null}

                {(selectedTemplateSummary.idealFor || []).length ? (
                  <>
                    <strong>Ideal For</strong>
                    <ul>
                      {selectedTemplateSummary.idealFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {(selectedTemplateSummary.budgetBreakdown || []).length ? (
                  <>
                    <strong>Budget Breakdown</strong>
                    <ul>
                      {selectedTemplateSummary.budgetBreakdown.map((item, index) => (
                        <li key={`${item.label}-${index}`}>
                          {item.label}: LKR {Number(item.amountLKR || 0).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {(selectedTemplateSummary.executionPlan || []).length ? (
                  <>
                    <strong>Execution Flow (Short Preview)</strong>
                    <ul>
                      {selectedTemplateSummary.executionPlan.map((dayItem, index) => (
                        <li key={`${dayItem.day}-${index}`}>
                          Day {dayItem.day}: {dayItem.title}{dayItem.focus ? ` - ${dayItem.focus}` : ''}
                        </li>
                      ))}
                    </ul>
                    <p className="card-muted">The full task checklist appears below before launch.</p>
                  </>
                ) : null}

                {selectedTemplateSummary.metricDefinitions.length ? (
                  <>
                    <strong>Metrics</strong>
                    <ul>
                      {selectedTemplateSummary.metricDefinitions.slice(0, 5).map((metric, index) => (
                        <li key={`${metric.name}-${index}`}>
                          {metric.name} ({metric.type}) {metric.required ? '- required' : '- optional'}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {(selectedTemplateSummary.expectedResults || []).length ? (
                  <>
                    <strong>Expected Results</strong>
                    <ul>
                      {selectedTemplateSummary.expectedResults.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : null}
          </Card>

          {selectedTemplateSummary?.executionPlan?.length ? (
            <>
              <Card title="Full Campaign Preview" subtitle="All task details shown before launch.">
                <div className="activity-log">
                  {selectedTemplateSummary.executionPlan.map((dayData, index) => (
                    <div key={`${dayData.day}-${index}`} className="activity-item">
                      <strong>Day {dayData.day} – {dayData.title}</strong>
                      {dayData.focus ? <p className="card-muted">Focus: {dayData.focus}</p> : null}
                      <ul>
                        {(dayData.tasks || []).map((task) => <li key={task}>{task}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <strong>Required Metrics</strong>
                <ul>
                  {(selectedTemplateSummary.metricDefinitions || []).map((metric, index) => (
                    <li key={`${metric.name}-${index}`}>
                      <strong>{metric.name}</strong> ({metric.type}) {metric.required ? '- required' : '- optional'}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Final Campaign Outcome Summary">
                <ul>
                  {(selectedTemplateSummary.finalOutputItems || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Card>
            </>
          ) : (
            <>
              <div className="template-week-grid">
                {activePlan.phases.map((phase) => (
                  <Card key={phase.phase} title={`Phase ${phase.phase} – ${phase.title}`} subtitle={phase.objective}>
                    <p className="card-muted"><strong>Allocated Budget:</strong> LKR {phase.budget.toLocaleString()}</p>
                    <ul>
                      {phase.budgetItems.map((item) => (<li key={item}>{item}</li>))}
                    </ul>

                    <strong>Detailed Tasks</strong>
                    <div className="activity-log">
                      {phase.dayTasks.map((dayData) => (
                        <div key={`${phase.phase}-${dayData.day}`} className="activity-item">
                          <strong>Day {dayData.day} – {dayData.title}</strong>
                          <ul>
                            {dayData.tasks.map((task) => <li key={task}>{task}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <strong>Required Metrics</strong>
                    <ul>
                      {phase.requiredMetrics.map((metric) => (
                        <li key={metric.key}><strong>{metric.label}:</strong> {metric.description}</li>
                      ))}
                    </ul>

                    <strong>Expected Output</strong>
                    <ul>
                      {phase.expectedOutput.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </Card>
                ))}
              </div>

              <Card title="Final Campaign Outcome Summary">
                <ul>
                  {activePlan.finalExpectedOutcome.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Card>
            </>
          )}

          <div className="toolbar-row">
            <label className="form-label" style={{ maxWidth: '320px' }}>
              Start Date
              <input type="date" className="form-control" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </label>
            <Button onClick={launchCampaign}>Launch Campaign</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign
