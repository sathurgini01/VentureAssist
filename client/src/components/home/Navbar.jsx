import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAppContext } from '../../context/AppContext'

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Modules', href: '#modules' },
  { label: 'Stories', href: '#stories' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', href: '#contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { notifications, dismissNotification } = useAppContext()
  const [showNotifications, setShowNotifications] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const renderNotificationContent = (notification) => {
    const details = notification?.details || {}
    const hasDetailedSessionInfo = notification?.category === 'mentor_session_approved'

    return (
      <div className="notification-copy">
        <p>{notification.message}</p>
        {hasDetailedSessionInfo ? (
          <div className="notification-details">
            {details.dateTime ? (
              <p>
                <strong>Date & Time:</strong> {details.dateTime}
              </p>
            ) : null}
            {details.description ? (
              <p>
                <strong>Description:</strong> {details.description}
              </p>
            ) : null}
            {details.meetingUrl ? (
              <p>
                <strong>Meeting URL:</strong>{' '}
                <a className="notification-detail-url" href={details.meetingUrl} target="_blank" rel="noreferrer">
                  Open Link
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <header className="home-navbar">
      <div className="home-container home-navbar-inner">
        <a className="home-brand" href="#top" onClick={closeMenu}>
          <span className="home-brand-mark">VA</span>
          <span className="home-brand-copy">
            <strong>Venture Assist</strong>
            <small>Business Platform</small>
          </span>
        </a>

        <button
          type="button"
          className={`home-nav-toggle${isOpen ? ' is-open' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`home-nav-panel${isOpen ? ' is-open' : ''}`}>
          <nav className="home-nav-links" aria-label="Primary">
            {navItems.map((item) => (
              item.to ? (
                <NavLink key={item.label} to={item.to} onClick={closeMenu}>
                  {item.label}
                </NavLink>
              ) : (
                <a key={item.label} href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              )
            ))}
            {String(user?.role || '').toLowerCase() === 'mentor' ? (
              <NavLink to="/mentor-hub/businessIdea" onClick={closeMenu}>
                Mentor Hub
              </NavLink>
            ) : null}
          </nav>

          <div className="home-nav-actions">
            {user ? (
              <>
                <div className="notification-shell">
                  <button type="button" className="notification-button" onClick={() => setShowNotifications((current) => !current)}>
                    <span className="notification-icon" aria-hidden="true">🔔</span>
                    {notifications.length > 0 ? <span className="notification-badge">{notifications.length}</span> : null}
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
                            {renderNotificationContent(notification)}
                            <button type="button" className="notification-link" onClick={() => dismissNotification(notification.id)}>
                              Dismiss
                            </button>
                          </div>
                        )) : <div className="notification-item"><p>No new notifications</p></div>}
                      </div>
                    </div>
                  ) : null}
                </div>
                <NavLink to="/profile" className="home-btn home-btn-ghost" onClick={closeMenu}>
                  <span className="avatar-circle">
                    {(user.name ?? 'VA')
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join('')}
                  </span>
                  {user.name ?? 'User'}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login" className="home-btn home-btn-ghost" onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/register" className="home-btn home-btn-primary" onClick={closeMenu}>
                  Start Free
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
