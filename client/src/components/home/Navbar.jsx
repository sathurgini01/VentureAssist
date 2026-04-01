import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Modules', href: '#modules' },
  { label: 'Stories', href: '#stories' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', href: '#contact' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

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
          </nav>

          <div className="home-nav-actions">
            <NavLink to="/login" className="home-btn home-btn-ghost" onClick={closeMenu}>
              Login
            </NavLink>
            <NavLink to="/register" className="home-btn home-btn-primary" onClick={closeMenu}>
              Start Free
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
