import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { createLegalHelpRequest, getLegalTaskById } from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalHelpPage() {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const [task, setTask] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

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
      setSending(true)
      await createLegalHelpRequest({ taskId, message })
      addToast('Mentor help request sent successfully.', 'success')
      navigate(`/toolkits/legal/tasks/${taskId}`)
    } catch (error) {
      addToast(error.message || 'Unable to send help request.', 'error')
    } finally {
      setSending(false)
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
              <Card title="Ask a Mentor" subtitle={task?.title || 'Request guidance for this legal task.'}>
                <form className="legal-form-grid" onSubmit={handleSubmit}>
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
                    <Button type="submit" disabled={sending}>
                      {sending ? 'Sending…' : 'Send Request'}
                    </Button>
                    <NavLink to={`/toolkits/legal/tasks/${taskId}`}>
                      <Button variant="secondary">Back to Task</Button>
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

export default LegalHelpPage
