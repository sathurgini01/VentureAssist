import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { FINAL_EXPECTED_OUTCOME, INSTAGRAM_PACKAGE, WEEKLY_PLAN } from '../../data/instagramCampaignPlan'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const createTaskPayload = () => {
  const tasks = []
  WEEKLY_PLAN.forEach((week) => {
    week.dayTasks.forEach((dayData) => {
      dayData.tasks.forEach((task, idx) => {
        tasks.push({
          title: `W${week.week}-D${dayData.day} | ${task}`,
          description: dayData.title,
          order: week.week * 1000 + dayData.day * 10 + idx,
          isDone: false,
          completedAt: null,
        })
      })
    })
  })
  return tasks
}

const createMetricValuePayload = () => {
  const metricEntries = []
  WEEKLY_PLAN.forEach((week) => {
    week.requiredMetrics.forEach((metric) => {
      metricEntries.push({
        name: metric.key,
        type: metric.label.includes('CTR') ? 'percentage' : metric.label.includes('Spend') || metric.label.includes('CPL') ? 'currency' : 'number',
        value: 0,
      })
    })
  })

  metricEntries.push({ name: '__week1_saved__', type: 'number', value: 0 })
  metricEntries.push({ name: '__week2_saved__', type: 'number', value: 0 })
  metricEntries.push({ name: '__campaign_ended__', type: 'number', value: 0 })
  return metricEntries
}

function CreateCampaign() {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const { campaigns, selectedTemplate, createCampaign, updateCampaign, setSelectedTemplate, addToast } = useAppContext()
  const [startDate, setStartDate] = useState('')

  const editingCampaign = campaigns.find((item) => item.id === campaignId)
  const packageTitle = useMemo(() => INSTAGRAM_PACKAGE.title, [])

  useEffect(() => {
    if (editingCampaign?.metrics?.notes) {
      const match = String(editingCampaign.metrics.notes).match(/Start Date:\s*(\d{4}-\d{2}-\d{2})/)
      if (match) setStartDate(match[1])
    }
  }, [editingCampaign])

  const launchCampaign = async () => {
    if (!startDate) {
      addToast('Please select a start date before launching campaign.', 'warning')
      return
    }

    try {
      const tasks = createTaskPayload()
      const metricValues = createMetricValuePayload()

      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, {
          title: packageTitle,
          status: 'running',
          tasks,
          metricValues,
          progress: 0,
          metrics: {
            ...editingCampaign.metrics,
            notes: `Package: ${packageTitle}\nStart Date: ${startDate}`,
          },
        })
        navigate(`/dashboard/campaigns/${editingCampaign.id}`)
        return
      }

      const created = await createCampaign({
        title: packageTitle,
        templateId: selectedTemplate?.id,
      })

      await updateCampaign(created.id, {
        status: 'running',
        tasks,
        metricValues,
        progress: 0,
        metrics: {
          impressions: 0,
          clicks: 0,
          leads: 0,
          engagement: 0,
          sales: 0,
          budgetSpentLKR: 0,
          revenue: 0,
          notes: `Package: ${packageTitle}\nStart Date: ${startDate}`,
        },
      })

      setSelectedTemplate(null)
      navigate(`/dashboard/campaigns/${created.id}`)
    } catch (error) {
      addToast(error?.message || 'Failed to launch campaign.', 'warning')
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">{packageTitle}</h1>
            <p className="page-subtitle">Final preview page with complete 2-week execution details before launch.</p>
          </div>

          <Card title="Package Overview" subtitle="Professional Instagram startup launch package.">
            <div className="template-preview-summary">
              <div className="template-preview-pill"><strong>Duration</strong><span>{INSTAGRAM_PACKAGE.duration}</span></div>
              <div className="template-preview-pill"><strong>Budget</strong><span>LKR {INSTAGRAM_PACKAGE.budget.toLocaleString()}</span></div>
              <div className="template-preview-pill"><strong>Goal</strong><span>{INSTAGRAM_PACKAGE.goal}</span></div>
            </div>
          </Card>

          <div className="template-week-grid">
            {WEEKLY_PLAN.map((week) => (
              <Card key={week.week} title={`Week ${week.week} – ${week.title}`} subtitle={week.objective}>
                <p className="card-muted"><strong>Allocated Budget:</strong> LKR {week.budget.toLocaleString()}</p>
                <ul>
                  {week.budgetItems.map((item) => (<li key={item}>{item}</li>))}
                </ul>

                <strong>Detailed Tasks</strong>
                <div className="activity-log">
                  {week.dayTasks.map((dayData) => (
                    <div key={`${week.week}-${dayData.day}`} className="activity-item">
                      <strong>Day {dayData.day} – {dayData.title}</strong>
                      <ul>
                        {dayData.tasks.map((task) => <li key={task}>{task}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <strong>Required Metrics</strong>
                <ul>
                  {week.requiredMetrics.map((metric) => (
                    <li key={metric.key}><strong>{metric.label}:</strong> {metric.description}</li>
                  ))}
                </ul>

                <strong>Expected Output</strong>
                <ul>
                  {week.expectedOutput.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Card>
            ))}
          </div>

          <Card title="Overall 2-Week Expected Outcome">
            <ul>
              {FINAL_EXPECTED_OUTCOME.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Card>

          <div className="toolbar-row">
            <label className="form-label" style={{ maxWidth: '320px' }}>
              Start Date
              <input type="date" className="form-control" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </label>
            <Button onClick={launchCampaign}>Launch Campaign</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaign
