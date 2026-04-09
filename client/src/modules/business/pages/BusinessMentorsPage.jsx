import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../../../context/AppContext'
import { useAuth } from '../../../context/AuthContext.jsx'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionButton, ActionLink, BusinessPageHeader, MentorProfileCard, SectionCard } from '../components/BusinessComponents'
import { createMentorRequest, getIdeas, getMentors } from '../services/businessService'
import { isFutureDateTime } from '../services/validation'

function BusinessMentorsPage() {
  const navigate = useNavigate()
  const { addToast } = useAppContext()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const preselectedIdeaId = searchParams.get('ideaId') || ''
  const preselectedMentorId = searchParams.get('mentorId') || ''
  const [mentors, setMentors] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [expertiseFilter, setExpertiseFilter] = useState('All')
  const [requestForm, setRequestForm] = useState({
    mentorId: preselectedMentorId,
    ideaId: preselectedIdeaId,
    preferredTime: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    let isMounted = true

    async function loadMentorData() {
      try {
        setLoading(true)
        setError('')
        const [mentorData, ideaData] = await Promise.all([getMentors(), getIdeas().catch(() => [])])

        if (isMounted) {
          setMentors(mentorData)
          setIdeas(ideaData)
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMentorData()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredMentors = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    return mentors.filter((mentor) => {
      const matchesQuery =
        !normalizedQuery ||
        mentor.name.toLowerCase().includes(normalizedQuery) ||
        mentor.bio.toLowerCase().includes(normalizedQuery) ||
        mentor.expertise.toLowerCase().includes(normalizedQuery) ||
        (mentor.assignedBusinessIdeaTitles || []).some((title) => title.toLowerCase().includes(normalizedQuery))

      const matchesExpertise = expertiseFilter === 'All' || mentor.expertise === expertiseFilter

      return matchesQuery && matchesExpertise
    })
  }, [deferredQuery, expertiseFilter, mentors])

  function selectMentor(mentorId) {
    setRequestForm((current) => ({ ...current, mentorId }))
  }

  function updateRequestField(name, value) {
    setRequestForm((current) => ({ ...current, [name]: value }))
  }

  async function handleRequestSubmit(event) {
    event.preventDefault()

    if (!requestForm.mentorId || !requestForm.message.trim() || !requestForm.preferredTime.trim()) {
      addToast('Choose a mentor, message, and preferred time before submitting.', 'error')
      return
    }

    if (!isFutureDateTime(requestForm.preferredTime)) {
      addToast('Choose a valid future date and time.', 'error')
      return
    }

    try {
      setSending(true)
      await createMentorRequest({
        ...requestForm,
        ideaId: requestForm.ideaId || undefined,
        userName: user?.name || '',
        userEmail: user?.email || '',
      })
      addToast('Mentor request sent successfully.', 'success')
      setRequestForm((current) => ({
        ...current,
        mentorId: '',
        preferredTime: '',
        message: '',
      }))
    } catch (requestError) {
      addToast(requestError.message, 'error')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <LoadingState title="Loading mentor directory" description="Gathering mentors and idea options for your request workflow." />
  }

  if (error) {
    return <ErrorState title="Mentor directory unavailable" message={error} actionLabel="Retry" onAction={() => window.location.reload()} />
  }

  const expertiseOptions = ['All', ...new Set(mentors.map((mentor) => mentor.expertise))]

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Mentor directory"
        title="Find mentors who can pressure-test your next move"
        description="Filter the directory, review expertise areas, and send a request tied to a specific idea or a general support need."
        variant="mentors"
        actions={
          <>
            <ActionLink to="/business/become-mentor" variant="bannerSecondary">
              Become mentor
            </ActionLink>
            <ActionLink to="/business/mentor-requests" variant="bannerSecondary">
              Open requests
            </ActionLink>
            <ActionLink to="/business" variant="banner">
              Back to dashboard
            </ActionLink>
          </>
        }
      />

      <SectionCard title="Find the right mentor" subtitle="Search by name, specialty, or bio summary.">
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mentors"
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Expertise</span>
            <select
              value={expertiseFilter}
              onChange={(event) => setExpertiseFilter(event.target.value)}
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              {expertiseOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
      </SectionCard>

      {filteredMentors.length ? (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <MentorProfileCard
              key={mentor._id}
              mentor={mentor}
              isSelected={requestForm.mentorId === mentor._id}
              onSelect={selectMentor}
              onExplore={() => navigate(`/business/mentors/${mentor._id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No mentors match the current filters"
          message="Try a different expertise filter or a broader search."
          actionLabel="Reset filters"
          onAction={() => {
            setQuery('')
            setExpertiseFilter('All')
          }}
        />
      )}

      <SectionCard title="Request mentor" subtitle="Send a request with an optional idea reference and your preferred time.">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleRequestSubmit}>
          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Selected mentor</span>
            <select
              value={requestForm.mentorId}
              onChange={(event) => updateRequestField('mentorId', event.target.value)}
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="">Choose a mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.name} - {mentor.expertise}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Idea reference</span>
            <select
              value={requestForm.ideaId}
              onChange={(event) => updateRequestField('ideaId', event.target.value)}
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            >
              <option value="">General support request</option>
              {ideas.map((idea) => (
                <option key={idea._id} value={idea._id}>
                  {idea.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">Preferred time</span>
            <input
              type="datetime-local"
              value={requestForm.preferredTime}
              onChange={(event) => updateRequestField('preferredTime', event.target.value)}
              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              className="w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Message</span>
            <textarea
              rows={5}
              value={requestForm.message}
              onChange={(event) => updateRequestField('message', event.target.value)}
              placeholder="Share what you want help with, the decision you are making, and what kind of feedback would be most useful."
              className="min-h-[140px] w-full rounded-[20px] border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <div className="md:col-span-2">
            <ActionButton type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Request mentor'}
            </ActionButton>
          </div>
        </form>
      </SectionCard>
    </div>
  )
}

export default BusinessMentorsPage
