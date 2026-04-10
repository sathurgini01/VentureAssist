import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'
import {
  getCampaignPlanByKey,
  inferPlanKeyFromTemplateTitle,
  parsePlanKeyFromNotes,
} from '../../data/instagramCampaignPlan'
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

const formatMetricValue = (metric, value) => {
  const type = metric?.type
    || (String(metric?.label || '').toLowerCase().includes('rate') || String(metric?.label || '').toLowerCase().includes('ctr')
      ? 'percentage'
      : String(metric?.label || '').toLowerCase().includes('spend')
        || String(metric?.label || '').toLowerCase().includes('cpl')
        || String(metric?.label || '').toLowerCase().includes('cost')
        ? 'currency'
        : 'number')
  if (type === 'currency') return `LKR ${Number(value || 0).toLocaleString()}`
  if (type === 'percentage') return `${Number(value || 0).toLocaleString()}%`
  return Number(value || 0).toLocaleString()
}

const getCampaignPlan = (campaign) => {
  const planKey = parsePlanKeyFromNotes(campaign?.metrics?.notes)
    || inferPlanKeyFromTemplateTitle(campaign?.title || campaign?.name)
  return getCampaignPlanByKey(planKey)
}

const getAggregate = (campaign, metrics, matchers, { preferTotal = true, sum = false } = {}) => {
  const normalized = metrics.filter((metric) => matchers.some((matcher) => matcher(metric)))
  if (normalized.length === 0) return 0

  if (preferTotal) {
    const totalMetric = normalized.find((metric) => String(metric.label || '').toLowerCase().includes('total') || String(metric.label || '').toLowerCase().includes('overall') || String(metric.label || '').toLowerCase().includes('average'))
    if (totalMetric) {
      return getMetricValue(campaign, totalMetric.key, totalMetric.label)
    }
  }

  if (sum) {
    return normalized.reduce((acc, metric) => acc + getMetricValue(campaign, metric.key, metric.label), 0)
  }

  return getMetricValue(campaign, normalized[0].key, normalized[0].label)
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
  const template = selectedCampaign?.template || null
  const usesTemplateFlow = Array.isArray(template?.executionPlan) && template.executionPlan.length > 0

  const activePlan = getCampaignPlan(selectedCampaign)
  const allMetrics = activePlan.phases.flatMap((phase) => phase.requiredMetrics)

  const phaseActualRows = activePlan.phases.map((phase) => ({
    ...phase,
    metrics: phase.requiredMetrics.map((metric) => ({
      ...metric,
      actual: getMetricValue(selectedCampaign, metric.key, metric.label),
    })),
  }))

  const totalReach = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('reach')],
    { preferTotal: true, sum: true },
  )

  const totalLeads = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('lead')],
    { preferTotal: true, sum: true },
  )

  const totalSpend = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('spend')],
    { preferTotal: true, sum: true },
  )

  const totalEngagement = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('engagement') && !String(metric.label || '').toLowerCase().includes('rate')],
    { preferTotal: true, sum: true },
  )

  const engagementRate = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('engagement rate')],
    { preferTotal: true, sum: false },
  )

  const avgCtr = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('ctr')],
    { preferTotal: true, sum: false },
  )

  const avgCplDirect = getAggregate(
    selectedCampaign,
    allMetrics,
    [(metric) => String(metric.label || '').toLowerCase().includes('cpl') || String(metric.label || '').toLowerCase().includes('cost per lead')],
    { preferTotal: true, sum: false },
  )

  const averageCpl = avgCplDirect > 0 ? avgCplDirect : (totalLeads > 0 ? totalSpend / totalLeads : 0)

  const templateMetrics = Array.isArray(selectedCampaign?.metricDefinitions) ? selectedCampaign.metricDefinitions : []
  const templateMetricRows = templateMetrics.map((metric) => ({
    metric: metric.name,
    actual: formatMetricValue(metric, getMetricValue(selectedCampaign, metric.name, metric.name)),
  }))

  const templateOutcomeRows = useMemo(() => {
    return (template?.expectedResults || []).map((item) => {
      const value = String(item).toLowerCase()
      const metricMatch = templateMetrics.find((metric) => value.includes(String(metric.name || '').toLowerCase()))
      if (metricMatch) {
        return {
          expected: item,
          actual: formatMetricValue(metricMatch, getMetricValue(selectedCampaign, metricMatch.name, metricMatch.name)),
          score: 'Tracked',
        }
      }

      if (value.includes('lead') || value.includes('conversation')) {
        const metric = templateMetrics.find((entry) => {
          const label = String(entry.name || '').toLowerCase()
          return label.includes('lead') || label.includes('conversation')
        })
        const actual = metric ? getMetricValue(selectedCampaign, metric.name, metric.name) : 0
        const rangeCenter = parseRangeCenter(item)
        const score = rangeCenter ? (actual >= rangeCenter ? 'On Track' : 'Below Target') : actual > 0 ? 'Tracked' : 'Not Enough Data'
        return { expected: item, actual: actual ? formatMetricValue(metric, actual) : 'No data', score }
      }

      if (value.includes('reach') || value.includes('engagement') || value.includes('follower') || value.includes('conversion')) {
        const metric = templateMetrics.find((entry) => value.includes(String(entry.name || '').toLowerCase()))
        const actual = metric ? getMetricValue(selectedCampaign, metric.name, metric.name) : 0
        return { expected: item, actual: actual ? formatMetricValue(metric, actual) : 'Tracked in campaign summary', score: actual > 0 ? 'Tracked' : 'Not Enough Data' }
      }

      return { expected: item, actual: 'Campaign data captured', score: 'Tracked' }
    })
  }, [selectedCampaign, template, templateMetrics])

  const outcomeRows = useMemo(() => {
    return activePlan.finalExpectedOutcome.map((item) => {
      const value = String(item).toLowerCase()

      if (value.includes('lead')) {
        const rangeCenter = parseRangeCenter(item)
        const score = rangeCenter ? (totalLeads >= rangeCenter ? 'On Track' : 'Below Target') : totalLeads > 0 ? 'Tracked' : 'Not Enough Data'
        return { expected: item, actual: `${totalLeads.toLocaleString()} Leads`, score }
      }

      if (value.includes('reach')) {
        const minMatch = String(item).match(/(\d+[\d,]*)\s*\+/)
        const min = minMatch ? Number(minMatch[1].replace(/,/g, '')) : null
        const score = min ? (totalReach >= min ? 'On Track' : 'Below Target') : totalReach > 0 ? 'Tracked' : 'Not Enough Data'
        return { expected: item, actual: `${totalReach.toLocaleString()} Reach`, score }
      }

      if (value.includes('engagement rate')) {
        return {
          expected: item,
          actual: `${Number(engagementRate || 0).toFixed(2)}% Engagement Rate`,
          score: Number(engagementRate || 0) > 0 ? 'Tracked' : 'Not Enough Data',
        }
      }

      if (value.includes('cpl') || value.includes('cost per lead')) {
        const thresholdMatch = String(item).match(/below\s*lkr\s*(\d+[\d,]*)/i)
        const threshold = thresholdMatch ? Number(thresholdMatch[1].replace(/,/g, '')) : null
        const score = threshold ? (averageCpl > 0 && averageCpl <= threshold ? 'On Track' : 'Needs Work') : averageCpl > 0 ? 'Tracked' : 'Not Enough Data'
        return { expected: item, actual: `LKR ${Number(averageCpl || 0).toFixed(2)} Average CPL`, score }
      }

      if (value.includes('engagement')) {
        return { expected: item, actual: `${totalEngagement.toLocaleString()} Engagement`, score: totalEngagement > 0 ? 'Tracked' : 'Not Enough Data' }
      }

      if (value.includes('roi')) {
        const score = totalLeads > 0 && totalSpend > 0 ? 'Measured' : 'Not Enough Data'
        return { expected: item, actual: `Spend LKR ${totalSpend.toLocaleString()} | Leads ${totalLeads.toLocaleString()}`, score }
      }

      return { expected: item, actual: 'Campaign data captured', score: 'Tracked' }
    })
  }, [activePlan.finalExpectedOutcome, averageCpl, engagementRate, totalEngagement, totalLeads, totalReach, totalSpend])

  const expectedVsActualRows = phaseActualRows.flatMap((phase) => {
    const expectedHint = phase.expectedOutput.join(' | ')
    return phase.metrics.map((metric) => ({
      phase: `Phase ${phase.phase}`,
      metric: metric.label,
      expected: expectedHint,
      actual: formatMetricValue(metric, metric.actual),
    }))
  })

  const handleAnalyze = async () => {
    if (!selectedCampaign?.id) return
    setLoadingAnalysis(true)
    setAnalysisResult(null)
    try {
      const response = usesTemplateFlow
        ? await analyzeCampaign(selectedCampaign.id, {
          context: {
            templateTitle: selectedCampaign.title,
            overview: template?.campaignOverview || '',
            expectedResults: template?.expectedResults || [],
            finalOutputItems: template?.finalOutputItems || [],
            metrics: templateMetrics.map((metric) => ({
              name: metric.name,
              type: metric.type,
              required: metric.required,
              actual: getMetricValue(selectedCampaign, metric.name, metric.name),
            })),
          },
        })
        : await analyzeCampaign(selectedCampaign.id, {
          context: {
            package: activePlan.package,
            phases: phaseActualRows.map((phase) => ({
              phase: phase.phase,
              title: phase.title,
              objective: phase.objective,
              expectedOutput: phase.expectedOutput,
              metrics: phase.metrics.map((metric) => ({
                key: metric.key,
                label: metric.label,
                actual: metric.actual,
                type: metric.type,
              })),
            })),
            overallExpected: activePlan.finalExpectedOutcome,
            totalReach,
            totalSpend,
            totalLeads,
            totalEngagement,
            averageCpl,
            averageCtr: avgCtr,
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
        <div className="dashboard-content analytics-page">
          <div>
            <h1 className="page-title">Campaign Analysis</h1>
            <p className="page-subtitle">Compare planned expectations vs actual results, then run Gemini analysis.</p>
          </div>

          <Card title="Select Campaign">
            <select className="form-control" value={selectedCampaignId} onChange={(event) => setSelectedCampaignId(event.target.value)}>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
              ))}
            </select>
          </Card>

          {usesTemplateFlow ? (
            <>
              <Card title="Template Campaign Summary" subtitle={template?.campaignOverview || 'Summary based on the launched campaign template.'}>
                <div className="section-stack">
                  <p className="card-muted"><strong>Campaign:</strong> {selectedCampaign?.title}</p>
                  {template?.targetAudience ? <p className="card-muted"><strong>Target Audience:</strong> {template.targetAudience}</p> : null}
                  {(template?.finalOutputItems || []).length ? (
                    <>
                      <strong>Expected Final Outputs</strong>
                      <ul>
                        {(template.finalOutputItems || []).map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </>
                  ) : null}
                </div>
              </Card>

              <Card title="Expected vs Actual">
                <Table
                  columns={[
                    { key: 'expected', label: 'Expected Before Campaign' },
                    { key: 'actual', label: 'Actual Result' },
                    { key: 'score', label: 'Status' },
                  ]}
                  rows={templateOutcomeRows}
                />
              </Card>

              <Card title="Tracked Metrics">
                <Table
                  columns={[
                    { key: 'metric', label: 'Metric' },
                    { key: 'actual', label: 'Actual Value' },
                  ]}
                  rows={templateMetricRows}
                />
              </Card>
            </>
          ) : (
            <>
              <div className="template-week-grid">
                {phaseActualRows.map((phase) => (
                  <Card key={phase.phase} title={`Phase ${phase.phase} (Expected vs Actual)`}>
                    <p className="card-muted"><strong>Expected:</strong> {phase.expectedOutput.join(' | ')}</p>
                    {phase.metrics.map((metric) => (
                      <p key={metric.key} className="card-muted">
                        <strong>{metric.label}:</strong> {formatMetricValue(metric, metric.actual)}
                      </p>
                    ))}
                  </Card>
                ))}
              </div>

              <Card title="Overall Campaign Outcome (Expected vs Actual)">
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
            </>
          )}

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

                {Array.isArray(analysisResult.report.strengths) ? (
                  <div>
                    <strong>Strengths</strong>
                    <ul>
                      {analysisResult.report.strengths.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(analysisResult.report.weaknesses) ? (
                  <div>
                    <strong>Weaknesses</strong>
                    <ul>
                      {analysisResult.report.weaknesses.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(analysisResult.report.businessAdvice) ? (
                  <div>
                    <strong>Business Advice</strong>
                    <ul>
                      {analysisResult.report.businessAdvice.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ) : null}

                {Array.isArray(analysisResult.report.prioritizedActions) ? (
                  <div>
                    <strong>Prioritized Actions</strong>
                    <ul>
                      {analysisResult.report.prioritizedActions.map((item, index) => (
                        <li key={`${item.action}-${index}`}>
                          <strong>[{item.priority}] {item.action}</strong> - {item.reason}
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
