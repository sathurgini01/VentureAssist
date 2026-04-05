import { NavLink } from 'react-router-dom'

function CTASection() {
  return (
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
          </div>
          <small>No credit card required · Free plan available · Cancel anytime</small>
        </div>
      </div>
    </section>
  )
}

export default CTASection
