import { useState } from 'react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'

const adminLinks = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/mentor-applications', label: 'Mentor Apps' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/settings', label: 'Settings' },
]

const tabs = ['General', 'Email', 'Integrations', 'Security', 'Billing']

function Settings() {
  const [activeTab, setActiveTab] = useState('General')

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Platform settings placeholders for operational controls.</p>
          </div>
          <div className="filter-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${activeTab === tab ? 'active' : ''}`.trim()}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <Card title={`${activeTab} Settings`} subtitle="Placeholder fields for future configuration APIs.">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="settings-field-1">Primary field</label>
                <input id="settings-field-1" className="form-control" placeholder={`${activeTab} setting`} />
              </div>
              <div className="form-group">
                <label htmlFor="settings-field-2">Secondary field</label>
                <input id="settings-field-2" className="form-control" placeholder="Placeholder value" />
              </div>
            </div>
            <div className="inline-actions">
              <Button>Save Changes</Button>
              <Button variant="secondary">Reset</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings

