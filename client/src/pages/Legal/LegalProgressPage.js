import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import StatsCard from '../../components/MarketingStatsCard'
import { useAppContext } from '../../context/AppContext'
import { getLegalProgress, getLegalTasks, getMyLegalSubmissions } from '../../services/legalSupportService'
import { formatDate, getStatusMeta, legalUserLinks } from './legalHelpers'

function LegalProgressPage() {
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [progress, setProgress] = useState(null)
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [progressData, tasksData, submissionsData] = await Promise.all([
          getLegalProgress(),
          getLegalTasks(),
          getMyLegalSubmissions(),
        ])
        if (!active) return
        setProgress(progressData)
        setTasks(tasksData.tasks || [])
        setSubmissions(submissionsData.submissions || [])
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load progress.', 'error')
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const submissionMap = useMemo(
    () => new Map((submissions || []).map((item) => [String(item.taskId), item])),
    [submissions],
  )

  const stats = useMemo(() => {
    const data = progress || { readiness: 0, approved: 0, underReview: 0, pending: 0, changesRequested: 0 }
    return [
      { label: 'Readiness', value: `${data.readiness || 0}%`, helper: 'Approved vs active tasks' },
      { label: 'Approved', value: String(data.approved || 0).padStart(2, '0'), helper: 'Ready and verified' },
      { label: 'Under Review', value: String(data.underReview || 0).padStart(2, '0'), helper: 'Waiting for review' },
      { label: 'Changes Requested', value: String(data.changesRequested || 0).padStart(2, '0'), helper: 'Need updates' },
    ]
  }, [progress])

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="page-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="dashboard-stat-card">
                <StatsCard label={stat.label} value={stat.value} helper={stat.helper} />
              </div>
            ))}
          </section>

          <section className="dashboard-split legal-overview-grid">
            <Card title="Progress Overview" subtitle="Monitor your legal readiness and remaining compliance work.">
              <div className="legal-progress-bar-shell">
                <div className="legal-progress-bar-track">
                  <div className="legal-progress-bar-fill" style={{ width: `${progress?.readiness || 0}%` }} />
                </div>
                <strong>{progress?.readiness || 0}% complete</strong>
              </div>
              <p className="card-muted">
                Approved submissions increase your readiness score. Tasks under review and change requests are shown below.
              </p>
            </Card>

            <Card title="Quick Actions" subtitle="Continue improving your compliance status.">
              <div className="inline-actions">
                <NavLink to="/toolkits/legal/dashboard">
                  <Button>Open Dashboard</Button>
                </NavLink>
                <NavLink to="/toolkits/legal/ai">
                  <Button variant="secondary">Open AI Assistant</Button>
                </NavLink>
              </div>
            </Card>
          </section>

          <section>
            <Card title="Task Progress" subtitle="A live view of every legal task and its latest submission state.">
              <div className="legal-progress-list">
                {tasks.map((task) => {
                  const submission = submissionMap.get(String(task._id))
                  const meta = getStatusMeta(submission?.status || 'PENDING')
                  return (
                    <div key={task._id} className="legal-progress-item">
                      <div>
                        <strong>{task.title}</strong>
                        <p className="card-muted">{task.category} • Updated {formatDate(submission?.updatedAt || task.updatedAt)}</p>
                      </div>
                      <div className="legal-progress-actions">
                        <span className={`legal-status-pill tone-${meta.tone}`.trim()}>{meta.label}</span>
                        <NavLink to={`/toolkits/legal/tasks/${task._id}`}>
                          <Button variant="ghost">View</Button>
                        </NavLink>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalProgressPage
