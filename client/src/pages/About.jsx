import { NavLink } from 'react-router-dom'
import '../styles/about.css'

const offerCards = [
  {
    icon: '📈',
    title: 'Marketing & Campaign Management',
    description: 'Structured workflows for planning, launching, and improving startup marketing efforts.',
  },
  {
    icon: '🤝',
    title: 'Mentor & Support System',
    description: 'Access to mentor guidance, support requests, and founder-focused collaboration.',
  },
  {
    icon: '📚',
    title: 'Knowledge & Articles Hub',
    description: 'Practical learning resources designed to support better decisions and execution.',
  },
  {
    icon: '📅',
    title: 'Appointment & Scheduling System',
    description: 'A smoother way to organize mentor sessions, reviews, and startup follow-ups.',
  },
]

const teamMembers = [
  {
    name: 'M. Sanjeevan',
    role: 'Marketing & Development',
    description: 'Leads the Marketing & Development module, designing campaign strategies, templates, and AI-driven marketing insights for entrepreneurs.',
  },
  {
    name: 'K. Sathurgini',
    role: 'Business Law Management',
    description: 'Manages the Business Law module, ensuring compliance workflows, legal resources, and guidance are integrated for startup operations.',
  },
  {
    name: 'S. Pirathap',
    role: 'Financial Management',
    description: 'Oversees the Financial Management module, implementing budgeting, reporting, and analytics tools to support business growth decisions.',
  },
  {
    name: 'S. Nithusika',
    role: 'Business Idea Management',
    description: 'Develops the Business Idea Management module, helping users organize, evaluate, and refine venture concepts for successful execution.',
  },
]

const highlights = [
  'Secure role-based access control',
  'Structured business workflow simulation',
  'AI-powered insights integration',
  'Real-world startup support environment',
]

function About() {
  return (
    <div className="about-page">
      <header className="about-navbar">
        <div className="about-shell about-navbar-inner">
          <NavLink to="/" className="about-brand">
            <span className="about-brand-mark">VA</span>
            <span className="about-brand-copy">
              <strong>Venture Assist</strong>
              <small>Who We Are</small>
            </span>
          </NavLink>
          <div className="about-nav-actions">
            <NavLink to="/" className="about-nav-link">
              Home
            </NavLink>
            <a href="#about-cta" className="about-btn about-btn-ghost">
              Explore Platform
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="about-hero">
          <div className="about-shell about-hero-grid">
            <div>
              <span className="about-pill">Business Growth Platform</span>
              <h1>Empowering Entrepreneurs to Build, Grow, and Succeed.</h1>
              <p>
                Venture Assist is a role-based business growth platform designed to help entrepreneurs manage marketing campaigns, connect with mentors, access knowledge resources, and track business performance in one unified system.
              </p>
              <a href="#about-cta" className="about-btn about-btn-primary">
                Explore Platform
              </a>
            </div>
            <div className="about-hero-visual">
              <div className="about-visual-card">
                <span>Startup Growth Journey</span>
                <strong>From idea validation to execution, guidance, and measurable progress.</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-shell mission-grid">
            <article className="about-card">
              <span className="about-icon">🎯</span>
              <h2>Our Mission</h2>
              <p>
                To help startups grow through structured digital support, practical workflows, mentorship access, and tools that make execution clearer.
              </p>
            </article>
            <article className="about-card">
              <span className="about-icon">🌍</span>
              <h2>Our Vision</h2>
              <p>
                To build a collaborative entrepreneurial ecosystem where founders can learn, adapt, and scale with confidence.
              </p>
            </article>
          </div>
        </section>

        <section className="about-section">
          <div className="about-shell">
            <div className="about-heading">
              <span className="about-kicker">WHAT WE OFFER</span>
              <h2>Tools built around how startups actually grow</h2>
            </div>
            <div className="offer-grid">
              {offerCards.map((card) => (
                <article key={card.title} className="about-card offer-card">
                  <span className="about-icon">{card.icon}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section about-team-section">
          <div className="about-shell">
            <div className="about-heading">
              <span className="about-kicker">MEET THE TEAM</span>
              <h2>The people shaping Venture Assist</h2>
            </div>
            <div className="team-grid">
              {teamMembers.map((member) => (
                <article key={member.name} className="about-card team-card">
                  <span className="team-avatar">{member.name.charAt(0)}</span>
                  <h3>{member.name}</h3>
                  <strong>{member.role}</strong>
                  <p>{member.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-shell about-why-card">
            <span className="about-kicker">WHY VENTURE ASSIST</span>
            <h2>Built to support real startup momentum</h2>
            <div className="highlight-list">
              {highlights.map((item) => (
                <div key={item} className="highlight-item">
                  <span>•</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-shell about-cta-card" id="about-cta">
            <h2>Join the Venture Assist Community Today</h2>
            <div className="about-cta-actions">
              <NavLink to="/register" className="about-btn about-btn-primary">
                Get Started
              </NavLink>
              <NavLink to="/#contact" className="about-btn about-btn-ghost">
                Contact Us
              </NavLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="about-footer">
        <div className="about-shell about-footer-grid">
          <div>
            <div className="about-brand">
              <span className="about-brand-mark">VA</span>
              <span className="about-brand-copy">
                <strong>Venture Assist</strong>
                <small>Business Platform</small>
              </span>
            </div>
          </div>
          <div className="about-footer-links">
            <NavLink to="/">Home</NavLink>
            <a href="#about-cta">Explore Platform</a>
            <NavLink to="/register">Get Started</NavLink>
          </div>
          <div className="about-footer-socials">
            <a href="/">ig</a>
            <a href="/">in</a>
            <a href="/">x</a>
          </div>
        </div>
        <div className="about-shell about-footer-bottom">
          <p>© 2026 Venture Assist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default About
