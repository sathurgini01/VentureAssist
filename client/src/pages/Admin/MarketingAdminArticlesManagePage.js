import Button from '../../components/Button'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import Table from '../../components/Table'
import { useAppContext } from '../../context/AppContext'

const adminLinks = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/mentor-applications', label: 'Mentor Apps' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/settings', label: 'Settings' },
]

function ArticlesManage() {
  const { articles, updateArticleStatus } = useAppContext()
  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Articles Manage</h1>
            <p className="page-subtitle">Editorial management placeholders with publish state controls.</p>
          </div>
          <Table
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'author', label: 'Author' },
              { key: 'category', label: 'Category' },
              { key: 'status', label: 'Status' },
              { key: 'date', label: 'Date' },
              { key: 'views', label: 'Views' },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <Button
                    variant={row.status === 'Published' ? 'secondary' : 'primary'}
                    onClick={() =>
                      updateArticleStatus(
                        row.id,
                        row.status === 'Published' ? 'Draft' : 'Published',
                      )
                    }
                  >
                    {row.status === 'Published' ? 'Unpublish' : 'Publish'}
                  </Button>
                ),
              },
            ]}
            rows={articles}
          />
        </div>
      </div>
    </div>
  )
}

export default ArticlesManage

