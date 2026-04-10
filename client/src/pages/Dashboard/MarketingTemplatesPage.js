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

  const availableTemplates = useMemo(() => templates, [templates])

  const categories = useMemo(
    () => ['all', ...new Set(availableTemplates.map((item) => item.category).filter(Boolean))],
    [availableTemplates],
  )

  const previewTemplate = availableTemplates.find((item) => item.id === previewId)

  const filteredTemplates = useMemo(() => {
    return availableTemplates.filter((template) => {
      const matchesStage = stageFilter === 'all' || template.stage === stageFilter
      const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter
      const matchesSearch = `${template.title} ${template.description} ${template.category}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

      return matchesStage && matchesCategory && matchesSearch
    })
  }, [availableTemplates, stageFilter, categoryFilter, searchTerm])

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content templates-page">
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
              <p className="card-muted">Duration: {previewTemplate.durationLabel || `${previewTemplate.estimatedDurationDays} days`}</p>
              <p className="card-muted">Budget: LKR {previewTemplate.estimatedBudgetLKR.toLocaleString()}</p>
              <p className="card-muted">Objective: {previewTemplate.objective || '-'}</p>
              <p className="card-muted">Overview: {previewTemplate.campaignOverview || previewTemplate.description}</p>
              <p className="card-muted">Target Audience: {previewTemplate.targetAudience || '-'}</p>

              {(previewTemplate.idealFor || []).length ? (
                <>
                  <strong>Ideal For</strong>
                  <ul>
                    {(previewTemplate.idealFor || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {(previewTemplate.budgetBreakdown || []).length ? (
                <>
                  <strong>Budget Breakdown</strong>
                  <ul>
                    {(previewTemplate.budgetBreakdown || []).map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        {item.label}: LKR {Number(item.amountLKR || 0).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {(previewTemplate.executionPlan || []).length ? (
                <>
                  <strong>Execution Flow (Short Preview)</strong>
                  <ul>
                    {(previewTemplate.executionPlan || []).map((item, index) => (
                      <li key={`${item.day}-${index}`}>
                        Day {item.day}: {item.title}{item.focus ? ` - ${item.focus}` : ''}
                      </li>
                    ))}
                  </ul>
                  <p className="card-muted">Full task checklist appears only after you continue to the launch page.</p>
                </>
              ) : null}

              {(previewTemplate.expectedResults || []).length ? (
                <>
                  <strong>Expected Results</strong>
                  <ul>
                    {(previewTemplate.expectedResults || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {(previewTemplate.finalOutputItems || []).length ? (
                <>
                  <strong>Final Output Required</strong>
                  <ul>
                    {(previewTemplate.finalOutputItems || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {(previewTemplate.metricDefinitions || []).length ? (
                <>
                  <strong>Metrics to Track</strong>
                  <ul>
                    {(previewTemplate.metricDefinitions || []).slice(0, 5).map((metric, index) => (
                      <li key={`${metric.name}-${index}`}>
                        {metric.name} ({metric.type}) {metric.required ? '- required' : '- optional'}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

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

          {filteredTemplates.length === 0 ? (
            <Card title="No templates found" subtitle="Try changing filters or add templates from the template submission flow." />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Templates






