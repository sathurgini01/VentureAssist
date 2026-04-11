import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
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
  { to: '/dashboard/articles', label: 'Articles' },
]

function Articles() {
  const { articles } = useAppContext()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = useMemo(
    () => ['All', ...new Set(articles.map((article) => article.category).filter(Boolean))],
    [articles],
  )

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === 'All' || article.category === activeCategory
      const matchesSearch =
        `${article.title} ${article.excerpt} ${article.author} ${article.category}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [articles, activeCategory, searchTerm])

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content articles-page">
          <div>
            <p className="page-kicker">Knowledge Hub</p>
            <h1 className="page-title">Knowledge Hub</h1>
            <p className="page-subtitle">
              Explore articles, playbooks, and practical guidance for campaigns,
              content, and mentorship.
            </p>
          </div>

          <Card title="Browse Articles" subtitle="Articles from MongoDB via marketing API.">
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
            {filteredArticles.length === 0 ? (
              <Card title="No articles found" subtitle="Try another search or category." />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Articles



