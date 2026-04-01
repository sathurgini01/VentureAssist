import { NavLink } from 'react-router-dom'
import Button from './Button'
import { useAuth } from '../context/AuthContext.jsx'
import { useAppContext } from '../context/AppContext'
import '../styles/Cards.css'
import '../styles/MarketingDashboard.css'

function Sidebar({ links = [] }) {
  const { user, logout } = useAuth()
  const { sidebarOpen, setSidebarOpen } = useAppContext()

  return (
    <>
      <button
        type="button"
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`.trim()}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close sidebar"
      />
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`.trim()}>
        <div className="sidebar-logo">
          <strong>Venture Assist</strong>
          <span className="sidebar-tag">Founder workspace</span>
        </div>

        <nav className="sidebar-nav">
          {links
            .filter((link) => {
              if (!link.roles || link.roles.length === 0) {
                return true
              }

              return link.roles
                .map((role) => role.toLowerCase())
                .includes((user?.role ?? '').toLowerCase())
            })
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`.trim()
                }
                onClick={() => setSidebarOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        <div className="sidebar-footer">
          <Button
            variant="secondary"
            onClick={() => {
              setSidebarOpen(false)
              logout()
            }}
          >
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

