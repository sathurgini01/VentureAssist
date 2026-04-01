import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import '../../styles/MarketingDashboard.css'
import '../../styles/Cards.css'
import '../../styles/Buttons.css'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/mentor-requests', label: 'Mentor Requests', roles: ['mentor', 'admin'] },
  { to: '/dashboard/articles', label: 'Articles' },
  { to: '/profile', label: 'Profile' },
]

const mockArticles = [
  {
    id: 'article-1',
    title: 'How to Build a Founder-Friendly Campaign Funnel',
    author: 'Ayesha Fernando',
    date: 'March 27, 2026',
    readTime: '6 min read',
    category: 'Marketing',
    featuredImage: 'Featured Image Placeholder',
    content: [
      'A founder-friendly campaign funnel should help people move from curiosity to confidence. Instead of overcomplicating the journey, focus on a few clear messages that repeat with purpose across channels.',
      'Start with awareness content that introduces the problem, the founder, and the value proposition. Follow with nurturing content that builds trust through stories, proof, and simple examples.',
      'Conversion content should reduce friction. Give people one clear next action, explain why it matters, and make the outcome feel immediate and useful.',
    ],
  },
  {
    id: 'article-2',
    title: 'Mentor Sessions That Actually Create Momentum',
    author: 'Nadia Perera',
    date: 'March 21, 2026',
    readTime: '5 min read',
    category: 'Mentorship',
    featuredImage: 'Mentor Session Cover',
    content: [
      'The best mentor sessions start before the call. Arrive with context, a clear goal, and a short list of decisions you need help with.',
      'During the session, focus on specifics. General advice feels safe, but real progress comes from discussing concrete obstacles and next actions.',
      'End every session by writing down what changed, what you will do next, and what you want to follow up on later.',
    ],
  },
]

function ArticleDetail() {
  const { id } = useParams()

  const article =
    mockArticles.find((item) => item.id === id) ?? mockArticles[0]

  const relatedArticles = useMemo(
    () => mockArticles.filter((item) => item.id !== article.id),
    [article.id],
  )

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div className="article-layout">
            <div className="section-stack">
              <div className="featured-image">{article.featuredImage}</div>

              <Card>
                <span className="badge">{article.category}</span>
                <h1 className="page-title">{article.title}</h1>
                <div className="toolbar-row">
                  <div className="avatar-chip">
                    <span className="avatar-circle">
                      {article.author
                        .split(' ')
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <div>
                      <strong>{article.author}</strong>
                      <p className="card-muted">
                        {article.date} | {article.readTime}
                      </p>
                    </div>
                  </div>

                  <div className="inline-actions">
                    <Button variant="secondary">Share LinkedIn</Button>
                    <Button variant="secondary">Share X</Button>
                    <Button>Copy Link</Button>
                  </div>
                </div>

                <div className="rich-text">
                  {article.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </Card>

              <Card title="Comments" subtitle="Discussion area placeholder for future community features.">
                <div className="activity-log">
                  <div className="activity-item">
                    <p className="card-muted">Comment placeholder from a founder.</p>
                  </div>
                  <div className="activity-item">
                    <p className="card-muted">Reply placeholder from a mentor.</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="section-stack">
              <Card title="Related Articles" subtitle="Helpful reads from the Knowledge Hub.">
                <div className="activity-log">
                  {relatedArticles.map((item) => (
                    <div key={item.id} className="activity-item">
                      <strong>{item.title}</strong>
                      <p className="card-muted">
                        {item.author} | {item.date}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetail

