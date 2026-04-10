import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import { useAppContext } from '../../context/AppContext'
import { getLegalTaskById } from '../../services/legalSupportService'

function LegalMentorTaskDetailPage() {
  const { taskId } = useParams()
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true

    const loadTask = async () => {
      try {
        setLoading(true)
        const data = await getLegalTaskById(taskId)
        if (!active) return
        setTask(data.task)
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load task details.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTask()
    return () => {
      active = false
    }
  }, [taskId])

  return (
    <div className="mentor-legal-container">
      {loading ? (
        <Card title="Loading task details" subtitle="Please wait while the task loads." />
      ) : task ? (
        <>
          <div className="mentor-task-detail-header">
            <div className="mentor-inline-actions">
              <Link to="/mentor/legal/tasks" className="mentor-btn secondary mentor-task-link">
                ← Back to Task Library
              </Link>
            </div>
            <h2>{task.title}</h2>
            <p className="mentor-task-category">{task.category || 'Uncategorized'}</p>
          </div>

          <div className="mentor-task-detail-card">
            <Card title="Task Overview" subtitle="Full details for this legal task">
              <p className="card-muted">{task.description || 'No description provided yet.'}</p>
            </Card>

            <div className="mentor-detail-grid">
              <Card title="Action Steps" subtitle="Steps the user should follow.">
                <ol className="legal-list legal-ordered-list">
                  {(task.steps || []).length > 0 ? (
                    task.steps.map((step, index) => <li key={`${task._id}-step-${index}`}>{step}</li>)
                  ) : (
                    <li>Review business documents and prepare compliant evidence for this task.</li>
                  )}
                </ol>
              </Card>

              <Card title="Required Documents" subtitle="Documents needed to complete the task.">
                <ul className="legal-list">
                  {(task.requiredDocuments || []).length > 0 ? (
                    task.requiredDocuments.map((item, index) => <li key={`${task._id}-doc-${index}`}>{item}</li>)
                  ) : (
                    <li>No mandatory document list provided yet.</li>
                  )}
                </ul>
              </Card>
            </div>

            <Card title="Helpful Links" subtitle="Related resources for this task.">
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
          </div>
        </>
      ) : (
        <Card title="Task not found" subtitle="The selected legal task could not be loaded." />
      )}
    </div>
  )
}

export default LegalMentorTaskDetailPage
