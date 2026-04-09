import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import Navbar from '../../components/MarketingNavbar'
import Sidebar from '../../components/MarketingSidebar'
import { useAppContext } from '../../context/AppContext'
import { createMentor, getMentors, updateMentor } from '../../modules/business/services/businessService'
import { isValidEmail, isValidPhoneNumber } from '../../modules/business/services/validation'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/mentor-approvals', label: 'Mentor Approve' },
]

const expertiseOptions = ['Business', 'Finance', 'Marketing', 'Legal Adviser']

const initialForm = {
  name: '',
  email: '',
  phoneNumber: '',
  expertise: '',
  bio: '',
}

function AdminMentorFormPage() {
  const navigate = useNavigate()
  const { mentorId } = useParams()
  const { addToast } = useAppContext()
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [mentorId])

  async function loadData() {
    try {
      const mentorData = mentorId ? await getMentors() : []

      if (mentorId) {
        const mentor = mentorData.find((item) => item._id === mentorId)
        if (mentor) {
          setForm({
            name: mentor.name || '',
            email: mentor.email || '',
            phoneNumber: mentor.phoneNumber || '',
            expertise: mentor.expertise || '',
            bio: mentor.bio || '',
          })
        }
      }
    } catch (error) {
      addToast(error.message || 'Failed to load mentor form.', 'error')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      expertise: form.expertise.trim(),
      bio: form.bio.trim(),
    }

    if (!isValidEmail(payload.email)) {
      addToast('Enter a valid email address.', 'error')
      return
    }

    if (!isValidPhoneNumber(payload.phoneNumber)) {
      addToast('Enter a valid phone number.', 'error')
      return
    }

    try {
      setSaving(true)
      if (mentorId) {
        await updateMentor(mentorId, payload)
        addToast('Mentor updated successfully.', 'success')
      } else {
        await createMentor(payload)
        addToast('Mentor added successfully.', 'success')
      }
      navigate('/admin/business-idea-management')
    } catch (error) {
      addToast(error.message || 'Failed to save mentor.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard-shell">
      <Sidebar links={adminLinks} />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content section-stack admin-dashboard-surface">
          <Card title={mentorId ? 'Edit Mentor' : 'Add Mentor'} subtitle="Fill the mentor details below.">
            <form className="section-stack" onSubmit={handleSubmit}>
              <label className="form-label">
                Name
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
              </label>

              <label className="form-label">
                Email
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  required
                />
              </label>

              <label className="form-label">
                Phone Number
                <input
                  className="form-control"
                  value={form.phoneNumber}
                  onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                  pattern="^\+?[0-9\s\-()]{7,15}$"
                  required
                />
              </label>

              <label className="form-label">
                Expertise / Skills
                <select
                  className="form-control"
                  value={form.expertise}
                  onChange={(event) => setForm((current) => ({ ...current, expertise: event.target.value }))}
                  required
                >
                  <option value="">Select expertise</option>
                  {expertiseOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                Short Bio / About
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.bio}
                  onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                  required
                />
              </label>
              <div className="inline-actions">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : mentorId ? 'Update Mentor' : 'Add Mentor'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/admin/business-idea-management')}>
                  Back
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminMentorFormPage
