import { NavLink } from 'react-router-dom'

const metrics = [
  { label: 'Template Match', value: 'Growth Launch' },
  { label: 'Performance', value: 'On Track ↑' },
  { label: 'Mentor Review', value: 'Scheduled' },
]

const bars = ['35%', '55%', '45%', '70%', '85%', '100%']

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="home-container hero-grid">
        <div className="hero-copy">
          <span className="section-pill">Platform for Founders &amp; Entrepreneurs</span>
          <h1>
            Turn Your Business <span>Idea</span> into Reality
          </h1>
          <p className="hero-description">
            Build momentum with a platform that brings planning, mentorship, templates, and actionable AI guidance into one polished workspace.
          </p>

          <div className="hero-actions">
            <NavLink to="/register" className="home-btn home-btn-primary">
              Get Started Free <span aria-hidden="true">→</span>
            </NavLink>
            <a href="#modules" className="home-btn home-btn-soft">
              Explore Modules
            </a>
          </div>

          <div className="hero-trust">
            <div className="hero-avatars" aria-hidden="true">
              <span className="avatar avatar-teal" />
              <span className="avatar avatar-amber" />
              <span className="avatar avatar-coral" />
              <span className="avatar avatar-mint" />
            </div>
            <p>2,400+ founders growing with Venture Assist</p>
          </div>
        </div>

        <div className="hero-visual">
          <article className="dashboard-card">
            <div className="dashboard-header">
              <div>
                <span className="dashboard-label">CAMPAIGN WORKSPACE</span>
                <h2>Professional planning, without the clutter.</h2>
              </div>
              <span className="dashboard-status">
                <span className="live-dot" />
                preview 
              </span>
            </div>

            <div className="dashboard-chips">
              {metrics.map((item) => (
                <article key={item.label} className="metric-chip">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>

            <div className="dashboard-panels">
              <article className="dashboard-chart-box">
                <div className="chart-heading">
                  <span>Campaign Snapshot</span>
                  <small>Last 6 weeks</small>
                </div>
                <div className="chart-bars" aria-hidden="true">
                  {bars.map((height) => (
                    <span key={height} style={{ height }} />
                  ))}
                </div>
              </article>

              <article className="dashboard-ai-box">
                <span>✦ AI SUGGESTION</span>
                <p>Reposition your headline around customer outcomes before increasing paid spend this week.</p>
              </article>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default Hero
