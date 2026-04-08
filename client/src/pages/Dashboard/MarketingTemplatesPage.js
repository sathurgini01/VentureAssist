import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import TemplateCard from '../../components/MarketingTemplateCard'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function Templates() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const previewId = searchParams.get('preview')
  const { templates, applyTemplateToCampaign } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = useMemo(
    () => ['all', ...new Set(templates.map((item) => item.category).filter(Boolean))],
    [templates],
  )

  const previewTemplate = templates.find((item) => item.id === previewId)

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesStage = stageFilter === 'all' || template.stage === stageFilter
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
      const matchesSearch = `${template.title} ${template.description} ${template.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return matchesStage && matchesCategory && matchesSearch
    })
  }, [templates, stageFilter, categoryFilter, searchTerm])

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Templates</h1>
            <p className="page-subtitle">Browse and apply reusable template strategies.</p>
          </div>

          <div className="toolbar-row">
            <input
              className="search-input"
              placeholder="Search templates"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <select className="form-control" value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
              <option value="all">All stages</option>
              <option value="earlyStartup">Early Startup</option>
              <option value="growing">Growing</option>
              <option value="established">Established</option>
            </select>
            <select className="form-control" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All categories' : category}
                </option>
              ))}
            </select>
          </div>

          {previewTemplate ? (
            <Card title={`${previewTemplate.title} Preview`} subtitle={previewTemplate.description}>
              <p className="card-muted">Stage: {previewTemplate.stage}</p>
              <p className="card-muted">Category: {previewTemplate.category}</p>
              <p className="card-muted">Duration: {previewTemplate.estimatedDurationDays} days</p>
              <p className="card-muted">Budget: LKR {previewTemplate.estimatedBudgetLKR.toLocaleString()}</p>

              <strong>Timeline Steps</strong>
              <ul>
                {previewTemplate.steps.map((step) => (
                  <li key={`${step.order}-${step.title}`}>{step.title}</li>
                ))}
              </ul>

              <strong>Defined Metrics</strong>
              <ul>
                {previewTemplate.metricDefinitions?.map((metric) => (
                  <li key={`${metric.name}-${metric.type}`}>
                    {metric.name} ({metric.type}) {metric.required ? '- required' : ''}
                  </li>
                ))}
              </ul>

              <div className="inline-actions">
                <Button
                  onClick={() => {
                    applyTemplateToCampaign(previewTemplate)
                    navigate('/dashboard/campaigns/new')
                  }}
                >
                  Use Template
                </Button>
              </div>
            </Card>
          ) : null}

          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Templates


