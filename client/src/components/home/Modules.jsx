import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const moduleCards = [
  {
    icon: '💡',
    title: 'Business Idea Validation',
    tone: 'teal',
    tags: ['Idea Submission', 'Feasibility', 'Business Model'],
    description:
      'Validate and refine startup ideas with structured support for market problems, target audience definition, and early business model planning.',
  },
  {
    icon: '⚖️',
    title: 'Law & Order',
    tone: 'amber',
    tags: ['Registration', 'Compliance', 'Legal Checklist'],
    description:
      'Guide founders through business registration, document management, compliance tracking, and key legal milestones needed to operate safely.',
  },
  {
    icon: '📊',
    title: 'Marketing & Business Development',
    tone: 'coral',
    tags: ['Campaigns', 'Mentorship', 'AI Analyzer'],
    description:
      'Support startup growth with stage-based templates, campaign workflows, performance tracking, mentor applications, and marketing knowledge resources.',
    slug: 'marketing',
  },
  {
    icon: '💰',
    title: 'Financial Management',
    tone: 'mint',
    tags: ['Expenses', 'Revenue', 'Profit & Loss'],
    description:
      'Help entrepreneurs stay financially sustainable through expense and revenue tracking, budget monitoring, performance metrics, and planning support.',
  },
]

function Modules() {
  const { isAuthenticated } = useAuth()

  const getModuleLink = (card) => {
    if (card.slug === 'marketing') {
      return isAuthenticated ? '/dashboard' : '/login'
    }

    if (card.title === 'Law & Order') {
      return isAuthenticated ? '/toolkits/legal' : '/login'
    }


    return '#cta'
  }

  return (
    <section className="home-section modules-section" id="modules">
      <div className="home-container modules-layout">
        <div className="modules-copy">
          <span className="section-label">MODULES</span>
          <h2>Everything your venture needs</h2>
          <p>
            Venture Assist combines the strategic tools founders need most into one place, so building your business feels focused instead of fragmented.
          </p>
          <a href="#stories" className="home-btn home-btn-primary">
            Explore All Modules <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="modules-grid">
          {moduleCards.map((card) => (
            <article key={card.title} className="home-card module-card">
              <span className={`module-icon module-icon-${card.tone}`}>{card.icon}</span>
              <h3>{card.title}</h3>
              <div className="module-tags">
                {card.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p>{card.description}</p>
              {getModuleLink(card).startsWith('/') ? (
                <NavLink to={getModuleLink(card)} className="module-link">
                  →
                </NavLink>
              ) : (
                <a href={getModuleLink(card)} className="module-link">
                  →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Modules
