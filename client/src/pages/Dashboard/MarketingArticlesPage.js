import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import '../../styles/MarketingDashboard.css'
import '../../styles/Cards.css'
import '../../styles/Buttons.css'
import '../../styles/Forms.css'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/mentor-requests', label: 'Mentor Requests', roles: ['mentor', 'admin'] },
  { to: '/dashboard/articles', label: 'Articles' },
]

const mockArticles = [
  {
    id: 'article-1',
    title: 'How to Build a Founder-Friendly Campaign Funnel',
    excerpt:
      'A practical guide to structuring awareness, nurture, and conversion content for startup campaigns.',
    author: 'Ayesha Fernando',
    date: 'March 27, 2026',
    category: 'Marketing',
    thumbnail: 'Campaign Funnel',
  },
  {
    id: 'article-2',
    title: 'Mentor Sessions That Actually Create Momentum',
    excerpt:
      'Learn how to prepare for mentorship calls so each session turns into clear next steps.',
    author: 'Nadia Perera',
    date: 'March 21, 2026',
    category: 'Mentorship',
    thumbnail: 'Mentor Playbook',
  },
  {
    id: 'article-3',
    title: 'Campaign Metrics Founders Should Track Weekly',
    excerpt:
      'Focus on the metrics that show whether your campaign is generating interest, trust, and action.',
    author: 'Liam Santos',
    date: 'March 18, 2026',
    category: 'Campaigns',
    thumbnail: 'Weekly Metrics',
  },
  {
    id: 'article-4',
    title: 'Writing Content That Sounds Human, Not Corporate',
    excerpt:
      'Use a simple messaging framework to make startup content clearer, warmer, and easier to act on.',
    author: 'Amina Rahman',
    date: 'March 14, 2026',
    category: 'Marketing',
    thumbnail: 'Content Voice',
  },
]

function Articles() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Marketing', 'Campaigns', 'Mentorship']

  const filteredArticles = useMemo(() => {
    return mockArticles.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' || article.category === activeCategory
      const matchesSearch =
        `${article.title} ${article.excerpt} ${article.author} ${article.category}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchTerm])

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div>
            <p className="page-kicker">Knowledge Hub</p>
            <h1 className="page-title">Knowledge Hub</h1>
            <p className="page-subtitle">
              Explore articles, playbooks, and practical guidance for campaigns,
              content, and mentorship.
            </p>
          </div>

          <Card title="Browse Articles" subtitle="Mock content ready for API integration later.">
            <div className="toolbar-row">
              <input
                className="search-input"
                type="text"
                placeholder="Search articles, topics, or authors"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <div className="filter-tabs">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`filter-tab ${activeCategory === category ? 'active' : ''}`.trim()}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="article-grid">
            {filteredArticles.map((article) => (
              <Card key={article.id}>
                <div className="article-thumb">{article.thumbnail}</div>

                <div className="inline-actions">
                  <span className="badge">{article.category}</span>
                </div>

                <h3 className="card-title">{article.title}</h3>
                <p className="card-muted">{article.excerpt}</p>
                <p className="card-muted">
                  {article.author} | {article.date}
                </p>

                <NavLink to={`/dashboard/articles/${article.id}`}>
                  <Button>Read</Button>
                </NavLink>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Articles

