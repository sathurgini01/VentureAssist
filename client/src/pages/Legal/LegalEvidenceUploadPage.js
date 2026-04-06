import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { getLegalTaskById, submitLegalEvidence } from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalEvidenceUploadPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [task, setTask] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    getLegalTaskById(taskId)
      .then((data) => {
        if (active) setTask(data.task)
      })
      .catch((error) => {
        if (active) addToast(error.message || 'Unable to load task.', 'error')
      })

    return () => {
      active = false
    }
  }, [addToast, taskId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      setSubmitting(true)
      await submitLegalEvidence(taskId, { fileUrl, note })
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
