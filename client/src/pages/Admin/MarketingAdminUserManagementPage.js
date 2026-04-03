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

function UserManagement() {
  const { users, filters, setFilters, searchQuery } = useAppContext()
  const filteredUsers = users.filter((user) =>
    (filters.role === 'all' ? true : user.role.toLowerCase() === filters.role) &&
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Mock admin table for user review and moderation actions.</p>
          </div>
          <div className="toolbar-row">
            <input className="search-input" value={searchQuery} readOnly />
            <select
              className="form-control"
              value={filters.role}
              onChange={(event) =>
                setFilters((current) => ({ ...current, role: event.target.value }))
              }
            >
              <option value="all">All roles</option>
              <option value="founder">Founder</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role' },
              { key: 'status', label: 'Status' },
              { key: 'joined', label: 'Joined' },
              {
                key: 'actions',
                label: 'Actions',
                render: () => (
                  <div className="inline-actions">
                    <Button variant="secondary">Edit</Button>
                    <Button variant="ghost">Suspend</Button>
                  </div>
                ),
              },
            ]}
            rows={filteredUsers}
          />
        </div>
      </div>
    </div>
  )
}

export default UserManagement

