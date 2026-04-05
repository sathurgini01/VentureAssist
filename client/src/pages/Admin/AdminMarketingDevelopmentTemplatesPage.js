import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

function AdminMarketingDevelopmentTemplatesPage() {
  const { templates, createTemplate, updateTemplate, deleteTemplate } = useAppContext()
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    stage: 'earlyStartup',
    category: 'Social Media',
    tags: '',
    estimatedBudgetLKR: '',
    estimatedDurationDays: '',
    steps: 'Day 1 planning\nDay 2 content production',
    metricDefinitions: 'Impressions:number:required\nClicks:number:required\nRevenue:currency:optional',
  })

  const rows = useMemo(() => templates, [templates])

  const resetForm = () => {
    setEditingId(null)
    setForm({
      title: '',
      description: '',
      stage: 'earlyStartup',
      category: 'Social Media',
      tags: '',
      estimatedBudgetLKR: '',
      estimatedDurationDays: '',
      steps: 'Day 1 planning\nDay 2 content production',
      metricDefinitions: 'Impressions:number:required\nClicks:number:required\nRevenue:currency:optional',
    })
  }

  const toPayload = () => {
    const tags = form.tags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const steps = form.steps
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({
        title: line,
        description: '',
        order: index + 1,
      }))

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

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      stage: form.stage,
      category: form.category.trim(),
      tags,
      estimatedBudgetLKR: Number(form.estimatedBudgetLKR || 0),
      estimatedDurationDays: Number(form.estimatedDurationDays || 1),
      steps,
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
      estimatedBudgetLKR: String(template.estimatedBudgetLKR || ''),
      estimatedDurationDays: String(template.estimatedDurationDays || ''),
      steps: (template.steps || []).map((step) => step.title).join('\n'),
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
            subtitle="Create, update, and delete marketing templates with timeline and dynamic metric definitions."
          >
            <form className="section-stack" onSubmit={handleSubmit}>
              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Title
                  <input className="form-control" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
                </label>
                <label className="form-label">
                  Category
                  <input className="form-control" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required />
                </label>
              </div>

              <label className="form-label">
                Description
                <textarea className="form-control" rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} required />
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
                  <input className="form-control" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
                </label>
              </div>

              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Estimated Budget (LKR)
                  <input type="number" className="form-control" value={form.estimatedBudgetLKR} onChange={(event) => setForm((current) => ({ ...current, estimatedBudgetLKR: event.target.value }))} />
                </label>
                <label className="form-label">
                  Estimated Duration (days)
                  <input type="number" className="form-control" value={form.estimatedDurationDays} onChange={(event) => setForm((current) => ({ ...current, estimatedDurationDays: event.target.value }))} />
                </label>
              </div>

              <label className="form-label">
                Timeline Steps (one step per line)
                <textarea className="form-control" rows={4} value={form.steps} onChange={(event) => setForm((current) => ({ ...current, steps: event.target.value }))} />
              </label>

              <label className="form-label">
                Metric Definitions (format: name:type:required|optional)
                <textarea className="form-control" rows={4} value={form.metricDefinitions} onChange={(event) => setForm((current) => ({ ...current, metricDefinitions: event.target.value }))} />
              </label>

              <div className="inline-actions">
                <Button type="submit" disabled={submitting}>{editingId ? 'Update Template' : 'Add Template'}</Button>
                {editingId ? <Button type="button" variant="secondary" onClick={resetForm}>Cancel Edit</Button> : null}
              </div>
            </form>

            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'stage', label: 'Stage' },
                { key: 'category', label: 'Category' },
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
        </div>
      </div>
    </div>
  )
}

export default AdminMarketingDevelopmentTemplatesPage
