import { useNavigate } from 'react-router-dom'
import Button from './Button'
import '../styles/Cards.css'
import Card from './Card'
import { useAppContext } from '../context/AppContext'

function TemplateCard({ template }) {
  const navigate = useNavigate()
  const { applyTemplateToCampaign, addToast } = useAppContext()

  return (
    <Card title={template.name} subtitle={template.category}>
      <p className="card-muted">Format: {template.format}</p>
      <div className="inline-actions">
        <Button
          onClick={() => {
            applyTemplateToCampaign(template)
            navigate('/dashboard/campaigns/new')
          }}
        >
          Use Template
        </Button>
        <Button variant="secondary" onClick={() => addToast(`Previewing ${template.name}.`)}>
          Preview
        </Button>
      </div>
    </Card>
  )
}

export default TemplateCard
