import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from './Button'
import '../styles/Cards.css'
import Card from './Card'
import Modal from './Modal'
import { useAppContext } from '../context/AppContext'

function TemplateCard({ template }) {
  const navigate = useNavigate()
  const { applyTemplateToCampaign } = useAppContext()
  const [previewOpen, setPreviewOpen] = useState(false)

  const rawTitle = template?.name || template?.title || 'Template'
  const displayTitle = String(rawTitle).toLowerCase().includes('start up instagram launch plan')
    ? 'Instagram Growth Sprint - 14 Days Edition'
    : rawTitle

  const isInstagramGrowthSprint = String(template?.name || template?.title || '')
    .toLowerCase()
    .includes('instagram')

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
        <p className="card-muted">Duration: {template.estimatedDurationDays} days</p>
        <p className="card-muted">Estimated Budget: LKR {template.estimatedBudgetLKR.toLocaleString()}</p>
        <div className="inline-actions">
          <Button
            onClick={() => {
              if (isInstagramGrowthSprint) {
                setPreviewOpen(true)
                return
              }
              applyTemplateToCampaign(template)
              navigate('/dashboard/campaigns/new')
            }}
          >
            Use Template
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/dashboard/templates?preview=${template.id}`)}>
            Preview
          </Button>
        </div>
      </Card>

      {isInstagramGrowthSprint ? (
        <Modal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          size="large"
          title="Instagram Growth Sprint - 14 Days Edition"
        >
          <div className="template-preview-shell">
            <div className="template-preview-summary">
              <div className="template-preview-pill"><strong>Duration</strong><span>14 Days</span></div>
              <div className="template-preview-pill"><strong>Budget</strong><span>LKR 25,000</span></div>
              <div className="template-preview-pill"><strong>Goal</strong><span>Generate 80–150 Leads</span></div>
            </div>

            <div className="template-week-grid">
              <div className="template-week-card">
                <h4>Week 1 – Awareness & Engagement</h4>
                <p className="card-muted"><strong>Budget:</strong> LKR 12,000</p>
                <p className="card-muted"><strong>Focus:</strong> Build reach & warm audience</p>
                <strong>Main Activities</strong>
                <ul>
                  <li>3 reels (educational/problem-based)</li>
                  <li>2 carousel posts</li>
                  <li>Daily story engagement</li>
                  <li>1 awareness ad campaign</li>
                  <li>Community interaction</li>
                  <li>Weekly performance review</li>
                </ul>
                <p className="card-muted"><strong>Expected Outcome:</strong> 15K–25K Reach, 4–6% Engagement Rate, warmed audience for retargeting.</p>
              </div>

              <div className="template-week-card">
                <h4>Week 2 – Lead Generation & Conversion</h4>
                <p className="card-muted"><strong>Budget:</strong> LKR 13,000</p>
                <p className="card-muted"><strong>Focus:</strong> Convert engaged users into leads</p>
                <strong>Main Activities</strong>
                <ul>
                  <li>Lead magnet post</li>
                  <li>2 conversion reels</li>
                  <li>Retargeting ads</li>
                  <li>Instagram live session</li>
                  <li>FAQ/objection carousel</li>
                  <li>Final conversion push</li>
                </ul>
                <p className="card-muted"><strong>Expected Outcome:</strong> 80–150 leads, CPL under LKR 150, increased DM conversations.</p>
              </div>
            </div>

            <div className="template-budget-card">
              <strong>Budget Allocation</strong>
              <ul>
                <li>Awareness Ads – LKR 7,000</li>
                <li>Engagement Boost – LKR 5,000</li>
                <li>Lead Ads – LKR 9,000</li>
                <li>Retargeting – LKR 4,000</li>
              </ul>
              <p><strong>Total – LKR 25,000</strong></p>
            </div>

            <div className="inline-actions">
              <Button onClick={launchFromPreview}>Start Campaign</Button>
              <Button variant="secondary" onClick={() => setPreviewOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  )
}

export default TemplateCard
