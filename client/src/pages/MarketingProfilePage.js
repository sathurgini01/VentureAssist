import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Navbar from '../components/MarketingNavbar'
import Sidebar from '../components/MarketingSidebar'
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
  { to: '/profile', label: 'Profile' },
]

const mockUser = {
  name: 'Ayesha Fernando',
  email: 'ayesha@ventureassist.app',
  role: 'Founder',
  phone: '+94 77 123 4567',
  jobTitle: 'Founder & Operator',
  company: 'Venture Assist Labs',
  bio: 'Building practical tools that help founders move faster with better support.',
  linkedin: 'linkedin.com/in/ayeshafernando',
  website: 'ventureassist.app',
  notifications: 'weekly',
  twoFactor: 'enabled',
}

function Profile() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [profile, setProfile] = useState(mockUser)

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
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
                {profile.name
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')}
              </div>

              <div>
                <h1 className="page-title">{profile.name}</h1>
                <p className="page-subtitle">
                  Manage your profile details, preferences, and account security.
                </p>
                <span className="badge">{profile.role}</span>
              </div>

              <Button variant="secondary">Edit Profile</Button>
            </div>
          </Card>

          <Card title="Profile Information" subtitle="Mock profile form ready for backend integration.">
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
                <label htmlFor="profile-phone">Phone</label>
                <input
                  id="profile-phone"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-job-title">Job title</label>
                <input
                  id="profile-job-title"
                  name="jobTitle"
                  className="form-control"
                  value={profile.jobTitle}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-company">Company</label>
                <input
                  id="profile-company"
                  name="company"
                  className="form-control"
                  value={profile.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-bio">Bio</label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  className="form-control"
                  rows="5"
                  value={profile.bio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-linkedin">LinkedIn</label>
                <input
                  id="profile-linkedin"
                  name="linkedin"
                  className="form-control"
                  value={profile.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-website">Website</label>
                <input
                  id="profile-website"
                  name="website"
                  className="form-control"
                  value={profile.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="inline-actions">
              <Button>Save Changes</Button>
              <Button variant="secondary">Cancel</Button>
            </div>
          </Card>

          <Card title="Account Settings" subtitle="Security and communication preferences placeholders.">
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

              <div className="form-group">
                <label htmlFor="email-preference">Email preference</label>
                <select
                  id="email-preference"
                  name="notifications"
                  className="form-control"
                  value={profile.notifications}
                  onChange={handleChange}
                >
                  <option value="instant">Instant</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="two-factor">Two-factor authentication</label>
                <select
                  id="two-factor"
                  name="twoFactor"
                  className="form-control"
                  value={profile.twoFactor}
                  onChange={handleChange}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="inline-actions">
              <Button>Update Settings</Button>
              <Button variant="secondary">Reset</Button>
            </div>
          </Card>

          <Card title="Danger Zone" subtitle="Destructive actions should require an extra confirmation step.">
            <div className="danger-zone card">
              <p className="card-muted">
                Deleting an account is irreversible. This is a placeholder for a future protected API flow.
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
          This is a placeholder confirmation modal for deleting the user account.
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

