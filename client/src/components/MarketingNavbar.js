import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useAppContext } from '../context/AppContext'
import '../styles/Cards.css'
import '../styles/MarketingDashboard.css'

function Navbar() {
  const location = useLocation()
  const { user } = useAuth()
  const { notifications, dismissNotification, searchQuery, setSearchQuery, setSidebarOpen } = useAppContext()
  const [showNotifications, setShowNotifications] = useState(false)

  const breadcrumb = useMemo(() => {
    const path = location.pathname.split('/').filter(Boolean)

    if (path.length === 0) {
      return 'Home'
    }

    return path
      .map((segment) => segment.replace(/-/g, ' '))
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' / ')
  }, [location.pathname])

  const placeholder = useMemo(() => {
    if (location.pathname.includes('/campaigns')) {
      return 'Search campaigns'
    }

    if (location.pathname.includes('/mentors')) {
      return 'Search mentors'
    }

    if (location.pathname.includes('/articles')) {
      return 'Search articles'
    }

    return 'Search campaigns, mentors, or templates'
  }, [location.pathname])

  return (
    <header className="card top-navbar">
      <button
        type="button"
        className="filter-tab sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        Menu
      </button>
      <div className="breadcrumb-block">
        <span className="nav-label">Workspace</span>
        <strong>{breadcrumb}</strong>
      </div>
      <div className="search-shell">
        <input
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>
      <div className="nav-actions">
        <NavLink
          to="/"
          className="nav-icon-button nav-home-button"
          aria-label="Go to home page"
        >
          <span className="notification-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="notification-icon-svg">
              <path
                d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1v-9.5Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="nav-icon-label">Home</span>
        </NavLink>
        <div className="notification-shell">
          <button
            type="button"
            className="notification-button"
            aria-label="Notifications"
            onClick={() => setShowNotifications((current) => !current)}
          >
            <span className="notification-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="notification-icon-svg">
                <path
                  d="M12 3a4 4 0 0 0-4 4v1.1a7 7 0 0 1-1.55 4.4L5 14.3V16h14v-1.7l-1.45-1.8A7 7 0 0 1 16 8.1V7a4 4 0 0 0-4-4Zm0 18a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 21Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="notification-badge">{notifications.length}</span>
          </button>
          {showNotifications ? (
            <div className="notification-panel card">
              <div className="notification-panel-header">
                <strong>Notifications</strong>
                <span className="card-muted">{notifications.length} items</span>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p>{notification.message}</p>
                    <button
                      type="button"
                      className="notification-link"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      Dismiss
                    </button>
                  </div>
                )) : (
                  <div className="notification-item">
                    <p>No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
        <NavLink
          to="/profile"
          className="nav-icon-button profile-icon-button"
          aria-label="Open profile"
        >
          <span className="avatar-circle">
            {(user?.name ?? 'VA')
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')}
          </span>
          <span className="profile-info">
            <span className="profile-name">{user?.name ?? 'User'}</span>
            <span className="nav-icon-label">Profile</span>
          </span>
        </NavLink>
      </div>
    </header>
  )
}

export default Navbar

