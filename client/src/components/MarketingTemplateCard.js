import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'
import '../styles/Cards.css'
import Card from './Card'
import Modal from './Modal'
import { useAppContext } from '../context/AppContext'
import { getCampaignPlanByKey, inferPlanKeyFromTemplateTitle } from '../data/instagramCampaignPlan'

function TemplateCard({ template }) {
  const navigate = useNavigate()
  const { applyTemplateToCampaign } = useAppContext()
  const [previewOpen, setPreviewOpen] = useState(false)

  const rawTitle = template?.name || template?.title || 'Template'
  const planKey = template?.planKey || inferPlanKeyFromTemplateTitle(rawTitle)
  const plan = getCampaignPlanByKey(planKey)
  const displayTitle = rawTitle
  const shortPreviewItems = (template.executionPlan || []).slice(0, 4)

  const launchFromPreview = () => {
    applyTemplateToCampaign(template)
    setPreviewOpen(false)
    navigate('/dashboard/campaigns/new')
  }

  return (
    <>
      <Card title={displayTitle} subtitle={template.description || template.category}>
        <p className="card-muted">Stage: {template.stage}</p>
        <p className="card-muted">Category: {template.category}</p>
        <p className="card-muted">Duration: {template.durationLabel || `${template.estimatedDurationDays} days`}</p>
        <p className="card-muted">Estimated Budget: LKR {template.estimatedBudgetLKR.toLocaleString()}</p>
        <div className="inline-actions">
          <Button
            onClick={() => {
              setPreviewOpen(true)
            }}
          >
            Use Template
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/dashboard/templates?preview=${template.id}`)}>
            Preview
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        size="large"
        title={displayTitle}
      >
        <div className="template-preview-shell">
          <div className="template-preview-summary">
            <div className="template-preview-pill"><strong>Stage</strong><span>{template.stage}</span></div>
            <div className="template-preview-pill"><strong>Duration</strong><span>{template.durationLabel || `${template.estimatedDurationDays} days`}</span></div>
            <div className="template-preview-pill"><strong>Budget</strong><span>LKR {Number(template.estimatedBudgetLKR || 0).toLocaleString()}</span></div>
          </div>

          <div className="template-budget-card">
            <strong>Description</strong>
            <p className="card-muted">{template.description || 'No description added.'}</p>
          </div>

          {template.campaignOverview ? (
            <div className="template-budget-card">
              <strong>Campaign Overview</strong>
              <p className="card-muted">{template.campaignOverview}</p>
            </div>
          ) : null}

          {template.objective ? (
            <div className="template-budget-card">
              <strong>Objective</strong>
              <p className="card-muted">{template.objective}</p>
            </div>
          ) : null}

          {template.targetAudience ? (
            <div className="template-budget-card">
              <strong>Target Audience</strong>
              <p className="card-muted">{template.targetAudience}</p>
            </div>
          ) : null}

          {(template.idealFor || []).length ? (
            <div className="template-budget-card">
              <strong>Ideal For</strong>
              <ul>
                {(template.idealFor || []).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}

          {(template.budgetBreakdown || []).length ? (
            <div className="template-budget-card">
              <strong>Budget Breakdown</strong>
              <ul>
                {(template.budgetBreakdown || []).map((item, index) => (
                  <li key={`${item.label}-${index}`}>
                    {item.label}: LKR {Number(item.amountLKR || 0).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {shortPreviewItems.length ? (
            <div className="template-budget-card">
              <strong>Execution Flow (Short Preview)</strong>
              <ul>
                {shortPreviewItems.map((item, index) => (
                  <li key={`${item.day}-${index}`}>
                    Day {item.day}: {item.title}{item.focus ? ` - ${item.focus}` : ''}
                  </li>
                ))}
              </ul>
              {(template.executionPlan || []).length > shortPreviewItems.length ? (
                <p className="card-muted">More days continue in the launch preview.</p>
              ) : null}
              <p className="card-muted">Detailed task checklist appears in the final campaign preview page.</p>
            </div>
          ) : null}

          {(template.metricDefinitions || []).length ? (
            <div className="template-budget-card">
              <strong>Required Metrics</strong>
              <ul>
                {(template.metricDefinitions || []).map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    {item.name} ({item.type}) {item.required ? '- required' : '- optional'}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {(template.expectedResults || []).length ? (
            <div className="template-budget-card">
              <strong>Expected Results</strong>
              <ul>
                {(template.expectedResults || []).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}

          {(template.finalOutputItems || []).length ? (
            <div className="template-budget-card">
              <strong>Final Output Required</strong>
              <ul>
                {(template.finalOutputItems || []).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}

          {plan && !(template.executionPlan || []).length ? (
            <div className="template-budget-card">
              <strong>Full Execution Preview</strong>
              <ul>
                {plan.shortPreview.flow.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="inline-actions">
            <Button onClick={launchFromPreview}>Start Campaign</Button>
            <Button variant="secondary" onClick={() => setPreviewOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TemplateCard
