import { useMemo } from 'react'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import TemplateCard from '../../components/MarketingTemplateCard'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function Templates() {
  const { filters, setFilters, templates, searchQuery } = useAppContext()
  const tabs = ['All', 'Social Media', 'Email', 'Content']

  const activeTab = filters.category === 'all' ? 'All' : filters.category
  const filteredTemplates =
    activeTab === 'All'
      ? templates
      : templates.filter((template) => template.category === activeTab)
  const searchedTemplates = useMemo(
    () =>
      filteredTemplates.filter((template) =>
        `${template.name} ${template.category} ${template.format}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [filteredTemplates, searchQuery],
  )

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Templates</h1>
            <p className="page-subtitle">Browse mock content templates by category.</p>
          </div>

          <div className="filter-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${activeTab === tab ? 'active' : ''}`.trim()}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    category: tab === 'All' ? 'all' : tab,
                  }))
                }
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="template-grid">
            {searchedTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Templates

