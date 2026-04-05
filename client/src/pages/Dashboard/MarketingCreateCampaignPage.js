import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const steps = ['Basic Info', 'Audience', 'Content', 'Review']

function CreateCampaign() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, createCampaign, updateCampaign, selectedTemplate, setSelectedTemplate, addToast } = useAppContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    campaignName: '',
    description: '',
    platform: 'Instagram',
    startDate: '',
    endDate: '',
    ageRange: 28,
    genders: ['Women', 'Men'],
    locations: ['Colombo', 'Kandy', 'Remote Founders'],
    interests: ['Startups', 'Marketing', 'Investor Relations'],
    budget: '$1,200',
    contentType: 'Video',
    headline: '',
    body: '',
    cta: '',
  })
  const [error, setError] = useState('')
  const editingCampaign = campaigns.find((campaign) => campaign.id === campaignId)

  useEffect(() => {
    if (!selectedTemplate || campaignId) {
      return
    }

    setFormData((current) => ({
      ...current,
      campaignName: selectedTemplate.name,
      platform: selectedTemplate.platform,
      headline: selectedTemplate.headline,
      body: selectedTemplate.body,
      cta: selectedTemplate.cta,
    }))
  }, [campaignId, selectedTemplate])

  useEffect(() => {
    if (!editingCampaign) {
      return
    }

    setFormData((current) => ({
      ...current,
      campaignName: editingCampaign.name ?? '',
      description: editingCampaign.description ?? '',
      platform: editingCampaign.platform ?? 'Instagram',
      startDate: editingCampaign.startDate ?? '',
      endDate: editingCampaign.endDate ?? '',
      budget: editingCampaign.budget ?? '$1,200',
      headline: editingCampaign.title ?? editingCampaign.name ?? '',
      body: editingCampaign.description ?? '',
      cta: editingCampaign.cta ?? '',
    }))
  }, [editingCampaign])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleNext = () => {
    if (
      currentStep === 0 &&
      (!formData.campaignName || !formData.description || !formData.startDate || !formData.endDate)
    ) {
      setError('Complete the required fields before continuing.')
      addToast('Please complete the required campaign details.', 'warning')
      return
    }

    setError('')
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const handleCreate = () => {
    if (!formData.headline || !formData.cta) {
      setError('Headline and CTA are required before creating a campaign.')
      addToast('Please complete the content step.', 'warning')
      return
    }

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        title: formData.campaignName,
      }).then(() => navigate(`/dashboard/campaigns/${editingCampaign.id}`))
      return
    }

    const payload = selectedTemplate?.id
      ? { templateId: selectedTemplate.id, title: formData.campaignName }
      : { title: formData.campaignName }

    createCampaign(payload).then((created) => {
      setSelectedTemplate(null)
      navigate(`/dashboard/campaigns/${created.id}`)
    })
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</h1>
            <p className="page-subtitle">
              {editingCampaign
                ? 'Update your campaign details with the same 4-step wizard.'
                : 'A 4-step mock wizard ready for future API wiring.'}
            </p>
          </div>

          <div className="wizard-steps">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`wizard-step ${index === currentStep ? 'active' : ''}`.trim()}
              >
                <strong>Step {index + 1}</strong>
                <p className="card-muted">{step}</p>
              </div>
            ))}
          </div>

          <div className="wizard-shell">
            {error ? <p className="page-subtitle">{error}</p> : null}
            {currentStep === 0 ? (
              <Card title="Basic Info" subtitle="Core campaign details and schedule.">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="campaign-name">Campaign name</label>
                    <input id="campaign-name" name="campaignName" className="form-control" value={formData.campaignName} onChange={updateField} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-platform">Platform</label>
                    <select id="campaign-platform" name="platform" className="form-control" value={formData.platform} onChange={updateField}>
                      <option>Instagram</option>
                      <option>LinkedIn</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-description">Description</label>
                    <textarea id="campaign-description" name="description" className="form-control" rows="5" value={formData.description} onChange={updateField} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-start">Start date</label>
                    <input id="campaign-start" name="startDate" type="date" className="form-control" value={formData.startDate} onChange={updateField} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-end">End date</label>
                    <input id="campaign-end" name="endDate" type="date" className="form-control" value={formData.endDate} onChange={updateField} />
                  </div>
                </div>
              </Card>
            ) : null}

            {currentStep === 1 ? (
              <Card title="Audience" subtitle="Targeting placeholders for audience setup.">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="audience-age">Age range</label>
                    <input id="audience-age" type="range" min="18" max="65" defaultValue={formData.ageRange} />
                    <span className="card-muted">18 - {formData.ageRange + 18}</span>
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <div className="checkbox-row">
                      {['Women', 'Men', 'Non-binary'].map((gender) => (
                        <label key={gender} className="checkbox-item">
                          <input type="checkbox" defaultChecked={formData.genders.includes(gender)} />
                          <span>{gender}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Locations</label>
                    <div className="tag-row">
                      {formData.locations.map((location) => (
                        <span key={location} className="tag-chip">{location}</span>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Interests</label>
                    <div className="tag-row">
                      {formData.interests.map((interest) => (
                        <span key={interest} className="tag-chip">{interest}</span>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-budget">Budget</label>
                    <input id="campaign-budget" name="budget" className="form-control" value={formData.budget} onChange={updateField} />
                  </div>
                </div>
              </Card>
            ) : null}

            {currentStep === 2 ? (
              <Card title="Content" subtitle="Ad copy and media placeholders.">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="content-type">Content type</label>
                    <select id="content-type" name="contentType" className="form-control" value={formData.contentType} onChange={updateField}>
                      <option>Video</option>
                      <option>Carousel</option>
                      <option>Static Image</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-headline">Headline</label>
                    <input id="campaign-headline" name="headline" className="form-control" value={formData.headline} onChange={updateField} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-body">Body</label>
                    <textarea id="campaign-body" name="body" className="form-control" rows="5" value={formData.body} onChange={updateField} />
                  </div>
                  <div className="form-group">
                    <label>Media upload</label>
                    <div className="upload-dropzone">
                      Drag and drop media here
                      <br />
                      Upload placeholder only
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="campaign-cta">CTA</label>
                    <input id="campaign-cta" name="cta" className="form-control" value={formData.cta} onChange={updateField} />
                  </div>
                </div>
              </Card>
            ) : null}

            {currentStep === 3 ? (
              <Card title="Review" subtitle="Review summary before mock creation.">
                <div className="review-list">
                  <div className="review-item">
                    <div className="toolbar-row">
                      <strong>Basic Info</strong>
                      <Button variant="ghost" onClick={() => setCurrentStep(0)}>Edit</Button>
                    </div>
                    <p className="card-muted">{formData.campaignName} on {formData.platform}</p>
                  </div>
                  <div className="review-item">
                    <div className="toolbar-row">
                      <strong>Audience</strong>
                      <Button variant="ghost" onClick={() => setCurrentStep(1)}>Edit</Button>
                    </div>
                    <p className="card-muted">{formData.locations.join(', ')} | {formData.interests.join(', ')}</p>
                  </div>
                  <div className="review-item">
                    <div className="toolbar-row">
                      <strong>Content</strong>
                      <Button variant="ghost" onClick={() => setCurrentStep(2)}>Edit</Button>
                    </div>
                    <p className="card-muted">{formData.headline}</p>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="toolbar-row">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleCreate}>{editingCampaign ? 'Save Changes' : 'Create'}</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign


