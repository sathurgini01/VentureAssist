import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext.jsx'
import Table from '../../components/Table'
import {
  createArticle,
  deleteArticle,
  updateArticle,
} from '../../services/articleService'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

function AdminMarketingDevelopmentArticlesPage() {
  const { articles, refreshArticles, addToast } = useAppContext()
  const { token } = useAuth()

  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    stage: 'earlyStartup',
    tags: '',
  })

  const isEditMode = Boolean(editingId)

  const tableRows = useMemo(
    () =>
      articles.map((article) => ({
        ...article,
        stage: article.status === 'Draft' ? 'earlyStartup' : 'growing',
      })),
    [articles],
  )

  const resetForm = () => {
    setEditingId(null)
    setForm({
      title: '',
      content: '',
      category: '',
      stage: 'earlyStartup',
      tags: '',
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!token) {
      addToast('Please login as admin to manage articles.', 'error')
      return
    }

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category.trim(),
      stage: form.stage,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    try {
      setSaving(true)
      if (isEditMode) {
        await updateArticle(editingId, payload, token)
        addToast('Article updated successfully.', 'success')
      } else {
        await createArticle(payload, token)
        addToast('Article created successfully.', 'success')
      }
      await refreshArticles()
      resetForm()
    } catch (error) {
      addToast(error.message || 'Failed to save article.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (article) => {
    setEditingId(article.id)
    setForm({
      title: article.title,
      content: article.content,
      category: article.category,
      stage: article.status === 'Draft' ? 'earlyStartup' : 'growing',
      tags: '',
    })
  }

  const handleDelete = async (articleId) => {
    if (!token) {
      addToast('Please login as admin to manage articles.', 'error')
      return
    }

    try {
      await deleteArticle(articleId, token)
      addToast('Article deleted successfully.', 'success')
      await refreshArticles()
      if (editingId === articleId) {
        resetForm()
      }
    } catch (error) {
      addToast(error.message || 'Failed to delete article.', 'error')
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack">
          <div>
            <p className="page-kicker">Admin Module</p>
            <h1 className="page-title">Marketing & Development</h1>
            <p className="page-subtitle">Manage marketing content module pages.</p>
          </div>

          <div className="filter-tabs">
            <NavLink to="/admin/marketing-development/articles" className="filter-tab active">
              Articles
            </NavLink>
            <NavLink to="/admin/marketing-development/templates" className="filter-tab">
              Templates
            </NavLink>
          </div>

          <Card
            title="Articles"
            subtitle="Create, edit, and delete articles (connected to MongoDB backend)."
          >
            <form className="section-stack" onSubmit={handleSubmit}>
              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Title
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    required
                  />
                </label>
                <label className="form-label">
                  Category
                  <input
                    className="form-control"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                    required
                  />
                </label>
              </div>

              <label className="form-label">
                Content
                <textarea
                  className="form-control"
                  rows={6}
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                  required
                />
              </label>

              <div className="layout-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <label className="form-label">
                  Stage
                  <select
                    className="form-control"
                    value={form.stage}
                    onChange={(event) => setForm((current) => ({ ...current, stage: event.target.value }))}
                  >
                    <option value="earlyStartup">Early Startup</option>
                    <option value="growing">Growing</option>
                    <option value="established">Established</option>
                  </select>
                </label>
                <label className="form-label">
                  Tags (comma separated)
                  <input
                    className="form-control"
                    value={form.tags}
                    onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                    placeholder="marketing, growth"
                  />
                </label>
              </div>

              <div className="inline-actions">
                <Button type="submit" disabled={saving}>
                  {isEditMode ? 'Update Article' : 'Add Article'}
                </Button>
                {isEditMode ? (
                  <Button type="button" variant="secondary" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                ) : null}
              </div>
            </form>

            <Table
              columns={[
                { key: 'title', label: 'Title' },
                { key: 'category', label: 'Category' },
                { key: 'author', label: 'Author' },
                { key: 'date', label: 'Date' },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (_, row) => (
                    <div className="inline-actions">
                      <Button variant="secondary" onClick={() => handleEdit(row)}>
                        Edit
                      </Button>
                      <Button variant="secondary" onClick={() => handleDelete(row.id)}>
                        Delete
                      </Button>
                    </div>
                  ),
                },
              ]}
              rows={tableRows}
              emptyMessage="No articles found in database."
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminMarketingDevelopmentArticlesPage
