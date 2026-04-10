import { useEffect, useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { getArticleById } from '../../services/articleService'
import '../../styles/MarketingDashboard.css'
import '../../styles/Cards.css'
import '../../styles/Buttons.css'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function ArticleDetail() {
  const { articles } = useAppContext()
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const selectedFromContext = articles.find((item) => item.id === id)
    if (selectedFromContext) {
      setArticle(selectedFromContext)
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    const loadArticle = async () => {
      setLoading(true)
      const result = await getArticleById(id)
      if (mounted) {
        setArticle(result)
        setLoading(false)
      }
    }

    loadArticle()

    return () => {
      mounted = false
    }
  }, [id, articles])

  const relatedArticles = useMemo(() => {
    if (!article) return []
    return articles.filter((item) => item.id !== article.id).slice(0, 4)
  }, [articles, article])

  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar links={dashboardLinks} />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-content">
            <Card title="Loading article" subtitle="Fetching article details from database." />
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="dashboard-shell">
        <Sidebar links={dashboardLinks} />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-content">
            <Card title="Article not found" subtitle="This article may have been removed.">
              <NavLink to="/dashboard/articles">
                <Button>Back to Articles</Button>
              </NavLink>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const contentParagraphs = article.content
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <div className="article-layout">
            <div className="section-stack">
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
                  {contentParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
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
                      <NavLink to={`/dashboard/articles/${item.id}`}>
                        <Button variant="secondary">Read</Button>
                      </NavLink>
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



