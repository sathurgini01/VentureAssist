import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { getLegalMentors, getLegalTaskById, submitLegalEvidence } from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalEvidenceUploadPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [task, setTask] = useState(null)
  const [mentors, setMentors] = useState([])
  const [selectedMentorId, setSelectedMentorId] = useState('')
  const [loadingMentors, setLoadingMentors] = useState(true)
  const [fileUrl, setFileUrl] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoadingMentors(true)
        const [taskData, mentorData] = await Promise.all([
          getLegalTaskById(taskId),
          getLegalMentors()
        ])

        if (!active) return
        setTask(taskData.task)
        setMentors(mentorData.mentors || [])
        if (!selectedMentorId && Array.isArray(mentorData.mentors) && mentorData.mentors.length > 0) {
          setSelectedMentorId(mentorData.mentors[0]._id)
        }
      } catch (error) {
        if (active) addToast(error.message || 'Unable to load task or mentors.', 'error')
      } finally {
        if (active) setLoadingMentors(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [addToast, taskId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      const selectedMentor = mentors.find((mentor) => mentor._id === selectedMentorId)
      const mentorName = selectedMentor?.name || ''
      await submitLegalEvidence(taskId, {
        fileUrl,
        note,
        mentorId: selectedMentorId || undefined,
        mentorName,
      })

      if (mentorName && fileUrl) {
        const storageKey = `legalEvidenceMentorMap:${taskId}`
        const existing = JSON.parse(localStorage.getItem(storageKey) || '{}')
        existing[fileUrl] = mentorName
        localStorage.setItem(storageKey, JSON.stringify(existing))
      }

      addToast('Evidence submitted successfully.', 'success')
      navigate(`/toolkits/legal/tasks/${taskId}`)
    } catch (error) {
      addToast(error.message || 'Unable to submit evidence.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="dashboard-hero legal-page-hero">
            <div className="hero-primary-panel">
              <Card title="Upload Evidence" subtitle={task?.title || 'Attach your legal compliance proof.'}>
                <form className="legal-form-grid" onSubmit={handleSubmit}>
                  {loadingMentors ? (
                    <label className="form-group">
                      <span>Select Mentor</span>
                      <select disabled>
                        <option>Loading mentors…</option>
                      </select>
                    </label>
                  ) : mentors.length > 0 ? (
                    <label className="form-group">
                      <span>Select Mentor</span>
                      <select
                        value={selectedMentorId}
                        onChange={(event) => setSelectedMentorId(event.target.value)}
                        required
                      >
                        {mentors.map((mentor) => (
                          <option key={mentor._id} value={mentor._id}>
                            {mentor.name} — {mentor.expertise || 'Legal expert'}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="form-group">
                      <span>Select Mentor</span>
                      <select disabled>
                        <option>No mentors available</option>
                      </select>
                    </label>
                  )}

                  <label className="form-group">
                    <span>Document URL</span>
                    <input
                      type="url"
                      value={fileUrl}
                      onChange={(event) => setFileUrl(event.target.value)}
                      placeholder="Paste a secure document URL or storage link"
                      required
                    />
                  </label>

                  <label className="form-group">
                    <span>Submission Note</span>
                    <textarea
                      rows="6"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Add context for the mentor reviewing this evidence"
                    />
                  </label>

                  <div className="inline-actions">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting…' : 'Submit Evidence'}
                    </Button>
                    <NavLink to={`/toolkits/legal/tasks/${taskId}`}>
                      <Button variant="secondary">Cancel</Button>
                    </NavLink>
                  </div>
                </form>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalEvidenceUploadPage
