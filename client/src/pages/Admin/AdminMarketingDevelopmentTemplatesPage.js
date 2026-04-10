import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Modal from '../../components/Modal'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

const createEmptyExecutionDay = (day = 1) => ({
  day,
  title: '',
  focus: '',
  tasksText: '',
})

const createInitialForm = () => ({
  title: '',
  description: '',
  stage: 'earlyStartup',
  category: 'Social Media',
  tags: '',
  durationLabel: '',
  objective: '',
  campaignOverview: '',
  targetAudience: '',
  idealFor: '',
  estimatedBudgetLKR: '',
  estimatedDurationDays: '',
  budgetBreakdown: 'Awareness Ads:4000\nEngagement Boost:2500',
  executionPlanDays: [
    {
      day: 1,
      title: 'Awareness Setup',
      focus: 'Reach + brand visibility',
      tasksText: 'Define audience\nCreate brand intro creative\nLaunch awareness campaign',
    },
    {
      day: 2,
      title: 'Engagement Boost',
      focus: 'Build interaction momentum',
      tasksText: 'Boost best-performing post\nRespond to comments quickly',
    },
  ],
  expectedResults: '25,000 - 40,000 Reach\n1,500 - 3,000 Engagement\n300 - 600 New Followers',
  finalOutputItems: 'Total Spend\nTotal Reach\nTotal Engagement\nFollowers Gained\nBest Performing Creative',
  metricDefinitions: 'Total Ad Spend:number:required\nTotal Reach:number:required\nTotal Engagement:number:required',
})

function AdminMarketingDevelopmentTemplatesPage() {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useAppContext()
  const [editingId, setEditingId] = useState(null)
  const [viewingTemplate, setViewingTemplate] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(createInitialForm)

  const rows = useMemo(
    () => [...templates].sort((a, b) => String(b?.id || '').localeCompare(String(a?.id || ''))),
    [templates],
  )

  const resetForm = () => {
    setEditingId(null)
    setForm(createInitialForm())
  }

  const updateExecutionDay = (index, field, value) => {
    setForm((current) => ({
      ...current,
      executionPlanDays: current.executionPlanDays.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }))
  }

  const addExecutionDay = () => {
    setForm((current) => ({
      ...current,
      executionPlanDays: [...current.executionPlanDays, createEmptyExecutionDay(current.executionPlanDays.length + 1)],
    }))
  }

  const removeExecutionDay = (index) => {
    setForm((current) => ({
      ...current,
      executionPlanDays: current.executionPlanDays
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({ ...item, day: itemIndex + 1 })),
    }))
  }

  const toPayload = () => {
    const tags = form.tags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const budgetBreakdown = form.budgetBreakdown
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, amountRaw = '0'] = line.split(':').map((item) => item.trim())
        return {
          label,
          amountLKR: Number(amountRaw || 0),
        }
      })
      .filter((item) => item.label)

    const executionPlan = form.executionPlanDays
      .map((item, index) => ({
        day: Number(item.day || index + 1),
        title: String(item.title || `Day ${index + 1}`).trim(),
        focus: String(item.focus || '').trim(),
        tasks: String(item.tasksText || '')
          .split('\n')
          .map((task) => task.trim())
          .filter(Boolean),
      }))
      .filter((item) => item.title || item.focus || item.tasks.length)

    const metricDefinitions = form.metricDefinitions
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, type = 'number', required = 'optional'] = line.split(':').map((item) => item.trim())
        return {
          name,
          type: ['number', 'percentage', 'currency'].includes(type) ? type : 'number',
          required: required.toLowerCase() === 'required',
        }
      })

    const expectedResults = form.expectedResults
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    const finalOutputItems = form.finalOutputItems
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    const idealFor = form.idealFor
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      stage: form.stage,
      category: form.category.trim(),
      tags,
      durationLabel: form.durationLabel.trim(),
      objective: form.objective.trim(),
      campaignOverview: form.campaignOverview.trim(),
      targetAudience: form.targetAudience.trim(),
      idealFor,
      estimatedBudgetLKR: Number(form.estimatedBudgetLKR || 0),
      estimatedDurationDays: Number(form.estimatedDurationDays || 1),
      budgetBreakdown,
      executionPlan,
      expectedResults,
      finalOutputItems,
      metricDefinitions,
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = toPayload()
      if (editingId) {
        await updateTemplate(editingId, payload)
      } else {
        await createTemplate(payload)
      }
      resetForm()
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (template) => {
    setEditingId(template.id)
    setForm({
      title: template.title,
      description: template.description,
      stage: template.stage,
      category: template.category,
      tags: (template.tags || []).join(', '),
      durationLabel: template.durationLabel || '',
      objective: template.objective || '',
      campaignOverview: template.campaignOverview || '',
      targetAudience: template.targetAudience || '',
      idealFor: (template.idealFor || []).join('\n'),
      estimatedBudgetLKR: String(template.estimatedBudgetLKR || ''),
      estimatedDurationDays: String(template.estimatedDurationDays || ''),
      budgetBreakdown: (template.budgetBreakdown || [])
        .map((item) => `${item.label}:${item.amountLKR}`)
        .join('\n'),
      executionPlanDays: (template.executionPlan || []).length
        ? (template.executionPlan || []).map((item, index) => ({
          day: Number(item.day || index + 1),
          title: item.title || '',
          focus: item.focus || '',
          tasksText: (item.tasks || []).join('\n'),
        }))
        : [createEmptyExecutionDay(1)],
      expectedResults: (template.expectedResults || []).join('\n'),
      finalOutputItems: (template.finalOutputItems || []).join('\n'),
      metricDefinitions: (template.metricDefinitions || [])
        .map((metric) => `${metric.name}:${metric.type}:${metric.required ? 'required' : 'optional'}`)
        .join('\n'),
    })
  }

  const handleDelete = async (templateId) => {
    await deleteTemplate(templateId)
    if (editingId === templateId) {
      resetForm()
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack">
          <div>
            <p className="page-kicker">Admin Module</p>
            <h1 className="page-title">Marketing & Development</h1>
            <p className="page-subtitle">Manage marketing content module pages.</p>
          </div>

          <div className="filter-tabs">
            <NavLink to="/admin/marketing-development/articles" className="filter-tab">
              Articles
            </NavLink>
            <NavLink to="/admin/marketing-development/templates" className="filter-tab active">
              Templates
            </NavLink>
          </div>

          <Card
            title="Templates"
            subtitle="Post structured campaign templates that flow into cards, short preview, launch preview, task checklist, and final analysis."
          >
            <form className="section-stack" onSubmit={handleSubmit}>
              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Title
                  <input className="form-control" placeholder="e.g. Facebook Brand Growth & Engagement Sprint" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
                </label>
                <label className="form-label">
                  Category
                  <input className="form-control" placeholder="e.g. Social Media, WhatsApp, Email" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required />
                </label>
              </div>

              <label className="form-label">
                Short Description
                <textarea className="form-control" rows={3} placeholder="Short card summary for users." value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
              </label>

              <label className="form-label">
                Campaign Overview
                <textarea className="form-control" rows={4} placeholder="Full campaign explanation, what it is for, and what it tries to achieve." value={form.campaignOverview} onChange={(event) => setForm((current) => ({ ...current, campaignOverview: event.target.value }))} />
              </label>

              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Duration Label
                  <input className="form-control" placeholder="e.g. 7 Days" value={form.durationLabel} onChange={(event) => setForm((current) => ({ ...current, durationLabel: event.target.value }))} />
                </label>
                <label className="form-label">
                  Campaign Objective
                  <input className="form-control" placeholder="e.g. Increase Brand Awareness, Engagement & Followers" value={form.objective} onChange={(event) => setForm((current) => ({ ...current, objective: event.target.value }))} />
                </label>
              </div>

              <label className="form-label">
                Target Audience
                <textarea className="form-control" rows={2} placeholder="Who this campaign targets." value={form.targetAudience} onChange={(event) => setForm((current) => ({ ...current, targetAudience: event.target.value }))} />
              </label>

              <label className="form-label">
                Ideal For (one item per line)
                <textarea className="form-control" rows={3} placeholder={'Local service providers\nSmall online sellers\nAppointment-based businesses'} value={form.idealFor} onChange={(event) => setForm((current) => ({ ...current, idealFor: event.target.value }))} />
              </label>

              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Stage
                  <select className="form-control" value={form.stage} onChange={(event) => setForm((current) => ({ ...current, stage: event.target.value }))}>
                    <option value="earlyStartup">Early Startup</option>
                    <option value="growing">Growing</option>
                    <option value="established">Established</option>
                  </select>
                </label>
                <label className="form-label">
                  Tags (comma separated)
                  <input className="form-control" placeholder="e.g. facebook, engagement, sprint" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
                </label>
              </div>

              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Estimated Budget (LKR)
                  <input type="number" className="form-control" placeholder="e.g. 12000" value={form.estimatedBudgetLKR} onChange={(event) => setForm((current) => ({ ...current, estimatedBudgetLKR: event.target.value }))} />
                </label>
                <label className="form-label">
                  Estimated Duration (days)
                  <input type="number" className="form-control" placeholder="e.g. 7" value={form.estimatedDurationDays} onChange={(event) => setForm((current) => ({ ...current, estimatedDurationDays: event.target.value }))} />
                </label>
              </div>

              <label className="form-label">
                Budget Breakdown (one line per item, format: Label:Amount)
                <textarea className="form-control" rows={4} placeholder={'Awareness Ads:4000\nEngagement Boost:2500\nVideo Promotion:2500'} value={form.budgetBreakdown} onChange={(event) => setForm((current) => ({ ...current, budgetBreakdown: event.target.value }))} />
              </label>

              <div className="section-stack">
                <div className="toolbar-row">
                  <div>
                    <strong>Execution Plan</strong>
                    <p className="card-muted">Add each day separately. Inside a day, type one task per line so the launched campaign can convert them into checkbox items.</p>
                  </div>
                  <Button type="button" variant="secondary" onClick={addExecutionDay}>Add Day</Button>
                </div>

                {form.executionPlanDays.map((dayItem, index) => (
                  <Card key={`execution-day-${index}`} title={`Day ${index + 1}`} subtitle="This block becomes one day section in short preview and full launch preview.">
                    <div className="section-stack">
                      <div className="layout-grid" style={{ gridTemplateColumns: '120px 1fr' }}>
                        <label className="form-label">
                          Day Number
                          <input type="number" className="form-control" value={dayItem.day} onChange={(event) => updateExecutionDay(index, 'day', event.target.value)} min="1" />
                        </label>
                        <label className="form-label">
                          Day Title
                          <input className="form-control" placeholder="e.g. Awareness Setup" value={dayItem.title} onChange={(event) => updateExecutionDay(index, 'title', event.target.value)} />
                        </label>
                      </div>

                      <label className="form-label">
                        Focus
                        <input className="form-control" placeholder="e.g. Reach + Brand visibility" value={dayItem.focus} onChange={(event) => updateExecutionDay(index, 'focus', event.target.value)} />
                      </label>

                      <label className="form-label">
                        Tasks (one task per line)
                        <textarea className="form-control" rows={5} placeholder={'Define audience\nCreate brand introduction creative\nLaunch awareness campaign\nSet daily budget\nMonitor first 6-8 hours'} value={dayItem.tasksText} onChange={(event) => updateExecutionDay(index, 'tasksText', event.target.value)} />
                      </label>

                      <div className="inline-actions">
                        {form.executionPlanDays.length > 1 ? (
                          <Button type="button" variant="secondary" onClick={() => removeExecutionDay(index)}>Remove Day</Button>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <label className="form-label">
                Expected Results (one line per result)
                <textarea className="form-control" rows={4} placeholder={'25,000 - 40,000 Reach\n1,500 - 3,000 Engagement\n300 - 600 New Followers'} value={form.expectedResults} onChange={(event) => setForm((current) => ({ ...current, expectedResults: event.target.value }))} />
              </label>

              <label className="form-label">
                Final Output Required (one line per item)
                <textarea className="form-control" rows={4} placeholder={'Total Spend\nTotal Reach\nTotal Engagement\nFollowers Gained\nBest Performing Creative'} value={form.finalOutputItems} onChange={(event) => setForm((current) => ({ ...current, finalOutputItems: event.target.value }))} />
              </label>

              <label className="form-label">
                Metric Definitions (one line per metric, format: name:type:required|optional)
                <textarea className="form-control" rows={5} placeholder={'Total Ad Spend:currency:required\nTotal Reach:number:required\nCost Per Engagement:currency:optional'} value={form.metricDefinitions} onChange={(event) => setForm((current) => ({ ...current, metricDefinitions: event.target.value }))} />
              </label>

              <div className="inline-actions">
                <Button type="submit" disabled={submitting}>{editingId ? 'Update Template' : 'Add Template'}</Button>
                {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel Edit</Button> : null}
              </div>
            </form>

            <h3 style={{ marginTop: '1.25rem' }}>All Templates</h3>
            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'stage', label: 'Stage' },
                { key: 'category', label: 'Category' },
                {
                  key: 'createdBy',
                  label: 'Created By',
                  render: (value) => value?.name || value?.email || 'Unknown',
                },
                {
                  key: 'estimatedBudgetLKR',
                  label: 'Budget (LKR)',
                  render: (value) => Number(value || 0).toLocaleString(),
                },
                { key: 'estimatedDurationDays', label: 'Duration (days)' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <div className="inline-actions">
                      <Button variant="secondary" onClick={() => setViewingTemplate(row)}>View</Button>
                      <Button variant="secondary" onClick={() => handleEdit(row)}>Edit</Button>
                      <Button variant="secondary" onClick={() => handleDelete(row.id)}>Delete</Button>
                    </div>
                  ),
                },
              ]}
              rows={rows}
              emptyMessage="No templates available yet."
            />
          </Card>

          <Modal
            isOpen={Boolean(viewingTemplate)}
            onClose={() => setViewingTemplate(null)}
            size="large"
            title={viewingTemplate?.title || 'Template Preview'}
          >
            {viewingTemplate ? (
              <div className="section-stack">
                <p className="card-muted"><strong>Description:</strong> {viewingTemplate.description}</p>
                <p className="card-muted"><strong>Stage:</strong> {viewingTemplate.stage}</p>
                <p className="card-muted"><strong>Category:</strong> {viewingTemplate.category}</p>
                <p className="card-muted"><strong>Duration:</strong> {viewingTemplate.durationLabel || `${viewingTemplate.estimatedDurationDays} days`}</p>
                <p className="card-muted"><strong>Budget:</strong> LKR {Number(viewingTemplate.estimatedBudgetLKR || 0).toLocaleString()}</p>
                <p className="card-muted"><strong>Objective:</strong> {viewingTemplate.objective || '-'}</p>
                <p className="card-muted"><strong>Overview:</strong> {viewingTemplate.campaignOverview || '-'}</p>
                <p className="card-muted"><strong>Target Audience:</strong> {viewingTemplate.targetAudience || '-'}</p>

                {(viewingTemplate.idealFor || []).length ? (
                  <div>
                    <strong>Ideal For</strong>
                    <ul>
                      {(viewingTemplate.idealFor || []).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {(viewingTemplate.budgetBreakdown || []).length ? (
                  <div>
                    <strong>Budget Breakdown</strong>
                    <ul>
                      {(viewingTemplate.budgetBreakdown || []).map((item, index) => (
                        <li key={`${item.label}-${index}`}>{item.label}: LKR {Number(item.amountLKR || 0).toLocaleString()}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <strong>Execution Plan (Short Preview)</strong>
                  <ul>
                    {(viewingTemplate.executionPlan || []).map((dayItem, index) => (
                      <li key={`${dayItem.title}-${index}`}>
                        Day {dayItem.day}: {dayItem.title} {dayItem.focus ? `- ${dayItem.focus}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>

                {(viewingTemplate.expectedResults || []).length ? (
                  <div>
                    <strong>Expected Results</strong>
                    <ul>
                      {(viewingTemplate.expectedResults || []).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <strong>Metric Definitions</strong>
                  <ul>
                    {(viewingTemplate.metricDefinitions || []).map((metric, index) => (
                      <li key={`${metric.name}-${index}`}>
                        {metric.name} ({metric.type}) {metric.required ? '- required' : '- optional'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default AdminMarketingDevelopmentTemplatesPage
