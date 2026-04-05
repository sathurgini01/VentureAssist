import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import Modal from '../Modal'
import Button from '../Button'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAppContext } from '../../context/AppContext'

function CTASection() {
  const { isAuthenticated } = useAuth()
  const { submitMentorApplication, addToast } = useAppContext()
  const [showMentorForm, setShowMentorForm] = useState(false)
  const [formData, setFormData] = useState({
    qualification: '',
    yearsExperience: '',
    expertiseAreas: [],
    bio: '',
    portfolioLink: '',
    availability: '',
  })

  const toggleExpertise = (value) => {
    setFormData((current) => ({
      ...current,
      expertiseAreas: current.expertiseAreas.includes(value)
        ? current.expertiseAreas.filter((item) => item !== value)
        : [...current.expertiseAreas, value],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isAuthenticated) {
      addToast('Please login first to apply as a mentor.', 'warning')
      return
    }
    if (!formData.qualification || formData.expertiseAreas.length === 0 || !formData.bio) {
      addToast('Please complete required mentor qualification fields.', 'warning')
      return
    }
    await submitMentorApplication({
      qualification: formData.qualification,
      yearsExperience: Number(formData.yearsExperience || 0),
      expertiseAreas: formData.expertiseAreas,
      bio: formData.bio,
      portfolioLink: formData.portfolioLink,
      availability: formData.availability,
    })
    setShowMentorForm(false)
  }

  return (
    <>
      <section className="home-section cta-section" id="cta">
        <div className="home-container">
          <div className="cta-panel">
            <span className="section-label">GET STARTED</span>
            <h2>
              Begin Your <span>Venture</span> Journey Today
            </h2>
            <p>
              Join a platform designed to help founders plan better, launch faster, and grow with more support around every move.
            </p>
            <div className="cta-actions">
              <NavLink to="/register" className="home-btn home-btn-primary">
                Sign Up — It&apos;s Free
              </NavLink>
              <a href="#modules" className="home-btn home-btn-soft">
                Explore Templates
              </a>
              <button type="button" className="home-btn home-btn-soft" onClick={() => setShowMentorForm(true)}>
                Start Mentoring
              </button>
            </div>
            <small>No credit card required · Free plan available · Cancel anytime</small>
          </div>
        </div>
      </section>

      <Modal isOpen={showMentorForm} title="Start Mentoring">
        <p className="card-muted">
          Minimum requirements: proven startup/industry experience, strong communication skills, and practical mentoring ability.
          Please provide accurate qualification details for admin review.
        </p>
        <form className="section-stack" onSubmit={handleSubmit}>
          <label className="form-label">
            Highest Qualification *
            <input className="form-control" value={formData.qualification} onChange={(event) => setFormData((current) => ({ ...current, qualification: event.target.value }))} />
          </label>
          <label className="form-label">
            Years of Experience *
            <input type="number" className="form-control" value={formData.yearsExperience} onChange={(event) => setFormData((current) => ({ ...current, yearsExperience: event.target.value }))} />
          </label>
          <label className="form-label">
            Expertise Areas *
            <div className="checkbox-row">
              {['Business Idea', 'Marketing & Development', 'Law'].map((item) => (
                <label key={item} className="checkbox-item">
                  <input type="checkbox" checked={formData.expertiseAreas.includes(item)} onChange={() => toggleExpertise(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </label>
          <label className="form-label">
            Professional Bio *
            <textarea className="form-control" rows={3} value={formData.bio} onChange={(event) => setFormData((current) => ({ ...current, bio: event.target.value }))} />
          </label>
          <label className="form-label">
            Portfolio / LinkedIn URL
            <input className="form-control" value={formData.portfolioLink} onChange={(event) => setFormData((current) => ({ ...current, portfolioLink: event.target.value }))} />
          </label>
          <label className="form-label">
            Availability
            <input className="form-control" value={formData.availability} onChange={(event) => setFormData((current) => ({ ...current, availability: event.target.value }))} />
          </label>
          <div className="inline-actions">
            <Button type="submit">Submit Application</Button>
            <Button type="button" variant="secondary" onClick={() => setShowMentorForm(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CTASection
