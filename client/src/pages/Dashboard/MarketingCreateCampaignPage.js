import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { CAMPAIGN_METRIC_FIELDS, INSTAGRAM_TWO_WEEK_PLAN } from '../../data/instagramCampaignPlan'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const steps = ['Basic Info', 'Audience & Budget', 'Content Strategy', 'Review']

const initialForm = {
  campaignName: 'Instagram Lead Generation Campaign',
  description: '',
  startDate: '',
  targetAudience: '',
  weeklyBudgetLKR: '',
  targetReach: '',
  contentGoal: '',
  coreHook: '',
  captionTone: '',
  hashtagStyle: '',
  cta: '',
}

const buildTasks = () => {
  const tasks = []
  INSTAGRAM_TWO_WEEK_PLAN.forEach((weekData) => {
    weekData.days.forEach((dayData) => {
      dayData.tasks.forEach((taskText, idx) => {
        tasks.push({
          title: `W${weekData.week}-D${dayData.day} | ${taskText}`,
          description: dayData.title,
          order: weekData.week * 1000 + dayData.day * 10 + idx,
          isDone: false,
          completedAt: null,
        })
      })
    })
  })
  return tasks
}

const buildMetricValues = () => CAMPAIGN_METRIC_FIELDS.map((field) => ({
  name: field.label,
  type: field.key === 'ctr' ? 'percentage' : field.key === 'budgetSpentLKR' || field.key === 'cpc' || field.key === 'cpm' ? 'currency' : 'number',
  value: 0,
}))

function CreateCampaign() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, createCampaign, updateCampaign, selectedTemplate, setSelectedTemplate, addToast } = useAppContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(initialForm)

  const editingCampaign = campaigns.find((campaign) => campaign.id === campaignId)

  useEffect(() => {
    if (!selectedTemplate || campaignId) return
    setFormData((current) => ({
      ...current,
      campaignName: selectedTemplate.title || selectedTemplate.name || current.campaignName,
      description: selectedTemplate.description || current.description,
    }))
  }, [selectedTemplate, campaignId])

  useEffect(() => {
    if (!editingCampaign) return
    setFormData((current) => ({
      ...current,
      campaignName: editingCampaign.name || current.campaignName,
      description: editingCampaign.metrics?.notes || current.description,
      weeklyBudgetLKR: String(editingCampaign.metrics?.budgetSpentLKR || ''),
      targetReach: String(editingCampaign.metrics?.impressions || ''),
    }))
  }, [editingCampaign])

  const aiGuide = useMemo(() => ([
    'Hook: Stop wasting ad money until you see this…',
    'Caption style: Problem → Solution → CTA',
    'Hashtags: #StartupGrowth #DigitalMarketingTips #EntrepreneurLife',
    'Thumbnail idea: bold text overlay + contrast background',
  ]), [])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const validateCurrentStep = () => {
    if (currentStep === 0) {
      if (!formData.campaignName || !formData.description || !formData.startDate) {
        return 'Please complete campaign name, description, and start date.'
      }
    }
    if (currentStep === 1) {
      if (!formData.targetAudience || !formData.weeklyBudgetLKR || !formData.targetReach) {
        return 'Please provide audience, weekly budget, and target reach.'
      }
    }
    if (currentStep === 2) {
      if (!formData.contentGoal || !formData.coreHook || !formData.cta) {
        return 'Please complete content goal, hook, and CTA.'
      }
    }
    return ''
  }

  const handleNext = () => {
    const stepError = validateCurrentStep()
    if (stepError) {
      setError(stepError)
      addToast(stepError, 'warning')
      return
    }
    setError('')
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  const handleSave = async () => {
    try {
      const tasks = buildTasks()
      const metricValues = buildMetricValues()

      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, {
          title: formData.campaignName,
          tasks,
          metricValues,
          status: 'running',
          metrics: {
            ...editingCampaign.metrics,
            impressions: Number(formData.targetReach || 0),
            budgetSpentLKR: Number(formData.weeklyBudgetLKR || 0),
            notes: `${formData.description}\nGoal: ${formData.contentGoal}\nHook: ${formData.coreHook}`,
          },
        })
        navigate(`/dashboard/campaigns/${editingCampaign.id}`)
        return
      }

      const created = await createCampaign({
        title: formData.campaignName,
        templateId: selectedTemplate?.id,
      })

      await updateCampaign(created.id, {
        status: 'running',
        tasks,
        metricValues,
        metrics: {
          impressions: Number(formData.targetReach || 0),
          budgetSpentLKR: Number(formData.weeklyBudgetLKR || 0),
          leads: 0,
          clicks: 0,
          notes: `${formData.description}\nGoal: ${formData.contentGoal}\nHook: ${formData.coreHook}`,
        },
      })

      setSelectedTemplate(null)
      navigate(`/dashboard/campaigns/${created.id}`)
    } catch (saveError) {
      addToast(saveError?.message || 'Failed to create campaign.', 'warning')
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">{editingCampaign ? 'Edit Instagram Campaign' : 'Create Instagram Campaign'}</h1>
            <p className="page-subtitle">Professional 2-week execution flow (manual execution + weekly optimization).</p>
          </div>

          <div className="wizard-steps">
            {steps.map((step, index) => (
              <div key={step} className={`wizard-step ${index === currentStep ? 'active' : ''}`.trim()}>
                <strong>Step {index + 1}</strong>
                <p className="card-muted">{step}</p>
              </div>
            ))}
          </div>

          <div className="wizard-shell">
            {error ? <p className="error-text">{error}</p> : null}

            {currentStep === 0 ? (
              <Card title="Campaign Foundation" subtitle="Define campaign context and launch schedule.">
                <div className="form-grid">
                  <label className="form-label">
                    Campaign Name
                    <input name="campaignName" className="form-control" value={formData.campaignName} onChange={updateField} />
                  </label>
                  <label className="form-label">
                    Start Date
                    <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={updateField} />
                  </label>
                  <label className="form-label" style={{ gridColumn: '1 / -1' }}>
                    Description
                    <textarea name="description" rows="5" className="form-control" value={formData.description} onChange={updateField} />
                  </label>
                </div>
              </Card>
            ) : null}

            {currentStep === 1 ? (
              <Card title="Audience + Budget" subtitle="Plan targeting and expected top-of-funnel outcomes.">
                <div className="form-grid">
                  <label className="form-label">
                    Target Audience
                    <textarea name="targetAudience" rows="4" className="form-control" value={formData.targetAudience} onChange={updateField} placeholder="Example: Founders (22-40), Sri Lanka, startup + marketing interests" />
                  </label>
                  <label className="form-label">
                    Weekly Budget (LKR)
                    <input type="number" name="weeklyBudgetLKR" className="form-control" value={formData.weeklyBudgetLKR} onChange={updateField} />
                  </label>
                  <label className="form-label">
                    Target Reach
                    <input type="number" name="targetReach" className="form-control" value={formData.targetReach} onChange={updateField} />
                  </label>
                </div>
              </Card>
            ) : null}

            {currentStep === 2 ? (
              <div className="mentor-layout">
                <Card title="Content Execution Strategy" subtitle="No uploads. Platform provides strategy, captions, hashtags, and tasks.">
                  <div className="form-grid">
                    <label className="form-label">
                      Content Goal
                      <input name="contentGoal" className="form-control" value={formData.contentGoal} onChange={updateField} placeholder="Awareness, engagement, or lead generation" />
                    </label>
                    <label className="form-label">
                      Core Hook
                      <input name="coreHook" className="form-control" value={formData.coreHook} onChange={updateField} />
                    </label>
                    <label className="form-label">
                      Caption Tone
                      <input name="captionTone" className="form-control" value={formData.captionTone} onChange={updateField} placeholder="Professional, bold, educational..." />
                    </label>
                    <label className="form-label">
                      Hashtag Strategy
                      <input name="hashtagStyle" className="form-control" value={formData.hashtagStyle} onChange={updateField} placeholder="Niche tags + broad discovery tags" />
                    </label>
                    <label className="form-label" style={{ gridColumn: '1 / -1' }}>
                      Primary CTA
                      <input name="cta" className="form-control" value={formData.cta} onChange={updateField} placeholder="DM for guide / click link / book call" />
                    </label>
                  </div>
                </Card>

                <Card title="AI Suggestion Box" subtitle="Smart starting point for this campaign.">
                  <div className="activity-log">
                    {aiGuide.map((item) => (
                      <div key={item} className="activity-item">
                        <p className="card-muted">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <Card title="Review + Launch" subtitle="Launch a structured 2-week campaign board with weekly metric tracking.">
                <div className="review-list">
                  <div className="review-item">
                    <strong>{formData.campaignName}</strong>
                    <p className="card-muted">Starts: {formData.startDate || 'Not set'} · Budget: LKR {Number(formData.weeklyBudgetLKR || 0).toLocaleString()} / week</p>
                    <p className="card-muted">Goal: {formData.contentGoal || 'Not set'} · CTA: {formData.cta || 'Not set'}</p>
                  </div>
                  <div className="review-item">
                    <strong>Execution Plan</strong>
                    <p className="card-muted">2 weeks · 14 days · {buildTasks().length} detailed tasks</p>
                    <p className="card-muted">Week 1: Awareness + Engagement · Week 2: Lead Generation + Conversion</p>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="toolbar-row">
              <Button variant="secondary" onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))} disabled={currentStep === 0}>
                Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>Next</Button>
              ) : (
                <Button onClick={handleSave}>{editingCampaign ? 'Save Campaign' : 'Launch Campaign Plan'}</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign
