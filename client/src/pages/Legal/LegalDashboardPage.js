import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { getLegalTasks, getMyLegalSubmissions } from '../../services/legalSupportService'
import { getLegalCategories, getStatusMeta, legalUserLinks, normalizeLegalCategory } from './legalHelpers'

function LegalDashboardPage() {
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [tasks, setTasks] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        setLoading(true)
        const [tasksData, submissionsData] = await Promise.all([
          getLegalTasks(),
          getMyLegalSubmissions(),
        ])
        if (!active) return
        const normalizedTasks = (tasksData.tasks || []).map((task) => ({
          ...task,
          category: normalizeLegalCategory(task.category),
        }))
        setTasks(normalizedTasks)
        setSubmissions(submissionsData.submissions || [])
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load legal dashboard.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const submissionMap = useMemo(
    () =>
      new Map(
        (submissions || []).map((submission) => [
          String(submission?.taskId?._id || submission?.taskId),
          submission,
        ]),
      ),
    [submissions],
  )

  const visibleTasks = useMemo(() => {
    if (activeCategory === 'All') return tasks
    return tasks.filter((task) => task.category === activeCategory)
  }, [activeCategory, tasks])

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="dashboard-hero legal-page-hero">
            <div className="hero-primary-panel">
              <Card title="Legal Dashboard" subtitle="Track every legal requirement, submission, and next action in one place.">
                <div className="legal-page-intro">
                  <p className="card-muted">
                    Use the category filters to move through your legal checklist in a structured order. Each task shows
                    its latest submission status so you always know what to do next.
                  </p>
                  <div className="legal-filter-row">
                    <button
                      type="button"
                      className={`legal-filter-pill ${activeCategory === 'All' ? 'active' : ''}`.trim()}
                      onClick={() => setActiveCategory('All')}
                    >
                      All
                    </button>
                    {getLegalCategories().map((category) => (
                      <button
                        key={category}
                        type="button"
                        className={`legal-filter-pill ${activeCategory === category ? 'active' : ''}`.trim()}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="legal-task-grid">
            {loading ? (
              <Card title="Loading tasks" subtitle="Preparing your legal checklist." />
            ) : visibleTasks.length > 0 ? (
              visibleTasks.map((task) => {
                const status = submissionMap.get(String(task._id))?.status || 'PENDING'
                const meta = getStatusMeta(status)

                return (
                  <Card key={task._id} title={task.title} subtitle={task.category}>
                    <div className="legal-card-body">
                      <span className={`legal-status-pill tone-${meta.tone}`.trim()}>{meta.label}</span>
                      <p className="card-muted">Step order: {task.order ?? 0}</p>
                      <p className="card-muted">
                        Last submission: {submissionMap.get(String(task._id))?.updatedAt
                          ? new Date(submissionMap.get(String(task._id)).updatedAt).toLocaleString()
                          : 'No submissions yet'}
                      </p>
                      <p className="card-muted">
                        Evidence files: {submissionMap.get(String(task._id))?.evidence?.length || 0}
                      </p>
                      <div className="inline-actions">
                        <NavLink to={`/toolkits/legal/tasks/${task._id}`}>
                          <Button>Open Task</Button>
                        </NavLink>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card title="No tasks found" subtitle="Try another category or ask your admin to activate legal tasks." />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalDashboardPage
