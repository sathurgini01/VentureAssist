import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'

const dashboardLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/templates', label: 'Templates' },
  { to: '/dashboard/campaigns', label: 'Campaigns' },
  { to: '/dashboard/analytics', label: 'Analytics' },
  { to: '/dashboard/mentors', label: 'Mentors' },
  { to: '/dashboard/articles', label: 'Articles' },
]

function BecomeMentor() {
  const { submitMentorApplication, addToast } = useAppContext()
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const [formData, setFormData] = useState({
    background: '',
    expertise: [],
    experience: '',
    pricing: '',
    bio: '',
  })

  const toggleExpertise = (item) => {
    setFormData((current) => ({
      ...current,
      expertise: current.expertise.includes(item)
        ? current.expertise.filter((value) => value !== item)
        : [...current.expertise, item],
    }))
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={dashboardLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div>
            <h1 className="page-title">Become a Mentor</h1>
            <p className="page-subtitle">Mentor application skeleton with scheduling and pricing placeholders.</p>
          </div>

          <Card title="Mentor Profile Setup" subtitle="This form is ready for future application APIs.">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="mentor-background">Professional background</label>
                <input
                  id="mentor-background"
                  className="form-control"
                  placeholder="Startup founder, operator, investor"
                  value={formData.background}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, background: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Expertise</label>
                <div className="checkbox-row">
                  {['Fundraising', 'Growth', 'Product', 'Branding'].map((item) => (
                    <label key={item} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.expertise.includes(item)}
                        onChange={() => toggleExpertise(item)}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="mentor-experience">Experience</label>
                <textarea
                  id="mentor-experience"
                  className="form-control"
                  rows="5"
                  placeholder="Describe your work, wins, and mentoring history"
                  value={formData.experience}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, experience: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Availability scheduler</label>
                <div className="schedule-grid">
                  {days.map((day) => (
                    <div key={day} className="schedule-cell">{day}<br />Open</div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="mentor-pricing">Pricing</label>
                <input
                  id="mentor-pricing"
                  className="form-control"
                  placeholder="$80 / hour"
                  value={formData.pricing}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, pricing: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="mentor-bio">Bio</label>
                <textarea
                  id="mentor-bio"
                  className="form-control"
                  rows="5"
                  placeholder="Short mentor bio"
                  value={formData.bio}
                  onChange={(event) =>
                    setFormData((current) => ({ ...current, bio: event.target.value }))
                  }
                />
              </div>
            </div>
            <Button
              onClick={() => {
                if (!formData.background || formData.expertise.length === 0 || !formData.experience) {
                  addToast('Complete the required mentor application fields.', 'warning')
                  return
                }

                submitMentorApplication(formData)
              }}
            >
              Submit Application
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BecomeMentor

