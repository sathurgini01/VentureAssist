import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Navbar from '../components/MarketingNavbar'
import Sidebar from '../components/MarketingSidebar'
import { useAuth } from '../context/AuthContext'
import '../styles/MarketingDashboard.css'
import '../styles/Cards.css'
import '../styles/Buttons.css'
import '../styles/Forms.css'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Knowledge Hub' },
]

function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
  }

  const handleSaveChanges = () => {
    // For now, only updates local state
    // TODO: Add PUT /api/auth/profile endpoint to backend
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-content">
          <Card>
            <div className="profile-hero">
              <div className="profile-avatar">
                {(profile.name || 'VA')
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </div>

              <div>
                <h1 className="page-title">{profile.name || 'User Profile'}</h1>
                <p className="page-subtitle">
                  Manage your profile details, preferences, and account security.
                </p>
                <span className="badge">{profile.role || 'user'}</span>
              </div>

              <div style={{ display: 'grid', gap: '0.5rem', justifyContent: 'end' }}>
                <Button variant="secondary">Edit Profile</Button>
                <Button onClick={handleLogout} variant="secondary">
                  Logout
                </Button>
              </div>
            </div>
          </Card>

          <Card title="Profile Information" subtitle="Update your profile details.">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="profile-name">Full name</label>
                <input
                  id="profile-name"
                  name="name"
                  className="form-control"
                  value={profile.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  name="email"
                  className="form-control"
                  value={profile.email}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-role">Role</label>
                <input
                  id="profile-role"
                  name="role"
                  className="form-control"
                  value={profile.role}
                  onChange={handleChange}
                  readOnly
                />
              </div>
            </div>

            <div className="inline-actions">
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </Card>

          <Card title="Account Settings" subtitle="Change your password.">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="current-password">Current password</label>
                <input
                  id="current-password"
                  type="password"
                  className="form-control"
                  placeholder="Current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password">New password</label>
                <input
                  id="new-password"
                  type="password"
                  className="form-control"
                  placeholder="New password"
                />
              </div>
            </div>

            <div className="inline-actions">
              <Button>Update Password</Button>
              <Button variant="secondary">Reset</Button>
            </div>
          </Card>

          <Card title="Danger Zone" subtitle="Destructive actions should require extra confirmation.">
            <div className="danger-zone card">
              <p className="card-muted">
                Deleting an account is irreversible. This action cannot be undone.
              </p>
              <Button variant="secondary" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showDeleteModal} title="Confirm Account Deletion">
        <p className="card-muted">
          Are you sure you want to delete your account? This action is permanent and cannot be undone.
        </p>
        <div className="inline-actions">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowDeleteModal(false)}>Confirm Delete</Button>
        </div>
      </Modal>
    </div>
  )
}

export default Profile

