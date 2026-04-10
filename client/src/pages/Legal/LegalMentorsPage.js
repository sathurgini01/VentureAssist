import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { getLegalMentors } from '../../services/legalSupportService'
import { legalUserLinks } from './legalHelpers'

function LegalMentorsPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const addToastRef = useRef(addToast)
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    addToastRef.current = addToast
  }, [addToast])

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        setLoading(true)
        const data = await getLegalMentors()
        if (!active) return
        setMentors(data.mentors || [])
      } catch (error) {
        if (active) addToastRef.current(error.message || 'Unable to load mentors.', 'error')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  const mentorCount = useMemo(() => mentors.length, [mentors])

  return (
    <div className="dashboard-shell legal-shell">
      <Sidebar links={legalUserLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content legal-dashboard-content">
          <section className="dashboard-hero legal-page-hero">
            <div className="hero-primary-panel">
              <Card title="Legal Mentors" subtitle="Browse mentors available to support your legal tasks.">
                <p className="card-muted">
                  Review the mentor details directly on this page. Use the legal task help flow to send your question to a selected mentor.
                </p>
                <div className="quick-actions">
                  <NavLink to="/toolkits/legal/dashboard">
                    <Button variant="secondary">Legal Dashboard</Button>
                  </NavLink>
                  <NavLink to="/toolkits/legal/ai">
                    <Button variant="ghost">Open AI Assistant</Button>
                  </NavLink>
                </div>
              </Card>
            </div>
          </section>

          <section className="legal-task-grid">
            {loading ? (
              <Card title="Loading mentors" subtitle="Finding available legal mentors." />
            ) : mentorCount > 0 ? (
              mentors.map((mentor) => (
                <Card key={mentor._id} title={mentor.name} subtitle={mentor.expertise || 'Legal mentor'}>
                  <div className="legal-card-body">
                    <p className="card-muted">{mentor.bio || 'Experienced mentor ready to help.'}</p>
                    <div className="mentor-details">
                      {mentor.expertise && (
                        <p><strong>Expertise:</strong> {mentor.expertise}</p>
                      )}
                      {mentor.availability && (
                        <p><strong>Availability:</strong> {mentor.availability}</p>
                      )}
                      {mentor.email && (
                        <p><strong>Contact:</strong> {mentor.email}</p>
                      )}
                      {mentor.qualification && (
                        <p><strong>Qualification:</strong> {mentor.qualification}</p>
                      )}
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
                    <div className="inline-actions">
                      <Button type="button" onClick={() => navigate(`/toolkits/legal/mentors/${mentor._id}`)}>
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card title="No mentors found" subtitle="Try again later or contact support." />
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default LegalMentorsPage
