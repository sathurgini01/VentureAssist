import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { useAuth } from '../../../context/AuthContext.jsx'
import { ActionButton, ActionLink, BusinessPageHeader, SectionCard } from '../components/BusinessComponents'
import { isValidEmail, isValidPhoneNumber } from '../services/validation'

const initialForm = {
  mentorName: '',
  mentorEmail: '',
  phoneNumber: '',
  expertiseSkills: '',
  shortBio: '',
}

const expertiseOptions = ['Business', 'Finance', 'Marketing', 'Legal Adviser']

function BusinessBecomeMentorPage() {
  const navigate = useNavigate()
  const { addToast, submitMentorApplication } = useAppContext()
  const { user, isAuthenticated } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setForm((current) => ({
      ...current,
      mentorName: user?.name || '',
      mentorEmail: user?.email || '',
    }))
  }, [user])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!isAuthenticated) {
      addToast('Please login first to send a mentor request.', 'warning')
      navigate('/login')
      return
    }

    const payload = {
      mentorName: form.mentorName.trim(),
      mentorEmail: form.mentorEmail.trim(),
      phoneNumber: form.phoneNumber.trim(),
      expertiseSkills: form.expertiseSkills.trim(),
      shortBio: form.shortBio.trim(),
      qualification: form.expertiseSkills.trim(),
      bio: form.shortBio.trim(),
      expertiseAreas: ['businessIdea'],
    }

    if (!isValidEmail(payload.mentorEmail)) {
      addToast('Enter a valid email address.', 'error')
      return
    }

    if (!isValidPhoneNumber(payload.phoneNumber)) {
      addToast('Enter a valid phone number.', 'error')
      return
    }

    try {
      setSubmitting(true)
      await submitMentorApplication(payload)
      addToast('Become mentor request sent to admin approval.', 'success')
      navigate('/business/mentor-requests')
    } catch (error) {
      addToast(error.message || 'Failed to submit mentor request.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Become mentor"
        title="Send your mentor request to admin approval"
        description="Fill in your mentor details and submit the request. Admin can approve or reject it from the mentor approve page."
        variant="mentors"
        actions={
          <>
            <ActionLink to="/business/mentor-requests" variant="bannerSecondary">
              Open request status
            </ActionLink>
            <ActionLink to="/business/mentors" variant="banner">
              Back to mentors
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Become Mentor Form" subtitle="Use the same details as the admin add mentor form.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Mentor Name</span>
            <input
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.mentorName}
              onChange={(event) => setForm((current) => ({ ...current, mentorName: event.target.value }))}
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.mentorEmail}
              onChange={(event) => setForm((current) => ({ ...current, mentorEmail: event.target.value }))}
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Phone Number</span>
            <input
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.phoneNumber}
              onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
              pattern="^\+?[0-9\s\-()]{7,15}$"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Expertise / Skills</span>
            <select
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.expertiseSkills}
              onChange={(event) => setForm((current) => ({ ...current, expertiseSkills: event.target.value }))}
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

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Short Bio / About</span>
            <textarea
              rows={5}
              className="min-h-[140px] w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
              value={form.shortBio}
              onChange={(event) => setForm((current) => ({ ...current, shortBio: event.target.value }))}
              required
            />
          </label>

          <div className="md:col-span-2">
            <ActionButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </ActionButton>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}

export default BusinessBecomeMentorPage
