import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/AsyncState'
import {
  ActionLink,
  BusinessPageHeader,
  MentorIcon,
  PreviewCard,
  ProgressBar,
  SectionCard,
  SummaryCard,
  ToolkitIcon,
} from '../components/BusinessComponents'
import { getBusinessHome } from '../services/businessService'

function BusinessHomePage() {
  const navigate = useNavigate()
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadHome() {
      try {
        setLoading(true)
        setError('')
        const data = await getBusinessHome()

        if (isMounted) {
          setHomeData(data)
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

    loadHome()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <LoadingState
        title="Loading business dashboard"
        description="Pulling together your latest ideas, mentors, and toolkit highlights."
      />
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard unavailable"
        message={error}
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    )
  }

  const trackerSnapshot = homeData?.trackerSnapshot

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Business module"
        title="Validate stronger ideas with less guesswork"
        description="Move from early concept to practical next steps with idea capture, AI SWOT generation, mentor access, and progress tracking in one focused workspace."
        variant="overview"
        actions={
          <>
            <ActionLink to="/business/ideas/new" variant="banner">Submit idea</ActionLink>
            <ActionLink to="/business/ideas" variant="bannerSecondary">
              View ideas
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Ideas submitted"
          value={homeData?.ideasCreated ?? 0}
          caption="Open your pipeline and keep refining the strongest concepts."
          to="/business/ideas"
          tone="teal"
        />
        <SummaryCard
          title="SWOT analyses"
          value={homeData?.swotGenerated ?? 0}
          caption="See which ideas already have structured risk and opportunity insights."
          to="/business/ideas"
          tone="blue"
        />
        <SummaryCard
          title="Toolkit library"
          value={homeData?.toolkitCount ?? 0}
          caption="Jump into planning tools that help you pressure-test your approach."
          to="/business/toolkits"
          tone="amber"
        />
        <SummaryCard
          title="Mentor directory"
          value={homeData?.mentorCount ?? 0}
          caption="Browse experts who can challenge assumptions and sharpen execution."
          to="/business/mentors"
          tone="rose"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Toolkit preview"
          subtitle="Three resources you can open right away."
          actions={
            <ActionLink to="/business/toolkits" variant="secondary">
              See all toolkits
            </ActionLink>
          }
        >
          {homeData?.topToolkits?.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {homeData.topToolkits.map((toolkit) => (
                <PreviewCard
                  key={toolkit._id}
                  title={toolkit.name || toolkit.title}
                  subtitle={toolkit.relatedBusinessIdeaTitle || toolkit.category}
                  description={toolkit.description}
                  meta="Toolkit"
                  to={`/business/toolkits/${toolkit._id}`}
                  icon={<ToolkitIcon />}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No toolkits yet"
              message="Toolkit previews will appear here as soon as the backend has entries."
              actionLabel="Browse library"
              onAction={() => navigate('/business/toolkits')}
            />
          )}
        </SectionCard>

        <SectionCard
          title="Tracker snapshot"
          subtitle="The latest progress from your most recently updated idea."
        >
          {trackerSnapshot ? (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Last active idea
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-950">
                {trackerSnapshot.ideaTitle}
              </h3>
              <p className="mt-3 text-sm text-slate-600">
                Progress is currently at{' '}
                <span className="font-semibold text-slate-900">
                  {trackerSnapshot.progressPercent}%
                </span>
                .
              </p>
              <div className="mt-5">
                <ProgressBar value={trackerSnapshot.progressPercent} centered />
              </div>
              <ul className="mt-4 space-y-3">
                {trackerSnapshot.nextTasks?.map((task) => (
                  <li
                    key={task}
                    className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm"
                  >
                    {task}
                  </li>
                ))}
              </ul>
              <Link
                to={`/business/ideas/${trackerSnapshot.ideaId}/tracker`}
                className="mt-5 inline-flex text-sm font-semibold text-slate-900 hover:text-teal-700"
              >
                Open tracker
              </Link>
            </div>
          ) : (
            <EmptyState
              title="No tracker activity yet"
              message="Create an idea and the backend will initialize a progress tracker automatically."
              actionLabel="Create first idea"
              onAction={() => navigate('/business/ideas/new')}
            />
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Mentor preview"
        subtitle="A quick look at mentors currently available in the directory."
        actions={
          <ActionLink to="/business/mentors" variant="secondary">
            Explore mentors
          </ActionLink>
        }
      >
        {homeData?.topMentors?.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {homeData.topMentors.map((mentor) => (
                <PreviewCard
                  key={mentor._id}
                  title={mentor.name}
                  subtitle={mentor.expertise}
                  description={
                    mentor.assignedBusinessIdeaTitles?.length
                      ? `Assigned ideas: ${mentor.assignedBusinessIdeaTitles.join(', ')}`
                      : mentor.bio
                  }
                  meta="Mentor"
                  to="/business/mentors"
                  icon={<MentorIcon />}
                />
              ))}
          </div>
        ) : (
          <EmptyState
            title="No mentors listed yet"
            message="Mentor profiles will show up here after the business directory is seeded."
            actionLabel="Refresh"
            onAction={() => window.location.reload()}
          />
        )}
      </SectionCard>
    </div>
  )
}

export default BusinessHomePage
