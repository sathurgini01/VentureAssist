import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../../../components/common/AsyncState'
import { ActionLink, BusinessPageHeader, SectionCard } from '../components/BusinessComponents'
import { getToolkitById } from '../services/businessService'

function BusinessToolkitDetailPage() {
  const { toolkitId } = useParams()
  const [toolkit, setToolkit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadToolkit() {
      try {
        setLoading(true)
        setError('')
        const data = await getToolkitById(toolkitId)

        if (isMounted) {
          setToolkit(data)
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

    loadToolkit()

    return () => {
      isMounted = false
    }
  }, [toolkitId])

  if (loading) {
    return <LoadingState title="Loading toolkit" description="Preparing the selected toolkit details and resource content." />
  }

  if (error || !toolkit) {
    return <ErrorState title="Toolkit not available" message={error || 'The selected toolkit could not be loaded.'} />
  }

  return (
    <div className="space-y-6">
      <BusinessPageHeader
        eyebrow="Toolkit detail"
        title={toolkit.title}
        description={toolkit.description}
        variant="toolkits"
        actions={
          <>
            <ActionLink to="/business/toolkits" variant="bannerSecondary">
              Back to toolkits
            </ActionLink>
            <a
              href={toolkit.downloadUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/80 bg-[linear-gradient(135deg,#10b981_0%,#0f766e_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_34px_rgba(5,150,105,0.3)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-400 hover:brightness-105 hover:shadow-[0_24px_44px_rgba(5,150,105,0.34)]"
            >
              Download
            </a>
          </>
        }
      />

      <SectionCard title="Category" subtitle={toolkit.category}>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-700">
          {toolkit.content}
        </div>
      </SectionCard>

      <SectionCard title="Toolkit Preview" subtitle="Open and review the PDF directly on this page.">
        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/80 shadow-sm">
          <iframe
            src={toolkit.downloadUrl}
            title={toolkit.title}
            className="h-[70vh] w-full min-h-[640px] bg-white"
          />
        </div>
      </SectionCard>
    </div>
  )
}

export default BusinessToolkitDetailPage
