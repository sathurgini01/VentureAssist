import { useNavigate } from 'react-router-dom'
import Button from './Button'
import '../styles/Cards.css'
import Card from './Card'
import { useAppContext } from '../context/AppContext'

function TemplateCard({ template }) {
  const navigate = useNavigate()
  const { applyTemplateToCampaign } = useAppContext()

  return (
    <Card title={template.name} subtitle={template.description || template.category}>
      <p className="card-muted">Stage: {template.stage}</p>
      <p className="card-muted">Category: {template.category}</p>
      <p className="card-muted">Duration: {template.estimatedDurationDays} days</p>
      <p className="card-muted">Estimated Budget: LKR {template.estimatedBudgetLKR.toLocaleString()}</p>
      <div className="inline-actions">
        <Button
          onClick={() => {
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
  )
}

export default TemplateCard
