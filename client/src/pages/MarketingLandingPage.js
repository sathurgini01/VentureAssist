import { NavLink } from 'react-router-dom'
import Button from '../components/Button'
import { useAppContext } from '../context/AppContext'
import { useAuth } from '../context/AuthContext.jsx'
import '../styles/MarketingLanding.css'

const trustMetrics = [
  { value: '120+', label: 'Marketing Templates' },
  { value: '45+', label: 'Active Mentors' },
  { value: '500+', label: 'Campaigns Created' },
  { value: '10K+', label: 'Leads Generated' },
]

const problems = [
  'Random promotions',
  'Poor ROI tracking',
  'No structured growth plan',
  'Wasted budget',
]

const solutions = [
  'Stage-based templates',
  'Real-time analytics',
  'Mentor guidance',
  'AI suggestions',
]

const testimonials = [
  {
    name: 'Nadeesha Perera',
    business: 'D2C wellness brand',
    quote: 'We stopped guessing and started running campaigns with a much clearer structure.',
  },
  {
    name: 'Ishara Fernando',
    business: 'B2B SaaS startup',
    quote: 'The mentor guidance and templates made our marketing process feel far more professional.',
  },
]

function Landing() {
  const { templates } = useAppContext()
  const { isAuthenticated } = useAuth()
  const templateRoute = isAuthenticated ? '/dashboard/templates' : '/login'
  const previewTemplates = templates.slice(0, 3)

  return (
    <main className="landing-page">
      <div className="landing-shell">
        <header className="landing-nav">
          <div className="landing-brand-block">
            <span className="landing-brand-mark">VA</span>
            <div className="landing-brand-copy">
              <strong>Venture Assist</strong>
              <p>Marketing Module</p>
            </div>
          </div>

          <div className="landing-nav-actions">
            <NavLink to="/login">
              <Button variant="secondary">Login</Button>
            </NavLink>
            <NavLink to="/register">
              <Button>Start Free</Button>
            </NavLink>
          </div>
        </header>

        <section className="landing-hero">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow">Marketing system for founders</span>
            <h1>Launch Smarter Campaigns. Grow Faster.</h1>
            <p className="landing-hero-text">
              Venture Assist helps teams run structured campaigns with templates, analytics, AI insights, and mentor support.
            </p>

            <div className="landing-cta-row">
              <NavLink to="/register">
                <Button>Start Free</Button>
              </NavLink>
              <a href="#templates" className="landing-anchor-link">
                <Button variant="secondary">Explore Templates</Button>
              </a>
            </div>

            <div className="landing-proof-strip">
              <span>Templates</span>
              <span>Mentor-backed</span>
              <span>AI-assisted</span>
            </div>
          </div>

          <div className="hero-showcase">
            <div className="hero-showcase-window">
              <div className="hero-window-header">
                <span className="window-dot coral" />
                <span className="window-dot gold" />
                <span className="window-dot mint" />
              </div>

              <div className="hero-showcase-main">
                <div className="hero-showcase-intro">
                  <p className="showcase-label">Campaign Workspace</p>
                  <h2>Professional planning, without the clutter.</h2>
                </div>

                <div className="showcase-stat-band">
                  <article>
                    <span>Template Match</span>
                    <strong>Growth Launch</strong>
                  </article>
                  <article>
                    <span>Performance</span>
                    <strong>On Track</strong>
                  </article>
                  <article>
                    <span>Mentor Review</span>
                    <strong>Scheduled</strong>
                  </article>
                </div>

                <div className="showcase-visual-grid">
                  <section className="showcase-chart-card">
                    <div className="showcase-card-heading">
                      <span>Campaign Snapshot</span>
                      <small>Last 30 days</small>
                    </div>
                    <div className="showcase-chart" aria-hidden="true">
                      <span style={{ height: '42%' }} />
                      <span style={{ height: '58%' }} />
                      <span style={{ height: '50%' }} />
                      <span style={{ height: '74%' }} />
                      <span style={{ height: '68%' }} />
                      <span style={{ height: '88%' }} />
                    </div>
                  </section>

                  <section className="showcase-focus-card">
                    <span className="showcase-mini-label">AI Suggestion</span>
                    <strong>Refine your message for higher lead quality.</strong>
                    <p>Use a stronger value proposition before expanding spend.</p>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-metrics-section" aria-label="Platform impact metrics">
          {trustMetrics.map((metric) => (
            <article key={metric.label} className="trust-metric-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </section>

        <section className="landing-cta-banner">
          <div className="landing-cta-copy">
            <span className="landing-eyebrow light">Move with clarity</span>
            <h2>Ready to Scale Your Marketing?</h2>
            <p>Give your team one structured place to plan, launch, and improve campaigns.</p>
          </div>
          <NavLink to="/register">
            <Button>Create Your First Campaign</Button>
          </NavLink>
        </section>

        <section className="solution-section">
          <div className="section-heading">
            <span className="landing-section-tag">The Problem</span>
            <h2>Most teams don’t fail because they lack ideas. They fail because execution stays inconsistent.</h2>
          </div>

          <div className="problem-solution-layout">
            <article className="issue-panel">
              <h3>Common marketing issues</h3>
              <ul className="benefit-list issue-list">
                {problems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>
            </article>

            <article className="solution-panel">
              <h3>What Venture Assist brings</h3>
              <ul className="benefit-list solution-list">
                {solutions.map((solution) => (
                  <li key={solution}>{solution}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="feature-section" id="templates">
          <div className="section-heading section-heading-split">
            <div>
              <span className="landing-section-tag">Templates</span>
              <h2>Start with ready-made campaign templates built for real marketing workflows.</h2>
            </div>
            <p>Choose a template and continue to the full Templates page to explore or use it.</p>
          </div>

          <div className="template-preview-grid">
            {previewTemplates.map((template) => (
              <NavLink key={template.id} to={templateRoute} className="template-preview-card">
                <div className="template-preview-top">
                  <span className="template-preview-badge">{template.category}</span>
                  <span className="template-preview-format">{template.format}</span>
                </div>
                <h3>{template.name}</h3>
                <p>{template.headline}</p>
                <span className="template-preview-link">Explore</span>
              </NavLink>
            ))}
          </div>

          <div className="template-preview-action">
            <NavLink to={templateRoute}>
              <Button variant="secondary">View All Templates</Button>
            </NavLink>
          </div>
        </section>

        <section className="social-proof-section">
          <div className="section-heading section-heading-split">
            <div>
              <span className="landing-section-tag">Social Proof</span>
              <h2>Founders use Venture Assist to make marketing feel more disciplined.</h2>
            </div>
            <p>Simple workflows, clearer decisions, and a more professional way to execute campaigns.</p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="testimonial-card">
                <p className="testimonial-quote">“{testimonial.quote}”</p>
                <div className="testimonial-meta">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.business}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Landing

