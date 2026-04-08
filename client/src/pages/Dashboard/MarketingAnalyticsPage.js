import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'
import { FINAL_EXPECTED_OUTCOME, INSTAGRAM_PACKAGE, WEEKLY_PLAN } from '../../data/instagramCampaignPlan'
import { analyzeCampaign } from '../../services/campaignService'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

const getMetricValue = (campaign, key, label) => {
  const metricValues = Array.isArray(campaign?.metricValues) ? campaign.metricValues : []
  const byKey = metricValues.find((item) => item.name === key)
  const byLabel = metricValues.find((item) => item.name === label)
  if (byKey) return Number(byKey.value || 0)
  if (byLabel) return Number(byLabel.value || 0)
  return 0
}

const parseRangeCenter = (text) => {
  const match = String(text).match(/(\d+[\d,]*)\s*[–-]\s*(\d+[\d,]*)/)
  if (!match) return null
  const left = Number(match[1].replace(/,/g, ''))
  const right = Number(match[2].replace(/,/g, ''))
  if (Number.isNaN(left) || Number.isNaN(right)) return null
  return Math.round((left + right) / 2)
}

function Analytics() {
  const { campaigns, addToast } = useAppContext()
  const [searchParams] = useSearchParams()
  const requestedCampaignId = searchParams.get('campaign')
  const defaultCampaignId = campaigns[0]?.id || ''
  const [selectedCampaignId, setSelectedCampaignId] = useState(requestedCampaignId || defaultCampaignId)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const selectedCampaign = campaigns.find((item) => item.id === selectedCampaignId) || campaigns[0]

  const week1 = WEEKLY_PLAN[0]
  const week2 = WEEKLY_PLAN[1]

  const week1Actual = {
    reach: getMetricValue(selectedCampaign, 'week1Reach', 'Reach'),
    engagement: getMetricValue(selectedCampaign, 'week1Engagement', 'Engagement'),
    ctr: getMetricValue(selectedCampaign, 'week1Ctr', 'CTR'),
    adSpend: getMetricValue(selectedCampaign, 'week1AdSpend', 'Ad Spend'),
    followers: getMetricValue(selectedCampaign, 'week1FollowersGained', 'Followers Gained'),
  }

  const week2Actual = {
    reach: getMetricValue(selectedCampaign, 'week2Reach', 'Reach'),
    ctr: getMetricValue(selectedCampaign, 'week2Ctr', 'CTR'),
    leads: getMetricValue(selectedCampaign, 'week2LeadsGenerated', 'Leads Generated'),
    cpl: getMetricValue(selectedCampaign, 'week2Cpl', 'Cost Per Lead (CPL)'),
    adSpend: getMetricValue(selectedCampaign, 'week2AdSpend', 'Ad Spend'),
  }

  const totalReach = week1Actual.reach + week2Actual.reach
  const totalSpend = week1Actual.adSpend + week2Actual.adSpend

  const outcomeRows = useMemo(() => {
    return FINAL_EXPECTED_OUTCOME.map((item) => {
      if (item.includes('80–150 Leads')) {
        const target = parseRangeCenter('80-150') || 115
        return { expected: item, actual: `${week2Actual.leads.toLocaleString()} Leads`, score: week2Actual.leads >= target ? 'On Track' : 'Below Target' }
      }
      if (item.includes('30,000+ Total Reach')) {
        return { expected: item, actual: `${totalReach.toLocaleString()} Total Reach`, score: totalReach >= 30000 ? 'On Track' : 'Below Target' }
      }
      if (item.includes('Improved CTR')) {
        const avgCtr = (week1Actual.ctr + week2Actual.ctr) / 2
        return { expected: item, actual: `${avgCtr.toFixed(2)}% Avg CTR`, score: avgCtr >= 2 ? 'On Track' : 'Needs Work' }
      }
      if (item.includes('Measurable ROI')) {
        return { expected: item, actual: `Current Spend LKR ${totalSpend.toLocaleString()}`, score: totalSpend > 0 ? 'Measured' : 'Not Enough Data' }
      }
      return { expected: item, actual: 'Campaign data captured', score: 'Tracked' }
    })
  }, [totalReach, totalSpend, week1Actual.ctr, week2Actual.ctr, week2Actual.leads])

  const expectedVsActualRows = [
    ...week1.requiredMetrics.map((metric) => {
      const expectedHint = week1.expectedOutput.join(' | ')
      return {
        phase: 'Week 1',
        metric: metric.label,
        expected: expectedHint,
        actual: getMetricValue(selectedCampaign, metric.key, metric.label).toLocaleString(),
      }
    }),
    ...week2.requiredMetrics.map((metric) => {
      const expectedHint = week2.expectedOutput.join(' | ')
      return {
        phase: 'Week 2',
        metric: metric.label,
        expected: expectedHint,
        actual: getMetricValue(selectedCampaign, metric.key, metric.label).toLocaleString(),
      }
    }),
  ]

  const handleAnalyze = async () => {
    if (!selectedCampaign?.id) return
    setLoadingAnalysis(true)
    setAnalysisResult(null)
    try {
      const response = await analyzeCampaign(selectedCampaign.id, {
        context: {
          package: INSTAGRAM_PACKAGE,
          week1Expected: week1.expectedOutput,
          week2Expected: week2.expectedOutput,
          overallExpected: FINAL_EXPECTED_OUTCOME,
          week1Actual,
          week2Actual,
          totalReach,
          totalSpend,
        },
      })
      setAnalysisResult(response)
      addToast('Gemini analysis generated successfully.', 'success')
    } catch (error) {
      addToast(error?.message || 'Failed to generate Gemini analysis.', 'warning')
    } finally {
      setLoadingAnalysis(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Campaign Analysis</h1>
            <p className="page-subtitle">Compare planned expectations vs Week 1/Week 2 results, then run Gemini analysis.</p>
          </div>

          <Card title="Select Campaign">
            <select className="form-control" value={selectedCampaignId} onChange={(event) => setSelectedCampaignId(event.target.value)}>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
          </Card>

          <div className="template-week-grid">
            <Card title="Week 1 (Expected vs Actual)">
              <p className="card-muted"><strong>Expected:</strong> {week1.expectedOutput.join(' | ')}</p>
              <p className="card-muted"><strong>Actual Reach:</strong> {week1Actual.reach.toLocaleString()}</p>
              <p className="card-muted"><strong>Actual Engagement:</strong> {week1Actual.engagement.toLocaleString()}</p>
              <p className="card-muted"><strong>Actual CTR:</strong> {week1Actual.ctr.toLocaleString()}%</p>
              <p className="card-muted"><strong>Actual Spend:</strong> LKR {week1Actual.adSpend.toLocaleString()}</p>
              <p className="card-muted"><strong>Followers Gained:</strong> {week1Actual.followers.toLocaleString()}</p>
            </Card>

            <Card title="Week 2 (Expected vs Actual)">
              <p className="card-muted"><strong>Expected:</strong> {week2.expectedOutput.join(' | ')}</p>
              <p className="card-muted"><strong>Actual Reach:</strong> {week2Actual.reach.toLocaleString()}</p>
              <p className="card-muted"><strong>Actual CTR:</strong> {week2Actual.ctr.toLocaleString()}%</p>
              <p className="card-muted"><strong>Leads Generated:</strong> {week2Actual.leads.toLocaleString()}</p>
              <p className="card-muted"><strong>CPL:</strong> LKR {week2Actual.cpl.toLocaleString()}</p>
              <p className="card-muted"><strong>Actual Spend:</strong> LKR {week2Actual.adSpend.toLocaleString()}</p>
            </Card>
          </div>

          <Card title="Overall 2-Week Outcome (Expected vs Actual)">
            <Table
              columns={[
                { key: 'expected', label: 'Expected Before Campaign' },
                { key: 'actual', label: 'Actual Result' },
                { key: 'score', label: 'Status' },
              ]}
              rows={outcomeRows}
            />
          </Card>

          <Card title="Metric-by-Metric Expected vs Actual">
            <Table
              columns={[
                { key: 'phase', label: 'Phase' },
                { key: 'metric', label: 'Metric' },
                { key: 'expected', label: 'Expected Context' },
                { key: 'actual', label: 'Actual Value' },
              ]}
              rows={expectedVsActualRows}
            />
          </Card>

          <Card title="Gemini AI Analysis" subtitle="Run model analysis using campaign metrics + expected targets.">
            <div className="inline-actions">
              <Button onClick={handleAnalyze} disabled={loadingAnalysis}>
                {loadingAnalysis ? 'Analyzing...' : 'Analysis'}
              </Button>
            </div>

            {analysisResult?.report ? (
              <div className="section-stack" style={{ marginTop: '1rem' }}>
                <p><strong>Overview:</strong> {analysisResult.report.overview}</p>
                <p><strong>Health:</strong> {analysisResult.report.health}</p>

                {Array.isArray(analysisResult.report.keyFindings) ? (
                  <div>
                    <strong>Key Findings</strong>
                    <ul>
                      {analysisResult.report.keyFindings.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(analysisResult.report.prioritizedActions) ? (
                  <div>
                    <strong>Prioritized Actions</strong>
                    <ul>
                      {analysisResult.report.prioritizedActions.map((item, index) => (
                        <li key={`${item.action}-${index}`}>
                          <strong>[{item.priority}] {item.action}</strong> — {item.reason}
                          {item.expectedImpact ? ` (Expected: ${item.expectedImpact})` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="card-muted" style={{ marginTop: '0.75rem' }}>
                Click Analysis to fetch Gemini results.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Analytics
