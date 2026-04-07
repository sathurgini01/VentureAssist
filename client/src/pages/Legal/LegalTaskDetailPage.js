import { useEffect, useRef, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { getLegalTaskById, getMySubmissionForTask } from '../../services/legalSupportService'
import { formatDate, getStatusMeta, legalUserLinks } from './legalHelpers'

function LegalTaskDetailPage() {
  const { taskId } = useParams()
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [task, setTask] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        const [taskData, submissionData] = await Promise.all([
          getLegalTaskById(taskId),
          getMySubmissionForTask(taskId),
        ])

        if (!active) return
        setTask(taskData.task)
        setSubmission(submissionData.submission)
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load task details.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [taskId])

  const meta = getStatusMeta(submission?.status || 'PENDING')

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          {loading ? (
            <Card title="Loading task details" subtitle="Please wait while we prepare the legal task." />
          ) : task ? (
            <>
              <section className="dashboard-hero legal-page-hero">
                <div className="hero-primary-panel">
                  <Card title={task.title} subtitle={task.category}>
                    <div className="legal-task-header-row">
                      <span className={`legal-status-pill tone-${meta.tone}`.trim()}>{meta.label}</span>
                      <span className="card-muted">Last updated: {formatDate(submission?.updatedAt || task.updatedAt)}</span>
                    </div>
                    <p className="card-muted legal-description">{task.description || 'No description provided yet.'}</p>
                    <div className="quick-actions">
                      <NavLink to={`/toolkits/legal/tasks/${taskId}/evidence`}>
                        <Button>Add Evidence</Button>
                      </NavLink>
                      <NavLink to={`/toolkits/legal/tasks/${taskId}/help`}>
                        <Button variant="secondary">Ask Mentor</Button>
                      </NavLink>
                      <NavLink to="/toolkits/legal/dashboard">
                        <Button variant="ghost">Back to Dashboard</Button>
                      </NavLink>
                    </div>
                  </Card>
                </div>
              </section>

              <section className="dashboard-split legal-detail-grid">
                <Card title="Action Steps" subtitle="Follow these steps before submitting evidence.">
                  <ol className="legal-list legal-ordered-list">
                    {(task.steps || []).length > 0 ? (
                      task.steps.map((step, index) => <li key={`${task._id}-step-${index}`}>{step}</li>)
                    ) : (
                      <li>Review your business documents and prepare compliant evidence for this task.</li>
                    )}
                  </ol>
                </Card>

                <Card title="Required Documents" subtitle="Keep these documents ready before submission.">
                  <ul className="legal-list">
                    {(task.requiredDocuments || []).length > 0 ? (
                      task.requiredDocuments.map((item, index) => <li key={`${task._id}-doc-${index}`}>{item}</li>)
                    ) : (
                      <li>No mandatory document list provided yet.</li>
                    )}
                  </ul>
                </Card>
              </section>

              <section className="dashboard-split legal-detail-grid">
                <Card title="Helpful Links" subtitle="Resources that may help you complete this task faster.">
                  <ul className="legal-link-list">
                    {(task.helpfulLinks || []).length > 0 ? (
                      task.helpfulLinks.map((link, index) => (
                        <li key={`${task._id}-link-${index}`}>
                          <a href={link} target="_blank" rel="noreferrer">{link}</a>
                        </li>
                      ))
                    ) : (
                      <li className="card-muted">No additional resources are linked to this task.</li>
                    )}
                  </ul>
                </Card>

                <Card title="Submission Status" subtitle="Latest review information for this task.">
                  <div className="section-stack compact-stack">
                    <div className="legal-submission-status">
                      <span className={`legal-status-pill tone-${meta.tone}`.trim()}>{meta.label}</span>
                      {submission?.mentorFeedback ? <p className="card-muted">Mentor feedback: {submission.mentorFeedback}</p> : null}
                      {submission?.adminFeedback ? <p className="card-muted">Admin feedback: {submission.adminFeedback}</p> : null}
                    </div>
                    {(submission?.evidence || []).length > 0 ? (
                      <div className="legal-evidence-list">
                        {(submission.evidence || []).map((item, index) => (
                          <div key={`${item.fileUrl}-${index}`} className="legal-evidence-item">
                            <a href={item.fileUrl} target="_blank" rel="noreferrer">Evidence {index + 1}</a>
                            <span className="card-muted">{item.note || 'No note provided'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="card-muted">You have not uploaded evidence for this task yet.</p>
                    )}
                  </div>
                </Card>
              </section>
            </>
          ) : (
            <Card title="Task not found" subtitle="The selected legal task could not be loaded." />
          )}
        </div>
      </div>
    </div>
  )
}

export default LegalTaskDetailPage
