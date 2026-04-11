import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import { useAppContext } from '../../context/AppContext'
import { legalUserLinks } from './legalHelpers'
import { getLegalProgress, getLegalTasks, getLegalToolkits } from '../../services/legalSupportService'

function LegalHomePage() {
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [progress, setProgress] = useState(null)
  const [toolkits, setToolkits] = useState([])
  const [summaryTasks, setSummaryTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [toolkit, setToolkit] = useState(null)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        const [progressData, tasksData, toolkitsData] = await Promise.all([
          getLegalProgress(),
          getLegalTasks('', true),
          getLegalToolkits(),
        ])

        if (!active) return
        setProgress(progressData)
        setSummaryTasks(tasksData.tasks || [])
        const fetchedToolkits = toolkitsData.toolkits || []
        setToolkits(fetchedToolkits)
        setToolkit(fetchedToolkits[0] || null)

      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load legal overview.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const p = progress || { totalTasks: 0, approved: 0, underReview: 0, changesRequested: 0, readiness: 0 }
    return [
      { label: 'Readiness Score', value: `${p.readiness || 0}%`, helper: 'Compliance progress' },
      { label: 'Approved Tasks', value: String(p.approved || 0).padStart(2, '0'), helper: 'Completed and verified' },
      { label: 'Under Review', value: String(p.underReview || 0).padStart(2, '0'), helper: 'Waiting for review' },
      { label: 'Total Tasks', value: String(p.totalTasks || 0).padStart(2, '0'), helper: 'Active legal requirements' },
    ]
  }, [progress])

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="dashboard-hero legal-hero-grid">
            <div className="hero-primary-panel">
              <Card title={toolkit?.title || toolkit?.name || 'Legal Toolkit'} subtitle="Complete your legal requirements with a guided, structured workflow.">
                <div className="legal-hero-copy">
                  <div className="dashboard-hero-ribbon legal-ribbon">
                    <span className="dashboard-hero-kicker">Law &amp; Order</span>
                    <div className="dashboard-hero-tags">
                      <span>Registration</span>
                      <span>Compliance</span>
                      <span>Legal Checklist</span>
                    </div>
                  </div>
                  <p className="card-muted legal-summary-copy">
                    Stay aligned with the legal foundations of running a business. Review your tasks, upload evidence,
                    ask for mentor support, and track your readiness from one workspace.
                  </p>
                  <div className="quick-actions">
                    <NavLink to="/toolkits/legal/dashboard">
                      <Button>Continue Legal Setup</Button>
                    </NavLink>
                    <NavLink to="/toolkits/legal/ai">
                      <Button variant="secondary">AI Legal Assistant</Button>
                    </NavLink>
                    <NavLink to="/toolkits/legal/progress">
                      <Button variant="ghost">View My Progress</Button>
                    </NavLink>
                  </div>
                </div>
              </Card>
            </div>
            <div className="hero-secondary-panel legal-secondary-panel">
              <Card title="Workspace Snapshot" subtitle="A quick summary of what needs your attention next.">
                {loading ? (
                  <p className="card-muted">Loading legal summary…</p>
                ) : (
                  <div className="legal-spotlight-list">
                    <div className="legal-spotlight-item">
                      <strong>{summaryTasks.length}</strong>
                      <span className="card-muted">Tasks available</span>
                    </div>
                    <div className="legal-spotlight-item">
                      <strong>{progress?.changesRequested || 0}</strong>
                      <span className="card-muted">Need revisions</span>
                    </div>
                    <div className="legal-spotlight-item">
                      <strong>{progress?.underReview || 0}</strong>
                      <span className="card-muted">Awaiting mentor review</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </section>

          <section className="page-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-stat-card">
                <StatsCard label={stat.label} value={stat.value} helper={stat.helper} />
              </div>
            ))}
          </section>

          <section className="dashboard-split legal-overview-grid">
            <Card title="Legal Toolkits" subtitle="Toolkits added by admin and available for users.">
              {loading ? (
                <p className="card-muted">Loading toolkits…</p>
              ) : toolkits.length === 0 ? (
                <p className="card-muted">No legal toolkits available right now.</p>
              ) : (
                <div className="legal-chip-grid">
                  {toolkits.map((item) => (
                    <div key={item._id} className="legal-task-preview toolkit-preview">
                      <span className="badge">{item.category}</span>
                      <strong>{item.title}</strong>
                      {item.description ? <p className="card-muted toolkit-description">{item.description}</p> : null}
                      <p className="card-muted toolkit-link">
                        {item.type === 'LINK' && item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer">
                            Open link
                          </a>
                        ) : item.url ? (
                          <span>{item.url}</span>
                        ) : (
                          <span>{item.type}</span>
                        )}
                      </p>
                      {Array.isArray(item.tags) && item.tags.length > 0 ? (
                        <p className="card-muted toolkit-tags">Tags: {item.tags.join(', ')}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <section className="dashboard-split legal-overview-grid">
            <Card title="Task Categories" subtitle="Your legal toolkit is organised into the key areas founders need to manage.">
              <div className="legal-chip-grid">
                {(summaryTasks || []).slice(0, 6).map((task) => (
                  <NavLink key={task._id} to={`/toolkits/legal/tasks/${task._id}`} className="legal-task-preview">
                    <span className="badge">{task.category}</span>
                    <strong>{task.title}</strong>
                  </NavLink>
                ))}
                {summaryTasks.length === 0 ? <p className="card-muted">No active legal tasks are available yet.</p> : null}
              </div>
            </Card>
            <Card title="Recommended Next Step" subtitle="Use the legal dashboard to continue your legal setup journey.">
              <div className="section-stack">
                <p className="card-muted">
                  Start with your highest priority tasks, upload supporting evidence, and keep your compliance history
                  organised for mentor review.
                </p>
                <div className="inline-actions">
                  <NavLink to="/toolkits/legal/dashboard">
                    <Button>Open Task Dashboard</Button>
                  </NavLink>
                  <NavLink to="/toolkits/legal/ai">
                    <Button variant="secondary">Open AI Assistant</Button>
                  </NavLink>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalHomePage
