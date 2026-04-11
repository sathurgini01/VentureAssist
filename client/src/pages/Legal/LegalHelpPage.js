import { useEffect, useRef, useState } from 'react'
import { NavLink, useParams, useSearchParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { createLegalHelpRequest, getMyLegalHelpRequests, getLegalMentors, getLegalTaskById } from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalHelpPage() {
  const { taskId } = useParams()
  const [searchParams] = useSearchParams()
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [task, setTask] = useState(null)
  const [mentors, setMentors] = useState([])
  const [selectedMentorId, setSelectedMentorId] = useState(searchParams.get('mentorId') || '')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingMentors, setLoadingMentors] = useState(true)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true

    getLegalTaskById(taskId)
      .then((data) => {
        if (active) setTask(data.task)
      })
      .catch((error) => {
        if (active) addToastRef.current(error.message || 'Unable to load task.', 'error')
      })

    return () => {
      active = false
    }
  }, [taskId])

  useEffect(() => {
    let active = true

    const loadMentors = async () => {
      try {
        setLoadingMentors(true)
        const data = await getLegalMentors()
        if (!active) return
        setMentors(data.mentors || [])
        if (!selectedMentorId && Array.isArray(data.mentors) && data.mentors.length > 0) {
          setSelectedMentorId(data.mentors[0]._id)
        }
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load mentors.', 'error')
      } finally {
        if (active) setLoadingMentors(false)
      }
    }

    const loadHistory = async () => {
      try {
        setLoadingHistory(true)
        const data = await getMyLegalHelpRequests()
        if (!active) return
        const taskHistory = (data.requests || []).filter((entry) => {
          const entryTaskId = entry.taskId?._id || entry.taskId
          return String(entryTaskId) === String(taskId)
        })
        setHistory(taskHistory)
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load question history.', 'error')
      } finally {
        if (active) setLoadingHistory(false)
      }
    }

    loadMentors()
    loadHistory()
    return () => {
      active = false
    }
  }, [taskId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSending(true)
      const selectedMentor = mentors.find((mentor) => String(mentor._id) === String(selectedMentorId))
      await createLegalHelpRequest({
        taskId,
        mentorId: selectedMentorId,
        mentorName: selectedMentor?.name || '',
        message,
      })
      addToast('Mentor help request sent successfully.', 'success')
      setMessage('')
      const refreshed = await getMyLegalHelpRequests()
      const taskHistory = (refreshed.requests || []).filter((entry) => {
        const entryTaskId = entry.taskId?._id || entry.taskId
        return String(entryTaskId) === String(taskId)
      })
      setHistory(taskHistory)
    } catch (error) {
      addToast(error.message || 'Unable to send help request.', 'error')
    } finally {
      setSending(false)
    }
  }

  const resolveMentorName = (entry) => {
    if (entry?.mentorId?.name) return entry.mentorId.name
    if (entry?.mentorName) return entry.mentorName

    const mentorId = entry?.mentorId?._id || entry?.mentorId
    if (mentorId) {
      const matchedMentor = mentors.find((mentor) => String(mentor._id) === String(mentorId))
      if (matchedMentor?.name) return matchedMentor.name
    }

    return 'Mentor'
  }

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="dashboard-hero legal-page-hero">
            <div className="hero-primary-panel">
              <Card title="Ask a Mentor" subtitle={task?.title || 'Request guidance for this legal task.'}>
                <form className="legal-form-grid" onSubmit={handleSubmit}>
                  <label className="form-group">
                    <span>Select Mentor</span>
                    <select
                      value={selectedMentorId}
                      onChange={(event) => setSelectedMentorId(event.target.value)}
                      required
                    >
                      {loadingMentors ? (
                        <option value="">Loading mentors…</option>
                      ) : mentors.length > 0 ? (
                        mentors.map((mentor) => (
                          <option key={mentor._id} value={mentor._id}>
                            {mentor.name} — {mentor.expertise || 'Legal expert'}
                          </option>
                        ))
                      ) : (
                        <option value="">No mentors available</option>
                      )}
                    </select>
                  </label>

                  <label className="form-group">
                    <span>Your Message</span>
                    <textarea
                      rows="7"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Describe the issue you need help with, what you have already prepared, and where you are blocked."
                      required
                    />
                  </label>

                  <div className="inline-actions">
                    <Button type="submit" disabled={sending || loadingMentors || mentors.length === 0}>
                      {sending ? 'Sending…' : 'Send Request'}
                    </Button>
                    <NavLink to="/toolkits/legal/mentors">
                      <Button variant="secondary">Back to Mentors</Button>
                    </NavLink>
                    <NavLink to={`/toolkits/legal/tasks/${taskId}`}>
                      <Button variant="secondary">Back to Task</Button>
                    </NavLink>
                  </div>
                </form>
              </Card>

              <section className="dashboard-split legal-detail-grid">
                <Card title="Your Question History" subtitle="Track previous mentor requests for this task.">
                  {loadingHistory ? (
                    <p className="card-muted">Loading your mentor questions…</p>
                  ) : history.length > 0 ? (
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
                            <p><strong>Answered by: {resolveMentorName(entry)}</strong></p>
                            <p>{entry.mentorReply}</p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="card-muted">You have not asked any mentor questions yet.</p>
                  )}
                </Card>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalHelpPage
