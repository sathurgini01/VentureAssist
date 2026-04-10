import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import {
  createLegalHelpRequest,
  getLegalMentorById,
  getLegalTasks,
  getMyLegalHelpRequests,
} from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalMentorDetailPage() {
  const { mentorId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [mentor, setMentor] = useState(null)
  const [tasks, setTasks] = useState([])
  const [selectedTaskId, setSelectedTaskId] = useState(searchParams.get('taskId') || '')
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        const [mentorData, taskData, historyData] = await Promise.all([
          getLegalMentorById(mentorId),
          getLegalTasks('', true),
          getMyLegalHelpRequests(mentorId),
        ])

        if (!active) return
        setMentor(mentorData.mentor)
        setTasks(taskData.tasks || [])
        setHistory(historyData.requests || [])

        if (!selectedTaskId && taskData.tasks?.length > 0) {
          setSelectedTaskId(taskData.tasks[0]._id)
        }
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load mentor details.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [mentorId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedTaskId) {
      addToast('Select a task before sending your question.', 'error')
      return
    }

    try {
      setSending(true)
      await createLegalHelpRequest({
        taskId: selectedTaskId,
        mentorId,
        message,
      })
      addToast('Question submitted to mentor.', 'success')
      setMessage('')
      const refreshed = await getMyLegalHelpRequests(mentorId)
      setHistory(refreshed.requests || [])
    } catch (error) {
      addToast(error.message || 'Unable to send question.', 'error')
    } finally {
      setSending(false)
    }
  }

  const taskOptions = useMemo(
    () => (
      tasks || []
    ),
    [tasks],
  )

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          {loading ? (
            <Card title="Loading mentor profile" subtitle="Please wait while we retrieve mentor details." />
          ) : mentor ? (
            <>
              <section className="dashboard-hero legal-page-hero">
                <div className="hero-primary-panel">
                  <Card title={mentor.name} subtitle={mentor.expertise || 'Legal mentor'}>
                    <p className="card-muted">{mentor.bio || 'This mentor is available to support your legal tasks.'}</p>
                    <div className="mentor-details">
                      {mentor.email && <p><strong>Email:</strong> {mentor.email}</p>}
                      {mentor.availability && <p><strong>Availability:</strong> {mentor.availability}</p>}
                      {mentor.qualification && <p><strong>Qualification:</strong> {mentor.qualification}</p>}
                      {Number(mentor.yearsExperience) > 0 && (
                        <p><strong>Experience:</strong> {mentor.yearsExperience} years</p>
                      )}
                      {mentor.portfolioLink && (
                        <p>
                          <strong>Portfolio:</strong>{' '}
                          <a href={mentor.portfolioLink} target="_blank" rel="noreferrer">
                            View profile
                          </a>
                        </p>
                      )}
                    </div>
                    <div className="quick-actions">
                      <NavLink to="/toolkits/legal/mentors">
                        <Button variant="secondary">Back to Mentor List</Button>
                      </NavLink>
                      <NavLink to="/toolkits/legal/dashboard">
                        <Button variant="ghost">Task Dashboard</Button>
                      </NavLink>
                    </div>
                  </Card>
                </div>
              </section>

              <section className="dashboard-split legal-detail-grid">
                <Card title="Ask this Mentor" subtitle="Select a task and send a question directly.">
                  <form className="legal-form-grid" onSubmit={handleSubmit}>
                    <label className="form-group">
                      <span>Select Task</span>
                      <select value={selectedTaskId} onChange={(event) => setSelectedTaskId(event.target.value)} required>
                        <option value="" disabled>Select a legal task</option>
                        {taskOptions.map((task) => (
                          <option key={task._id} value={task._id}>{task.title}</option>
                        ))}
                      </select>
                    </label>

                    <label className="form-group">
                      <span>Your Question</span>
                      <textarea
                        rows="7"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Describe the issue you need help with, what you have already prepared, and where you are blocked."
                        required
                      />
                    </label>

                    <div className="inline-actions">
                      <Button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send Question'}</Button>
                      <Button type="button" variant="secondary" onClick={() => navigate('/toolkits/legal/mentors')}>Cancel</Button>
                    </div>
                  </form>
                </Card>

                <Card title="Question History" subtitle="Your previous requests for this mentor.">
                  {history.length > 0 ? (
                    history.map((entry) => (
                      <div key={entry._id} className="legal-progress-item">
                        <div className="legal-progress-item-header">
                          <strong>{entry.taskId?.title || 'General Legal Question'}</strong>
                          <span className="card-muted">{new Date(entry.createdAt).toLocaleString()}</span>
                        </div>
                        {entry.taskId?.category && (
                          <p className="task-category-badge">{entry.taskId.category}</p>
                        )}
                        {entry.taskId?.description && (
                          <p className="task-detail-description">{entry.taskId.description}</p>
                        )}
                        <p className="history-question"><strong>Your Question:</strong> {entry.message}</p>
                        <p className="card-muted">Status: {entry.status}</p>
                        {entry.mentorReply ? (
                          <div className="history-mentor-reply">
                            <p><strong>Mentor Reply:</strong></p>
                            <p>{entry.mentorReply}</p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="card-muted">No questions have been sent to this mentor yet.</p>
                  )}
                </Card>
              </section>
            </>
          ) : (
            <Card title="Mentor not found" subtitle="The selected mentor could not be loaded." />
          )}
        </div>
      </div>
    </div>
  )
}

export default LegalMentorDetailPage
