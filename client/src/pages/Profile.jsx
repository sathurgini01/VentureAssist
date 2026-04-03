import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

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
    <div className="auth-shell">
      <div className="auth-card section-stack">
        {/* Back to Home Button */}
        <div className="profile-header">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="back-home-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </Button>
        </div>

        <div className="profile-welcome">
          <div className="welcome-gradient">
            <p className="page-kicker">Your Account</p>
            <h1 className="page-title">Profile</h1>
            <p className="page-subtitle">
              Manage your profile details, preferences, and account security.
            </p>
          </div>
        </div>

        <Card className="profile-card-main">
          <div className="profile-hero-premium">
            <div className="profile-avatar-premium">
              <div className="avatar-gradient">
                {(profile.name || 'VA')
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </div>
              <div className="avatar-glow"></div>
            </div>

            <div className="profile-info-premium">
              <h2 className="profile-name-premium">{profile.name || 'User Profile'}</h2>
              <p className="profile-desc-premium">
                Manage your profile details and account settings.
              </p>
              <div className="profile-badges">
                <span className="badge-premium">{profile.role || 'user'}</span>
                <span className="badge-status">Active</span>
              </div>
            </div>

            <div className="profile-actions-premium">
              <Button variant="primary" className="edit-profile-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </Button>
              <Button onClick={handleLogout} variant="outline" className="logout-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Profile Information" subtitle="Update your profile details." className="profile-card-info">
          <div className="form-grid-premium">
            <div className="form-group-premium">
              <label htmlFor="profile-name" className="form-label-premium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Full name
              </label>
              <input
                id="profile-name"
                name="name"
                className="form-control-premium"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group-premium">
              <label htmlFor="profile-email" className="form-label-premium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </label>
              <input
                id="profile-email"
                name="email"
                className="form-control-premium"
                value={profile.email}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="form-group-premium">
              <label htmlFor="profile-role" className="form-label-premium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Role
              </label>
              <input
                id="profile-role"
                name="role"
                className="form-control-premium"
                value={profile.role}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>

          <div className="inline-actions-premium">
            <Button onClick={handleSaveChanges} className="save-btn-premium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Save Changes
            </Button>
            <Button variant="ghost" className="cancel-btn-premium">Cancel</Button>
          </div>
        </Card>

        <Card title="Account Settings" subtitle="Change your password." className="profile-card-security">
          <div className="security-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="form-grid-premium">
            <div className="form-group-premium">
              <label htmlFor="current-password" className="form-label-premium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Current password
              </label>
              <input
                id="current-password"
                type="password"
                className="form-control-premium"
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group-premium">
              <label htmlFor="new-password" className="form-label-premium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                New password
              </label>
              <input
                id="new-password"
                type="password"
                className="form-control-premium"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="inline-actions-premium">
            <Button className="update-btn-premium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Update Password
            </Button>
            <Button variant="ghost" className="reset-btn-premium">Reset</Button>
          </div>
        </Card>

        <Card title="Danger Zone" subtitle="Destructive actions should require extra confirmation." className="profile-card-danger">
          <div className="danger-content">
            <div className="danger-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="danger-text">
              <h4>Delete Account</h4>
              <p className="card-muted">
                Deleting an account is irreversible. This action cannot be undone and will permanently remove all your data.
              </p>
            </div>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)} className="delete-btn-premium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Delete Account
            </Button>
          </div>
        </Card>
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