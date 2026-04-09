import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionButton, ActionLink, BusinessPageHeader, DetailItem, SectionCard } from '../components/BusinessComponents'
import { getMentorById } from '../services/businessService'

function BusinessMentorDetailPage() {
  const navigate = useNavigate()
  const { mentorId } = useParams()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMentor() {
      try {
        setLoading(true)
        setError('')
        const data = await getMentorById(mentorId)

        if (isMounted) {
          setMentor(data)
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

    loadMentor()

    return () => {
      isMounted = false
    }
  }, [mentorId])

  if (loading) {
    return <LoadingState title="Loading mentor" description="Preparing the full mentor profile details." />
  }

  if (error || !mentor) {
    return <ErrorState title="Mentor not available" message={error || 'The selected mentor could not be loaded.'} />
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Mentor detail"
        title={mentor.name}
        description={mentor.bio}
        variant="mentors"
        actions={
          <>
            <ActionLink to="/business/mentors" variant="bannerSecondary">
              Back to mentors
            </ActionLink>
            <ActionButton onClick={() => navigate(`/business/mentors?mentorId=${mentor._id}`)} variant="banner">
              Request mentor
            </ActionButton>
          </>
        }
      />

      <SectionCard title="Mentor Overview" subtitle="Review the full mentor profile before sending a request.">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailItem label="Mentor Name" value={mentor.name} />
          <DetailItem label="Email" value={mentor.email} />
          <DetailItem label="Phone Number" value={mentor.phoneNumber} />
          <DetailItem label="Expertise / Skills" value={mentor.expertise} />
          <DetailItem
            label="Assigned Business Ideas"
            value={mentor.assignedBusinessIdeaTitles?.length ? mentor.assignedBusinessIdeaTitles.join(', ') : 'General support'}
          />
          <DetailItem label="Short Bio / About" value={mentor.bio} />
        </div>
      </SectionCard>
    </div>
  )
}

export default BusinessMentorDetailPage
